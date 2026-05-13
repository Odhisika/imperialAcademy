import { GoogleGenerativeAI } from '@google/generative-ai';

class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GEMINI_API_KEY is not set in environment variables.');
        }
        this.genAI = new GoogleGenerativeAI(apiKey || '');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-09-2025' });
    }

    async generateGuidance(context: string, prompt: string) {
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('Gemini API key is missing.');
            }

            const fullPrompt = `
You are an expert business consultant for Ghana. You help users register businesses and stay compliant.
Use the provided context about requirements and laws to give specific, actionable advice.

CONTEXT:
${context}

USER QUERY:
${prompt}

Provide a helpful, concise, and accurate response formatted in Markdown.
`;

            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating AI guidance:', error);
            throw new Error('Failed to generate guidance from AI service.');
        }
    }
    async generateFinancialAdvice(metrics: any) {
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('Gemini API key is missing.');
            }

            const { budgets, alerts, summary } = metrics;

            const prompt = `
You are a financial advisor for startups in Ghana. Provide a concise, advisory summary of the business's financial health based on the data below.

DATA:
- Total Revenue: GHS ${summary.totalRevenue.toLocaleString()}
- Total Expenses: GHS ${summary.totalExpenses.toLocaleString()}
- Net Balance: GHS ${summary.netBalance.toLocaleString()}
- Active Alerts: ${alerts.map((a: any) => a.message).join('; ') || 'None'}
- Budgets: ${budgets.map((b: any) => `${b.category}: GHS ${Number(b.allocatedAmount).toLocaleString()}`).join(', ')}

GUIDELINES:
1. Be advisory and educational. Don't perform calculations (they are already done for you).
2. Explain the significance of the Net Balance (e.g., sustainability).
3. Interpret any OVERSPENDING alerts and suggest corrective actions (e.g., shifting to organic channels).
4. If income is low, suggest identifying recurring revenue sources.
5. Keep the tone professional but accessible.
6. Format in Markdown. Use bold for key terms.

Output only the advice.
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating financial advice:', error);
            throw new Error('Failed to generate financial advice.');
        }
    }
}

export const aiService = new AiService();
