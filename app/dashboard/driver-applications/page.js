'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://temride-backend-production.up.railway.app'

const STATUS_CONFIG = {
  PENDING:        { label: 'Pending',        color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  DOCUMENT_CHECK: { label: 'Cek Dokumen',   color: 'bg-blue-100 text-blue-800 border-blue-200' },
  INTERVIEW:      { label: 'Interview',      color: 'bg-purple-100 text-purple-800 border-purple-200' },
  CREDIT_CHECK:   { label: 'Cek Kredit',    color: 'bg-orange-100 text-orange-800 border-orange-200' },
  APPROVED:       { label: 'Disetujui',      color: 'bg-green-100 text-green-800 border-green-200' },
  REJECTED:       { label: 'Ditolak',        color: 'bg-red-100 text-red-800 border-red-200' },
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'

export default function DriverApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', city: '', vehicleType: '' })
  const [selected, setSelected] = useState(null)
  const [reviewForm, setReviewForm] = useState({ status: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [reviewMsg, setReviewMsg] = useState('')

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('temride_token') || localStorage.getItem('token')
      const params = {}
      if (filters.status)      params.status      = filters.status
      if (filters.city)        params.city        = filters.city
      if (filters.vehicleType) params.vehicleType = filters.vehicleType
      const res = await axios.get(`${API_BASE}/api/driver-registration`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      setApplications(res.data.data || [])
      setStats(res.data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const openDetail = (app) => {    setSelected(app)
    setReviewForm({ status: app.status, notes: app.notes || '' })
    setReviewMsg('')
  }

  const handleReview = async () => {
    if (!selected) return
    setSubmitting(true)
    setReviewMsg('')
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('temride_token') || localStorage.getItem('token')
      await axios.patch(
        `${API_BASE}/api/driver-registration/${selected.id}/review`,
        { status: reviewForm.status, notes: reviewForm.notes },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReviewMsg('✅ Status berhasil diperbarui')
      setSelected((prev) => ({ ...prev, status: reviewForm.status, notes: reviewForm.notes }))
      fetchApplications()
    } catch (err) {
      setReviewMsg('❌ Gagal memperbarui status: ' + (err.response?.data?.message || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  const quickReview = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('temride_token') || localStorage.getItem('token')
      await axios.patch(
        `${API_BASE}/api/driver-registration/${id}/review`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchApplications()
      if (selected?.id === id) {
        setSelected((prev) => ({ ...prev, status }))
        setReviewForm((prev) => ({ ...prev, status }))
        setReviewMsg('✅ Status diperbarui')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📝 Pendaftaran Driver</h1>
        <p className="text-gray-500 text-sm mt-1">Manajemen pendaftaran mitra driver TemRide</p>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Tentang Halaman Ini</h3>
        <p className="text-blue-700 text-sm mb-3">
          Halaman ini menampilkan pendaftar driver baru dari:
        </p>
        <ol className="list-decimal list-inside text-blue-700 text-sm space-y-1">
          <li>Form online di <strong>temride.id/daftar-driver.html</strong></li>
          <li>Walk-in di kantor <strong>PT TEM Balikpapan</strong></li>
        </ol>
        <p className="text-blue-700 text-sm mt-3">
          <strong>Alur:</strong> Daftar → Review Admin → <span className="text-green-700 font-semibold">Approved</span> / <span className="text-red-700 font-semibold">Rejected</span> → Notif WA ke calon driver
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📋' },
          { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '⏳' },
          { label: 'Disetujui', value: stats.approved, color: 'bg-green-50 text-green-700 border-green-200', icon: '✅' },
          { label: 'Ditolak', value: stats.rejected, color: 'bg-red-50 text-red-700 border-red-200', icon: '❌' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <select
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Kota</option>
          <option value="BALIKPAPAN">Balikpapan</option>
          <option value="SAMARINDA">Samarinda</option>
        </select>

        <select
          value={filters.vehicleType}
          onChange={(e) => setFilters((f) => ({ ...f, vehicleType: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Kendaraan</option>
          <option value="MOTOR">Motor</option>
          <option value="MOBIL">Mobil</option>
        </select>

        <button
          onClick={() => setFilters({ status: '', city: '', vehicleType: '' })}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Reset Filter
        </button>

        <button
          onClick={fetchApplications}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-3 animate-spin inline-block">⏳</div>
            <p>Memuat data...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📭</div>
            <p>Tidak ada data pendaftaran</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['No Reg', 'Nama', 'HP', 'Kota', 'Kendaraan', 'Kredit?', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbo className="divide-y divide-gray-100">
                {applications.map((app) => {
                  const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => openDetail(app)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold">{app.registrationNumber}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{app.fullName}</td>
                      <td className="px-4 py-3 text-gray-600">{app.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{app.city}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${app.vehicleType === 'MOTOR' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {app.vehicleType === 'MOTOR' ? '🛵' : '🚗'} {app.vehicleType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{app.requestCredit ? '💳 Ya' : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{formatDate(app.createdAt)}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          {app.status === 'PENDING' && (
                            <button
                              onClick={() => quickReview(app.id, 'INTERVIEW')}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                            >
                              Interview
                            </button>
                          )}
                          {app.status !== 'APPROVED' && app.status !== 'REJECTED' && (
                            <>
                              <button
                                onClick={() => quickReview(app.id, 'APPROVED')}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => quickReview(app.id, 'REJECTED')}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbo>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-start justify-center px-4 pt-8 pb-20">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSelected(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl z-10">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Detail Pendaftaran</h2>
                  <p className="text-sm text-blue-700 font-mono">{selected.registrationNumber}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Data Diri */}
                <section>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-base">👤</span> Data Diri
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Nama Lengkap', selected.fullName],
                      ['NIK KTP', selected.nik],
                      ['No HP', selected.phone],
                      ['Email', selected.email || '-'],
                      ['Tanggal Lahir', selected.birthDate || '-'],
                      ['Kota', selected.city],
                      ['Alamat', selected.address || '-'],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Data Kendaraan */}
                <section>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-base">{selected.vehicleType === 'MOTOR' ? '🛵' : '🚗'}</span> Kendaraan
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Jenis', selected.vehicleType],
                      ['Punya Kendaraan', selected.hasOwnVehicle ? 'Ya' : 'Tidak'],
                      ['Merek', selected.vehicleBrand || '-'],
                      ['Model', selected.vehicleModel || '-'],
                      ['Tahun', selected.vehicleYear || '-'],
                      ['Plat Nomor', selected.vehiclePlate || '-'],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className="text-sm font-medium text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Kredit */}
                {selected.requestCredit && (
                  <section>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="text-base">💳</span> Kredit Kendaraan
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">Paket Kredit</p>
                      <p className="text-sm font-semibold text-blue-900">{selected.creditPackage || '-'}</p>
                    </div>
                  </section>
                )}

                {/* Dokumen */}
                <section>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-base">📄</span> Dokumen
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ['KTP', selected.ktpPhotoUrl],
                      ['SIM', selected.simPhotoUrl],
                      ['Selfie + KTP', selected.selfiePhotoUrl],
                      ['STNK', selected.stnkPhotoUrl],
                      ['Buku Rekening', selected.bankBookUrl],
                      ['KK', selected.kkPhotoUrl],
                      ['Slip Gaji/SKU', selected.salarySlipUrl],
                    ].map(([label, url]) => (
                      <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
                        {url ? (
                          <>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={url}
                                alt={label}
                                className="w-full h-20 object-cover rounded-md mb-2 hover:opacity-80 transition-opacity cursor-pointer"
                                onError={(e) => { e.target.style.display = 'none' }}
                              />
                            </a>
                            <p className="text-xs text-gray-600">{label}</p>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                              Lihat File
                            </a>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-20 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400 text-2xl">
                              📎
                            </div>
                            <p className="text-xs text-gray-400">{label} — Belum upload</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Riwayat & Update Status */}
                <section>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-base">🔄</span> Status & Aksi
                  </h3>

                  {/* Status History Display */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {['PENDING', 'DOCUMENT_CHECK', 'INTERVIEW', 'CREDIT_CHECK', 'APPROVED'].map((s, i, arr) => {
                      const statuses = ['PENDING', 'DOCUMENT_CHECK', 'INTERVIEW', 'CREDIT_CHECK', 'APPROVED', 'REJECTED']
                      const currentIdx = statuses.indexOf(selected.status)
                      const stepIdx = statuses.indexOf(s)
                      const isActive = selected.status === s
                      const isPast = currentIdx > stepIdx && selected.status !== 'REJECTED'
                      const cfg = STATUS_CONFIG[s]
                      return (
                        <div key={s} className="flex items-center gap-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                            isActive ? cfg.color : isPast ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'
                          }`}>
                            {isPast ? '✓ ' : ''}{cfg.label}
                          </span>
                          {i < arr.length - 1 && <span className="text-gray-300">→</span>}
                        </div>
                      )
                    })}
                    {selected.status === 'REJECTED' && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${STATUS_CONFIG.REJECTED.color}`}>
                        ✗ Ditolak
                      </span>
                    )}
                  </div>

                  {/* Update Form */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Update Status</label>
                      <select
                        value={reviewForm.status}
                        onChange={(e) => setReviewForm((f) => ({ ...f, status: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <option key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                      <textarea
                        value={reviewForm.notes}
                        onChange={(e) => setReviewForm((f) => ({ ...f, notes: e.target.value }))}
                        rows={2}
                        placeholder="Catatan untuk driver atau internal..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    {reviewMsg && (
                      <p className="text-sm font-medium">{reviewMsg}</p>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => { setReviewForm((f) => ({ ...f, status: 'INTERVIEW' })); setTimeout(handleReview, 100) }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                      >
                        🎯 Interview
                      </button>
                      <button
                        onClick={() => { setReviewForm((f) => ({ ...f, status: 'APPROVED' })); setTimeout(handleReview, 100) }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => { setReviewForm((f) => ({ ...f, status: 'REJECTED' })); setTimeout(handleReview, 100) }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={handleReview}
                        disabled={submitting}
                        className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {submitting ? '⏳ Menyimpan...' : '💾 Simpan Status'}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Meta */}
                <div className="text-xs text-gray-400 border-t border-gray-100 pt-3">
                  <p>Terdaftar: {formatDate(selected.createdAt)}</p>
                  {selected.reviewedAt && <p>Direview: {formatDate(selected.reviewedAt)}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
