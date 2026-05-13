import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all news
router.get('/', async (req, res) => {
    try {
        const news = await prisma.news.findMany({
            orderBy: { publishedAt: 'desc' }
        });
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// GET featured news
router.get('/featured', async (req, res) => {
    try {
        const news = await prisma.news.findMany({
            where: { isFeatured: true },
            take: 3,
            orderBy: { publishedAt: 'desc' }
        });
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch featured news' });
    }
});

// GET single news by ID
router.get('/:id', async (req, res) => {
    try {
        const news = await prisma.news.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!news) { res.status(404).json({ error: 'Article not found' }); return; }
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// POST new news (Admin)
router.post('/', async (req, res) => {
    const { title, slug, content, excerpt, category, imageUrl, isFeatured, author } = req.body;
    try {
        const news = await prisma.news.create({
            data: { title, slug, content, excerpt, category, imageUrl, isFeatured: isFeatured ?? false, author }
        });
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create news article' });
    }
});

// PATCH update news article
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, slug, content, excerpt, category, imageUrl, isFeatured, author } = req.body;
    try {
        const updated = await prisma.news.update({
            where: { id: parseInt(id) },
            data: { title, slug, content, excerpt, category, imageUrl, isFeatured, author }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update article' });
    }
});

// DELETE news article
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.news.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Article deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

export default router;
