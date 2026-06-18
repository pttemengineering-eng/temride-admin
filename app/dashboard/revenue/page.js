'use client'

import { useState, useEffect } from 'react'
import { revenueAPI } from '@/lib/api'
import RevenueChart from '@/components/RevenueChart'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const StatsCard = ({ icon, label, value, sub, color }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
        {icon}
      </div>
    </div>
  </div>
)

export default function RevenuePage() {
  const [summary, setSummary] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [paymentBreakdown, setPaymentBreakdown] = useState([])
  const [topDrivers, setTopDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, m, p, t] = await Promise.all([
          revenueAPI.getSummary(),
          revenueAPI.getMonthly(),
          revenueAPI.getPaymentBreakdown(),
          revenueAPI.getTopDrivers(),
        ])
        setSummary(s)
        setMonthlyData(m)
        setPaymentBreakdown(p)
        setTopDrivers(t)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleDownload = (format) => {
    alert(`Download laporan ${format} akan segera tersedia!`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">💰</div>
          <p className="text-gray-500 text-sm">Memuat data revenue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">💰 Laporan Revenue</h1>
          <p className="text-gray-500 text-sm mt-0.5">Analisis pendapatan platform TemRide</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload('PDF')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            📄 Unduh PDF
          </button>
          <button
            onClick={() => handleDownload('Excel')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors shadow-sm"
          >
            📊 Unduh Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard icon="💹" label="Total Revenue" value={summary?.totalRevenue} sub="Tahun 2024" color="bg-blue-50" />
        <StatsCard icon="🏢" label="Platform Fee (20%)" value={summary?.platformFee} sub="Komisi platform" color="bg-purple-50" />
        <StatsCard icon="🏍️" label="Driver Earnings" value={summary?.driverEarnings} sub="80% ke driver" color="bg-green-50" />
        <StatsCard icon="⚡" label="Voucher Sales" value={summary?.voucherSales} sub="Penjualan voucher" color="bg-yellow-50" />
      </div>

      {/* Revenue Chart 12 Bulan */}
      <RevenueChart data={monthlyData} title="Revenue Bulanan 2024 (12 Bulan)" height={320} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-1">Breakdown by Payment Method</h3>
          <p className="text-xs text-gray-400 mb-4">Persentase berdasarkan metode pembayaran</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={paymentBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {paymentBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {paymentBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name}</span>
                <span className="text-xs font-semibold text-gray-800 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue metrics */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Metrik Revenue</h3>
          <div className="space-y-4">
            {[
              { label: 'Rata-rata Revenue/Hari', value: 'Rp 3.67Jt', change: '+8.2%', up: true },
              { label: 'Rata-rata Fare/Order', value: 'Rp 22.500', change: '+2.1%', up: true },
              { label: 'Peak Revenue Day', value: 'Sabtu', change: 'Rp 6.8Jt avg', up: null },
              { label: 'Total Transaksi', value: '48.252', change: '+15.3%', up: true },
              { label: 'Platform Fee Rate', value: '20%', change: 'Fixed', up: null },
              { label: 'Voucher Redemption Rate', value: '31.9%', change: '-2.4%', up: false },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{m.label}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-800">{m.value}</span>
                  {m.change && (
                    <span className={`text-xs ml-2 font-medium ${m.up === true ? 'text-green-600' : m.up === false ? 'text-red-500' : 'text-gray-400'}`}>
                      {m.up === true ? '↑' : m.up === false ? '↓' : ''} {m.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Drivers */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">🏆 Top 10 Driver by Earnings</h3>
          <p className="text-xs text-gray-400 mt-0.5">Driver dengan pendapatan tertinggi bulan ini</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase w-10">#</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Driver</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Plat</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Total Earnings</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell">Total Trip</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Rating</th>
              </tr>
            </thead>
            <tbo>
              {topDrivers.map((d, i) => (
                <tr key={d.id} className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="py-3 px-5">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold inline-flex ${
                      i === 0 ? 'bg-yellow-400 text-white' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-orange-400 text-white' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#1B3A6B] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {d.name?.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-700">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{d.plate}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-green-600">{d.totalEarnings}</span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-gray-600">{d.totalTrips?.toLocaleString()} trip</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-yellow-600 font-semibold">★ {d.rating}</span>
                  </td>
                </tr>
              ))}
            </tbo>
          </table>
        </div>
      </div>
    </div>
  )
}
