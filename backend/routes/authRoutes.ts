import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const ADMIN_GATE_SECRET = process.env.ADMIN_GATE_SECRET;
// Keep in sync with prisma/seeds/adminUser.ts — accounts on this password must be changed.
const DEFAULT_ADMIN_PASSWORD = 'Admin@123';

const usesDefaultPassword = async (passwordHash: string) =>
    bcrypt.compare(DEFAULT_ADMIN_PASSWORD, passwordHash);

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
            mustChangePassword: await usesDefaultPassword(user.passwordHash),
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
            select: { id: true, fullName: true, email: true, passwordHash: true }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({
            ...user,
            passwordHash: undefined,
            mustChangePassword: await usesDefaultPassword(user.passwordHash)
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// CHANGE PASSWORD (requires a valid token)
router.post('/change-password', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    const { currentPassword, newPassword } = req.body;
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
        res.status(400).json({ error: 'New password must be at least 8 characters long.' });
        return;
    }
    if (newPassword === currentPassword) {
        res.status(400).json({ error: 'New password must be different from the current one.' });
        return;
    }
    if (newPassword === DEFAULT_ADMIN_PASSWORD) {
        res.status(400).json({ error: 'Choose a password other than the default one.' });
        return;
    }

    try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as { id: number };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (!(await bcrypt.compare(currentPassword || '', user.passwordHash))) {
            res.status(400).json({ error: 'Current password is incorrect.' });
            return;
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: await bcrypt.hash(newPassword, 10) }
        });

        res.json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

export default router;
