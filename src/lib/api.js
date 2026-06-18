import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://temride-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach token from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('temride_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('temride_token');
        localStorage.removeItem('temride_admin');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────
export const login = (email, password) =>
  api.post('/api/admin/login', { email, password });

export const logout = () =>
  api.post('/api/admin/logout');

// ── Dashboard ─────────────────────────────────
export const getDashboardStats = () =>
  api.get('/api/admin/dashboard-stats');

export const getRevenueChart = (days = 7) =>
  api.get(`/api/admin/dashboard/revenue-chart?days=${days}`);

// ── Drivers ───────────────────────────────────
export const getDrivers = (params = {}) =>
  api.get('/api/admin/drivers', { params });

export const getDriverById = (id) =>
  api.get(`/api/admin/drivers/${id}`);

export const approveDriver = (id) =>
  api.post(`/api/admin/drivers/${id}/approve`);

export const suspendDriver = (id, reason) =>
  api.post(`/api/admin/drivers/${id}/suspend`, { reason });

export const activateDriver = (id) =>
  api.post(`/api/admin/drivers/${id}/activate`);

// ── Orders ────────────────────────────────────
export const getOrders = (params = {}) =>
  api.get('/api/admin/orders', { params });

export const getOrderById = (id) =>
  api.get(`/api/admin/orders/${id}`);

export const cancelOrder = (id, reason) =>
  api.post(`/api/admin/orders/${id}/cancel`, { reason });

// ── Revenue ───────────────────────────────────
export const getRevenueSummary = (year) =>
  api.get(`/api/admin/revenue/summary?year=${year}`);

export const getRevenueByMonth = (year, month) =>
  api.get(`/api/admin/revenue/monthly?year=${year}&month=${month}`);

// ── Vouchers ──────────────────────────────────
export const getVouchers = (params = {}) =>
  api.get('/api/admin/vouchers', { params });

export const getVoucherStats = () =>
  api.get('/api/admin/vouchers/stats');

// ── Promos ────────────────────────────────────
export const getPromos = () =>
  api.get('/api/admin/promos');

export const createPromo = (data) =>
  api.post('/api/admin/promos', data);

export const updatePromo = (id, data) =>
  api.put(`/api/admin/promos/${id}`, data);

export const deletePromo = (id) =>
  api.delete(`/api/admin/promos/${id}`);

export const togglePromo = (id, active) =>
  api.patch(`/api/admin/promos/${id}/toggle`, { active });

// ── Helpers (non-auth fetch for stats page) ──
export const API_BASE = API_URL;

export async function fetchDashboardStats() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('temride_token') : null;
    const res = await fetch(`${API_URL}/api/admin/dashboard-stats`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('fetchDashboardStats error:', err);
    return null;
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default api;
