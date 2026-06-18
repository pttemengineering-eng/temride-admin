'use client'

import { useEffect, useRef, useState } from 'react'

const mockDrivers = [
  { id: 1, name: 'Budi Santoso', plate: 'B 1234 ABC', status: 'available', lat: -6.2088, lng: 106.8456, earnings: 'Rp 185.000' },
  { id: 2, name: 'Ahmad Ridwan', plate: 'B 5678 DEF', status: 'on_trip', lat: -6.2150, lng: 106.8320, earnings: 'Rp 240.000' },
  { id: 3, name: 'Dian Pratama', plate: 'B 9012 GHI', status: 'available', lat: -6.1920, lng: 106.8600, earnings: 'Rp 120.000' },
  { id: 4, name: 'Eko Wahyu', plate: 'B 3456 JKL', status: 'on_trip', lat: -6.2250, lng: 106.8700, earnings: 'Rp 310.000' },
  { id: 5, name: 'Fajar Kurnia', plate: 'B 7890 MNO', status: 'offline', lat: -6.1750, lng: 106.8250, earnings: 'Rp 0' },
  { id: 6, name: 'Gilang Saputra', plate: 'B 2345 PQR', status: 'available', lat: -6.2050, lng: 106.8550, earnings: 'Rp 95.000' },
  { id: 7, name: 'Hendra Wijaya', plate: 'B 6789 STU', status: 'on_trip', lat: -6.2180, lng: 106.8420, earnings: 'Rp 275.000' },
]

const statusColors = {
  available: '#22C55E',
  on_trip: '#F59E0B',
  offline: '#EF4444',
}

const statusLabels = {
  available: 'Tersedia',
  on_trip: 'Dalam Perjalanan',
  offline: 'Offline',
}

export default function LiveMap() {
  const mapRef = useRef(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [drivers, setDrivers] = useState(mockDrivers)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [mapLoaded, setMapLoaded] = useState(false)

  // Simulate live refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => ({
        ...d,
        lat: d.lat + (Math.random() - 0.5) * 0.001,
        lng: d.lng + (Math.random() - 0.5) * 0.001,
      })))
      setLastUpdate(new Date())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const onlineCount = drivers.filter(d => d.status !== 'offline').length
  const availableCount = drivers.filter(d => d.status === 'available').length
  const onTripCount = drivers.filter(d => d.status === 'on_trip').length

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            🗺️ Live Driver Map
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Update terakhir: {lastUpdate.toLocaleTimeString('id-ID')} · Refresh tiap 10 detik
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">{availableCount} Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600">{onTripCount} Trip</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">{drivers.filter(d => d.status === 'offline').length} Offline</span>
          </div>
        </div>
      </div>

      {/* Map Area - Simulated with positioned driver markers */}
      <div className="relative bg-[#E8F0FE] overflow-hidden" style={{ height: '380px' }}>
        {/* Map background simulation */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #E8F4E8 0%, #E0EEF8 30%, #EEF2F8 60%, #E8F0E8 100%)',
        }}>
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(#1B3A6B 1px, transparent 1px), linear-gradient(90deg, #1B3A6B 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Road simulation */}
          <div className="absolute" style={{ top: '45%', left: 0, right: 0, height: '3px', background: '#C8D8E8', opacity: 0.6 }}></div>
          <div className="absolute" style={{ top: 0, bottom: 0, left: '50%', width: '3px', background: '#C8D8E8', opacity: 0.6 }}></div>
          <div className="absolute" style={{ top: '25%', left: '20%', right: '30%', height: '2px', background: '#C8D8E8', opacity: 0.4, transform: 'rotate(-5deg)' }}></div>
          <div className="absolute" style={{ top: '65%', left: '30%', right: '10%', height: '2px', background: '#C8D8E8', opacity: 0.4, transform: 'rotate(3deg)' }}></div>

          {/* Area labels */}
          <span className="absolute text-xs text-gray-400 font-medium" style={{ top: '10%', left: '15%' }}>Jakarta Pusat</span>
          <span className="absolute text-xs text-gray-400 font-medium" style={{ top: '60%', left: '60%' }}>Jakarta Selatan</span>
          <span className="absolute text-xs text-gray-400 font-medium" style={{ top: '30%', right: '10%' }}>Jakarta Timur</span>
        </div>

        {/* Driver Markers */}
        {drivers.map((driver, idx) => {
          // Map lat/lng to relative positions
          const baseLatMin = -6.235, baseLatMax = -6.165
          const baseLngMin = 106.820, baseLngMax = 106.880
          const x = ((driver.lng - baseLngMin) / (baseLngMax - baseLngMin)) * 90 + 5
          const y = ((driver.lat - baseLatMin) / (baseLatMax - baseLatMin)) * 90 + 5
          const clampedX = Math.max(5, Math.min(95, x))
          const clampe = Math.max(5, Math.min(95, y))

          return (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(selectedDriver?.id === driver.id ? null : driver)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 z-10"
              style={{ left: `${clampedX}%`, top: `${clampe}%` }}
            >
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white"
                  style={{ backgroundColor: statusColors[driver.status] }}
                >
                  🏍️
                </div>
                {driver.status !== 'offline' && (
                  <div
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white animate-pulse"
                    style={{ backgroundColor: statusColors[driver.status] }}
                  ></div>
                )}
              </div>
            </button>
          )
        })}

        {/* Selected driver popup */}
        {selectedDriver && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: statusColors[selectedDriver.status] }}
                >
                  {selectedDriver.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedDriver.name}</p>
                  <p className="text-xs text-gray-500">{selectedDriver.plate}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: statusColors[selectedDriver.status] }}
                    >
                      {statusLabels[selectedDriver.status]}
                    </span>
                    <span className="text-xs text-gray-500">Earnings: {selectedDriver.earnings}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Map attribution */}
        <div className="absolute bottom-2 right-2 bg-white/80 text-xs text-gray-400 px-2 py-1 rounded">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Google Maps' : 'Map Preview (Dev Mode)'}
        </div>
      </div>
    </div>
  )
}
