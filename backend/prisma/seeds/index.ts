import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Database Seeding...');

    try {
        // Run individual seed files
        // Using ts-node to run the specific seed file
        console.log('Running Admin User Seed...');
        await execPromise('npx ts-node prisma/seeds/adminUser.ts');

        console.log('Running Registration Requirements Seed...');
        await execPromise('npx ts-node prisma/seeds/registrationRequirements.ts');

        console.log('Running Financial Templates Seed...');
        await execPromise('npx ts-node prisma/seeds/financialTemplates.ts');

        console.log('Running Admin User Seed...');
        await execPromise('npx ts-node prisma/seeds/adminUser.ts');

        console.log('✅ All seeds executed successfully.');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
