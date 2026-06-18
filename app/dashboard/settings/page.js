'use client'

import { useState, useEffect } from 'react'

const APP_VERSION = '1.0.0'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://temride-backend-production.up.railway.app'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')

  // Pricing config
  const [pricing, setPricing] = useState({
    baseFare: 5000,
    perKm: 2500,
    perMinute: 500,
    minFare: 8000,
    surgeMultiplier: 1.5,
  })

  // SOS contacts
  const [sosContacts, setSosContacts] = useState([
    { id: 1, name: 'Polisi', phone: '110' },
    { id: 2, name: 'Ambulans', phone: '119' },
    { id: 3, name: 'Pemadam', phone: '113' },
  ])
  const [newSos, setNewSos] = useState({ name: '', phone: '' })

  // Toggles
  const [toggles, setToggles] = useState({
    maintenanceMode: false,
    newDriverRegistration: true,
    driverCreditSystem: true,
    promoEnabled: true,
    fcmEnabled: true,
    fontteEnabled: true,
  })

  // App info
  const [appInfo] = useState({
    version: APP_VERSION,
    apiUrl: API_URL,
    environment: process.env.NODE_ENV || 'production',
    buildDate: new Date().toLocaleDateString('id-ID'),
  })

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) })
        setBackendStatus(res.ok ? 'online' : 'error')
      } catch {
        setBackendStatus('offline')
      }
    }
    checkBackend()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addSosContact = () => {
    if (!newSos.name || !newSos.phone) return
    setSosContacts(prev => [...prev, { id: Date.now(), ...newSos }])
    setNewSos({ name: '', phone: '' })
  }

  const removeSosContact = (id) => {
    setSosContacts(prev => prev.filter(s => s.id !== id))
  }

  const statusBadge = {
    online: { cls: 'bg-green-100 text-green-700', label: 'Online' },
    offline: { cls: 'bg-red-100 text-red-600', label: 'Offline' },
    checking: { cls: 'bg-yellow-100 text-yellow-700', label: 'Checking...' },
    error: { cls: 'bg-orange-100 text-orange-700', label: 'Error' },
  }[backendStatus]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">⚙️ Pengaturan</h1>
          <p className="text-gray-500 text-sm mt-0.5">Konfigurasi sistem TemRide</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
            saved ? 'bg-green-600 text-white' : 'bg-[#1B3A6B] text-white hover:bg-[#142D52]'
          } disabled:opacity-60`}
        >
          {saving ? 'Menyimpan...' : saved ? '✓ Tersimpan!' : 'Simpan Pengaturan'}
        </button>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>ℹ️</span> Informasi Aplikasi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Versi', value: appInfo.version },
            { label: 'Environment', value: appInfo.environment },
            { label: 'Tanggal Build', value: appInfo.buildDate },
            { label: 'Backend', value: <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge.cls}`}>{statusBadge.label}</span> },
          ].map(f => (
            <div key={f.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{f.label}</p>
              <div className="text-sm font-semibold text-gray-800">{f.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Backend URL</p>
          <code className="text-sm text-[#1B3A6B] font-mono break-all">{appInfo.apiUrl}</code>
        </div>
      </div>

      {/* Pricing Config */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>💰</span> Konfigurasi Harga
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Base Fare (Rp)', key: 'baseFare', hint: 'Tarif dasar per order' },
            { label: 'Per KM (Rp)', key: 'perKm', hint: 'Tarif per kilometer' },
            { label: 'Per Menit (Rp)', key: 'perMinute', hint: 'Tarif per menit perjalanan' },
            { label: 'Min Fare (Rp)', key: 'minFare', hint: 'Tarif minimum order' },
            { label: 'Surge Multiplier', key: 'surgeMultiplier', hint: 'Pengali tarif saat ramai (x)' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type="number"
                value={pricing[f.key]}
                onChange={e => setPricing(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
              />
              <p className="text-xs text-gray-400 mt-0.5">{f.hint}</p>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-700 mb-2">Preview Estimasi Tarif (5 km, 15 menit)</p>
          <p className="text-xl font-bold text-blue-800">
            Rp {Math.max(pricing.minFare, pricing.baseFare + (5 * pricing.perKm) + (15 * pricing.perMinute)).toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            {pricing.baseFare.toLocaleString()} + (5 × {pricing.perKm.toLocaleString()}) + (15 × {pricing.perMinute.toLocaleString()})
          </p>
        </div>
      </div>

      {/* SOS Contacts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🆘</span> Kontak Darurat SOS
        </h3>
        <div className="space-y-2 mb-4">
          {sosContacts.map(c => (
            <div key={c.id} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <span className="text-red-500 text-lg">📞</span>
              <span className="font-semibold text-gray-800 flex-1">{c.name}</span>
              <span className="font-mono text-red-700 font-bold">{c.phone}</span>
              <button
                onClick={() => removeSosContact(c.id)}
                className="text-red-400 hover:text-red-600 text-sm ml-2"
              >✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSos.name}
            onChange={e => setNewSos(p => ({ ...p, name: e.target.value }))}
            placeholder="Nama layanan..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
          />
          <input
            type="text"
            value={newSos.phone}
            onChange={e => setNewSos(p => ({ ...p, phone: e.target.value }))}
            placeholder="No. telepon..."
            className="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
          />
          <button
            onClick={addSosContact}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
          >
            + Tambah
          </button>
        </div>
      </div>

      {/* Toggle Settings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔧</span> Toggle Fitur
        </h3>
        <div className="space-y-3">
          {[
            { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Nonaktifkan akses aplikasi untuk maintenance', danger: true },
            { key: 'newDriverRegistration', label: 'Registrasi Driver Baru', desc: 'Izinkan driver baru mendaftar ke platform' },
            { key: 'driverCreditSystem', label: 'Sistem Kredit Driver', desc: 'Aktifkan sistem cicilan motor untuk driver' },
            { key: 'promoEnabled', label: 'Promo & Voucher', desc: 'Aktifkan penggunaan promo dan voucher' },
            { key: 'fcmEnabled', label: 'FCM Push Notification', desc: 'Aktifkan notifikasi push via Firebase' },
            { key: 'fontteEnabled', label: 'Fonnte WhatsApp', desc: 'Aktifkan notifikasi via WhatsApp Fonnte' },
          ].map(t => (
            <div
              key={t.key}
              className={`flex items-center justify-between p-4 rounded-lg ${
                t.danger && toggles[t.key] ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex-1">
                <p className={`text-sm font-semibold ${t.danger && toggles[t.key] ? 'text-red-700' : 'text-gray-800'}`}>
                  {t.danger && toggles[t.key] ? '⚠️ ' : ''}{t.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
              </div>
              <button
                onClick={() => setToggles(p => ({ ...p, [t.key]: !p[t.key] }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ml-4 ${
                  toggles[t.key]
                    ? t.danger ? 'bg-red-500' : 'bg-[#1B3A6B]'
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
                    toggles[t.key] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
