import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', async (req, res) => {
    try {
        const [
            admissions, 
            news, 
            gallery, 
            unreadContacts,
            recentAdmissions,
            recentMessages
        ] = await Promise.all([
            prisma.admission.count(),
            prisma.news.count(),
            prisma.gallery.count(),
            prisma.contact.count({ where: { isRead: false } }),
            prisma.admission.findMany({
                take: 5,
                orderBy: { submissionDate: 'desc' }
            }),
            prisma.contact.findMany({
                take: 5,
                orderBy: { submissionDate: 'desc' }
            })
        ]);

        res.json({
            admissions,
            news,
            gallery,
            unreadContacts,
            recentAdmissions,
            recentMessages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

export default router;
