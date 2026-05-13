import 'dotenv/config'; 
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

import path from 'path';

// Routes Imports (To be created)
import newsRoutes from './routes/newsRoutes';
import galleryRoutes from './routes/galleryRoutes';
import admissionRoutes from './routes/admissionRoutes';
import contactRoutes from './routes/contactRoutes';
import authRoutes from './routes/authRoutes';
import headerRoutes from './routes/headerRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import uploadRoutes from './routes/uploadRoutes';
import documentRoutes from './routes/documentRoutes';
import activityRoutes from './routes/activityRoutes';

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Imperial Academy Backend is live!');
});

app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/headers', headerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/activities', activityRoutes);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Port config
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
