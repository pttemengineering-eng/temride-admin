'use client'

import { useState, useEffect } from 'react'
import Modal from '@/app/components/ui/Modal'
import Badge from '@/app/components/ui/Badge'

const MOCK_PASSENGERS = Array.from({ length: 20 }, (_, i) => ({
  id: `P${String(i + 1).padStart(3, '0')}`,
  name: ['Siti Rahayu', 'Rizky Aditya', 'Maya Dewi', 'Anton Wijaya', 'Fitri Handayani', 'Rian Kusuma', 'Nina Susanti', 'Bela Oktavia', 'Doni Setiawan', 'Citra Lestari'][i % 10],
  phone: `0812-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  totalOrders: Math.floor(Math.random() * 150) + 1,
  lastOrder: `2024-06-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  status: i % 7 === 0 ? 'suspended' : 'active',
  email: `user${i + 1}@example.com`,
  joinDate: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  totalSpend: `Rp ${((Math.random() * 2 + 0.5) * 1000000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`,
}))

export default function PassengersPage() {
  const [passengers, setPassengers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPassenger, setSelectedPassenger] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPassengers(MOCK_PASSENGERS)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const filtered = passengers.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
    return matchStatus && matchSearch
  })

  const handleSuspend = (id) => {
    setPassengers(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'suspended' ? 'active' : 'suspended' } : p
    ))
  }

  const openDetail = (p) => {
    setSelectedPassenger(p)
    setShowDetail(true)
  }

  const counts = {
    all: passengers.length,
    active: passengers.filter(p => p.status === 'active').length,
    suspended: passengers.filter(p => p.status === 'suspended').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👤 Manajemen Penumpang</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola semua penumpang TemRide</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Penumpang', value: counts.all, icon: '👤', color: 'text-blue-600' },
          { label: 'Aktif', value: counts.active, icon: '✅', color: 'text-green-600' },
          { label: 'Suspended', value: counts.suspended, icon: '⛔', color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.icon}</span>
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex gap-1 flex-wrap">
            {['all', 'active', 'suspended'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  statusFilter === f ? 'bg-[#1B3A6B] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Suspended'}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau nomor HP..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-2 animate-spin">⟳</div>
              <p className="text-sm">Memuat data penumpang...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Penumpang</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">No HP</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Total Order</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Total Spend</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell">Last Order</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400">
                      <div className="text-4xl mb-2">👤</div>
                      <p className="text-sm">Tidak ada penumpang ditemukan</p>
                    </td>
                  </tr>
                ) : filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 !== 0 ? 'bg-gray-50/30' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#1B3A6B] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{p.phone}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-800">{p.totalOrders}</span>
                      <span className="text-gray-400 text-xs ml-1">trip</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{p.totalSpend}</td>
                    <td className="py-3 px-4 text-xs text-gray-500 hidden sm:table-cell">{p.lastOrder}</td>
                    <td className="py-3 px-4">
                      <Badge status={p.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(p)}
                          className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleSuspend(p.id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                            p.status === 'suspended'
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {p.status === 'suspended' ? 'Aktifkan' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Menampilkan {filtered.length} dari {passengers.length} penumpang
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        title="Detail Penumpang"
        size="md"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowDetail(false)}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                if (selectedPassenger) handleSuspend(selectedPassenger.id)
                setShowDetail(false)
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                selectedPassenger?.status === 'suspended'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {selectedPassenger?.status === 'suspended' ? 'Aktifkan Akun' : 'Suspend Akun'}
            </button>
          </div>
        }
      >
        {selectedPassenger && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1B3A6B] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedPassenger.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{selectedPassenger.name}</h4>
                <p className="text-gray-500 text-sm">{selectedPassenger.phone}</p>
                <Badge status={selectedPassenger.status} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'ID Penumpang', value: selectedPassenger.id },
                { label: 'Email', value: selectedPassenger.email },
                { label: 'Tanggal Daftar', value: selectedPassenger.joinDate },
                { label: 'Total Order', value: `${selectedPassenger.totalOrders} trip` },
                { label: 'Total Spend', value: selectedPassenger.totalSpend },
                { label: 'Last Order', value: selectedPassenger.lastOrder },
              ].map(f => (
                <div key={f.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
