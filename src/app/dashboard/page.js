"use client";
import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import StatsCard from '../../components/StatsCard';
import { formatRupiah, formatDate, getStatusColor, getStatusLabel } from '../../lib/utils';
import { fetchDashboardStats, checkBackendHealth } from '../../lib/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border border-slate-100 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.name === 'revenue' ? formatRupiah(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      // Check health first (no auth needed)
      const healthy = await checkBackendHealth();
      setBackendOnline(healthy);

      if (healthy) {
        const data = await fetchDashboardStats();
        if (data) {
          setStats(data);
          setError(null);
        } else {
          setError('Gagal memuat data dari backend.');
        }
      } else {
        setError('Backend tidak dapat dijangkau.');
      }
    } catch (e) {
      setError('Terjadi kesalahan saat memuat data.');
      setBackendOnline(false);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Derive stat cards from live data
  const statCards = stats
    ? [
        {
          label: 'Total Order',
          value: String(stats.orders?.total ?? 0),
          change: `Hari ini: ${stats.orders?.today ?? 0}`,
          positive: true,
          icon: '📦',
          color: 'blue',
        },
        {
          label: 'Revenue Platform',
          value: formatRupiah(stats.revenue?.total ?? 0),
          change: `Selesai: ${stats.orders?.completed ?? 0}`,
          positive: true,
          icon: '💰',
          color: 'green',
        },
        {
          label: 'Driver Online',
          value: String(stats.drivers?.active ?? 0),
          change: `KYC Pending: ${stats.drivers?.pendingKyc ?? 0}`,
          positive: true,
          icon: '🏍️',
          color: 'yellow',
        },
        {
          label: 'Total Penumpang',
          value: String(stats.users?.passengers ?? 0),
          change: `Total user: ${stats.users?.total ?? 0}`,
          positive: true,
          icon: '👥',
          color: 'purple',
        },
      ]
    : [
        { label: 'Total Order', value: '—', change: 'Menunggu data...', positive: false, icon: '📦', color: 'blue' },
        { label: 'Revenue Platform', value: '—', change: 'Menunggu data...', positive: false, icon: '💰', color: 'green' },
        { label: 'Driver Online', value: '—', change: 'Menunggu data...', positive: false, icon: '🏍️', color: 'yellow' },
        { label: 'Total Penumpang', value: '—', change: 'Menunggu data...', positive: false, icon: '👥', color: 'purple' },
      ];

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {backendOnline === null ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
              Memeriksa backend...
            </span>
          ) : backendOnline ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-full font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              🟢 Backend Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-100 px-3 py-1.5 rounded-full font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              🔴 Backend Offline
            </span>
          )}
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              Update: {lastUpdated.toLocaleTimeString('id-ID')}
            </span>
          )}
        </div>
        <button
          onClick={() => { setLoading(true); loadData(); }}
          disabled={loading}
          className="text-xs bg-[#1B3A6B] text-white px-3 py-1.5 rounded-full hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {loading ? '⏳ Memuat...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Error Banner */}
      {error && !loading && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{error} Data akan dicoba ulang otomatis setiap 30 detik.</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      {/* Order Summary from live data */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Order Hari Ini', value: stats.orders?.today ?? 0, color: 'bg-blue-50 text-blue-700' },
            { label: 'Order Selesai', value: stats.orders?.completed ?? 0, color: 'bg-green-50 text-green-700' },
            { label: 'Order Dibatalkan', value: stats.orders?.cancelled ?? 0, color: 'bg-red-50 text-red-700' },
            { label: 'Completion Rate', value: `${stats.orders?.completionRate ?? 0}%`, color: 'bg-purple-50 text-purple-700' },
          ].map((item) => (
            <div key={item.label} className={`${item.color} rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs mt-1 opacity-80">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts — static sample to show layout (real chart data needs revenue-chart endpoint) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Revenue Mingguan</h3>
              <p className="text-xs text-gray-500">Pendapatan platform 7 hari terakhir</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {backendOnline ? 'Live' : 'Sample'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { day: 'Sen', revenue: 0 },
                { day: 'Sel', revenue: 0 },
                { day: 'Rab', revenue: 0 },
                { day: 'Kam', revenue: 0 },
                { day: 'Jum', revenue: 0 },
                { day: 'Sab', revenue: 0 },
                { day: 'Min', revenue: stats?.revenue?.total ? Math.round(stats.revenue.total / 7) : 0 },
              ]}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v > 0 ? `${(v / 1000).toFixed(0)}k` : '0'} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#1B3A6B" radius={[6, 6, 0, 0]} name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Ringkasan Platform</h3>
              <p className="text-xs text-gray-500">Data real-time dari Railway backend</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${backendOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {backendOnline ? '🟢 Connected' : '⏳ Connecting'}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Total Pengguna', value: stats?.users?.total ?? '—', icon: '👤' },
              { label: 'Total Driver', value: stats?.users?.drivers ?? '—', icon: '🏍️' },
              { label: 'KYC Menunggu', value: stats?.drivers?.pendingKyc ?? '—', icon: '📋' },
              { label: 'Total Order', value: stats?.orders?.total ?? '—', icon: '📦' },
              { label: 'Platform Revenue', value: stats?.revenue?.total != null ? formatRupiah(stats.revenue.total) : '—', icon: '💰' },
              { label: 'Completion Rate', value: stats?.orders?.completionRate != null ? `${stats.orders.completionRate}%` : '—', icon: '✅' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <span>{item.icon}</span> {item.label}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {loading ? <span className="animate-pulse text-gray-400">...</span> : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="text-center text-xs text-gray-400 py-2">
        Auto-refresh setiap 30 detik • Backend: https://temride-backend-production.up.railway.app
      </div>
    </div>
  );
}
