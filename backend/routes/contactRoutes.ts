import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all contacts (Admin only)
router.get('/', async (req, res) => {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { submissionDate: 'desc' }
        });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// POST new contact message
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject,
                message
            }
        });
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// PATCH mark as read/unread
router.patch('/:id/read', async (req, res) => {
    const { isRead } = req.body;
    try {
        const contact = await prisma.contact.update({
            where: { id: parseInt(req.params.id) },
            data: { isRead: isRead !== undefined ? isRead : true }
        });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// DELETE contact
router.delete('/:id', async (req, res) => {
    try {
        await prisma.contact.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

export default router;
