'use client'

import { useState, useEffect } from 'react'
import DriversTable from '@/components/DriversTable'
import { driversAPI } from '@/lib/api'
import { useSearchParams } from 'next/navigation'

const TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'kyc', label: 'Pending KYC' },
  { key: 'active', label: 'Aktif' },
  { key: 'suspended', label: 'Suspended' },
]

export default function DriversPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'all'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tabCounts, setTabCounts] = useState({ all: 0, kyc: 0, active: 0, suspended: 0 })

  const fetchDrivers = async () => {
    setLoading(true)
    try {
      const data = await driversAPI.getAll({ status: activeTab, search })
      setDrivers(data)
      // Fetch counts for tabs
      const [all, kyc, active, suspended] = await Promise.all([
        driversAPI.getAll({}),
        driversAPI.getAll({ status: 'kyc' }),
        driversAPI.getAll({ status: 'active' }),
        driversAPI.getAll({ status: 'suspended' }),
      ])
      setTabCounts({ all: all.length, kyc: kyc.length, active: active.length, suspended: suspended.length })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDrivers() }, [activeTab, search])

  const handleApproveKYC = async (id) => {
    await driversAPI.approveKYC(id)
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, kycStatus: 'approved' } : d))
  }

  const handleSuspend = async (id) => {
    await driversAPI.suspend(id)
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'suspended' } : d))
  }

  const handleActivate = async (id) => {
    await driversAPI.activate(id)
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'active' } : d))
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏍️ Manajemen Driver</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola semua driver TemRide</p>
        </div>
        <button className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors shadow-sm">
          + Tambah Driver
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Driver', value: tabCounts.all, icon: '🏍️', color: 'text-blue-600' },
          { label: 'Pending KYC', value: tabCounts.kyc, icon: '⏳', color: 'text-yellow-600' },
          { label: 'Driver Aktif', value: tabCounts.active, icon: '✅', color: 'text-green-600' },
          { label: 'Suspended', value: tabCounts.suspended, icon: '⛔', color: 'text-red-600' },
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
        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex gap-1 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#1B3A6B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tabCounts[tab.key]}
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
              placeholder="Cari nama, HP, plat..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-2 animate-spin">⟳</div>
              <p className="text-sm">Memuat data driver...</p>
            </div>
          </div>
        ) : drivers.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🏍️</div>
              <p className="text-sm font-medium">Tidak ada driver ditemukan</p>
              <p className="text-xs mt-1">Coba ubah filter atau kata pencarian</p>
            </div>
          </div>
        ) : (
          <DriversTable
            drivers={drivers}
            onApproveKYC={handleApproveKYC}
            onSuspend={handleSuspend}
            onActivate={handleActivate}
          />
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
          <span>Menampilkan {drivers.length} driver</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled>← Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
