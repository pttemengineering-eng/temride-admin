'use client'
import { useState, useEffect } from 'react'

const API_URL = 'https://temride-backend-production.up.railway.app'

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('adminToken') || localStorage.getItem('temride_token') || ''
}

export default function PassengersPage() {
  const [passengers, setPassengers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  const fetchPassengers = async () => {
    setLoading(true)
    setError(null)
    try {
      // Try dedicated passengers endpoint first
      const res = await fetch(`${API_URL}/api/admin/passengers`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPassengers(data.passengers || data.data || [])
        return
      }

      // Fallback: extract unique passengers from orders
      const res2 = await fetch(`${API_URL}/api/admin/orders?limit=100`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      if (res2.ok) {
        const data2 = await res2.json()
        const orders = data2.orders || data2.data || []
        const map = {}
        orders.forEach(o => {
          const p = o.passenger || o.user
          if (p && p.id && !map[p.id]) {
            map[p.id] = { ...p, totalOrders: 0 }
          }
          if (p && p.id) map[p.id].totalOrders++
        })
        setPassengers(Object.values(map))
        return
      }

      setError('Endpoint belum tersedia. Pastikan backend sudah diupdate.')
      setPassengers([])
    } catch (err) {
      setError('Tidak dapat memuat data. Backend mungkin memerlukan autentikasi.')
      setPassengers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPassengers() }, [])

  const filtered = passengers.filter(p =>
    !search ||
    (p.name || p.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.phone || '').includes(search)
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👥 Penumpang</h1>
          <p className="text-gray-500 text-sm mt-1">Data pengguna aplikasi TemRide sebagai penumpang</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {passengers.length} penumpang
          </span>
          <button
            onClick={fetchPassengers}
            className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Tentang Menu Ini</h3>
        <p className="text-blue-700 text-sm">
          Menu ini menampilkan semua pengguna yang terdaftar sebagai <strong>penumpang</strong> di aplikasi TemRide.
          Data tersinkronisasi dengan App Penumpang melalui Backend Railway.
          Penumpang mendaftar via App Penumpang menggunakan nomor WhatsApp dan OTP.
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari nama atau nomor HP..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            ⏳ Memuat data...
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
              {error}
            </div>
            <p className="text-gray-500 text-sm mt-3">
              💡 Pastikan app penumpang sudah digunakan untuk registrasi minimal 1 akun terlebih dahulu.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-gray-500 font-medium">Belum ada penumpang terdaftar</p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? 'Tidak ada hasil untuk pencarian ini.' : 'Penumpang akan muncul setelah mendaftar via App Penumpang (Expo Go)'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">No HP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Daftar</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {p.name || p.fullName || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.phone || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.email || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {p.totalOrders ?? p._count?.orders ?? 0} order
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === 'SUSPENDED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {p.status === 'SUSPENDED' ? 'Suspended' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Menampilkan {filtered.length} dari {passengers.length} penumpang
        </div>
      </div>
    </div>
  )
}
