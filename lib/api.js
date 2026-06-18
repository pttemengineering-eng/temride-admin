import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://temride-backend-production.up.railway.app'

// ─── Central fetch helper ────────────────────────────────────────────────────
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('temride_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }

  return res.json()
}

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminAPI = {
  // Dashboard
  getStats: () => apiCall('/admin/dashboard-stats'),
  getRevenue: (days = 7) => apiCall(`/admin/revenue?days=${days}`),

  // Drivers
  getDrivers: (params = '') => apiCall(`/admin/drivers${params}`),
  addDriver: (data) => apiCall('/admin/drivers', { method: 'POST', body: JSON.stringify(data) }),
  verifyDriver: (id, action) =>
    apiCall(`/admin/drivers/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    }),

  // Orders
  getOrders: (params = '') => apiCall(`/admin/orders${params}`),

  // Passengers
  getPassengers: () => apiCall('/admin/passengers'),
  deleteUser: (id) => apiCall(`/admin/users/${id}`, { method: 'DELETE' }),

  // Restaurants (TFood)
  getRestaurants: () => apiCall('/admin/restaurants'),

  // TSend (GoSend)
  getGoSend: () => apiCall('/admin/gosend'),

  // Food orders (TFood)
  getFoodOrders: () => apiCall('/admin/gofood-orders').catch(() => apiCall('/admin/food-orders')),

  // Vouchers
  getVouchers: () => apiCall('/vouchers/list'),
  createVoucher: (data) =>
    apiCall('/admin/vouchers', { method: 'POST', body: JSON.stringify(data) }),

  // Driver Applications
  getApplications: () => apiCall('/driver-registration/list'),
  reviewApplication: (id, action, notes) =>
    apiCall(`/driver-registration/review/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action, notes }),
    }),

  // Withdrawals
  getWithdrawals: () => apiCall('/admin/withdrawals'),
  processWithdrawal: (id, action) =>
    apiCall(`/admin/withdrawals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    }),
}

// ─── Axios instance (legacy – keep for compatibility) ─────────────────────────
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('adminToken') || localStorage.getItem('temride_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('temride_token')
        localStorage.removeItem('temride_admin')
        localStorage.removeItem('adminToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ─── Mock data helpers (kept for pages that still use them) ──────────────────
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

const mockDriversList = [
  { id: 'D001', name: 'Budi Santoso', phone: '0812-3456-7890', plate: 'B 1234 ABC', kycStatus: 'approved', status: 'active', rating: 4.8, totalTrips: 1245, monthlyEarnings: 'Rp 3.2Jt', creditStatus: 'good', joinDate: '2023-01-15' },
  { id: 'D002', name: 'Ahmad Ridwan', phone: '0813-9876-5432', plate: 'B 5678 DEF', kycStatus: 'pending', status: 'active', rating: 4.5, totalTrips: 432, monthlyEarnings: 'Rp 2.1Jt', creditStatus: 'warning', joinDate: '2024-02-20' },
  { id: 'D003', name: 'Dian Pratama', phone: '0857-1234-5678', plate: 'B 9012 GHI', kycStatus: 'approved', status: 'active', rating: 4.9, totalTrips: 2103, monthlyEarnings: 'Rp 4.5Jt', creditStatus: 'good', joinDate: '2022-08-10' },
  { id: 'D004', name: 'Eko Wahyu', phone: '0821-5678-9012', plate: 'B 3456 JKL', kycStatus: 'pending', status: 'active', rating: 4.2, totalTrips: 187, monthlyEarnings: 'Rp 1.3Jt', creditStatus: 'critical', joinDate: '2024-05-01' },
  { id: 'D005', name: 'Fajar Kurnia', phone: '0878-2345-6789', plate: 'B 7890 MNO', kycStatus: 'approved', status: 'suspended', rating: 3.8, totalTrips: 567, monthlyEarnings: 'Rp 0', creditStatus: 'critical', joinDate: '2023-07-22' },
]

const mockOrdersList = [
  { id: 'ORD-001', passenger: 'Siti Rahayu', driver: 'Budi Santoso', from: 'Kemang, Jakarta Selatan', to: 'Sudirman, Jakarta Pusat', fare: 'Rp 25.000', status: 'completed', time: '08:30', payment: 'GoPay' },
  { id: 'ORD-002', passenger: 'Rizky Aditya', driver: 'Dian Pratama', from: 'Blok M, Jakarta Selatan', to: 'Semanggi, Jakarta Selatan', fare: 'Rp 18.000', status: 'ongoing', time: '09:15', payment: 'Cash' },
]

const mockRevenue7Days = [
  { date: 'Sen', revenue: 3200000, orders: 145 },
  { date: 'Sel', revenue: 2800000, orders: 132 },
  { date: 'Rab', revenue: 4100000, orders: 198 },
  { date: 'Kam', revenue: 3700000, orders: 176 },
  { date: 'Jum', revenue: 5200000, orders: 241 },
  { date: 'Sab', revenue: 6800000, orders: 312 },
  { date: 'Min', revenue: 4500000, orders: 208 },
]

export const authAPI = {
  login: async (email, password) => {
    await delay()
    if (email && password) {
      return { token: 'mock-jwt-token', admin: { name: 'Admin TemRide', email, role: 'superadmin' } }
    }
    throw new Error('Invalid credentials')
  },
}

export const dashboardAPI = {
  getStats: async () => {
    try {
      const data = await adminAPI.getStats()
      return data
    } catch {
      await delay()
      return {
        todayOrders: 0,
        todayOrdersChange: '0%',
        todayRevenue: 'Rp 0',
        onlineDrivers: 0,
        activeDrivers: 0,
      }
    }
  },
  getRevenue7Days: async () => {
    await delay()
    return mockRevenue7Days
  },
  getRecentOrders: async () => {
    await delay()
    return mockOrdersList
  },
}

export const driversAPI = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams()
      if (filters.status && filters.status !== 'all') params.set('status', filters.status)
      if (filters.search) params.set('search', filters.search)
      const query = params.toString() ? `?${params.toString()}` : ''
      const data = await adminAPI.getDrivers(query)
      return data.drivers || data.data || []
    } catch {
      await delay()
      let data = [...mockDriversList]
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'kyc') data = data.filter((d) => d.kycStatus === 'pending')
        else if (filters.status === 'suspended') data = data.filter((d) => d.status === 'suspended')
        else data = data.filter((d) => d.status === 'active' && d.kycStatus !== 'pending')
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        data = data.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.phone.includes(q) ||
            d.plate.toLowerCase().includes(q)
        )
      }
      return data
    }
  },
  getById: async (id) => {
    await delay()
    const driver = mockDriversList.find((d) => d.id === id)
    if (!driver) throw new Error('Driver not found')
    return { ...driver }
  },
  approveKYC: async (id) => {
    try {
      return await adminAPI.verifyDriver(id, 'APPROVE')
    } catch {
      await delay()
      return { success: true }
    }
  },
  suspend: async (id) => {
    try {
      return await adminAPI.verifyDriver(id, 'SUSPEND')
    } catch {
      await delay()
      return { success: true }
    }
  },
  activate: async (id) => {
    try {
      return await adminAPI.verifyDriver(id, 'ACTIVATE')
    } catch {
      await delay()
      return { success: true }
    }
  },
}

export const ordersAPI = {
  getAll: async (filters = {}) => {
    try {
      const data = await adminAPI.getOrders()
      return data.orders || data.data || []
    } catch {
      await delay()
      return mockOrdersList
    }
  },
}

export const revenueAPI = {
  getSummary: async () => {
    await delay()
    return { totalRevenue: 'Rp 0', platformFee: 'Rp 0', driverEarnings: 'Rp 0', voucherSales: 'Rp 0' }
  },
  getMonthly: async () => {
    await delay()
    return mockRevenue7Days
  },
  getPaymentBreakdown: async () => {
    await delay()
    return [
      { name: 'Cash', value: 35, color: '#1B3A6B' },
      { name: 'Transfer', value: 65, color: '#F59E0B' },
    ]
  },
  getTopDrivers: async () => {
    await delay()
    return mockDriversList.slice(0, 5).map((d, i) => ({ ...d, rank: i + 1 }))
  },
}

export const vouchersAPI = {
  getStats: async () => {
    await delay()
    return { sold: 0, revenue: 'Rp 0', active: 0, used: 0 }
  },
  getPackages: async () => {
    await delay()
    return []
  },
  getTransactions: async () => {
    await delay()
    return []
  },
}

export const promoAPI = {
  getAll: async () => {
    await delay()
    return []
  },
  create: async (data) => {
    return await adminAPI.createVoucher(data)
  },
  toggle: async (id, status) => {
    await delay()
    return { success: true }
  },
}

export default api
