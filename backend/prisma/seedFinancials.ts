import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding budget templates...');

    const templates = [
        // 1. Sole Proprietorship (Service-based, e.g., Consultant, Web Dev)
        { businessType: 'Sole Proprietorship', category: 'Operating Costs', recommendedAmount: 1500 },
        { businessType: 'Sole Proprietorship', category: 'Marketing', recommendedAmount: 500 },
        { businessType: 'Sole Proprietorship', category: 'Personnel', recommendedAmount: 0 }, // Often solo
        { businessType: 'Sole Proprietorship', category: 'Technology', recommendedAmount: 1000 },

        // 2. LLC (Retail, e.g., Shop, Boutique)
        { businessType: 'Limited Liability Company', category: 'Operating Costs', recommendedAmount: 5000 },
        { businessType: 'Limited Liability Company', category: 'Marketing', recommendedAmount: 2000 },
        { businessType: 'Limited Liability Company', category: 'Personnel', recommendedAmount: 3000 },
        { businessType: 'Limited Liability Company', category: 'Technology', recommendedAmount: 1500 },
        { businessType: 'Limited Liability Company', category: 'Regulatory/Legal', recommendedAmount: 2000 },

        // 3. Hospitality (e.g., Restaurant, Bed & Breakfast)
        { businessType: 'Hospitality', category: 'Operating Costs', recommendedAmount: 8000 },
        { businessType: 'Hospitality', category: 'Marketing', recommendedAmount: 1500 },
        { businessType: 'Hospitality', category: 'Personnel', recommendedAmount: 5000 },
        { businessType: 'Hospitality', category: 'Technology', recommendedAmount: 1000 },
        { businessType: 'Hospitality', category: 'Regulatory/Legal', recommendedAmount: 3000 },

        // 4. Default categories for any business
        { businessType: 'General', category: 'Emergency Fund', recommendedAmount: 1000 },
    ];

    for (const template of templates) {
        await prisma.budgetTemplate.upsert({
            where: { id: 0 }, // This is a hack for upserting without unique field besides id
            // But since BudgetTemplate doesn't have a unique constraint on type/cat yet
            // Let's just create if not exists
            create: template,
            update: {}
        });
    }

    // A better approach for upsert without unique fields in schema:
    for (const template of templates) {
        const existing = await prisma.budgetTemplate.findFirst({
            where: {
                businessType: template.businessType,
                category: template.category
            }
        });

        if (!existing) {
            await prisma.budgetTemplate.create({ data: template });
        }
    }

    console.log('✅ Budget templates seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
