import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Financial & Budget Templates...');

    // 1. Budget Templates (Recommended starting budgets for Ghana context)
    const budgetTemplates = [
        // GENERAL / STARTUP
        {
            businessType: 'All',
            category: 'Registration & Licenses',
            recommendedAmount: 1500.00, // GHS
        },
        {
            businessType: 'All',
            category: 'Marketing & Branding',
            recommendedAmount: 2000.00,
        },
        {
            businessType: 'All',
            category: 'Office/Workspace Setup',
            recommendedAmount: 5000.00,
        },
        {
            businessType: 'All',
            category: 'Technology & Software',
            recommendedAmount: 3000.00,
        },

        // MANUFACTURING SPECIFIC
        {
            businessType: 'Manufacturing',
            category: 'Equipment & Machinery',
            recommendedAmount: 50000.00,
        },
        {
            businessType: 'Manufacturing',
            category: 'Raw Materials (Initial Stock)',
            recommendedAmount: 20000.00,
        },
        {
            businessType: 'Manufacturing',
            category: 'Safety Compliance (EPA/Standards)',
            recommendedAmount: 5000.00,
        },

        // RETAIL SPECIFIC
        {
            businessType: 'Retail',
            category: 'Inventory (Initial Stock)',
            recommendedAmount: 15000.00,
        },
        {
            businessType: 'Retail',
            category: 'Store Fitting & Shelving',
            recommendedAmount: 8000.00,
        },
    ];

    // 2. Financial Rules (Alert Logic)
    const financialRules = [
        {
            ruleName: 'Low Budget Alert',
            thresholdPercentage: 80.00, // Alert when 80% of budget use
            severity: 'Warning',
            description: 'Alert when a specific budget category exceeds 80% utilization.'
        },
        {
            ruleName: 'Critical Budget Overrun',
            thresholdPercentage: 100.00,
            severity: 'Critical',
            description: 'Critical alert when a budget category is fully exhausted.'
        },
        {
            ruleName: 'Low Cash Flow Warning',
            thresholdPercentage: 10.00, // e.g., < 10% operating cash (logic implemented in app)
            severity: 'High',
            description: 'Warning when estimated cash reserves dip dangerously low.'
        }
    ];

    console.log(`Creating ${budgetTemplates.length} budget templates...`);
    for (const item of budgetTemplates) {
        await prisma.budgetTemplate.create({ data: item });
    }

    console.log(`Creating ${financialRules.length} financial rules...`);
    for (const rule of financialRules) {
        await prisma.financialRule.create({ data: rule });
    }

    console.log('✅ Financial seeding completed.');
}

main()
    .catch((e) => {
        console.error('❌ Financial Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
