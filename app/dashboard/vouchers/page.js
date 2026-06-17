'use client'

import { useState, useEffect } from 'react'
import { vouchersAPI } from '@/lib/api'

export default function VouchersPage() {
  const [stats, setStats] = useState(null)
  const [packages, setPackages] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editPkg, setEditPkg] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', trips: '', bonus: '' })
  const [activeTab, setActiveTab] = useState('packages')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, p, t] = await Promise.all([
          vouchersAPI.getStats(),
          vouchersAPI.getPackages(),
          vouchersAPI.getTransactions(),
        ])
        setStats(s)
        setPackages(p)
        setTransactions(t)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const openCreate = () => {
    setEditPkg(null)
    setForm({ name: '', price: '', trips: '', bonus: '' })
    setShowModal(true)
  }

  const openEdit = (pkg) => {
    setEditPkg(pkg)
    setForm({ name: pkg.name, price: pkg.price, trips: pkg.trips, bonus: pkg.bonus })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editPkg) {
      setPackages(prev => prev.map(p => p.id === editPkg.id ? { ...p, ...form } : p))
    } else {
      setPackages(prev => [...prev, {
        id: `V${Date.now()}`,
        ...form,
        status: 'active',
        sold: 0
      }])
    }
    setShowModal(false)
  }

  const handleToggle = (id) => {
    setPackages(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ))
  }

  const handleDelete = (id) => {
    if (confirm('Hapus paket voucher ini?')) {
      setPackages(prev => prev.filter(p => p.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">⚡</div>
          <p className="text-gray-500 text-sm">Memuat data voucher...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">⚡ Manajemen Voucher</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola paket voucher dan transaksi</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors shadow-sm"
        >
          + Tambah Paket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🎫', label: 'Voucher Terjual', value: stats?.sold?.toLocaleString(), color: 'bg-blue-50' },
          { icon: '💰', label: 'Revenue Voucher', value: stats?.revenue, color: 'bg-green-50' },
          { icon: '✅', label: 'Voucher Aktif', value: stats?.active?.toLocaleString(), color: 'bg-yellow-50' },
          { icon: '✔️', label: 'Voucher Terpakai', value: stats?.used?.toLocaleString(), color: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl border border-gray-100 p-4 shadow-sm`}>
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex gap-1 p-3 border-b border-gray-100">
          {[
            { key: 'packages', label: '📦 Paket Voucher' },
            { key: 'transactions', label: '🧾 Transaksi' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.key ? 'bg-[#1B3A6B] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {packages.map(pkg => (
                <div
                  key={pkg.id}
                  className={`rounded-xl border-2 p-5 transition-all ${
                    pkg.status === 'active'
                      ? 'border-[#1B3A6B] bg-gradient-to-br from-[#1B3A6B]/5 to-[#1B3A6B]/10'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800">{pkg.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{pkg.sold} terjual</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      pkg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {pkg.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-[#1B3A6B]">
                      Rp {Number(pkg.price).toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {pkg.trips} trip
                      </span>
                      {pkg.bonus > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                          +{pkg.bonus} bonus
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(pkg.id)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        pkg.status === 'active'
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {pkg.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      onClick={() => openEdit(pkg)}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Paket</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Harga</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Trip Terpakai</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell">Pembelian</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Kadaluarsa</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={t.id} className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{t.id}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">{t.user}</td>
                    <td className="py-3 px-4 text-gray-600">{t.package}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">
                      Rp {Number(t.amount).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-[#1B3A6B] h-1.5 rounded-full"
                            style={{ width: `${(t.usedTrips / t.totalTrips) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{t.usedTrips}/{t.totalTrips}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 hidden sm:table-cell">{t.purchaseDate}</td>
                    <td className="py-3 px-4 text-xs text-gray-500 hidden lg:table-cell">{t.expiry}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        t.status === 'active' ? 'bg-green-100 text-green-700' :
                        t.status === 'fully_used' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {t.status === 'active' ? 'Aktif' : t.status === 'fully_used' ? 'Terpakai' : 'Kadaluarsa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editPkg ? 'Edit Paket Voucher' : 'Tambah Paket Voucher'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Nama Paket', key: 'name', placeholder: 'misal: Starter Pack', type: 'text' },
                { label: 'Harga (Rp)', key: 'price', placeholder: '50000', type: 'number' },
                { label: 'Jumlah Trip', key: 'trips', placeholder: '3', type: 'number' },
                { label: 'Bonus Trip', key: 'bonus', placeholder: '0', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                  />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors"
              >
                {editPkg ? 'Simpan Perubahan' : 'Tambah Paket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
