'use client'

import { useState, useEffect } from 'react'
import { promoAPI } from '@/lib/api'

export default function PromoPage() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: '', type: 'percentage', value: '', limit: '', expiry: '', minOrder: ''
  })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const data = await promoAPI.getAll()
        setPromos(data)
      } finally {
        setLoading(false)
      }
    }
    fetchPromos()
  }, [])

  const handleToggle = async (id) => {
    const promo = promos.find(p => p.id === id)
    const newStatus = promo.status === 'active' ? 'inactive' : 'active'
    await promoAPI.toggle(id, newStatus)
    setPromos(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.code || !form.value || !form.limit || !form.expiry) {
      setFormError('Semua field wajib diisi!')
      return
    }
    setSaving(true)
    try {
      const res = await promoAPI.create(form)
      setPromos(prev => [{
        id: res.id,
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        limit: Number(form.limit),
        used: 0,
        expiry: form.expiry,
        status: 'active',
        minOrder: Number(form.minOrder) || 0,
      }, ...prev])
      setForm({ code: '', type: 'percentage', value: '', limit: '', expiry: '', minOrder: '' })
      setShowForm(false)
      setSuccessMsg('Promo berhasil dibuat!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const activePromos = promos.filter(p => p.status === 'active')
  const totalUsage = promos.reduce((s, p) => s + p.used, 0)
  const totalLimit = promos.reduce((s, p) => s + p.limit, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🎟️</div>
          <p className="text-gray-500 text-sm">Memuat data promo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🎟️ Manajemen Promo</h1>
          <p className="text-gray-500 text-sm mt-0.5">Buat dan kelola kode promo TemRide</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors shadow-sm"
        >
          {showForm ? '✕ Tutup Form' : '+ Buat Promo Baru'}
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm font-medium">
          ✅ {successMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '✅', label: 'Promo Aktif', value: activePromos.length, color: 'bg-green-50 text-green-600' },
          { icon: '📊', label: 'Total Promo', value: promos.length, color: 'bg-blue-50 text-blue-600' },
          { icon: '🎯', label: 'Total Penggunaan', value: totalUsage.toLocaleString(), color: 'bg-yellow-50 text-yellow-600' },
          { icon: '📈', label: 'Usage Rate', value: `${totalLimit > 0 ? Math.round((totalUsage / totalLimit) * 100) : 0}%`, color: 'bg-purple-50 text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className={`text-2xl font-bold ${s.color.split(' ')[1]} mb-1`}>{s.value}</div>
            <div className="flex items-center gap-1.5">
              <span>{s.icon}</span>
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-[#1B3A6B]/20 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-[#1B3A6B]/5">
            <h3 className="font-bold text-[#1B3A6B]">🎟️ Buat Promo Baru</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-5">
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                ⚠️ {formError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kode Promo *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="TEMRIDE10"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Diskon *</label>
                <select
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 bg-white"
                >
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed">Nominal Tetap (Rp)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nilai Diskon * {form.type === 'percentage' ? '(%)' : '(Rp)'}
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                  placeholder={form.type === 'percentage' ? '10' : '20000'}
                  min="1"
                  max={form.type === 'percentage' ? '100' : undefined}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Limit Penggunaan *</label>
                <input
                  type="number"
                  value={form.limit}
                  onChange={e => setForm(p => ({ ...p, limit: e.target.value }))}
                  placeholder="500"
                  min="1"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Kadaluarsa *</label>
                <input
                  type="date"
                  value={form.expiry}
                  onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. Order (Rp)</label>
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))}
                  placeholder="15000"
                  min="0"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors disabled:opacity-60"
              >
                {saving ? '⟳ Menyimpan...' : '🎟️ Buat Promo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Promos Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Semua Promo</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Kode</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Tipe</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Nilai</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Penggunaan</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell">Kadaluarsa</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Min Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbo>
              {promos.map((promo, i) => {
                const usagePct = Math.round((promo.used / promo.limit) * 100)
                return (
                  <tr key={promo.id} className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#1B3A6B] bg-[#1B3A6B]/10 px-2.5 py-1 rounded-lg text-sm">
                        {promo.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        promo.type === 'percentage' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {promo.type === 'percentage' ? 'Persentase' : 'Nominal'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-800">
                      {promo.type === 'percentage' ? `${promo.value}%` : `Rp ${Number(promo.value).toLocaleString('id-ID')}`}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-20">
                          <div
                            className={`h-1.5 rounded-full ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(usagePct, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {promo.used}/{promo.limit}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 hidden sm:table-cell">{promo.expiry}</td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        Rp {Number(promo.minOrder).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        promo.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {promo.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggle(promo.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          promo.status === 'active'
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {promo.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbo>
          </table>
        </div>

        {/* Usage Stats per promo */}
        <div className="p-5 border-t border-gray-100">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">📊 Statistik Penggunaan per Promo</h4>
          <div className="space-y-3">
            {promos.map(promo => {
              const pct = Math.min(Math.round((promo.used / promo.limit) * 100), 100)
              return (
                <div key={promo.id} className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#1B3A6B] w-28 flex-shrink-0">{promo.code}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-[#1B3A6B]'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-20 flex-shrink-0 text-right">
                    {promo.used}/{promo.limit} ({pct}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
