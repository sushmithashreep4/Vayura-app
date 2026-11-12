import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ============================================================
// Auth token injection
// ============================================================
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vayura_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// Error handling
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ============================================================
// Travel Profile APIs
// ============================================================
export const profileApi = {
  create: (data: unknown) => apiClient.post('/profiles', data),
  get: (id: string) => apiClient.get(`/profiles/${id}`),
  update: (id: string, data: unknown) => apiClient.put(`/profiles/${id}`, data),
};

// ============================================================
// AI Assistant APIs
// ============================================================
export const aiApi = {
  chat: (payload: {
    message: string;
    conversationId?: string;
    travelProfileId?: string;
    context?: Record<string, unknown>;
  }) => apiClient.post('/ai/chat', payload),

  generatePlan: (travelProfileId: string) =>
    apiClient.post('/ai/generate-plan', { travelProfileId }),

  getReadinessSummary: (arrivalPlanId: string) =>
    apiClient.get(`/ai/readiness/${arrivalPlanId}`),
};

// ============================================================
// Payment APIs (PayPal)
// ============================================================
export const paymentApi = {
  createOrder: (payload: {
    amount: number;
    currency: string;
    description: string;
    serviceId?: string;
  }) => apiClient.post('/payments/create-order', payload),

  captureOrder: (orderId: string) =>
    apiClient.post(`/payments/capture-order/${orderId}`),

  getTransactions: (userId: string) =>
    apiClient.get(`/payments/transactions/${userId}`),
};

// ============================================================
// Country & Discovery APIs
// ============================================================
export const countryApi = {
  getCountry: (code: string) => apiClient.get(`/countries/${code}`),
  getApps: (countryCode: string, purpose: string) =>
    apiClient.get(`/discovery/apps?country=${countryCode}&purpose=${purpose}`),
};

// ============================================================
// Budget APIs
// ============================================================
export const budgetApi = {
  getBudget: (profileId: string) => apiClient.get(`/budgets/${profileId}`),
  addExpense: (budgetId: string, expense: unknown) =>
    apiClient.post(`/budgets/${budgetId}/expenses`, expense),
};
