import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendApprovalEmail } from '../utils/mailer';

const router = Router();
const prisma = new PrismaClient();

// POST new admission application
router.post('/', async (req, res) => {
    const { 
        childName, 
        childDob, 
        gender, 
        gradeLevel, 
        parentName, 
        parentEmail, 
        parentPhone, 
        address, 
        previousSchool 
    } = req.body;
    
    try {
        const admission = await prisma.admission.create({
            data: {
                childName,
                childDob: new Date(childDob),
                gender,
                gradeLevel,
                parentName,
                parentEmail,
                parentPhone,
                address,
                previousSchool
            }
        });
        res.status(201).json({ message: 'Application submitted successfully', id: admission.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// GET all admissions (Admin only)
router.get('/', async (req, res) => {
    try {
        const admissions = await prisma.admission.findMany({
            orderBy: { submissionDate: 'desc' }
        });
        res.json(admissions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch admissions' });
    }
});

// GET admission stats (counts by status)
router.get('/stats', async (req, res) => {
    try {
        const [total, pending, underReview, approved, rejected] = await Promise.all([
            prisma.admission.count(),
            prisma.admission.count({ where: { status: 'Pending' } }),
            prisma.admission.count({ where: { status: 'Under Review' } }),
            prisma.admission.count({ where: { status: 'Approved' } }),
            prisma.admission.count({ where: { status: 'Rejected' } }),
        ]);
        res.json({ total, pending, underReview, approved, rejected });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// PATCH update admission status (Admin only)
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status value' });
        return;
    }

    try {
        const updated = await prisma.admission.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        // Send approval email if status is changed to Approved
        if (status === 'Approved') {
            await sendApprovalEmail(updated.parentEmail, updated.parentName, updated.childName);
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// DELETE admission application (Admin only)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.admission.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete application' });
    }
});

export default router;
