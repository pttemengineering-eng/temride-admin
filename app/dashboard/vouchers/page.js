'use client'

import { useState, useEffect } from 'react'
import Modal from '@/app/components/ui/Modal'
import Badge from '@/app/components/ui/Badge'

const MOCK_VOUCHERS = [
  { id: 'V001', code: 'TEMRIDE10', type: 'percentage', value: 10, minOrder: 15000, quota: 500, used: 342, validUntil: '2024-07-31', active: true },
  { id: 'V002', code: 'NEWUSER20', type: 'nominal', value: 20000, minOrder: 25000, quota: 1000, used: 876, validUntil: '2024-06-30', active: true },
  { id: 'V003', code: 'WEEKEND15', type: 'percentage', value: 15, minOrder: 20000, quota: 300, used: 289, validUntil: '2024-07-07', active: true },
  { id: 'V004', code: 'TEMSPECIAL', type: 'nominal', value: 50000, minOrder: 50000, quota: 100, used: 100, validUntil: '2024-06-15', active: false },
  { id: 'V005', code: 'RAMADAN30', type: 'percentage', value: 30, minOrder: 10000, quota: 2000, used: 1542, validUntil: '2024-04-10', active: false },
  { id: 'V006', code: 'GOSEND5K', type: 'nominal', value: 5000, minOrder: 12000, quota: 800, used: 123, validUntil: '2024-08-15', active: true },
]

const EMPTY_FORM = {
  code: '',
  type: 'percentage',
  value: '',
  minOrder: '',
  quota: '',
  validUntil: '',
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { setVouchers(MOCK_VOUCHERS); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = vouchers.filter(v => {
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? v.active : !v.active)
    const matchSearch = !search || v.code.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.code || !form.value || !form.quota) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setVouchers(prev => [...prev, {
      id: `V${String(prev.length + 1).padStart(3, '0')}`,
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      quota: Number(form.quota),
      used: 0,
      validUntil: form.validUntil || '2024-12-31',
      active: true,
    }])
    setSaving(false)
    setShowModal(false)
  }

  const handleToggle = (id) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, active: !v.active } : v))
  }

  const handleDelete = (id) => {
    if (window.confirm('Hapus voucher ini?')) {
      setVouchers(prev => prev.filter(v => v.id !== id))
    }
  }

  const counts = {
    all: vouchers.length,
    active: vouchers.filter(v => v.active).length,
    inactive: vouchers.filter(v => !v.active).length,
  }

  const totalUsed = vouchers.reduce((acc, v) => acc + v.used, 0)
  const totalQuota = vouchers.reduce((acc, v) => acc + v.quota, 0)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🎟️ Promo & Voucher</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola kode promo dan voucher diskon</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors shadow-sm"
        >
          + Buat Voucher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: '🎟️', label: 'Total Voucher', value: counts.all, color: 'text-blue-600' },
          { icon: '✅', label: 'Voucher Aktif', value: counts.active, color: 'text-green-600' },
          { icon: '📊', label: 'Total Terpakai', value: totalUsed.toLocaleString(), color: 'text-purple-600' },
          { icon: '🎯', label: 'Sisa Kuota', value: (totalQuota - totalUsed).toLocaleString(), color: 'text-yellow-600' },
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex gap-1">
            {['all', 'active', 'inactive'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  statusFilter === f ? 'bg-[#1B3A6B] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Nonaktif'}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{counts[f]}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari kode voucher..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center"><div className="text-3xl mb-2 animate-spin">⟳</div><p className="text-sm">Memuat voucher...</p></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Kode', 'Diskon', 'Min Order', 'Kuota', 'Terpakai', 'Progress', 'Berlaku s/d', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbo>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center text-gray-400">
                    <div className="text-4xl mb-2">🎟️</div>
                    <p className="text-sm">Tidak ada voucher ditemukan</p>
                  </td></tr>
                ) : filtered.map((v, i) => {
                  const progress = Math.min(100, (v.used / v.quota) * 100)
                  return (
                    <tr key={v.id} className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 !== 0 ? 'bg-gray-50/30' : ''}`}>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#1B3A6B] bg-blue-50 px-2 py-0.5 rounded text-sm">{v.code}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-bold ${v.type === 'percentage' ? 'text-green-600' : 'text-purple-600'}`}>
                          {v.type === 'percentage' ? `${v.value}%` : `Rp ${v.value.toLocaleString('id-ID')}`}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">({v.type === 'percentage' ? 'persen' : 'nominal'})</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        Rp {v.minOrder.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{v.quota.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{v.used.toLocaleString()}</td>
                      <td className="py-3 px-4 min-w-[100px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${progress >= 90 ? 'bg-red-500' : progress >= 60 ? 'bg-yellow-400' : 'bg-green-500'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right">{Math.round(progress)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">{v.validUntil}</td>
                      <td className="py-3 px-4">
                        <Badge status={v.active ? 'active' : 'inactive'} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggle(v.id)}
                            className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                              v.active ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {v.active ? 'Nonaktif' : 'Aktifkan'}
                          </button>
                          <button
                            onClick={() => handleDelete(v.id)}
                            className="px-2 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded hover:bg-red-100"
                          >✕</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbo>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Menampilkan {filtered.length} dari {vouchers.length} voucher
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Buat Voucher Baru"
        size="md"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50">Batal</button>
            <button
              onClick={handleSave}
              disabled={saving || !form.code || !form.value || !form.quota}
              className="flex-1 py-2.5 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : 'Buat Voucher'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode Voucher *</label>
            <input
              type="text"
              value={form.code}
              onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="misal: DISKON20"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 font-mono uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Diskon</label>
            <div className="flex gap-3">
              {[
                { value: 'percentage', label: '% Persen', icon: '📊' },
                { value: 'nominal', label: 'Rp Nominal', icon: '💵' },
              ].map(t => (
                <label key={t.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    checked={form.type === t.value}
                    onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="sr-only"
                  />
                  <div className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                    form.type === t.value ? 'border-[#1B3A6B] bg-blue-50' : 'border-gray-200'
                  }`}>
                    <span>{t.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{t.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {[
            { label: `Nilai Diskon (${form.type === 'percentage' ? '%' : 'Rp'}) *`, key: 'value', placeholder: form.type === 'percentage' ? '10' : '20000', type: 'number' },
            { label: 'Min Order (Rp)', key: 'minOrder', placeholder: '15000', type: 'number' },
            { label: 'Kuota Penggunaan *', key: 'quota', placeholder: '500', type: 'number' },
            { label: 'Berlaku Hingga', key: 'validUntil', placeholder: '', type: 'date' },
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
          {form.value && form.type === 'percentage' && Number(form.value) > 0 && (
            <div className="bg-green-50 rounded-lg p-3 text-xs text-green-700">
              💡 Voucher ini memberikan diskon {form.value}% dari total order
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
