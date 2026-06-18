'use client'

import { useState, useEffect } from 'react'
import Modal from '@/app/components/ui/Modal'
import Badge from '@/app/components/ui/Badge'

const CATEGORIES = ['Semua', 'Masakan Padang', 'Fast Food', 'Ayam & Bebek', 'Seafood', 'Vegetarian', 'Minuman', 'Bakery']

const MOCK_RESTAURANTS = [
  { id: 'R001', name: 'Warung Padang Sederhana', address: 'Jl. Kemang Raya No. 12, Jaksel', category: 'Masakan Padang', status: 'open', rating: 4.8, totalOrders: 1245, phone: '0812-3456-7890', image: null },
  { id: 'R002', name: 'McRide Burger', address: 'Jl. Sudirman No. 45, Jakpus', category: 'Fast Food', status: 'open', rating: 4.5, totalOrders: 892, phone: '0813-5678-9012', image: null },
  { id: 'R003', name: 'Ayam Geprek Bu Siti', address: 'Jl. Fatmawati No. 8, Jaksel', category: 'Ayam & Bebek', status: 'closed', rating: 4.9, totalOrders: 2103, phone: '0857-1234-5678', image: null },
  { id: 'R004', name: 'Pizza Temride', address: 'Jl. Kuningan No. 67, Jaksel', category: 'Fast Food', status: 'open', rating: 4.3, totalOrders: 456, phone: '0821-8901-2345', image: null },
  { id: 'R005', name: 'Nasi Goreng 77', address: 'Jl. Tebet No. 23, Jaksel', category: 'Masakan Padang', status: 'open', rating: 4.7, totalOrders: 1789, phone: '0878-3456-7890', image: null },
  { id: 'R006', name: 'Seblak Mercon', address: 'Jl. Blok M No. 5, Jaksel', category: 'Vegetarian', status: 'closed', rating: 4.2, totalOrders: 321, phone: '0819-6789-0123', image: null },
]

const EMPTY_FORM = { name: '', address: '', phone: '', category: 'Masakan Padang', description: '' }

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editRestaurant, setEditRestaurant] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { setRestaurants(MOCK_RESTAURANTS); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = restaurants.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchCat = catFilter === 'Semua' || r.category === catFilter
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchCat && matchSearch
  })

  const openCreate = () => {
    setEditRestaurant(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (r) => {
    setEditRestaurant(r)
    setForm({ name: r.name, address: r.address, phone: r.phone, category: r.category, description: r.description || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    if (editRestaurant) {
      setRestaurants(prev => prev.map(r => r.id === editRestaurant.id ? { ...r, ...form } : r))
    } else {
      setRestaurants(prev => [...prev, {
        id: `R${String(prev.length + 1).padStart(3, '0')}`,
        ...form,
        status: 'open',
        rating: 0,
        totalOrders: 0,
        image: null,
      }])
    }
    setSaving(false)
    setShowModal(false)
  }

  const handleToggleStatus = (id) => {
    setRestaurants(prev => prev.map(r =>
      r.id === id ? { ...r, status: r.status === 'open' ? 'closed' : 'open' } : r
    ))
  }

  const handleDelete = (id) => {
    if (window.confirm('Hapus restoran ini?')) {
      setRestaurants(prev => prev.filter(r => r.id !== id))
    }
  }

  const counts = {
    all: restaurants.length,
    open: restaurants.filter(r => r.status === 'open').length,
    closed: restaurants.filter(r => r.status === 'closed').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏪 Manajemen Restoran</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola semua mitra restoran TemRide</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors shadow-sm"
        >
          + Tambah Restoran
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Restoran', value: counts.all, icon: '🏪', color: 'text-blue-600' },
          { label: 'Sedang Buka', value: counts.open, icon: '✅', color: 'text-green-600' },
          { label: 'Tutup', value: counts.closed, icon: '🔒', color: 'text-red-600' },
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

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col gap-3 px-5 py-3 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama restoran..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-600"
            >
              <option value="all">Semua Status</option>
              <option value="open">Buka</option>
              <option value="closed">Tutup</option>
            </select>
          </div>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  catFilter === c ? 'bg-[#1B3A6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center"><div className="text-3xl mb-2 animate-spin">⟳</div><p className="text-sm">Memuat data restoran...</p></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Restoran', 'Alamat', 'Kategori', 'Status', 'Rating', 'Total Order', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbo>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400">
                    <div className="text-4xl mb-2">🏪</div>
                    <p className="text-sm">Tidak ada restoran ditemukan</p>
                  </td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={r.id} className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 !== 0 ? 'bg-gray-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🍽️</div>
                        <div>
                          <p className="font-semibold text-gray-800">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-[160px] truncate">{r.address}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{r.category}</span>
                    </td>
                    <td className="py-3 px-4"><Badge status={r.status} /></td>
                    <td className="py-3 px-4">
                      <span className="text-yellow-500 font-semibold">★ {r.rating}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{r.totalOrders.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(r)}
                          className="px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                        >Edit</button>
                        <button
                          onClick={() => handleToggleStatus(r.id)}
                          className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                            r.status === 'open' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >{r.status === 'open' ? 'Tutup' : 'Buka'}</button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                        >✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbo>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Menampilkan {filtered.length} dari {restaurants.length} restoran
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editRestaurant ? 'Edit Restoran' : 'Tambah Restoran Baru'}
        size="md"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50">Batal</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : editRestaurant ? 'Simpan Perubahan' : 'Tambah Restoran'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {[
            { label: 'Nama Restoran', key: 'name', type: 'text', placeholder: 'Nama restoran...' },
            { label: 'Alamat', key: 'address', type: 'text', placeholder: 'Alamat lengkap...' },
            { label: 'No. Telepon', key: 'phone', type: 'text', placeholder: '0812-xxxx-xxxx' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 bg-white"
            >
              {CATEGORIES.filter(c => c !== 'Semua').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Restoran</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400">
              <span className="text-3xl block mb-2">📷</span>
              <p className="text-sm">Upload foto restoran (fitur segera hadir)</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
