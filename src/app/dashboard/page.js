"use client";
import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import StatsCard from '../../components/StatsCard';
import { formatRupiah, formatDate, getStatusColor, getStatusLabel } from '../../lib/utils';

const revenueData = [
  { day: 'Sen', revenue: 4200000, orders: 84 },
  { day: 'Sel', revenue: 3800000, orders: 76 },
  { day: 'Rab', revenue: 5100000, orders: 102 },
  { day: 'Kam', revenue: 4700000, orders: 94 },
  { day: "Jum", revenue: 6200000, orders: 124 },
  { day: 'Sab', revenue: 7800000, orders: 156 },
  { day: 'Min', revenue: 6900000, orders: 138 },
];

const recentOrders = [
  { id: 'TR-2024-001', passenger: 'Budi Santoso', driver: 'Andi Wijaya', fare: 28000, status: 'COMPLETED', time: '2024-01-15 14:23' },
  { id: 'TR-2024-002', passenger: 'Sari Dewi', driver: 'Deni Kurniawan', fare: 35000, status: 'COMPLETED', time: '2024-01-15 14:18' },
  { id: 'TR-2024-003', passenger: 'Ahmad Fauzi', driver: 'Rini Puspita', fare: 22000, status: 'PENDING', time: '2024-01-15 14:15' },
  { id: 'TR-2024-004', passenger: 'Maya Putri', driver: '-', fare: 0, status: 'CANCELLED', time: '2024-01-15 14:10' },
  { id: 'TR-2024-005', passenger: 'Hendra Budi', driver: 'Joko Susilo', fare: 42000, status: 'COMPLETED', time: '2024-01-15 14:05' },
];

const stats = [
  { label: 'Order Hari Ini', value: '247', change: '+12%', positive: true, icon: '📦', color: 'blue' },
  { label: 'Revenue Hari Ini', value: 'Rp 6.2 Jt', change: '+8%', positive: true, icon: '💰', color: 'green' },
  { label: 'Driver Online', value: '38', change: '+5', positive: true, icon: '🏍️', color: 'yellow' },
  { label: 'Total Driver Aktif', value: '124', change: '+3', positive: true, icon: '👥', color: 'purple' },
];

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
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Revenue 7 Hari</h3>
              <p className="text-xs text-gray-500">Pendapatan harian platform</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">+8% minggu ini</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#1B3A6B" radius={[6, 6, 0, 0]} name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Jumlah Order 7 Hari</h3>
              <p className="text-xs text-gray-500">Total order per hari</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Total: 774</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone" dataKey="orders" stroke="#F59E0B"
                strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }} name="orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800">Order Terbaru</h3>
            <p className="text-xs text-gray-500">5 order terakhir hari ini</p>
          </div>
          <a href="/dashboard/orders" className="text-sm text-[#1B3A6B] hover:underline font-medium">
            Lihat Semua →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['No', 'ID Order', 'Penumpang', 'Driver', 'Fare', 'Status', 'Waktu'].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order, i) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="py-3 px-3 font-mono text-xs text-[#1B3A6B] font-medium">{order.id}</td>
                  <td className="py-3 px-3 font-medium text-gray-800">{order.passenger}</td>
                  <td className="py-3 px-3 text-gray-600">{order.driver}</td>
                  <td className="py-3 px-3 font-medium text-gray-800">
                    {order.fare > 0 ? formatRupiah(order.fare) : '-'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-xs">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
