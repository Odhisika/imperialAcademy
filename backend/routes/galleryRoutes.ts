import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all gallery items
router.get('/', async (req, res) => {
    try {
        const gallery = await prisma.gallery.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(gallery);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// POST new gallery item
router.post('/', async (req, res) => {
    const { title, imageUrl, category } = req.body;
    try {
        const item = await prisma.gallery.create({
            data: { title, imageUrl, category }
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add gallery item' });
    }
});

// PATCH update gallery item title/category
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category } = req.body;
    try {
        const updated = await prisma.gallery.update({
            where: { id: parseInt(id) },
            data: { title, category }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update gallery item' });
    }
});

// DELETE gallery item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.gallery.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Gallery item deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete gallery item' });
    }
});

export default router;
