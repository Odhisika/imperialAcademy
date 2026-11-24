import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const SOCIAL_KEYS = ['facebookUrl', 'instagramUrl', 'twitterUrl', 'linkedinUrl', 'youtubeUrl', 'tiktokUrl'] as const;
const TEXT_KEYS = ['addressLine1', 'digitalAddress', 'phone1', 'phone2', 'email', 'weekdayHours', 'saturdayHours', 'sundayHours'] as const;

const SOCIAL_BASES: Record<(typeof SOCIAL_KEYS)[number], string> = {
    facebookUrl: 'https://facebook.com/',
    instagramUrl: 'https://instagram.com/',
    twitterUrl: 'https://x.com/',
    linkedinUrl: 'https://linkedin.com/company/',
    youtubeUrl: 'https://youtube.com/@',
    tiktokUrl: 'https://tiktok.com/@',
};

export const DEFAULT_SETTINGS = {
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    addressLine1: 'TQ 63, New Tafo Akim',
    digitalAddress: 'EE-1049-7190',
    phone1: '0201188847',
    phone2: '0543974931',
    email: 'imperailacademy68@gmail.com',
    weekdayHours: '8:00 AM - 4:00 PM',
    saturdayHours: '9:00 AM - 1:00 PM',
    sundayHours: 'Closed',
    updatedAt: null as Date | null,
};

const isHttpUrl = (value: string) => {
    try {
        return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
        return false;
    }
};

// Accepts full URLs, URLs without a scheme, or a plain handle like "@imperialacademy".
const normalizeSocial = (key: (typeof SOCIAL_KEYS)[number], raw: unknown): string => {
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    if (value.includes('.') && !value.startsWith('@')) return `https://${value}`;
    return `${SOCIAL_BASES[key]}${encodeURIComponent(value.replace(/^@/, ''))}`;
};

// Public — the footer and contact page read this.
router.get('/', async (req, res) => {
    try {
        const saved = await prisma.siteSettings.findUnique({ where: { id: 1 } });
        if (!saved) {
            res.json(DEFAULT_SETTINGS);
            return;
        }
        const { id, ...values } = saved;
        void id;
        res.json({ ...DEFAULT_SETTINGS, ...values });
    } catch (error) {
        console.error('Fetch settings error:', error);
        res.json(DEFAULT_SETTINGS);
    }
});

// Admin only — requires a valid JWT.
router.put('/', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    try {
        jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }

    const data: Record<string, string> = {};

    for (const key of SOCIAL_KEYS) {
        const url = normalizeSocial(key, req.body?.[key]);
        if (url && !isHttpUrl(url)) {
            res.status(400).json({ error: `Invalid URL for ${key}.` });
            return;
        }
        data[key] = url;
    }

    for (const key of TEXT_KEYS) {
        const value = typeof req.body?.[key] === 'string' ? req.body[key].trim() : '';
        if (key === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            res.status(400).json({ error: 'Please enter a valid email address.' });
            return;
        }
        data[key] = value;
    }

    // Keep the defaults if an admin clears a required contact field.
    if (!data.addressLine1) data.addressLine1 = DEFAULT_SETTINGS.addressLine1;
    if (!data.digitalAddress) data.digitalAddress = DEFAULT_SETTINGS.digitalAddress;
    if (!data.phone1) data.phone1 = DEFAULT_SETTINGS.phone1;
    if (!data.email) data.email = DEFAULT_SETTINGS.email;
    if (!data.weekdayHours) data.weekdayHours = DEFAULT_SETTINGS.weekdayHours;
    if (!data.saturdayHours) data.saturdayHours = DEFAULT_SETTINGS.saturdayHours;
    if (!data.sundayHours) data.sundayHours = DEFAULT_SETTINGS.sundayHours;

    try {
        const saved = await prisma.siteSettings.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data },
        });
        const { id, ...values } = saved;
        void id;
        res.json({ ...DEFAULT_SETTINGS, ...values });
    } catch (error) {
        console.error('Save settings error:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

export default router;
