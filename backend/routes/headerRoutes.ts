import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all header images
router.get('/', async (req, res) => {
    try {
        const headers = await prisma.headerImage.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(headers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch header images' });
    }
});

// GET header images by pageName
router.get('/:pageName', async (req, res) => {
    try {
        const headers = await prisma.headerImage.findMany({
            where: { pageName: req.params.pageName },
            orderBy: { order: 'asc' }
        });

        if (!headers || headers.length === 0) {
            // Return empty array or 404? Usually empty array is safer for carousels
            res.json([]);
            return;
        }
        res.json(headers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch header images' });
    }
});

// POST add a new header image for a page
router.post('/', async (req, res) => {
    const { pageName, imageUrl, order } = req.body;
    try {
        const header = await prisma.headerImage.create({
            data: { 
                pageName, 
                imageUrl, 
                order: order || 0 
            }
        });
        res.status(201).json(header);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add header image' });
    }
});

// DELETE a specific header image by ID
router.delete('/:id', async (req, res) => {
    try {
        await prisma.headerImage.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Header image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete header image' });
    }
});

export default router;
