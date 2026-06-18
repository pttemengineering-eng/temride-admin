'use client'

import { useState, useEffect } from 'react'
import Badge from '@/app/components/ui/Badge'
import Modal from '@/app/components/ui/Modal'

const STATUSES = ['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled']

const STATUS_LABELS = {
  all: 'Semua', pending: 'Pending', accepted: 'Diterima',
  in_progress: 'Berlangsung', completed: 'Selesai', cancelled: 'Dibatalkan',
}

const MOCK_GOSEND = Array.from({ length: 15 }, (_, i) => ({
  id: `GS-${String(i + 1001).padStart(4, '0')}`,
  sender: ['Budi Santoso', 'Maya Dewi', 'Rian Kusuma', 'Siti Rahayu', 'Anton'][i % 5],
  receiver: ['PT Maju Jaya', 'Toko Sejahtera', 'Rumah Sakit A', 'CV Berkah', 'Warung B'][i % 5],
  pickup: ['Kemang, Jaksel', 'Blok M, Jaksel', 'Fatmawati', 'Tebet', 'Tanah Abang'][i % 5],
  destination: ['Sudirman', 'Kuningan', 'Semanggi', 'Menteng', 'Senen'][i % 5],
  weight: `${(Math.random() * 4 + 0.5).toFixed(1)} kg`,
  total: `Rp ${((Math.floor(Math.random() * 30) + 10) * 1000).toLocaleString('id-ID')}`,
  status: STATUSES[(i % 5) + 1],
  time: `${String(8 + (i % 12)).padStart(2, '0')}:${String(i * 5 % 60).padStart(2, '0')}`,
  notes: i % 3 === 0 ? 'Fragile - hati-hati' : '',
}))

export default function GoSendPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setOrders(MOCK_GOSEND)
      setLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchSearch = !search || [o.id, o.sender, o.receiver, o.pickup, o.destination]
      .some(v => v.toLowerCase().includes(search.toLowerCase()))
    return matchStatus && matchSearch
  })

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter(o => o.status === s).length
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📦 GoSend Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manajemen pengiriman barang TemRide</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`bg-white border rounded-xl p-3 text-center transition-all shadow-sm hover:shadow ${
              statusFilter === s ? 'border-[#1B3A6B] ring-2 ring-[#1B3A6B]/20' : 'border-gray-100'
            }`}
          >
            <p className={`text-xl font-bold ${
              s === 'completed' ? 'text-green-600' : s === 'cancelled' ? 'text-red-500' :
              s === 'in_progress' ? 'text-blue-600' : s === 'pending' ? 'text-yellow-600' :
              s === 'accepted' ? 'text-indigo-600' : 'text-[#1B3A6B]'
            }`}>{counts[s]}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{STATUS_LABELS[s]}</p>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-3 border-b border-gray-100">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari ID, pengirim, penerima..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 bg-white text-gray-600"
          >
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-2 animate-spin">⟳</div>
              <p className="text-sm">Memuat data GoSend...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['ID Order', 'Pengirim', 'Penerima', 'Pickup', 'Tujuan', 'Berat', 'Total', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center text-gray-400">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-sm">Tidak ada order GoSend</p>
                  </td></tr>
                ) : filtered.map((o, i) => (
                  <tr key={o.id} className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 !== 0 ? 'bg-gray-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{o.id}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">{o.sender}</td>
                    <td className="py-3 px-4 text-gray-600">{o.receiver}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{o.pickup}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{o.destination}</td>
                    <td className="py-3 px-4 text-gray-600">{o.weight}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{o.total}</td>
                    <td className="py-3 px-4"><Badge status={o.status} /></td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
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
          Menampilkan {filtered.length} dari {orders.length} order
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Detail GoSend Order"
        size="md"
        footer={
          <button
            onClick={() => setSelectedOrder(null)}
            className="w-full py-2.5 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52]"
          >
            Tutup
          </button>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded font-semibold">{selectedOrder.id}</span>
              <Badge status={selectedOrder.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pengirim', value: selectedOrder.sender },
                { label: 'Penerima', value: selectedOrder.receiver },
                { label: 'Pickup', value: selectedOrder.pickup },
                { label: 'Tujuan', value: selectedOrder.destination },
                { label: 'Berat', value: selectedOrder.weight },
                { label: 'Total', value: selectedOrder.total },
                { label: 'Waktu', value: selectedOrder.time },
                { label: 'Catatan', value: selectedOrder.notes || '-' },
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
