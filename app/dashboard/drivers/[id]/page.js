'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { driversAPI } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DriverDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')
  const [actionLoading, setActionLoading] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const data = await driversAPI.getById(params.id)
        setDriver(data)
      } catch {
        router.push('/dashboard/drivers')
      } finally {
        setLoading(false)
      }
    }
    fetchDriver()
  }, [params.id])

  const handleApprove = async () => {
    setActionLoading('approve')
    try {
      await driversAPI.approveKYC(driver.id)
      setDriver(prev => ({ ...prev, kycStatus: 'approved' }))
      setSuccessMsg('KYC berhasil diapprove!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } finally { setActionLoading(null) }
  }

  const handleSuspend = async () => {
    setActionLoading('suspend')
    try {
      await driversAPI.suspend(driver.id)
      setDriver(prev => ({ ...prev, status: 'suspended' }))
      setSuccessMsg('Driver berhasil disuspend.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } finally { setActionLoading(null) }
  }

  const handleActivate = async () => {
    setActionLoading('activate')
    try {
      await driversAPI.activate(driver.id)
      setDriver(prev => ({ ...prev, status: 'active' }))
      setSuccessMsg('Driver berhasil diaktifkan!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } finally { setActionLoading(null) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🏍️</div>
          <p className="text-gray-500 text-sm">Memuat data driver...</p>
        </div>
      </div>
    )
  }

  if (!driver) return null

  const creditPct = driver.creditBalance || 65

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Back + Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          ← Kembali
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">Detail Driver</h1>
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2">
          ✅ {successMsg}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 bg-[#1B3A6B] rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {driver.name?.charAt(0)}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{driver.name}</h2>
                <p className="text-gray-500 text-sm">{driver.phone}</p>
                <p className="text-gray-400 text-xs mt-0.5">ID: {driver.id}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {driver.status === 'active' ? '● Aktif' : '● Suspended'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    driver.kycStatus === 'approved' ? 'bg-blue-100 text-blue-700' :
                    driver.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'
                  }`}>
                    KYC: {driver.kycStatus === 'approved' ? 'Approved' : driver.kycStatus === 'pending' ? 'Pending' : 'Ditolak'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700">
                    ★ {driver.rating}
                  </span>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {driver.kycStatus === 'pending' && (
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading === 'approve'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    {actionLoading === 'approve' ? '⟳' : '✅'} Approve KYC
                  </button>
                )}
                {driver.status === 'active' ? (
                  <button
                    onClick={handleSuspend}
                    disabled={actionLoading === 'suspend'}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    {actionLoading === 'suspend' ? '⟳' : '⛔'} Suspend
                  </button>
                ) : (
                  <button
                    onClick={handleActivate}
                    disabled={actionLoading === 'activate'}
                    className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors disabled:opacity-60"
                  >
                    {actionLoading === 'activate' ? '⟳' : '✔️'} Aktifkan
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                  🔑 Reset Password
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1B3A6B]">{driver.totalTrips?.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total Trip</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{driver.monthlyEarnings}</p>
                <p className="text-xs text-gray-400">Earnings/Bulan</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">★ {driver.rating}</p>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex gap-1 p-3 border-b border-gray-100 overflow-x-auto">
          {[
            { key: 'info', label: '📋 Info Driver' },
            { key: 'credit', label: '💳 Status Kredit' },
            { key: 'earnings', label: '💰 Earnings' },
            { key: 'orders', label: '📦 Riwayat Order' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'bg-[#1B3A6B] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Data Pribadi</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Nama Lengkap', value: driver.name },
                    { label: 'NIK', value: driver.nik },
                    { label: 'No HP', value: driver.phone },
                    { label: 'Alamat', value: driver.address },
                    { label: 'Tanggal Bergabung', value: driver.joinDate },
                  ].map(item => (
                    <div key={item.label} className="flex gap-3">
                      <span className="text-xs text-gray-400 w-36 flex-shrink-0 pt-0.5">{item.label}</span>
                      <span className="text-sm text-gray-700 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Data Kendaraan</h4>
                <div className="space-y-3">
                  {[
                    { label: 'No Plat', value: driver.plate },
                    { label: 'Jenis Motor', value: driver.motorType },
                    { label: 'CC', value: driver.motorCC },
                    { label: 'No SIM', value: driver.simNumber },
                    { label: 'Status Kredit', value: driver.creditStatus === 'good' ? '✅ Baik' : driver.creditStatus === 'warning' ? '⚠️ Peringatan' : '🔴 Kritis' },
                  ].map(item => (
                    <div key={item.label} className="flex gap-3">
                      <span className="text-xs text-gray-400 w-36 flex-shrink-0 pt-0.5">{item.label}</span>
                      <span className="text-sm text-gray-700 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* KYC Documents Preview */}
                <h4 className="font-semibold text-gray-700 mb-3 mt-5 text-sm uppercase tracking-wider">Dokumen KYC</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['Foto KTP', 'SIM', 'Foto Motor'].map(doc => (
                    <div key={doc} className="bg-gray-100 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors group">
                      <span className="text-2xl">📄</span>
                      <span className="text-xs text-gray-500 mt-1 group-hover:text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Credit Tab */}
          {activeTab === 'credit' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-[#1B3A6B] to-[#2E54A0] rounded-xl p-5 text-white">
                <p className="text-blue-200 text-sm mb-2">Status Kredit Motor</p>
                <div className="flex items-end justify-between mb-3">
                  <span className="text-3xl font-bold">{creditPct}%</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    creditPct >= 70 ? 'bg-green-500' : creditPct >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {creditPct >= 70 ? 'BAIK' : creditPct >= 40 ? 'PERINGATAN' : 'KRITIS'}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      creditPct >= 70 ? 'bg-green-400' : creditPct >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${creditPct}%` }}
                  ></div>
                </div>
                <p className="text-blue-200 text-xs mt-2">{creditPct} / 100 kredit tersisa</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Riwayat Deduction Kredit</h4>
                <div className="space-y-2">
                  {driver.creditHistory?.map((h, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm flex-shrink-0">
                        ↓
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">{h.reason}</p>
                        <p className="text-xs text-gray-400">{h.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-red-600">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(h.amount)}
                        </p>
                        <p className="text-xs text-gray-400">Saldo: {h.balance}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Earnings 30 Hari Terakhir</h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={driver.earningsChart} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={v => `Rp${(v/1000).toFixed(0)}K`}
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip
                    formatter={(v, n) => [n === 'earnings'
                      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v)
                      : v, n === 'earnings' ? 'Earnings' : 'Trip']}
                  />
                  <Bar dataKey="earnings" fill="#1B3A6B" radius={[3, 3, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Riwayat Order Terakhir</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">ID</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Penumpang</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Rute</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Fare</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbo>
                    {driver.recentOrders?.map((o, i) => (
                      <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">#{o.id}</span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-gray-700">{o.passenger}</td>
                        <td className="py-2.5 px-3">
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">{o.from} → {o.to}</p>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-gray-800">{o.fare}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            o.status === 'completed' ? 'bg-green-100 text-green-700' :
                            o.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {o.status === 'completed' ? 'Selesai' : o.status === 'ongoing' ? 'Berlangsung' : 'Dibatalkan'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbo>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
