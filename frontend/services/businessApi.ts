import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const businessApi = {
    // 1. Business Profile
    createBusiness: async (data: any) => {
        const response = await api.post('/api/businesses', data);
        return response.data;
    },
    getUserBusinesses: async (userId: string) => {
        const response = await api.get(`/api/businesses/user/${userId}`);
        return response.data;
    },
    getBusinessById: async (id: string | number) => {
        const response = await api.get(`/api/businesses/${id}`);
        return response.data;
    },
    updateBusiness: async (id: string | number, data: any) => {
        const response = await api.patch(`/api/businesses/${id}`, data);
        return response.data;
    },

    // 2. Registration Requirements
    getRequirements: async (country: string, businessType?: string) => {
        const response = await api.get('/api/registration/requirements', {
            params: { country, businessType }
        });
        return response.data;
    },

    // 3. Registration Session
    getSession: async (businessId: string | number) => {
        const response = await api.get(`/api/registration/sessions/${businessId}`);
        return response.data;
    },
    updateSession: async (data: any) => {
        const response = await api.post('/api/registration/sessions', data);
        return response.data;
    },

    // 4. Compliance Checklist
    getCompliance: async (businessId: string | number) => {
        const response = await api.get(`/api/compliance/items/business/${businessId}`);
        return response.data;
    },
    initializeChecklist: async (businessId: string | number, country: string, businessType: string) => {
        const response = await api.post('/api/compliance/checklist/initialize', {
            businessId, country, businessType
        });
        return response.data;
    },
    updateItemStatus: async (itemId: number, status: string) => {
        const response = await api.patch(`/api/compliance/items/${itemId}/status`, { status });
        return response.data;
    },

    // 5. AI Assistance
    getGuidance: async (prompt: string, businessType?: string, industry?: string) => {
        const response = await api.post('/api/ai/guidance', { prompt, businessType, industry });
        return response.data;
    },
    getGuidanceHistory: async (userId: string | number) => {
        const response = await api.get(`/api/ai/history/${userId}`);
        return response.data;
    },

    // 6. Financials
    addFinancialEntry: async (data: any) => {
        const response = await api.post('/api/financials/entries', data);
        return response.data;
    },
    getFinancialSummary: async (businessId: string | number) => {
        const response = await api.get(`/api/financials/summary/business/${businessId}`);
        return response.data;
    },
    getBudgets: async (businessId: string | number) => {
        const response = await api.get(`/api/financials/budgets/business/${businessId}`);
        return response.data;
    },
    upsertBudget: async (data: any) => {
        const response = await api.post('/api/financials/budgets', data);
        return response.data;
    },
    getFinancialAlerts: async (businessId: string | number) => {
        const response = await api.get(`/api/financials/alerts/business/${businessId}`);
        return response.data;
    },
    getFinancialAiInsights: async (businessId: string | number) => {
        const response = await api.get(`/api/financials/ai-insights/${businessId}`);
        return response.data;
    }
};
