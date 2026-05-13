import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Application Data Seeding...');

    // 1. Ghana Registration Requirements
    const requirements = [
        // GENERAL REQUIREMENTS (All Business Types)
        {
            country: 'Ghana',
            businessType: null, // Applies to all
            requirementName: 'Business Name Search',
            description: 'Conduct a business name search at the Registrar General’s Department (RGD) to ensure your desired business name is available and not already in use.',
            mandatory: true,
            category: 'Legal',
            estimatedCost: 25.00,
            estimatedDurationDays: 1,
            orderSequence: 1
        },
        {
            country: 'Ghana',
            businessType: null,
            requirementName: 'Tax Identification Number (TIN)',
            description: 'Obtain a Tax Identification Number (TIN) from the Ghana Revenue Authority (GRA). This is required for all business owners and directors.',
            mandatory: true,
            category: 'Tax',
            estimatedCost: 0.00,
            estimatedDurationDays: 1,
            orderSequence: 2
        },
        {
            country: 'Ghana',
            businessType: null, // Applies to most, specific types might override or add to this
            requirementName: 'Business Registration / Incorporation',
            description: 'Register the business with the Registrar General’s Department (RGD) to obtain a Certificate of Incorporation or Business Registration Certificate.',
            mandatory: true,
            category: 'Legal',
            estimatedCost: 60.00, // Can vary
            estimatedDurationDays: 5,
            orderSequence: 3
        },
        {
            country: 'Ghana',
            businessType: null,
            requirementName: 'GRA Tax Registration',
            description: 'Register the business entity with the Ghana Revenue Authority (GRA) for CIT (Corporate Income Tax) and other applicable taxes like VAT.',
            mandatory: true,
            category: 'Tax',
            estimatedCost: 0.00,
            estimatedDurationDays: 3,
            orderSequence: 4
        },
        {
            country: 'Ghana',
            businessType: null,
            requirementName: 'Metropolitan/Municipal Assembly Permit',
            description: 'Obtain a Business Operating Permit (BOP) from your local Metropolitan, Municipal, or District Assembly (MMDA).',
            mandatory: true,
            category: 'Licensing',
            estimatedCost: 100.00, // Highly variable
            estimatedDurationDays: 7,
            orderSequence: 5
        },
        {
            country: 'Ghana',
            businessType: null,
            requirementName: 'SSNIT Employer Registration',
            description: 'Register with the Social Security and National Insurance Trust (SSNIT) if the business employs at least one worker.',
            mandatory: true,
            category: 'Legal',
            estimatedCost: 0.00,
            estimatedDurationDays: 2,
            orderSequence: 6
        },

        // SECTOR SPECIFIC
        // Retail
        {
            country: 'Ghana',
            businessType: 'Retail',
            requirementName: 'Food and Drugs Authority (FDA) Registration',
            description: 'Register products/premises with the Food and Drugs Authority (FDA) if selling consumable goods, cosmetics, or medical devices.',
            mandatory: false, // Context dependent
            category: 'Licensing',
            estimatedCost: 200.00,
            estimatedDurationDays: 30,
            orderSequence: 7
        },

        // Manufacturing
        {
            country: 'Ghana',
            businessType: 'Manufacturing',
            requirementName: 'Environmental Protection Agency (EPA) Permit',
            description: 'Acquire environmental permits from the EPA. Required for manufacturing operations that impact the environment.',
            mandatory: true,
            category: 'Licensing',
            estimatedCost: 300.00,
            estimatedDurationDays: 21,
            orderSequence: 7
        },
        {
            country: 'Ghana',
            businessType: 'Manufacturing',
            requirementName: 'Ghana Standards Authority (GSA) Certification',
            description: 'Ensure products meet national standards and get certified by the GSA.',
            mandatory: true,
            category: 'Licensing',
            estimatedCost: 150.00,
            estimatedDurationDays: 14,
            orderSequence: 8
        },

        // Service
        {
            country: 'Ghana',
            businessType: 'Service',
            requirementName: 'Professional Certification / Industry License',
            description: 'Obtain relevant professional certification if required for the specific service (e.g., Tourism, Real Estate, Banking, Education).',
            mandatory: false, // Depends on service
            category: 'Licensing',
            estimatedCost: 0.00,
            estimatedDurationDays: 0,
            orderSequence: 7
        },

        // Security
        {
            country: 'Ghana',
            businessType: 'Security',
            requirementName: 'Ministry of Interior License',
            description: 'Apply for and obtain a license to operate a private security organization from the Ministry of the Interior.',
            mandatory: true,
            category: 'Licensing',
            estimatedCost: 500.00,
            estimatedDurationDays: 60,
            orderSequence: 7
        },
        {
            country: 'Ghana',
            businessType: 'Security',
            requirementName: 'Police Clearance / Vetting',
            description: 'Provide evidence of police vetting/clearance for all directors and employees to ensure no criminal record.',
            mandatory: true,
            category: 'Legal',
            estimatedCost: 100.00,
            estimatedDurationDays: 14,
            orderSequence: 8
        },

        // Hospitality / Tourism
        {
            country: 'Ghana',
            businessType: 'Hospitality',
            requirementName: 'Ghana Tourism Authority License',
            description: 'Obtain a license from the Ghana Tourism Authority (GTA) for hotels, restaurants, and travel agencies.',
            mandatory: true,
            category: 'Licensing',
            estimatedCost: 300.00,
            estimatedDurationDays: 30,
            orderSequence: 7
        },

        // Education
        {
            country: 'Ghana',
            businessType: 'Education',
            requirementName: 'GES / GTEC Accreditation',
            description: 'Register with the Ghana Education Service (GES) for pre-tertiary or Ghana Tertiary Education Commission (GTEC) for tertiary institutions.',
            mandatory: true,
            category: 'Accreditation',
            estimatedCost: 1000.00,
            estimatedDurationDays: 90,
            orderSequence: 7
        }
    ];

    console.log(`Creating ${requirements.length} registration requirements...`);

    for (const req of requirements) {
        // Find existing record by unique profile
        const existing = await prisma.registrationRequirement.findFirst({
            where: {
                country: req.country,
                requirementName: req.requirementName,
                businessType: req.businessType
            }
        });

        if (existing) {
            // Update existing
            await prisma.registrationRequirement.update({
                where: { id: existing.id },
                data: req
            });
        } else {
            // Create new
            await prisma.registrationRequirement.create({
                data: req
            });
        }
    }

    console.log('✅ Seeding completed.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
