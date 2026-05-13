import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Ensure the uploads/documents directory exists
const docDir = path.join(process.cwd(), 'uploads', 'documents');
if (!fs.existsSync(docDir)) {
    fs.mkdirSync(docDir, { recursive: true });
}

// Configure multer storage for documents
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, docDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = file.originalname.split('.')[0].replace(/\s+/g, '-').toLowerCase();
        cb(null, `doc-${name}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for documents
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only PDF, Word, and Excel files are allowed!'));
        }
        cb(null, true);
    }
});

// GET /api/documents
router.get('/', async (req, res) => {
    try {
        const documents = await prisma.schoolDocument.findMany();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// GET /api/documents/:name
router.get('/:name', async (req, res) => {
    try {
        const document = await prisma.schoolDocument.findUnique({
            where: { name: req.params.name }
        });
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch document' });
    }
});

// POST /api/documents/upload
// Expects body: { name: string, title: string } and file: 'file'
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file provided' });
            return;
        }

        const { name, title } = req.body;
        if (!name || !title) {
            res.status(400).json({ error: 'Document name and title are required' });
            return;
        }

        const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        const document = await prisma.schoolDocument.upsert({
            where: { name: name },
            update: {
                title: title,
                fileUrl: fileUrl,
            },
            create: {
                name: name,
                title: title,
                fileUrl: fileUrl,
            },
        });

        res.status(200).json({
            message: 'Document uploaded successfully',
            document: document
        });
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ error: 'Failed to process the document upload' });
    }
});

export default router;
