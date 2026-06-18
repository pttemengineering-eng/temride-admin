'use client'
import { useState, useEffect } from 'react'

const API_URL = 'https://temride-backend-production.up.railway.app'

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('adminToken') || localStorage.getItem('temride_token') || ''
}

const STATUS_COLORS = {
  PENDING:     'bg-yellow-100 text-yellow-800',
  ACCEPTED:    'bg-blue-100 text-blue-800',
  PREPARING:   'bg-indigo-100 text-indigo-800',
  ON_THE_WAY:  'bg-purple-100 text-purple-800',
  DELIVERED:   'bg-green-100 text-green-800',
  CANCELLED:   'bg-red-100 text-red-800',
  completed:   'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  pending:     'bg-yellow-100 text-yellow-800',
  cancelled:   'bg-red-100 text-red-800',
}

export default function TFoodPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/food-orders`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      } else {
        setOrders([])
      }
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const STATUS_FILTERS = ['all', 'PENDING', 'ACCEPTED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED']

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search || [
      o.id,
      o.passenger?.name, o.user?.name, o.customerName,
      o.restaurant?.name, o.restaurantName,
    ].some(v => v && String(v).toLowerCase().includes(search.toLowerCase()))
    return matchStatus && matchSearch
  })

  const totalRevenue = orders
    .filter(o => o.status === 'DELIVERED' || o.status === 'completed')
    .reduce((s, o) => s + (o.totalAmount || o.total || o.price || 0), 0)

  const activeRestaurants = [...new Set(
    orders.map(o => o.restaurant?.id || o.restaurantId).filter(Boolean)
  )].length

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🍔 TFood — TemFood</h1>
          <p className="text-gray-500 text-sm mt-1">Layanan pesan antar makanan TemRide</p>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Info box */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-green-800 mb-3">🍔 Cara Kerja TFood</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-green-700">
          <div className="flex items-start gap-2">
            <span>1️⃣</span>
            <span>Penumpang buka app → tap <strong>TFood</strong> → pilih restoran &amp; menu</span>
          </div>
          <div className="flex items-start gap-2">
            <span>2️⃣</span>
            <span>Restoran terima order → konfirmasi &amp; mulai masak</span>
          </div>
          <div className="flex items-start gap-2">
            <span>3️⃣</span>
            <span>Driver terdekat mengambil pesanan dari restoran</span>
          </div>
          <div className="flex items-start gap-2">
            <span>4️⃣</span>
            <span>Driver antar ke alamat penumpang → selesai</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Order', value: orders.length, color: 'text-blue-600' },
          { label: 'Selesai', value: orders.filter(o => o.status === 'DELIVERED' || o.status === 'completed').length, color: 'text-green-600' },
          { label: 'Revenue TFood', value: `Rp ${totalRevenue.toLocaleString('id')}`, color: 'text-purple-600' },
          { label: 'Restoran Aktif', value: activeRestaurants || '-', color: 'text-orange-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-gray-500 text-xs">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari ID, nama pelanggan, restoran..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === f ? 'bg-[#1B3A6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Semua' : f}
            {f !== 'all' && (
              <span className="ml-1 text-xs opacity-75">
                ({orders.filter(o => o.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            ⏳ Memuat data TFood...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🍔</div>
            <p className="text-gray-500 font-medium">Belum ada order TFood</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || filter !== 'all'
                ? 'Tidak ada hasil untuk filter ini.'
                : 'Order akan muncul saat penumpang menggunakan layanan TFood di app'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pelanggan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Restoran</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <tr key={o.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">
                      {String(o.id || '').slice(0, 8)}{o.id?.length > 8 ? '...' : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {o.passenger?.name || o.user?.name || o.customerName || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {o.restaurant?.name || o.restaurantName || '-'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[150px] truncate">
                      {Array.isArray(o.items)
                        ? o.items.map(it => it.name || it.menuName || it).join(', ')
                        : (o.itemsSummary || o.items || '-')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {o.driver?.name || o.driverName || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      Rp {(o.totalAmount || o.total || o.price || 0).toLocaleString('id')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                        {o.status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString('id-ID') : (o.time || '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Menampilkan {filtered.length} dari {orders.length} order TFood
        </div>
      </div>
    </div>
  )
}
