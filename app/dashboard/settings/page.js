'use client'
import { useState, useEffect } from 'react'
const API_URL = 'https://temride-backend-production.up.railway.app'

export default function SettingsPage() {
  const [surgeStatus, setSurgeStatus] = useState(null)
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState('')

  const fetchStatus = async () => {
    try {
      const [s, r] = await Promise.all([
        fetch(`${API_URL}/api/fare/surge`).then(r => r.json()),
        fetch(`${API_URL}/api/fare/rates`).then(r => r.json()),
      ])
      setSurgeStatus(s.surge)
      setRates(r.rates)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchStatus()
    const i = setInterval(fetchStatus, 30000)
    return () => clearInterval(i)
  }, [])

  const surgeColorMap = {
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">⚙️ Pengaturan Sistem</h1>
        <p className="text-gray-500 text-sm mt-1">Konfigurasi tarif, surge pricing, dan pengaturan operasional TemRide</p>
      </div>

      {/* Surge Status Live */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">⚡ Status Surge Pricing — Live</h2>
        {loading ? (
          <div className="text-gray-400">⏳ Memuat status...</div>
        ) : surgeStatus ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`rounded-xl p-4 ${surgeColorMap[surgeStatus.surgeColor] || 'text-gray-600 bg-gray-50'}`}>
              <p className="text-xs font-semibold uppercase opacity-70">Status</p>
              <p className="text-xl font-bold mt-1">{surgeStatus.surgeLabel}</p>
            </div>
            <div className="rounded-xl p-4 bg-blue-50 text-blue-600">
              <p className="text-xs font-semibold uppercase opacity-70">Multiplier</p>
              <p className="text-xl font-bold mt-1">×{surgeStatus.multiplier}</p>
            </div>
            <div className="rounded-xl p-4 bg-purple-50 text-purple-600">
              <p className="text-xs font-semibold uppercase opacity-70">Order Aktif</p>
              <p className="text-xl font-bold mt-1">{surgeStatus.demand}</p>
            </div>
            <div className="rounded-xl p-4 bg-green-50 text-green-600">
              <p className="text-xs font-semibold uppercase opacity-70">Driver Online</p>
              <p className="text-xl font-bold mt-1">{surgeStatus.supply}</p>
            </div>
          </div>
        ) : <p className="text-gray-400">Tidak dapat memuat status</p>}

        <button onClick={fetchStatus} className="mt-4 text-sm text-blue-600 hover:underline">🔄 Refresh</button>
      </div>

      {/* Tarif Dasar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">💰 Tarif Dasar (per kendaraan)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rates && Object.entries(rates).map(([type, r]) => (
            <div key={type} className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                {type === 'MOTORCYCLE' ? '🛵 Motor (GoRide)' : type === 'CAR' ? '🚗 Mobil (GoCar)' : '📦 Kurir (TSend)'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Biaya buka</span><span className="font-medium">Rp {r.basePrice?.toLocaleString('id')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Per km</span><span className="font-medium">Rp {r.perKm?.toLocaleString('id')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Minimum</span><span className="font-medium">Rp {r.minFare?.toLocaleString('id')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Biaya layanan</span><span className="font-medium">Rp {r.serviceFee?.toLocaleString('id')}</span></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">* Tarif dapat diubah di pricing.controller.js (backend). Update akan aktif setelah redeploy Railway.</p>
      </div>

      {/* Surge Rules */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">⚡ Aturan Surge Pricing</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Kondisi</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Rasio (demand/supply)</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Multiplier</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Contoh (5km motor)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cond: 'Normal', ratio: '< 2×', mult: '×1.0', ex: 'Rp 17.500', color: 'bg-green-50' },
                { cond: 'Ramai', ratio: '2× – 3×', mult: '×1.2', ex: 'Rp 21.000', color: 'bg-yellow-50' },
                { cond: 'Sangat Ramai', ratio: '3× – 5×', mult: '×1.5', ex: 'Rp 26.250', color: 'bg-orange-50' },
                { cond: 'Permintaan Tinggi', ratio: '≥ 5×', mult: '×2.0', ex: 'Rp 35.000', color: 'bg-red-50' },
                { cond: 'Jam Sibuk (07-09, 17-20)', ratio: 'Time-based', mult: '×1.3 min', ex: 'Rp 22.750', color: 'bg-blue-50' },
              ].map((row, i) => (
                <tr key={i} className={`${row.color} border-b border-gray-100`}>
                  <td className="px-4 py-3 font-medium">{row.cond}</td>
                  <td className="px-4 py-3 text-gray-600">{row.ratio}</td>
                  <td className="px-4 py-3 font-bold">{row.mult}</td>
                  <td className="px-4 py-3 text-gray-700">{row.ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info operasional */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Info Operasional TemRide Balikpapan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-blue-700">
          <div>📍 <strong>Area Pilot:</strong> Balikpapan Kota</div>
          <div>🕐 <strong>Jam Operasi:</strong> 06:00 – 23:00 WITA</div>
          <div>💰 <strong>Split Driver:</strong> 90% driver / 10% TEM</div>
          <div>🔄 <strong>Cascade:</strong> 5 driver × 30 detik</div>
        </div>
      </div>
    </div>
  )
}
