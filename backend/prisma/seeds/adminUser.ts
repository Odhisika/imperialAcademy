import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Default Admin User...');

    const email = 'admin@imperialacademy.edu.gh';
    const fullName = 'Super Admin';
    const password = 'Admin@123';

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        console.log('Default admin user already exists, skipping.');
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            fullName,
            email,
            passwordHash
        }
    });

    console.log(`✅ Default admin user created: ${email}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
