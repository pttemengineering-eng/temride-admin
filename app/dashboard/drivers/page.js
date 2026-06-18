'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = 'https://temride-backend-production.up.railway.app'

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : ''

const statusConfig = {
  ACTIVE: { label: 'Aktif', bg: 'bg-green-100', text: 'text-green-800' },
  PENDING_KYC: { label: 'Pending KYC', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  SUSPENDED: { label: 'Suspended', bg: 'bg-red-100', text: 'text-red-800' },
  REJECTED: { label: 'Ditolak', bg: 'bg-gray-100', text: 'text-gray-600' },
}

const performanceConfig = {
  GOOD: { label: 'Performa Baik', bg: 'bg-green-100', text: 'text-green-700', icon: '✅', bar: 'bg-green-500' },
  WARNING: { label: 'Perlu Perhatian', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⚠️', bar: 'bg-yellow-500' },
  CRITICAL: { label: 'Kritis', bg: 'bg-red-100', text: 'text-red-700', icon: '🚨', bar: 'bg-red-500' },
}

function getPerformanceLevel(rating, acceptanceRate, cancelRate) {
  if (rating >= 4.5 && (acceptanceRate === null || acceptanceRate >= 80) && (cancelRate === null || cancelRate <= 10)) return 'GOOD'
  if (rating >= 4.0 && (acceptanceRate === null || acceptanceRate >= 60) && (cancelRate === null || cancelRate <= 20)) return 'WARNING'
  return 'CRITICAL'
}

function PerformanceBar({ value, max = 100, color = 'bg-blue-500' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function DriverDetailModal({ driver, onClose, onVerify, onSuspend }) {
  if (!driver) return null
  const rating = driver.driverProfile?.rating || driver.avgRating || 5.0
  const acceptanceRate = driver.driverProfile?.acceptanceRate ?? null
  const cancelRate = driver.driverProfile?.cancelRate ?? null
  const perf = performanceConfig[getPerformanceLevel(rating, acceptanceRate, cancelRate)]
  const totalTrips = driver._count?.orders || driver.totalTrips || 0
  const walletBalance = driver.driverProfile?.walletBalance || 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1B3A6B] flex items-center justify-center text-white font-bold text-lg">
              {(driver.name || '?')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-gray-800">{driver.name || '-'}</h2>
              <p className="text-xs text-gray-500">{driver.phone || '-'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status & Online */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${(statusConfig[driver.status] || statusConfig.PENDING_KYC).bg} ${(statusConfig[driver.status] || statusConfig.PENDING_KYC).text}`}>
              {(statusConfig[driver.status] || statusConfig.PENDING_KYC).label}
            </span>
            <span className={`text-xs font-medium ${driver.driverProfile?.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
              {driver.driverProfile?.isOnline ? '🟢 Online' : '⚫ Offline'}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${perf.bg} ${perf.text}`}>
              {perf.icon} {perf.label}
            </span>
          </div>

          {/* Performance Cards — Gojek style */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 text-sm mb-3">📊 Monitoring Performa</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-yellow-500 text-lg mb-0.5">⭐</div>
                <div className="text-xl font-bold text-gray-800">{Number(rating).toFixed(1)}</div>
                <div className="text-xs text-gray-500">Rating</div>
                <PerformanceBar value={rating} max={5} color={rating >= 4.5 ? 'bg-green-500' : rating >= 4.0 ? 'bg-yellow-500' : 'bg-red-500'} />
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-green-500 text-lg mb-0.5">✔️</div>
                <div className="text-xl font-bold text-gray-800">
                  {acceptanceRate !== null ? `${acceptanceRate}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Acceptance</div>
                {acceptanceRate !== null && <PerformanceBar value={acceptanceRate} max={100} color={acceptanceRate >= 80 ? 'bg-green-500' : acceptanceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'} />}
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-red-500 text-lg mb-0.5">🚫</div>
                <div className="text-xl font-bold text-gray-800">
                  {cancelRate !== null ? `${cancelRate}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Cancel Rate</div>
                {cancelRate !== null && <PerformanceBar value={cancelRate} max={100} color={cancelRate <= 10 ? 'bg-green-500' : cancelRate <= 20 ? 'bg-yellow-500' : 'bg-red-500'} />}
              </div>
            </div>
          </div>

          {/* Trip & Wallet */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-blue-600 text-xl mb-1">🛵</div>
              <div className="text-2xl font-bold text-blue-800">{totalTrips}</div>
              <div className="text-xs text-blue-600">Total Trip</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="text-emerald-600 text-xl mb-1">💰</div>
              <div className="text-lg font-bold text-emerald-800">Rp {walletBalance.toLocaleString('id')}</div>
              <div className="text-xs text-emerald-600">Saldo Driver</div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 text-sm mb-2">🚗 Info Kendaraan</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Model</span>
                <p className="font-medium text-gray-800">{driver.driverProfile?.vehicleModel || driver.vehicleModel || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Plat Nomor</span>
                <p className="font-medium font-mono text-gray-800">{driver.driverProfile?.vehiclePlate || driver.vehiclePlate || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Jenis</span>
                <p className="font-medium text-gray-800">{driver.driverProfile?.vehicleType || driver.vehicleType || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">No. SIM</span>
                <p className="font-medium text-gray-800">{driver.driverProfile?.simNumber || driver.simNumber || '-'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            {driver.status === 'PENDING_KYC' && (
              <>
                <button onClick={() => { onVerify(driver.id, 'approve'); onClose() }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium">
                  ✅ Approve Driver
                </button>
                <button onClick={() => { onVerify(driver.id, 'reject'); onClose() }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium">
                  ❌ Reject
                </button>
              </>
            )}
            {driver.status === 'ACTIVE' && (
              <button onClick={() => { onSuspend(driver.id); onClose() }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-medium">
                ⏸ Suspend Driver
              </button>
            )}
            <Link href={`/dashboard/drivers/${driver.id}`}
              className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium text-center hover:bg-gray-50">
              📄 Halaman Detail
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [detailDriver, setDetailDriver] = useState(null)
  const [addForm, setAddForm] = useState({
    name: '', phone: '', simNumber: '',
    vehicleType: 'MOTORCYCLE', vehiclePlate: '', vehicleModel: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const fetchDrivers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/drivers`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setDrivers(data.drivers || data.data || [])
    } catch { setDrivers([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDrivers() }, [])

  const handleAddDriver = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMsg('')
    try {
      const res = await fetch(`${API_URL}/api/admin/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({
          ...addForm,
          phone: addForm.phone.replace(/^0/, '62').replace(/^\+/, ''),
          role: 'DRIVER'
        })
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitMsg('✅ Driver berhasil ditambahkan!')
        setAddForm({ name: '', phone: '', simNumber: '', vehicleType: 'MOTORCYCLE', vehiclePlate: '', vehicleModel: '' })
        fetchDrivers()
        setTimeout(() => { setShowAddModal(false); setSubmitMsg('') }, 2000)
      } else {
        setSubmitMsg(`❌ ${data.message || 'Gagal menambahkan driver'}`)
      }
    } catch (err) {
      setSubmitMsg(`❌ Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerify = async (driverId, action) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/drivers/${driverId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ action })
      })
      if (res.ok) { fetchDrivers() }
      else {
        await fetch(`${API_URL}/api/admin/drivers/${driverId}/approve`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
          body: JSON.stringify({ status: action === 'approve' ? 'ACTIVE' : 'REJECTED' })
        })
        fetchDrivers()
      }
    } catch (err) { alert('Gagal: ' + err.message) }
  }

  const handleSuspend = async (driverId) => {
    if (!confirm('Yakin suspend driver ini?')) return
    try {
      await fetch(`${API_URL}/api/admin/drivers/${driverId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ action: 'suspend' })
      })
      fetchDrivers()
    } catch {}
  }

  const filtered = drivers
    .filter(d => {
      const matchSearch = !search ||
        (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.phone || '').includes(search) ||
        (d.driverProfile?.vehiclePlate || '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || d.status === filterStatus ||
        (filterStatus === 'online' && d.driverProfile?.isOnline)
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.driverProfile?.rating || 5) - (a.driverProfile?.rating || 5)
      if (sortBy === 'trips') return (b._count?.orders || b.totalTrips || 0) - (a._count?.orders || a.totalTrips || 0)
      if (sortBy === 'balance') return (b.driverProfile?.walletBalance || 0) - (a.driverProfile?.walletBalance || 0)
      return (a.name || '').localeCompare(b.name || '')
    })

  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.status === 'ACTIVE').length,
    online: drivers.filter(d => d.driverProfile?.isOnline).length,
    pending: drivers.filter(d => d.status === 'PENDING_KYC').length,
    good: drivers.filter(d => {
      const r = d.driverProfile?.rating || d.avgRating || 5
      return getPerformanceLevel(r, d.driverProfile?.acceptanceRate ?? null, d.driverProfile?.cancelRate ?? null) === 'GOOD'
    }).length,
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🛵 Manajemen Driver</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola mitra driver TemRide — verifikasi, monitoring performa, dan status</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchDrivers} className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
            🔄 Refresh
          </button>
          <button onClick={() => setShowAddModal(true)} className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 font-medium">
            + Tambah Driver
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Driver', value: stats.total, icon: '👥', bg: 'bg-white', text: 'text-gray-800' },
          { label: 'Driver Aktif', value: stats.active, icon: '✅', bg: 'bg-green-50', text: 'text-green-800' },
          { label: 'Sedang Online', value: stats.online, icon: '🟢', bg: 'bg-emerald-50', text: 'text-emerald-800' },
          { label: 'Menunggu KYC', value: stats.pending, icon: '⏳', bg: 'bg-yellow-50', text: 'text-yellow-800' },
          { label: 'Performa Baik', value: stats.good, icon: '🏆', bg: 'bg-blue-50', text: 'text-blue-800' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl border border-gray-100 shadow-sm p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{s.icon}</span>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Gojek-style Driver Lifecycle Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white">
        <h3 className="font-semibold mb-3 text-white/90 text-sm">📋 Alur Siklus Hidup Driver (Gojek-style)</h3>
        <div className="flex flex-wrap gap-0 items-center">
          {[
            { step: '1', label: 'Daftar Online', desc: 'temride.id/daftar-driver', emoji: '📝' },
            { step: '2', label: 'Upload Dokumen', desc: 'KTP, SIM, STNK', emoji: '📎' },
            { step: '3', label: 'Review Admin', desc: 'Approve / Reject', emoji: '🔍' },
            { step: '4', label: 'Akun Aktif', desc: 'Mulai trip', emoji: '🚀' },
            { step: '5', label: 'Monitoring', desc: 'Rating & performa', emoji: '📊' },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex items-center">
              <div className="bg-white/15 px-3 py-2 rounded-lg text-center min-w-[90px]">
                <div className="text-xl mb-0.5">{s.emoji}</div>
                <div className="font-semibold text-xs">Step {s.step}: {s.label}</div>
                <div className="text-white/70 text-xs">{s.desc}</div>
              </div>
              {i < arr.length - 1 && <div className="text-white/40 text-lg px-1">›</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Filter, Search & Sort */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Cari nama, HP, atau plat nomor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', 'ACTIVE', 'PENDING_KYC', 'SUSPENDED', 'online'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'bg-[#1B3A6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s === 'all' ? 'Semua' : s === 'online' ? '🟢 Online' : s === 'PENDING_KYC' ? '⏳ KYC' : s}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="name">Urutkan: Nama</option>
          <option value="rating">Urutkan: Rating ↓</option>
          <option value="trips">Urutkan: Trip Terbanyak</option>
          <option value="balance">Urutkan: Saldo Terbesar</option>
        </select>
      </div>

      {/* Driver Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-[#1B3A6B] rounded-full animate-spin" />
            <span className="text-sm">Memuat data driver...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🛵</div>
            <p className="text-gray-500 font-medium">
              {search ? `Tidak ada driver dengan kata kunci "${search}"` : 'Belum ada driver terdaftar'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Driver mendaftar via{' '}
              <a href="https://temride.id/daftar-driver.html" target="_blank" rel="noreferrer" className="text-blue-500 underline">
                temride.id/daftar-driver
              </a>{' '}
              atau tombol &quot;Tambah Driver&quot; di atas
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kendaraan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Online</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">⭐ Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Trip</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Saldo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Performa</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const rating = d.driverProfile?.rating || d.avgRating || 5.0
                  const acceptanceRate = d.driverProfile?.acceptanceRate ?? null
                  const cancelRate = d.driverProfile?.cancelRate ?? null
                  const perfKey = getPerformanceLevel(rating, acceptanceRate, cancelRate)
                  const perf = performanceConfig[perfKey]
                  const status = statusConfig[d.status] || statusConfig.PENDING_KYC
                  const totalTrips = d._count?.orders || d.totalTrips || 0

                  return (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => setDetailDriver(d)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center text-[#1B3A6B] font-bold text-sm flex-shrink-0">
                            {(d.name || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 text-sm">{d.name || '-'}</div>
                            <div className="text-xs text-gray-500">{d.phone || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{d.driverProfile?.vehicleModel || d.vehicleModel || '-'}</div>
                        <div className="text-xs text-gray-500 font-mono">{d.driverProfile?.vehiclePlate || d.vehiclePlate || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${d.driverProfile?.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                          {d.driverProfile?.isOnline ? '🟢 Online' : '⚫ Offline'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 text-sm">⭐</span>
                          <span className="text-sm font-semibold text-gray-700">{Number(rating).toFixed(1)}</span>
                        </div>
                        <div className="w-14 bg-gray-100 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${rating >= 4.5 ? 'bg-green-500' : rating >= 4.0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(rating / 5) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-medium">{totalTrips}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Rp {(d.driverProfile?.walletBalance || 0).toLocaleString('id')}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${perf.bg} ${perf.text}`}>
                            {perf.icon} {perf.label}
                          </span>
                          {acceptanceRate !== null && (
                            <div className="text-xs text-gray-400 mt-1">ACC: {acceptanceRate}%</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1 flex-wrap">
                          {d.status === 'PENDING_KYC' && (
                            <>
                              <button
                                onClick={() => handleVerify(d.id, 'approve')}
                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md font-medium transition-colors">
                                ✅ Approve
                              </button>
                              <button
                                onClick={() => handleVerify(d.id, 'reject')}
                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md font-medium transition-colors">
                                ❌ Reject
                              </button>
                            </>
                          )}
                          {d.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleSuspend(d.id)}
                              className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-md font-medium transition-colors">
                              ⏸ Suspend
                            </button>
                          )}
                          <button
                            onClick={() => setDetailDriver(d)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors">
                            👁 Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Table Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
              <span>Menampilkan {filtered.length} dari {drivers.length} driver</span>
              <span>Klik baris untuk detail performa lengkap</span>
            </div>
          </div>
        )}
      </div>

      {/* Performance Legend */}
      {!loading && drivers.length > 0 && (
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <span className="font-medium">Keterangan Performa:</span>
          {Object.entries(performanceConfig).map(([key, p]) => (
            <span key={key} className={`px-2 py-1 rounded-full ${p.bg} ${p.text} font-medium`}>
              {p.icon} {p.label}
            </span>
          ))}
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">+ Tambah Driver Baru</h2>
              <button onClick={() => { setShowAddModal(false); setSubmitMsg('') }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleAddDriver} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nama Lengkap *</label>
                <input required value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Ahmad Yani" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">No WhatsApp *</label>
                <input required value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="08xxxxxxxxxx" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nomor SIM</label>
                <input value={addForm.simNumber} onChange={e => setAddForm(p => ({ ...p, simNumber: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="B1234567" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Jenis Kendaraan</label>
                  <select value={addForm.vehicleType} onChange={e => setAddForm(p => ({ ...p, vehicleType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <option value="MOTORCYCLE">Motor</option>
                    <option value="CAR">Mobil</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Plat Nomor</label>
                  <input value={addForm.vehiclePlate} onChange={e => setAddForm(p => ({ ...p, vehiclePlate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="KT 1234 AB" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Model Kendaraan</label>
                <input value={addForm.vehicleModel} onChange={e => setAddForm(p => ({ ...p, vehicleModel: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Alva One / Gesits G1" />
              </div>
              {submitMsg && (
                <div className={`p-3 rounded-lg text-sm ${submitMsg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {submitMsg}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddModal(false); setSubmitMsg('') }}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 font-medium">
                  Batal
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-[#1B3A6B] text-white py-2.5 rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50 font-medium transition-colors">
                  {submitting ? '⏳ Menyimpan...' : '+ Tambah Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Detail Modal */}
      {detailDriver && (
        <DriverDetailModal
          driver={detailDriver}
          onClose={() => setDetailDriver(null)}
          onVerify={handleVerify}
          onSuspend={handleSuspend}
        />
      )}
    </div>
  )
}
