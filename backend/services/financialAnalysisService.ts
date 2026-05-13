import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FinancialAnalysisService {
    /**
     * Checks if a business has exceeded its budget for a specific category.
     * Rule: Expenses > Budget * 1.10
     */
    static async checkOverspending(businessId: number, category: string) {
        try {
            // 1. Get the allocated budget for this category
            const budget = await prisma.budget.findFirst({
                where: {
                    businessId,
                    category
                }
            });

            if (!budget) return;

            // 2. Get total expenses for this category
            // For now, we sum all expenses in that category
            const expenses = await prisma.expense.findMany({
                where: {
                    businessId,
                    category
                }
            });

            const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
            const limit = Number(budget.allocatedAmount) * 1.10;

            if (totalSpent > limit) {
                // 3. Create a financial alert if it doesn't already exist for this category today
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const existingAlert = await prisma.financialAlert.findFirst({
                    where: {
                        businessId,
                        message: { contains: category },
                        createdAt: { gte: today },
                        resolved: false
                    }
                });

                if (!existingAlert) {
                    await prisma.financialAlert.create({
                        data: {
                            businessId,
                            message: `OVERSPENDING: ${category} expenses (GHS ${totalSpent.toLocaleString()}) have exceeded 110% of your GHS ${Number(budget.allocatedAmount).toLocaleString()} budget.`,
                            resolved: false
                        }
                    });
                    console.log(`🚨 Financial Alert created for business ${businessId} - Category: ${category}`);
                }
            }
        } catch (error) {
            console.error('Error in checkOverspending:', error);
        }
    }

    /**
     * Aggregates financial metrics for AI analysis
     */
    static async getMetricsForAi(businessId: number) {
        const [budgets, incomes, expenses, alerts] = await Promise.all([
            prisma.budget.findMany({ where: { businessId } }),
            prisma.income.findMany({ where: { businessId } }),
            prisma.expense.findMany({ where: { businessId } }),
            prisma.financialAlert.findMany({ where: { businessId, resolved: false } })
        ]);

        return {
            budgets,
            incomes,
            expenses,
            alerts,
            summary: {
                totalRevenue: incomes.reduce((s, i) => s + Number(i.amount), 0),
                totalExpenses: expenses.reduce((s, e) => s + Number(e.amount), 0),
                netBalance: incomes.reduce((s, i) => s + Number(i.amount), 0) - expenses.reduce((s, e) => s + Number(e.amount), 0)
            }
        };
    }
}
