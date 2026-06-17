"use client";
import { useState } from 'react';
import { formatRupiah, getStatusColor, getStatusLabel } from '../../../lib/utils';

const mockOrders = [
  { id: 'TR-001', passenger: 'Budi Santoso', driver: 'Andi Wijaya', pickup: 'Jl. Ahmad Yani No. 12', destination: 'Mall Balikpapan', fare: 28000, status: 'COMPLETED', time: '2024-01-15 14:23', distance: '3.2 km' },
  { id: 'TR-002', passenger: 'Sari Dewi', driver: 'Deni Kurniawan', pickup: 'Jl. Sudirman No. 45', destination: 'RS Pertamina', fare: 35000, status: 'COMPLETED', time: '2024-01-15 14:18', distance: '4.1 km' },
  { id: 'TR-003', passenger: 'Ahmad Fauzi', driver: 'Rini Puspita', pickup: 'Bandara SAMS', destination: 'Hotel Grand Senyiur', fare: 75000, status: 'ON_GOING', time: '2024-01-15 14:15', distance: '8.5 km' },
  { id: 'TR-004', passenger: 'Maya Putri', driver: '-', pickup: 'Jl. MT. Haryono', destination: 'Pasar Klandasan', fare: 0, status: 'CANCELLED', time: '2024-01-15 14:10', distance: '2.8 km' },
  { id: 'TR-005', passenger: 'Hendra Budi', driver: 'Joko Susilo', pickup: 'Jl. Mulawarman', destination: 'RSUD Kanujoso', fare: 42000, status: 'COMPLETED', time: '2024-01-15 14:05', distance: '5.1 km' },
  { id: 'TR-006', passenger: 'Dewi Lestari', driver: 'Kurnia Sari', pickup: 'Pertamina Balikpapan', destination: 'BTC Mall', fare: 18000, status: 'COMPLETED', time: '2024-01-15 13:50', distance: '2.0 km' },
  { id: 'TR-007', passenger: 'Rizki Amalia', driver: 'Eko Prasetyo', pickup: 'Jl. Letjen S. Parman', destination: 'Universitas Balikpapan', fare: 31000, status: 'COMPLETED', time: '2024-01-15 13:45', distance: '3.7 km' },
  { id: 'TR-008', passenger: 'Fajar Mahendra', driver: '-', pickup: 'Jl. Jend. Sudirman', destination: 'Balikpapan Plaza', fare: 0, status: 'CANCELLED', time: '2024-01-15 13:30', distance: '1.9 km' },
  { id: 'TR-009', passenger: 'Indah Permata', driver: 'Hendra Budiman', pickup: 'Pasar Baru Balikpapan', destination: 'Jl. Soekarno-Hatta', fare: 22000, status: 'COMPLETED', time: '2024-01-15 13:20', distance: '2.5 km' },
  { id: 'TR-010', passenger: 'Lukman Hakim', driver: 'Andi Wijaya', pickup: 'Pelabuhan Semayang', destination: 'Hotel Le Grandeur', fare: 55000, status: 'COMPLETED', time: '2024-01-15 13:10', distance: '6.3 km' },
  { id: 'TR-011', passenger: 'Nurul Aini', driver: 'Deni Kurniawan', pickup: 'Jl. Ruhui Rahayu', destination: 'RS Siloam', fare: 40000, status: 'COMPLETED', time: '2024-01-15 13:00', distance: '4.8 km' },
  { id: 'TR-012', passenger: 'Oman Firdaus', driver: '-', pickup: 'Jl. Veteran', destination: 'Mall BSB', fare: 0, status: 'PENDING', time: '2024-01-15 12:55', distance: '3.3 km' },
  { id: 'TR-013', passenger: 'Putri Rahayu', driver: 'Joko Susilo', pickup: 'Jl. Pattimura', destination: 'Balikpapan Superblock', fare: 27000, status: 'COMPLETED', time: '2024-01-15 12:40', distance: '3.0 km' },
  { id: 'TR-014', passenger: 'Qori Islami', driver: 'Kurnia Sari', pickup: 'Taman Bekapai', destination: 'Jl. DI Panjaitan', fare: 15000, status: 'COMPLETED', time: '2024-01-15 12:30', distance: '1.7 km' },
  { id: 'TR-015', passenger: 'Rudi Hartono', driver: 'Eko Prasetyo', pickup: 'Jl. Wolter Monginsidi', destination: 'Bandara SAMS', fare: 80000, status: 'COMPLETED', time: '2024-01-15 12:15', distance: '9.1 km' },
];

const statusOptions = ['Semua', 'COMPLETED', 'PENDING', 'ON_GOING', 'CANCELLED'];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = mockOrders.filter((o) => {
    const matchStatus = statusFilter === 'Semua' || o.status === statusFilter;
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.passenger.toLowerCase().includes(search.toLowerCase()) ||
      o.driver.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const totalRevenue = mockOrders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + o.fare, 0);
  const completedCount = mockOrders.filter(o => o.status === 'COMPLETED').length;
  const cancelledCount = mockOrders.filter(o => o.status === 'CANCELLED').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Order</h1>
        <p className="text-gray-500 text-sm">Total {mockOrders.length} order terdaftar</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Order', value: mockOrders.length, icon: '📦', bg: 'bg-blue-50 text-blue-700' },
          { label: 'Selesai', value: completedCount, icon: '✅', bg: 'bg-green-50 text-green-700' },
          { label: 'Dibatalkan', value: cancelledCount, icon: '❌', bg: 'bg-red-50 text-red-700' },
          { label: 'Total Fare', value: formatRupiah(totalRevenue), icon: '💰', bg: 'bg-yellow-50 text-yellow-700' },
        ].map((c) => (
          <div key={c.label} className={`card border-none ${c.bg.split(' ')[0]}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className={`text-xl font-bold ${c.bg.split(' ')[1]}`}>{c.value}</p>
                <p className="text-xs text-gray-600">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
          >
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Tanggal:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
          />
        </div>
        <input
          type="text"
          placeholder="🔍 Cari ID, penumpang, driver..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] flex-1 min-w-48"
        />
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} hasil</span>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['ID Order', 'Penumpang', 'Driver', 'Pickup', 'Tujuan', 'Jarak', 'Fare', 'Status', 'Waktu'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <p className="text-4xl mb-2">📦</p>
                    <p>Tidak ada order ditemukan</p>
                  </td>
                </tr>
              ) : paginated.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-[#1B3A6B] font-semibold">{order.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{order.passenger}</td>
                  <td className="py-3 px-4 text-gray-600">{order.driver}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-32 truncate text-xs">{order.pickup}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-32 truncate text-xs">{order.destination}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{order.distance}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {order.fare > 0 ? formatRupiah(order.fare) : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
