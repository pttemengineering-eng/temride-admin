import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('temride_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('temride_token')
        localStorage.removeItem('temride_admin')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ---- Mock data helpers ----
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms))

const mockDriversList = [
  { id: 'D001', name: 'Budi Santoso', phone: '0812-3456-7890', plate: 'B 1234 ABC', kycStatus: 'approved', status: 'active', rating: 4.8, totalTrips: 1245, monthlyEarnings: 'Rp 3.2Jt', creditStatus: 'good', joinDate: '2023-01-15' },
  { id: 'D002', name: 'Ahmad Ridwan', phone: '0813-9876-5432', plate: 'B 5678 DEF', kycStatus: 'pending', status: 'active', rating: 4.5, totalTrips: 432, monthlyEarnings: 'Rp 2.1Jt', creditStatus: 'warning', joinDate: '2024-02-20' },
  { id: 'D003', name: 'Dian Pratama', phone: '0857-1234-5678', plate: 'B 9012 GHI', kycStatus: 'approved', status: 'active', rating: 4.9, totalTrips: 2103, monthlyEarnings: 'Rp 4.5Jt', creditStatus: 'good', joinDate: '2022-08-10' },
  { id: 'D004', name: 'Eko Wahyu', phone: '0821-5678-9012', plate: 'B 3456 JKL', kycStatus: 'pending', status: 'active', rating: 4.2, totalTrips: 187, monthlyEarnings: 'Rp 1.3Jt', creditStatus: 'critical', joinDate: '2024-05-01' },
  { id: 'D005', name: 'Fajar Kurnia', phone: '0878-2345-6789', plate: 'B 7890 MNO', kycStatus: 'approved', status: 'suspended', rating: 3.8, totalTrips: 567, monthlyEarnings: 'Rp 0', creditStatus: 'critical', joinDate: '2023-07-22' },
  { id: 'D006', name: 'Gilang Saputra', phone: '0819-3456-7890', plate: 'B 2345 PQR', kycStatus: 'approved', status: 'active', rating: 4.7, totalTrips: 891, monthlyEarnings: 'Rp 2.8Jt', creditStatus: 'good', joinDate: '2023-03-14' },
  { id: 'D007', name: 'Hendra Wijaya', phone: '0856-4567-8901', plate: 'B 6789 STU', kycStatus: 'pending', status: 'active', rating: 4.4, totalTrips: 354, monthlyEarnings: 'Rp 1.9Jt', creditStatus: 'warning', joinDate: '2024-01-08' },
  { id: 'D008', name: 'Indah Permata', phone: '0895-5678-9012', plate: 'B 0123 VWX', kycStatus: 'approved', status: 'active', rating: 5.0, totalTrips: 3421, monthlyEarnings: 'Rp 5.8Jt', creditStatus: 'good', joinDate: '2021-11-30' },
]

const mockOrdersList = [
  { id: 'ORD-001', passenger: 'Siti Rahayu', driver: 'Budi Santoso', from: 'Kemang, Jakarta Selatan', to: 'Sudirman, Jakarta Pusat', fare: 'Rp 25.000', status: 'completed', time: '08:30', payment: 'GoPay' },
  { id: 'ORD-002', passenger: 'Rizky Aditya', driver: 'Dian Pratama', from: 'Blok M, Jakarta Selatan', to: 'Semanggi, Jakarta Selatan', fare: 'Rp 18.000', status: 'ongoing', time: '09:15', payment: 'Cash' },
  { id: 'ORD-003', passenger: 'Maya Dewi', driver: 'Gilang Saputra', from: 'Fatmawati, Jakarta Selatan', to: 'Cilandak, Jakarta Selatan', fare: 'Rp 32.000', status: 'completed', time: '10:02', payment: 'OVO' },
  { id: 'ORD-004', passenger: 'Anton Wijaya', driver: 'Ahmad Ridwan', from: 'Tanah Abang, Jakarta Pusat', to: 'Senen, Jakarta Pusat', fare: 'Rp 15.000', status: 'cancelled', time: '10:45', payment: 'Cash' },
  { id: 'ORD-005', passenger: 'Fitri Handayani', driver: 'Hendra Wijaya', from: 'Kebayoran, Jakarta Selatan', to: 'Kuningan, Jakarta Selatan', fare: 'Rp 28.000', status: 'completed', time: '11:20', payment: 'Dana' },
  { id: 'ORD-006', passenger: 'Rian Kusuma', driver: 'Indah Permata', from: 'Cempaka Putih, Jakarta Pusat', to: 'Menteng, Jakarta Pusat', fare: 'Rp 22.000', status: 'completed', time: '12:05', payment: 'GoPay' },
  { id: 'ORD-007', passenger: 'Nina Susanti', driver: 'Eko Wahyu', from: 'Tebet, Jakarta Selatan', to: 'Matraman, Jakarta Timur', fare: 'Rp 35.000', status: 'pending', time: '12:45', payment: 'Cash' },
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

const mockRevenue12Months = [
  { date: 'Jan', revenue: 85000000, orders: 3240 },
  { date: 'Feb', revenue: 78000000, orders: 2980 },
  { date: 'Mar', revenue: 92000000, orders: 3520 },
  { date: 'Apr', revenue: 88000000, orders: 3380 },
  { date: 'Mei', revenue: 103000000, orders: 3910 },
  { date: 'Jun', revenue: 115000000, orders: 4350 },
  { date: 'Jul', revenue: 109000000, orders: 4120 },
  { date: 'Agt', revenue: 98000000, orders: 3760 },
  { date: 'Sep', revenue: 121000000, orders: 4580 },
  { date: 'Okt', revenue: 135000000, orders: 5120 },
  { date: 'Nov', revenue: 142000000, orders: 5380 },
  { date: 'Des', revenue: 168000000, orders: 6240 },
]

// ---- API Functions ----

export const authAPI = {
  login: async (email, password) => {
    await delay()
    if (email && password) {
      return { token: 'mock-jwt-token', admin: { name: 'Admin TemRide', email, role: 'superadmin' } }
    }
    throw new Error('Invalid credentials')
  }
}

export const dashboardAPI = {
  getStats: async () => {
    await delay()
    return {
      todayOrders: 412,
      todayOrdersChange: '+12.5%',
      todayOrdersChangeType: 'up',
      todayRevenue: 'Rp 18.4Jt',
      todayRevenueChange: '+8.2%',
      todayRevenueChangeType: 'up',
      onlineDrivers: 87,
      onlineDriversChange: '+5',
      onlineDriversChangeType: 'up',
      activeDrivers: 234,
      activeDriversChange: '+3.1%',
      activeDriversChangeType: 'up',
    }
  },
  getRevenue7Days: async () => {
    await delay()
    return mockRevenue7Days
  },
  getRecentOrders: async () => {
    await delay()
    return mockOrdersList.slice(0, 5)
  },
}

export const driversAPI = {
  getAll: async (filters = {}) => {
    await delay()
    let data = [...mockDriversList]
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'kyc') data = data.filter(d => d.kycStatus === 'pending')
      else if (filters.status === 'suspended') data = data.filter(d => d.status === 'suspended')
      else data = data.filter(d => d.status === 'active' && d.kycStatus !== 'pending')
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      data = data.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.plate.toLowerCase().includes(q)
      )
    }
    return data
  },
  getById: async (id) => {
    await delay()
    const driver = mockDriversList.find(d => d.id === id)
    if (!driver) throw new Error('Driver not found')
    return {
      ...driver,
      address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
      nik: '3174051234560001',
      simNumber: 'SIM-A-2024-001234',
      motorType: 'Honda Beat 2022',
      motorCC: '110cc',
      creditBalance: 65,
      creditLimit: 100,
      creditHistory: [
        { date: '2024-06-10', type: 'deduction', amount: -500000, reason: 'Kredit motor bulanan', balance: 65 },
        { date: '2024-05-10', type: 'deduction', amount: -500000, reason: 'Kredit motor bulanan', balance: 70 },
        { date: '2024-04-10', type: 'deduction', amount: -500000, reason: 'Kredit motor bulanan', balance: 75 },
        { date: '2024-03-10', type: 'deduction', amount: -500000, reason: 'Kredit motor bulanan', balance: 80 },
      ],
      earningsChart: Array.from({ length: 30 }, (_, i) => ({
        date: `${i + 1}`,
        earnings: Math.floor(Math.random() * 300000) + 100000,
        trips: Math.floor(Math.random() * 15) + 3,
      })),
      recentOrders: mockOrdersList.slice(0, 5).map(o => ({ ...o, driver: driver.name })),
    }
  },
  approveKYC: async (id) => {
    await delay()
    return { success: true, message: 'KYC approved successfully' }
  },
  suspend: async (id) => {
    await delay()
    return { success: true, message: 'Driver suspended' }
  },
  activate: async (id) => {
    await delay()
    return { success: true, message: 'Driver activated' }
  },
}

export const ordersAPI = {
  getAll: async (filters = {}) => {
    await delay()
    return mockOrdersList
  },
}

export const revenueAPI = {
  getSummary: async () => {
    await delay()
    return {
      totalRevenue: 'Rp 1.34M',
      platformFee: 'Rp 268Jt',
      driverEarnings: 'Rp 1.07M',
      voucherSales: 'Rp 54.2Jt',
    }
  },
  getMonthly: async () => {
    await delay()
    return mockRevenue12Months
  },
  getPaymentBreakdown: async () => {
    await delay()
    return [
      { name: 'Cash', value: 35, color: '#1B3A6B' },
      { name: 'GoPay', value: 28, color: '#F59E0B' },
      { name: 'OVO', value: 18, color: '#8B5CF6' },
      { name: 'Dana', value: 12, color: '#06B6D4' },
      { name: 'ShopeePay', value: 7, color: '#EF4444' },
    ]
  },
  getTopDrivers: async () => {
    await delay()
    return mockDriversList.slice(0, 10).map((d, i) => ({
      ...d,
      totalEarnings: `Rp ${(5 - i * 0.3).toFixed(1)}Jt`,
      rank: i + 1,
    }))
  },
}

export const vouchersAPI = {
  getStats: async () => {
    await delay()
    return {
      sold: 1245,
      revenue: 'Rp 124.5Jt',
      active: 847,
      used: 398,
    }
  },
  getPackages: async () => {
    await delay()
    return [
      { id: 'V001', name: 'Starter Pack', price: 50000, trips: 3, bonus: 0, status: 'active', sold: 456 },
      { id: 'V002', name: 'Regular Pack', price: 100000, trips: 7, bonus: 1, status: 'active', sold: 389 },
      { id: 'V003', name: 'Premium Pack', price: 200000, trips: 15, bonus: 3, status: 'active', sold: 245 },
      { id: 'V004', name: 'Ultimate Pack', price: 500000, trips: 40, bonus: 10, status: 'inactive', sold: 155 },
    ]
  },
  getTransactions: async () => {
    await delay()
    return Array.from({ length: 10 }, (_, i) => ({
      id: `VT-${1000 + i}`,
      user: `User ${i + 1}`,
      package: ['Starter Pack', 'Regular Pack', 'Premium Pack'][i % 3],
      amount: [50000, 100000, 200000][i % 3],
      usedTrips: Math.floor(Math.random() * 5),
      totalTrips: [3, 7, 15][i % 3],
      purchaseDate: `2024-06-${String(i + 1).padStart(2, '0')}`,
      expiry: `2024-07-${String(i + 1).padStart(2, '0')}`,
      status: i % 4 === 0 ? 'expired' : i % 3 === 0 ? 'fully_used' : 'active',
    }))
  },
}

export const promoAPI = {
  getAll: async () => {
    await delay()
    return [
      { id: 'P001', code: 'TEMRIDE10', type: 'percentage', value: 10, limit: 500, used: 342, expiry: '2024-07-31', status: 'active', minOrder: 15000 },
      { id: 'P002', code: 'NEWUSER20', type: 'fixed', value: 20000, limit: 1000, used: 876, expiry: '2024-06-30', status: 'active', minOrder: 25000 },
      { id: 'P003', code: 'WEEKEND15', type: 'percentage', value: 15, limit: 300, used: 289, expiry: '2024-07-07', status: 'active', minOrder: 20000 },
      { id: 'P004', code: 'TEMSPECIAL', type: 'fixed', value: 50000, limit: 100, used: 100, expiry: '2024-06-15', status: 'inactive', minOrder: 50000 },
      { id: 'P005', code: 'RAMADAN30', type: 'percentage', value: 30, limit: 2000, used: 1542, expiry: '2024-04-10', status: 'inactive', minOrder: 10000 },
    ]
  },
  create: async (data) => {
    await delay()
    return { success: true, id: `P${Date.now()}` }
  },
  toggle: async (id, status) => {
    await delay()
    return { success: true }
  },
}

export default api
