"use client";
import { useState } from 'react';
import { formatRupiah, getStatusColor } from '../../../lib/utils';

const mockDrivers = [
  { id: 1, name: 'Andi Wijaya', phone: '0812-3456-7890', plate: 'KT 1234 AB', kyc: 'APPROVED', rating: 4.8, trips: 342, earnings: 15200000, credit: 50000, status: 'ACTIVE' },
  { id: 2, name: 'Budi Santoso', phone: '0813-2345-6789', plate: 'KT 5678 CD', kyc: 'PENDING', rating: 0, trips: 0, earnings: 0, credit: 50000, status: 'PENDING' },
  { id: 3, name: 'Deni Kurniawan', phone: '0814-3456-7891', plate: 'KT 9012 EF', kyc: 'APPROVED', rating: 4.6, trips: 287, earnings: 12800000, credit: 75000, status: 'ACTIVE' },
  { id: 4, name: 'Eko Prasetyo', phone: '0815-4567-8902', plate: 'KT 3456 GH', kyc: 'APPROVED', rating: 4.9, trips: 521, earnings: 23100000, credit: 100000, status: 'ACTIVE' },
  { id: 5, name: 'Fajar Nugroho', phone: '0816-5678-9013', plate: 'KT 7890 IJ', kyc: 'PENDING', rating: 0, trips: 0, earnings: 0, credit: 50000, status: 'PENDING' },
  { id: 6, name: 'Gilang Ramadhan', phone: '0817-6789-0124', plate: 'KT 2345 KL', kyc: 'APPROVED', rating: 4.5, trips: 198, earnings: 8900000, credit: 25000, status: 'SUSPENDED' },
  { id: 7, name: 'Hendra Budiman', phone: '0818-7890-1235', plate: 'KT 6789 MN', kyc: 'APPROVED', rating: 4.7, trips: 415, earnings: 18600000, credit: 80000, status: 'ACTIVE' },
  { id: 8, name: 'Irfan Hakim', phone: '0819-8901-2346', plate: 'KT 1234 OP', kyc: 'PENDING', rating: 0, trips: 0, earnings: 0, credit: 50000, status: 'PENDING' },
  { id: 9, name: 'Joko Susilo', phone: '0821-9012-3457', plate: 'KT 5678 QR', kyc: 'APPROVED', rating: 4.4, trips: 156, earnings: 6700000, credit: 15000, status: 'ACTIVE' },
  { id: 10, name: 'Kurnia Sari', phone: '0822-0123-4568', plate: 'KT 9012 ST', kyc: 'APPROVED', rating: 4.9, trips: 623, earnings: 27800000, credit: 125000, status: 'ACTIVE' },
];

const tabs = ['Semua', 'Pending KYC', 'Aktif', 'Suspended'];

export default function DriversPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState(mockDrivers);

  const filtered = drivers.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) || d.plate.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === 'Semua' ? true :
      activeTab === 'Pending KYC' ? d.kyc === 'PENDING' :
      activeTab === 'Aktif' ? d.status === 'ACTIVE' :
      activeTab === 'Suspended' ? d.status === 'SUSPENDED' : true;
    return matchSearch && matchTab;
  });

  const handleApprove = (id) => {
    setDrivers((prev) =>
      prev.map((d) => d.id === id ? { ...d, kyc: 'APPROVED', status: 'ACTIVE' } : d)
    );
  };

  const handleSuspend = (id) => {
    setDrivers((prev) =>
      prev.map((d) => d.id === id ? { ...d, status: d.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' } : d)
    );
  };

  const getKycBadge = (kyc) => {
    if (kyc === 'APPROVED') return 'badge-approved';
    if (kyc === 'PENDING') return 'badge-pending';
    return 'badge-cancelled';
  };

  const getStatusBadge = (status) => {
    if (status === 'ACTIVE') return 'badge-active';
    if (status === 'SUSPENDED') return 'badge-suspended';
    return 'badge-pending';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Driver</h1>
          <p className="text-gray-500 text-sm">Total {drivers.length} driver terdaftar</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Cari nama, HP, plat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] w-64"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Driver', value: drivers.length, icon: '👥', bg: 'bg-blue-50', text: 'text-blue-700' },
          { label: 'Aktif', value: drivers.filter(d => d.status === 'ACTIVE').length, icon: '✅', bg: 'bg-green-50', text: 'text-green-700' },
          { label: 'Pending KYC', value: drivers.filter(d => d.kyc === 'PENDING').length, icon: '⏳', bg: 'bg-yellow-50', text: 'text-yellow-700' },
          { label: 'Suspended', value: drivers.filter(d => d.status === 'SUSPENDED').length, icon: '🚫', bg: 'bg-red-50', text: 'text-red-700' },
        ].map((c) => (
          <div key={c.label} className={`card flex items-center gap-3 ${c.bg} border-none`}>
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className={`text-2xl font-bold ${c.text}`}>{c.value}</p>
              <p className="text-xs text-gray-600">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-slate-200 px-6 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors mr-1 ${
                activeTab === tab
                  ? 'border-[#1B3A6B] text-[#1B3A6B]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              <span className="ml-1.5 bg-slate-100 text-slate-600 text-xs rounded-full px-2 py-0.5">
                {tab === 'Semua' ? drivers.length :
                 tab === 'Pending KYC' ? drivers.filter(d => d.kyc === 'PENDING').length :
                 tab === 'Aktif' ? drivers.filter(d => d.status === 'ACTIVE').length :
                 drivers.filter(d => d.status === 'SUSPENDED').length}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Nama Driver', 'No HP', 'Plat', 'Status KYC', 'Rating', 'Trips', 'Earnings', 'Kredit', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    <p className="text-4xl mb-2">🏍️</p>
                    <p>Tidak ada driver ditemukan</p>
                  </td>
                </tr>
              ) : (
                filtered.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#1B3A6B] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {driver.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{driver.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{driver.phone}</td>
                    <td className="py-3 px-4 font-mono text-xs font-medium text-gray-800">{driver.plate}</td>
                    <td className="py-3 px-4">
                      <span className={getKycBadge(driver.kyc)}>{driver.kyc}</span>
                    </td>
                    <td className="py-3 px-4">
                      {driver.rating > 0 ? (
                        <span className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="font-medium">{driver.rating}</span>
                        </span>
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-3 px-4 font-medium">{driver.trips}</td>
                    <td className="py-3 px-4 font-medium text-green-700">
                      {driver.earnings > 0 ? formatRupiah(driver.earnings) : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatRupiah(driver.credit)}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadge(driver.status)}>
                        {driver.status === 'ACTIVE' ? 'Aktif' : driver.status === 'SUSPENDED' ? 'Suspend' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1.5">
                        {driver.kyc === 'PENDING' && (
                          <button
                            onClick={() => handleApprove(driver.id)}
                            className="text-xs bg-blue-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleSuspend(driver.id)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                            driver.status === 'SUSPENDED'
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {driver.status === 'SUSPENDED' ? 'Aktifkan' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
