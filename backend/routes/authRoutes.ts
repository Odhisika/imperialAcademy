import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const ADMIN_GATE_SECRET = process.env.ADMIN_GATE_SECRET;

// Helper to generate token
const generateToken = (userId: number) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// MASTER REGISTRATION (One-time or protected)
router.post('/register-master', async (req, res) => {
    const { fullName, email, password, gateSecret } = req.body;

    if (!ADMIN_GATE_SECRET || gateSecret !== ADMIN_GATE_SECRET) {
        res.status(403).json({ error: 'Access denied. Invalid gate secret.' });
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash
            }
        });

        res.status(201).json({
            message: 'Admin user created successfully',
            user: { id: user.id, fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET CURRENT USER (Verify Token)
router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, fullName: true, email: true }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

export default router;
