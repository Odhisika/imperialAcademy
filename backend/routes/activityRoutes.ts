import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Ensure the uploads/activities directory exists
const activityDir = path.join(process.cwd(), 'uploads', 'activities');
if (!fs.existsSync(activityDir)) {
    fs.mkdirSync(activityDir, { recursive: true });
}

// Configure multer storage for activity images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, activityDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `activity-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only images are allowed!'));
        }
        cb(null, true);
    }
});

// GET /api/activities
router.get('/', async (req, res) => {
    try {
        const activities = await (prisma as any).activity.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// POST /api/activities
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description, order } = req.body;
        if (!title || !description || !req.file) {
            res.status(400).json({ error: 'Title, description, and image are required' });
            return;
        }

        const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/activities/${req.file.filename}`;

        const activity = await (prisma as any).activity.create({
            data: {
                title,
                description,
                imageUrl,
                order: order ? parseInt(order) : 0
            }
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

// DELETE /api/activities/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await (prisma as any).activity.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});

export default router;
