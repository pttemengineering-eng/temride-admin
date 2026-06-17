"use client";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatRupiah } from '../../../lib/utils';

const monthlyRevenue = [
  { month: 'Jan', revenue: 68000000 },
  { month: 'Feb', revenue: 72000000 },
  { month: 'Mar', revenue: 85000000 },
  { month: 'Apr', revenue: 91000000 },
  { month: 'Mei', revenue: 88000000 },
  { month: 'Jun', revenue: 95000000 },
  { month: 'Jul', revenue: 102000000 },
  { month: 'Agu', revenue: 98000000 },
  { month: 'Sep', revenue: 112000000 },
  { month: 'Okt', revenue: 125000000 },
  { month: 'Nov', revenue: 118000000 },
  { month: 'Des', revenue: 145000000 },
];

const paymentMethods = [
  { name: 'Cash', value: 45, color: '#1B3A6B' },
  { name: 'Transfer', value: 28, color: '#F59E0B' },
  { name: 'OVO', value: 15, color: '#10B981' },
  { name: 'GoPay', value: 8, color: '#3B82F6' },
  { name: 'Dana', value: 4, color: '#8B5CF6' },
];

const topDrivers = [
  { name: 'Kurnia Sari', trips: 623, earnings: 27800000, rating: 4.9 },
  { name: 'Eko Prasetyo', trips: 521, earnings: 23100000, rating: 4.9 },
  { name: 'Hendra Budiman', trips: 415, earnings: 18600000, rating: 4.7 },
  { name: 'Andi Wijaya', trips: 342, earnings: 15200000, rating: 4.8 },
  { name: 'Deni Kurniawan', trips: 287, earnings: 12800000, rating: 4.6 },
];

const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
const platformFee = totalRevenue * 0.1;
const driverEarnings = totalRevenue * 0.9;
const voucherSales = 12500000;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border border-slate-100 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-[#1B3A6B]">{formatRupiah(payload[0]?.value)}</p>
      </div>
    );
  }
  return null;
};

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analisis Revenue</h1>
        <p className="text-gray-500 text-sm">Laporan keuangan platform TemRide</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatRupiah(totalRevenue), icon: '💰', color: 'text-[#1B3A6B]', bg: 'bg-blue-50' },
          { label: 'Platform Fee (10%)', value: formatRupiah(platformFee), icon: '🏢', color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Driver Earnings (90%)', value: formatRupiah(driverEarnings), icon: '🏍️', color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Voucher Sales', value: formatRupiah(voucherSales), icon: '⚡', color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map((c) => (
          <div key={c.label} className={`card border-none ${c.bg}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart 12 months */}
        <div className="card xl:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Revenue per Bulan (2024)</h3>
            <p className="text-xs text-gray-500">Pendapatan kotor platform</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#1B3A6B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Metode Pembayaran</h3>
            <p className="text-xs text-gray-500">Breakdown berdasarkan metode</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {paymentMethods.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {paymentMethods.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></div>
                  <span className="text-gray-600">{m.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Drivers */}
      <div className="card">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">Top 5 Driver by Earnings</h3>
          <p className="text-xs text-gray-500">Driver dengan penghasilan tertinggi</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Peringkat', 'Nama Driver', 'Total Trips', 'Earnings', 'Rating'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topDrivers.map((d, i) => (
                <tr key={d.name} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${i === 0 ? 'bg-yellow-400 text-yellow-900' :
                        i === 1 ? 'bg-slate-300 text-slate-700' :
                        i === 2 ? 'bg-orange-300 text-orange-900' : 'bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{d.name}</td>
                  <td className="py-3 px-4 text-gray-600">{d.trips} trips</td>
                  <td className="py-3 px-4 font-semibold text-green-700">{formatRupiah(d.earnings)}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">{d.rating}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
