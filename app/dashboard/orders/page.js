'use client'

import { useState, useEffect } from 'react'
import OrdersTable from '@/components/OrdersTable'
import { ordersAPI } from '@/lib/api'
import { exportToCSV } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'completed', label: 'Selesai' },
  { value: 'ongoing', label: 'Berlangsung' },
  { value: 'cancelled', label: 'Dibatalkan' },
  { value: 'pending', label: 'Menunggu' },
]

const CITY_OPTIONS = [
  { value: 'all', label: 'Semua Kota' },
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'depok', label: 'Depok' },
  { value: 'bekasi', label: 'Bekasi' },
  { value: 'tangerang', label: 'Tangerang' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const data = await ordersAPI.getAll({ status: statusFilter, search, city: cityFilter })
        setOrders(data)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [statusFilter, search, cityFilter])

  const filteredOrders = orders.filter(o => {
    if (search) {
      const q = search.toLowerCase()
      return (
        o.id?.toLowerCase().includes(q) ||
        o.passenger?.toLowerCase().includes(q) ||
        o.driver?.toLowerCase().includes(q) ||
        o.from?.toLowerCase().includes(q) ||
        o.to?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const statusCounts = {
    all: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    ongoing: orders.filter(o => o.status === 'ongoing').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    pending: orders.filter(o => o.status === 'pending').length,
  }

  const handleExportCSV = () => {
    exportToCSV(
      filteredOrders.map(o => ({
        'Order ID': o.id,
        'Penumpang': o.passenger,
        'Driver': o.driver,
        'Dari': o.from,
        'Ke': o.to,
        'Fare': o.fare,
        'Status': o.status,
        'Waktu': o.time,
        'Payment': o.payment,
      })),
      'temride-orders'
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📦 Manajemen Order</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola dan pantau semua order perjalanan</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`bg-white border rounded-xl p-3 text-center transition-all shadow-sm hover:shadow ${
              statusFilter === s.value ? 'border-[#1B3A6B] ring-2 ring-[#1B3A6B]/20' : 'border-gray-100'
            }`}
          >
            <p className={`text-2xl font-bold ${
              s.value === 'completed' ? 'text-green-600' :
              s.value === 'ongoing' ? 'text-blue-600' :
              s.value === 'cancelled' ? 'text-red-500' :
              s.value === 'pending' ? 'text-yellow-600' : 'text-[#1B3A6B]'
            }`}>
              {statusCounts[s.value]}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari order ID, penumpang, driver..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 bg-white text-gray-600"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 bg-white text-gray-600"
          >
            {CITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 text-gray-600"
            />
            <span className="text-gray-400 text-sm">—</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 text-gray-600"
            />
          </div>
          <button
            onClick={() => { setSearch(''); setStatusFilter('all'); setCityFilter('all'); setDateFrom(''); setDateTo('') }}
            className="px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Daftar Order</h3>
          <span className="text-sm text-gray-400">{filteredOrders.length} order</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center text-gray-400">
              <div className="text-3xl mb-2 animate-spin">⟳</div>
              <p className="text-sm">Memuat data order...</p>
            </div>
          </div>
        ) : (
          <OrdersTable orders={filteredOrders} />
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
          <span>Menampilkan {filteredOrders.length} dari {orders.length} order</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled>← Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
