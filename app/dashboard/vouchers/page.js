'use client'
import { useState, useEffect } from 'react'

const API_URL = 'https://temride-backend-production.up.railway.app'

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('adminToken') || localStorage.getItem('temride_token') || ''
}

const EMPTY_FORM = {
  code: '',
  type: 'percentage',
  value: '',
  minOrder: '',
  maxUsage: '',
  validUntil: '',
  description: '',
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const fetchVouchers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/vouchers-list`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      if (res.ok) {
        const data = await res.json()
        setVouchers(data.vouchers || data.promoCodes || data.data || [])
      } else {
        setVouchers([])
      }
    } catch {
      setVouchers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVouchers() }, [])

  const filtered = vouchers.filter(v => {
    const isActive = v.active !== false && v.status !== 'INACTIVE'
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && isActive) ||
      (statusFilter === 'inactive' && !isActive)
    const matchSearch = !search || (v.code || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setSaveError('')
    setSaveSuccess('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.code || !form.value || !form.maxUsage) {
      setSaveError('Kode, nilai diskon, dan max penggunaan wajib diisi.')
      return
    }
    setSaving(true)
    setSaveError('')
    setSaveSuccess('')
    try {
      const payload = {
        code: form.code.toUpperCase(),
        type: form.type,
        discountType: form.type,
        value: Number(form.value),
        discount: Number(form.value),
        minOrder: Number(form.minOrder) || 0,
        minOrderAmount: Number(form.minOrder) || 0,
        maxUsage: Number(form.maxUsage),
        usageLimit: Number(form.maxUsage),
        validUntil: form.validUntil || undefined,
        expiresAt: form.validUntil || undefined,
        description: form.description || undefined,
      }
      const res = await fetch(`${API_URL}/api/admin/vouchers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        setSaveSuccess('✅ Voucher berhasil dibuat!')
        await fetchVouchers()
        setTimeout(() => {
          setShowModal(false)
          setSaveSuccess('')
        }, 1200)
      } else {
        setSaveError(data.message || `Gagal membuat voucher (${res.status})`)
      }
    } catch (err) {
      setSaveError('Koneksi gagal: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (v) => {
    const isActive = v.active !== false && v.status !== 'INACTIVE'
    try {
      const res = await fetch(`${API_URL}/api/admin/vouchers/${v.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ active: !isActive, status: !isActive ? 'ACTIVE' : 'INACTIVE' }),
      })
      if (res.ok) {
        setVouchers(prev =>
          prev.map(x =>
            x.id === v.id
              ? { ...x, active: !isActive, status: !isActive ? 'ACTIVE' : 'INACTIVE' }
              : x
          )
        )
      }
    } catch {}
  }

  const handleDelete = async (v) => {
    if (!window.confirm(`Hapus voucher ${v.code}?`)) return
    try {
      const res = await fetch(`${API_URL}/api/admin/vouchers/${v.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      })
      if (res.ok) {
        setVouchers(prev => prev.filter(x => x.id !== v.id))
      } else {
        // Optimistic remove anyway for UX
        setVouchers(prev => prev.filter(x => x.id !== v.id))
      }
    } catch {
      setVouchers(prev => prev.filter(x => x.id !== v.id))
    }
  }

  const counts = {
    all: vouchers.length,
    active: vouchers.filter(v => v.active !== false && v.status !== 'INACTIVE').length,
    inactive: vouchers.filter(v => v.active === false || v.status === 'INACTIVE').length,
  }

  return (
    <div className="space-y-5 p-1">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🎟️ Promo &amp; Voucher</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola kode promo dan voucher diskon TemRide</p>
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
          { icon: '📊', label: 'Total Terpakai', value: vouchers.reduce((a, v) => a + (v.used || v.usageCount || 0), 0), color: 'text-purple-600' },
          { icon: '🎯', label: 'Sisa Kuota', value: vouchers.reduce((a, v) => a + Math.max(0, (v.maxUsage || v.usageLimit || 0) - (v.used || v.usageCount || 0)), 0), color: 'text-yellow-600' },
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
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari kode voucher..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
              />
            </div>
            <button
              onClick={fetchVouchers}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            ⏳ Memuat voucher...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🎟️</div>
            <p className="text-gray-500 font-medium">
              {vouchers.length === 0 ? 'Belum ada voucher' : 'Tidak ada voucher ditemukan'}
            </p>
            {vouchers.length === 0 && (
              <button
                onClick={openCreate}
                className="mt-4 px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm hover:bg-blue-800 transition-colors"
              >
                + Buat Voucher Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Kode', 'Diskon', 'Min Order', 'Kuota', 'Terpakai', 'Berlaku s/d', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const isActive = v.active !== false && v.status !== 'INACTIVE'
                  const used = v.used || v.usageCount || 0
                  const quota = v.maxUsage || v.usageLimit || 0
                  const discountType = v.type || v.discountType || 'percentage'
                  const discountValue = v.value || v.discount || 0
                  return (
                    <tr key={v.id || i} className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 !== 0 ? 'bg-gray-50/30' : ''}`}>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#1B3A6B] bg-blue-50 px-2 py-0.5 rounded text-sm">{v.code}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-bold ${discountType === 'percentage' ? 'text-green-600' : 'text-purple-600'}`}>
                          {discountType === 'percentage' ? `${discountValue}%` : `Rp ${discountValue.toLocaleString('id-ID')}`}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">({discountType === 'percentage' ? 'persen' : 'nominal'})</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        Rp {(v.minOrder || v.minOrderAmount || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{quota || '-'}</td>
                      <td className="py-3 px-4 text-gray-700">{used}</td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {v.validUntil || v.expiresAt
                          ? new Date(v.validUntil || v.expiresAt).toLocaleDateString('id-ID')
                          : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggle(v)}
                            className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                              isActive ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {isActive ? 'Nonaktif' : 'Aktifkan'}
                          </button>
                          <button
                            onClick={() => handleDelete(v)}
                            className="px-2 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Menampilkan {filtered.length} dari {vouchers.length} voucher
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 py-8">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">🎟️ Buat Voucher Baru</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
              </div>

              <div className="p-6 space-y-4">
                {/* Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Voucher *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="contoh: DISKON20"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 font-mono uppercase"
                  />
                </div>

                {/* Type */}
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
                          name="voucherType"
                          value={t.value}
                          checked={form.type === t.value}
                          onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                          className="sr-only"
                        />
                        <div className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                          form.type === t.value ? 'border-[#1B3A6B] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <span>{t.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{t.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nilai Diskon ({form.type === 'percentage' ? '%' : 'Rp'}) *
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                    placeholder={form.type === 'percentage' ? '10' : '20000'}
                    min="1"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                  />
                </div>

                {/* Min Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (Rp)</label>
                  <input
                    type="number"
                    value={form.minOrder}
                    onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))}
                    placeholder="15000"
                    min="0"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                  />
                </div>

                {/* Max Usage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maks Penggunaan *</label>
                  <input
                    type="number"
                    value={form.maxUsage}
                    onChange={e => setForm(p => ({ ...p, maxUsage: e.target.value }))}
                    placeholder="500"
                    min="1"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                  />
                </div>

                {/* Valid Until */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berlaku Hingga</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Voucher untuk pelanggan baru"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                  />
                </div>

                {saveError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{saveError}</div>
                )}
                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">{saveSuccess}</div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.code || !form.value || !form.maxUsage}
                  className="flex-1 py-2.5 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] disabled:opacity-60 transition-colors"
                >
                  {saving ? '⏳ Menyimpan...' : '✅ Buat Voucher'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
