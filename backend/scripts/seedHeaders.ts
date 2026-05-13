import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultHeaderImage = '/images/hero_background_1776684578618.png';
const pages = ['home', 'about', 'academics', 'admissions', 'news', 'gallery', 'contact'];

async function main() {
  console.log('Seeding header images...');

  for (const pageName of pages) {
    const header = await prisma.headerImage.upsert({
      where: { pageName },
      update: {},
      create: {
        pageName,
        imageUrl: defaultHeaderImage,
      },
    });
    console.log(`Upserted header for ${pageName}: ${header.imageUrl}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
