"use client";
import { useState } from 'react';
import { formatRupiah, formatDate } from '../../../lib/utils';

const mockVouchers = [
  { id: 'VC-001', code: 'TEMRIDE50K', type: 'Perjalanan', price: 50000, buyer: 'Budi Santoso', purchaseDate: '2024-01-15 10:23', status: 'USED', usedDate: '2024-01-15 14:23' },
  { id: 'VC-002', code: 'TEMRIDE100K', type: 'Perjalanan', price: 100000, buyer: 'Sari Dewi', purchaseDate: '2024-01-15 09:15', status: 'ACTIVE', usedDate: null },
  { id: 'VC-003', code: 'TEMRIDE50K', type: 'Perjalanan', price: 50000, buyer: 'Ahmad Fauzi', purchaseDate: '2024-01-14 16:45', status: 'USED', usedDate: '2024-01-15 08:30' },
  { id: 'VC-004', code: 'TEMRIDE200K', type: 'Perjalanan', price: 200000, buyer: 'Maya Putri', purchaseDate: '2024-01-14 14:20', status: 'ACTIVE', usedDate: null },
  { id: 'VC-005', code: 'TEMRIDE50K', type: 'Perjalanan', price: 50000, buyer: 'Hendra Budi', purchaseDate: '2024-01-14 11:00', status: 'EXPIRED', usedDate: null },
  { id: 'VC-006', code: 'TEMRIDE100K', type: 'Perjalanan', price: 100000, buyer: 'Dewi Lestari', purchaseDate: '2024-01-13 15:30', status: 'USED', usedDate: '2024-01-14 09:20' },
  { id: 'VC-007', code: 'TEMRIDE50K', type: 'Perjalanan', price: 50000, buyer: 'Rizki Amalia', purchaseDate: '2024-01-13 12:00', status: 'ACTIVE', usedDate: null },
  { id: 'VC-008', code: 'TEMRIDE200K', type: 'Perjalanan', price: 200000, buyer: 'Fajar Mahendra', purchaseDate: '2024-01-12 10:15', status: 'USED', usedDate: '2024-01-13 14:45' },
];

const voucherTypes = [
  { code: 'TEMRIDE50K', price: 50000, bonus: 55000, label: 'Rp 50.000 → Rp 55.000' },
  { code: 'TEMRIDE100K', price: 100000, bonus: 115000, label: 'Rp 100.000 → Rp 115.000' },
  { code: 'TEMRIDE200K', price: 200000, bonus: 240000, label: 'Rp 200.000 → Rp 240.000' },
];

export default function VouchersPage() {
  const [filter, setFilter] = useState('Semua');

  const totalSold = mockVouchers.length;
  const totalRevenue = mockVouchers.reduce((s, v) => s + v.price, 0);
  const activeCount = mockVouchers.filter(v => v.status === 'ACTIVE').length;
  const usedCount = mockVouchers.filter(v => v.status === 'USED').length;

  const filtered = filter === 'Semua' ? mockVouchers : mockVouchers.filter(v => v.status === filter);

  const getVoucherBadge = (status) => {
    if (status === 'ACTIVE') return 'badge-active';
    if (status === 'USED') return 'badge-completed';
    if (status === 'EXPIRED') return 'badge-cancelled';
    return 'badge-pending';
  };

  const getVoucherLabel = (status) => {
    if (status === 'ACTIVE') return 'Aktif';
    if (status === 'USED') return 'Terpakai';
    if (status === 'EXPIRED') return 'Kadaluarsa';
    return status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Voucher</h1>
        <p className="text-gray-500 text-sm">Penjualan dan penggunaan voucher TemRide</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Terjual', value: totalSold, icon: '🎫', bg: 'bg-blue-50 text-blue-700' },
          { label: 'Total Revenue', value: formatRupiah(totalRevenue), icon: '💰', bg: 'bg-green-50 text-green-700' },
          { label: 'Masih Aktif', value: activeCount, icon: '✅', bg: 'bg-yellow-50 text-yellow-700' },
          { label: 'Sudah Terpakai', value: usedCount, icon: '✔️', bg: 'bg-purple-50 text-purple-700' },
        ].map((c) => (
          <div key={c.label} className={`card border-none ${c.bg.split(' ')[0]}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className={`text-xl font-bold ${c.bg.split(' ')[1]}`}>{c.value}</p>
                <p className="text-xs text-gray-600">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher Types */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3">Paket Voucher Tersedia</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {voucherTypes.map((v) => (
            <div key={v.code} className="border-2 border-[#1B3A6B]/20 rounded-xl p-4 bg-gradient-to-br from-[#1B3A6B]/5 to-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-[#1B3A6B]">{v.code}</span>
                <span className="text-xs bg-[#F59E0B]/20 text-[#d97706] px-2 py-0.5 rounded-full font-medium">Aktif</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{v.label}</p>
              <p className="text-xs text-green-600 mt-1">Bonus {formatRupiah(v.bonus - v.price)} gratis!</p>
              <p className="text-sm text-gray-500 mt-2">Terjual: {mockVouchers.filter(mv => mv.code === v.code).length} pcs</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="card p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-gray-800">Riwayat Transaksi Voucher</h3>
          <div className="flex gap-2">
            {['Semua', 'ACTIVE', 'USED', 'EXPIRED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                  filter === f
                    ? 'bg-[#1B3A6B] text-white'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {f === 'Semua' ? 'Semua' : f === 'ACTIVE' ? 'Aktif' : f === 'USED' ? 'Terpakai' : 'Kadaluarsa'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['ID', 'Kode Voucher', 'Tipe', 'Harga', 'Pembeli', 'Tgl Beli', 'Status', 'Tgl Pakai'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{v.id}</td>
                  <td className="py-3 px-4 font-mono text-sm font-semibold text-[#1B3A6B]">{v.code}</td>
                  <td className="py-3 px-4 text-gray-600">{v.type}</td>
                  <td className="py-3 px-4 font-medium text-green-700">{formatRupiah(v.price)}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{v.buyer}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{v.purchaseDate}</td>
                  <td className="py-3 px-4">
                    <span className={getVoucherBadge(v.status)}>{getVoucherLabel(v.status)}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{v.usedDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
