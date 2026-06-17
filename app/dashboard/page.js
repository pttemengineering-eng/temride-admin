'use client'

import { useState, useEffect } from 'react'
import StatsCard from '@/components/StatsCard'
import LiveMap from '@/components/LiveMap'
import RevenueChart from '@/components/RevenueChart'
import OrdersTable from '@/components/OrdersTable'
import { dashboardAPI } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
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
      }
    }
    fetchData()
  }, [])

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Selamat datang! Berikut ringkasan operasional TemRide hari ini.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 shadow-sm">
          <span>📅</span>
          <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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

      {/* Live Map */}
      <LiveMap />

      {/* Revenue Chart */}
      <RevenueChart data={revenueData} />

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">📋 Order Terbaru</h3>
            <p className="text-xs text-gray-400 mt-0.5">5 order terakhir yang masuk</p>
          </div>
          <a
            href="/dashboard/orders"
            className="text-sm text-[#1B3A6B] font-semibold hover:underline"
          >
            Lihat Semua →
          </a>
        </div>
        <OrdersTable orders={recentOrders} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🏍️', label: 'Approve KYC', desc: '7 pending', href: '/dashboard/drivers?tab=kyc', color: 'bg-yellow-50 border-yellow-200' },
          { icon: '📊', label: 'Laporan Revenue', desc: 'Unduh laporan', href: '/dashboard/revenue', color: 'bg-blue-50 border-blue-200' },
          { icon: '🎟️', label: 'Tambah Promo', desc: 'Buat promo baru', href: '/dashboard/promo', color: 'bg-green-50 border-green-200' },
          { icon: '⚡', label: 'Kelola Voucher', desc: 'Paket voucher', href: '/dashboard/vouchers', color: 'bg-purple-50 border-purple-200' },
        ].map(action => (
          <a
            key={action.label}
            href={action.href}
            className={`${action.color} border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group`}
          >
            <span className="text-2xl block mb-2">{action.icon}</span>
            <p className="font-semibold text-gray-800 text-sm group-hover:text-[#1B3A6B]">{action.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
