"use client";
import { useState } from 'react';
import { formatRupiah } from '../../../lib/utils';

const initialPromos = [
  { id: 1, code: 'WELCOME20', type: 'percent', value: 20, limit: 100, used: 67, expiry: '2024-02-29', active: true, desc: 'Diskon 20% untuk user baru' },
  { id: 2, code: 'HEMAT15K', type: 'fixed', value: 15000, limit: 200, used: 143, expiry: '2024-01-31', active: true, desc: 'Potongan Rp 15.000 tiap order' },
  { id: 3, code: 'WEEKEND25', type: 'percent', value: 25, limit: 50, used: 50, expiry: '2024-01-21', active: false, desc: 'Promo akhir pekan' },
  { id: 4, code: 'BPPDISKON', type: 'percent', value: 15, limit: 300, used: 89, expiry: '2024-03-31', active: true, desc: 'Khusus Balikpapan!' },
  { id: 5, code: 'RAMADAN50K', type: 'fixed', value: 50000, limit: 100, used: 0, expiry: '2024-04-30', active: false, desc: 'Promo Ramadan spesial' },
];

const emptyForm = { code: '', type: 'percent', value: '', limit: '', expiry: '', desc: '' };

export default function PromoPage() {
  const [promos, setPromos] = useState(initialPromos);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleToggle = (id) => {
    setPromos((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleDelete = (id) => {
    if (confirm('Yakin hapus promo ini?')) {
      setPromos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.code || !form.value || !form.limit || !form.expiry) {
      setFormError('Semua field wajib diisi.');
      return;
    }
    if (promos.some((p) => p.code.toUpperCase() === form.code.toUpperCase())) {
      setFormError('Kode promo sudah ada.');
      return;
    }

    const newPromo = {
      id: Date.now(),
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      limit: Number(form.limit),
      used: 0,
      expiry: form.expiry,
      active: true,
      desc: form.desc || '-',
    };
    setPromos((prev) => [newPromo, ...prev]);
    setForm(emptyForm);
    setFormSuccess('Promo berhasil dibuat!');
    setShowForm(false);
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const activeCount = promos.filter(p => p.active).length;
  const totalUsed = promos.reduce((s, p) => s + p.used, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Promo</h1>
          <p className="text-gray-500 text-sm">Kelola kode promo & diskon</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(''); }}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? '✕ Tutup' : '+ Buat Promo'}
        </button>
      </div>

      {formSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm flex items-center gap-2">
          <span>✅</span> {formSuccess}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Promo', value: promos.length, icon: '🎟️', color: 'text-[#1B3A6B]', bg: 'bg-blue-50' },
          { label: 'Promo Aktif', value: activeCount, icon: '✅', color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Promo Nonaktif', value: promos.length - activeCount, icon: '⏸️', color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'Total Pemakaian', value: `${totalUsed}x`, icon: '📊', color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map((c) => (
          <div key={c.label} className={`card border-none ${c.bg}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
                <p className="text-xs text-gray-600">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card border-2 border-[#1B3A6B]/20">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎟️</span> Buat Promo Baru
          </h3>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{formError}</div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Promo *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="misal: DISKON20"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Diskon *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              >
                <option value="percent">Persentase (%)</option>
                <option value="fixed">Nominal Tetap (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nilai {form.type === 'percent' ? '(%)' : '(Rp)'} *
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === 'percent' ? 'misal: 20' : 'misal: 15000'}
                min="1"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batas Penggunaan *</label>
              <input
                type="number"
                value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                placeholder="misal: 100"
                min="1"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kadaluarsa *</label>
              <input
                type="date"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <input
                type="text"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Deskripsi singkat promo"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
              <button type="submit" className="btn-primary px-6">
                ✓ Simpan Promo
              </button>
              <button
                type="button"
                onClick={() => { setForm(emptyForm); setFormError(''); setShowForm(false); }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Promo Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-gray-800">Daftar Semua Promo</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Kode', 'Tipe', 'Nilai', 'Penggunaan', 'Kadaluarsa', 'Deskripsi', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {promos.map((promo) => (
                <tr key={promo.id} className={`hover:bg-slate-50 transition-colors ${!promo.active ? 'opacity-60' : ''}`}>
                  <td className="py-3 px-4 font-mono font-bold text-[#1B3A6B]">{promo.code}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      promo.type === 'percent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {promo.type === 'percent' ? 'Persen' : 'Nominal'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {promo.type === 'percent' ? `${promo.value}%` : formatRupiah(promo.value)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                        <div
                          className="bg-[#1B3A6B] h-1.5 rounded-full"
                          style={{ width: `${Math.min((promo.used / promo.limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{promo.used}/{promo.limit}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{promo.expiry}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs max-w-40 truncate">{promo.desc}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggle(promo.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        promo.active ? 'bg-[#1B3A6B]' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        promo.active ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}></span>
                    </button>
                    <span className="ml-2 text-xs text-gray-500">{promo.active ? 'Aktif' : 'Off'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      🗑️ Hapus
                    </button>
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
