'use client'

import { useState, useEffect, useCallback } from 'react'
import StatsCard from '@/components/StatsCard'
import RevenueChart from '@/components/RevenueChart'
import OrdersTable from '@/components/OrdersTable'
import { dashboardAPI } from '@/lib/api'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://temride-backend-production.up.railway.app'

const SYSTEM_SERVICES = [
  { name: 'Backend API', key: 'backend', icon: '🖥️' },
  { name: 'Database', key: 'db', icon: '🗄️' },
  { name: 'FCM Push', key: 'fcm', icon: '🔔' },
  { name: 'Fonnte WA', key: 'fonnte', icon: '📱' },
  { name: 'Midtrans', key: 'midtrans', icon: '💳' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState({
    backend: 'checking', db: 'checking', fcm: 'online', fonnte: 'online', midtrans: 'online'
  })
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const [s, r, o] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRevenue7Days(),
        dashboardAPI.getRecentOrders(),
      ])
      setStats(s)
      setRevenueData(r)
      setRecentOrders(o)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }, [])

  const checkBackend = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) })
      setSystemStatus(s => ({ ...s, backend: res.ok ? 'online' : 'error', db: res.ok ? 'online' : 'error' }))
    } catch {
      setSystemStatus(s => ({ ...s, backend: 'offline', db: 'offline' }))
    }
  }, [])

  useEffect(() => {
    fetchData()
    checkBackend()
    const interval = setInterval(() => {
      fetchData()
      checkBackend()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchData, checkBackend])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🏍️</div>
          <p className="text-gray-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Selamat datang! Berikut ringkasan operasional TemRide hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-gray-400">
              Diperbarui {lastRefresh.toLocaleTimeString('id-ID')}
            </span>
          )}
          <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 shadow-sm">
            <span>📅</span>
            <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          icon="📦"
          title="Total Order Hari Ini"
          value={stats?.todayOrders?.toLocaleString('id-ID') || '0'}
          change={stats?.todayOrdersChange}
          changeType={stats?.todayOrdersChangeType}
          color="blue"
        />
        <StatsCard
          icon="💰"
          title="Revenue Hari Ini"
          value={stats?.todayRevenue || 'Rp 0'}
          change={stats?.todayRevenueChange}
          changeType={stats?.todayRevenueChangeType}
          color="green"
        />
        <StatsCard
          icon="🟢"
          title="Driver Online Sekarang"
          value={stats?.onlineDrivers || 0}
          change={stats?.onlineDriversChange}
          changeType={stats?.onlineDriversChangeType}
          subtitle="dari total driver aktif"
          color="yellow"
        />
        <StatsCard
          icon="🏍️"
          title="Total Driver Aktif"
          value={stats?.activeDrivers || 0}
          change={stats?.activeDriversChange}
          changeType={stats?.activeDriversChangeType}
          subtitle="driver terverifikasi"
          color="purple"
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={revenueData} title="Tren Order 7 Hari Terakhir" />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🛵', label: 'Tambah Driver', desc: 'Daftar driver baru', href: '/dashboard/drivers', color: 'bg-blue-50 border-blue-200' },
            { icon: '⏳', label: 'Order Pending', desc: `${(stats?.pendingOrders || 12)} menunggu`, href: '/dashboard/orders?status=pending', color: 'bg-yellow-50 border-yellow-200' },
            { icon: '🏍️', label: 'Approve KYC', desc: '7 perlu verifikasi', href: '/dashboard/drivers?tab=kyc', color: 'bg-orange-50 border-orange-200' },
            { icon: '🎟️', label: 'Tambah Promo', desc: 'Buat promo baru', href: '/dashboard/vouchers', color: 'bg-purple-50 border-purple-200' },
          ].map(action => (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group`}
            >
              <span className="text-2xl block mb-2">{action.icon}</span>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-[#1B3A6B]">{action.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">🖥️ Status Sistem</h3>
          <span className="text-xs text-gray-400">Auto-refresh 30 detik</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SYSTEM_SERVICES.map(svc => {
            const status = systemStatus[svc.key]
            const statusCfg = {
              online: { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', label: 'Online' },
              offline: { dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', label: 'Offline' },
              checking: { dot: 'bg-yellow-400 animate-pulse', text: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Checking...' },
              error: { dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', label: 'Error' },
            }[status] || { dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50', label: status }
            return (
              <div key={svc.key} className={`${statusCfg.bg} rounded-xl p-3 text-center`}>
                <div className="text-2xl mb-1">{svc.icon}</div>
                <p className="text-xs font-semibold text-gray-700">{svc.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`}></div>
                  <span className={`text-xs font-medium ${statusCfg.text}`}>{statusCfg.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">📋 Order Terbaru</h3>
            <p className="text-xs text-gray-400 mt-0.5">5 order terakhir yang masuk</p>
          </div>
          <Link href="/dashboard/orders" className="text-sm text-[#1B3A6B] font-semibold hover:underline">
            Lihat Semua →
          </Link>
        </div>
        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  )
}
