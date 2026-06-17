"use client";
import { useState } from 'react';
import { formatRupiah } from '../../../lib/utils';

const onlineDrivers = [
  { id: 1, name: 'Andi Wijaya', plate: 'KT 1234 AB', lat: -1.2654, lng: 116.8312, status: 'available', lastOrder: '14:23' },
  { id: 2, name: 'Deni Kurniawan', plate: 'KT 9012 EF', lat: -1.2701, lng: 116.8389, status: 'on_trip', lastOrder: '14:18' },
  { id: 3, name: 'Eko Prasetyo', plate: 'KT 3456 GH', lat: -1.2598, lng: 116.8245, status: 'available', lastOrder: '14:10' },
  { id: 4, name: 'Hendra Budiman', plate: 'KT 6789 MN', lat: -1.2732, lng: 116.8421, status: 'on_trip', lastOrder: '14:05' },
  { id: 5, name: 'Joko Susilo', plate: 'KT 5678 QR', lat: -1.2678, lng: 116.8356, status: 'available', lastOrder: '13:55' },
  { id: 6, name: 'Kurnia Sari', plate: 'KT 9012 ST', lat: -1.2621, lng: 116.8278, status: 'on_trip', lastOrder: '13:50' },
];

const activeOrders = [
  { id: 'TR-003', passenger: 'Ahmad Fauzi', driver: 'Rini Puspita', pickup: 'Bandara SAMS', destination: 'Hotel Grand Senyiur', fare: 75000, eta: '5 mnt' },
  { id: 'TR-012', passenger: 'Oman Firdaus', driver: 'Menunggu', pickup: 'Jl. Veteran', destination: 'Mall BSB', fare: 0, eta: '-' },
];

export default function MapPage() {
  const [selectedDriver, setSelectedDriver] = useState(null);

  const availableCount = onlineDrivers.filter(d => d.status === 'available').length;
  const onTripCount = onlineDrivers.filter(d => d.status === 'on_trip').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Live Map</h1>
        <p className="text-gray-500 text-sm">Pantau driver dan order secara realtime</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Driver Online', value: onlineDrivers.length, icon: '🟢', color: 'text-green-700 bg-green-50' },
          { label: 'Tersedia', value: availableCount, icon: '✅', color: 'text-blue-700 bg-blue-50' },
          { label: 'Dalam Perjalanan', value: onTripCount, icon: '🏍️', color: 'text-yellow-700 bg-yellow-50' },
          { label: 'Order Aktif', value: activeOrders.length, icon: '📦', color: 'text-purple-700 bg-purple-50' },
        ].map((c) => (
          <div key={c.label} className={`card border-none ${c.color.split(' ')[1]}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${c.color.split(' ')[0]}`}>{c.value}</p>
                <p className="text-xs text-gray-600">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Placeholder + Driver List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map */}
        <div className="xl:col-span-2 card p-0 overflow-hidden" style={{ minHeight: '400px' }}>
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Peta Balikpapan</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Tersedia
              <span className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></span> Perjalanan
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center relative"
               style={{ height: '400px' }}>
            {/* Fake map with driver dots */}
            <div className="absolute inset-0 p-8">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}>
              </div>

              {/* Driver markers */}
              {onlineDrivers.map((driver, i) => (
                <button
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver.id === selectedDriver?.id ? null : driver)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${15 + (i % 3) * 30 + Math.random() * 10}%`,
                    top: `${20 + Math.floor(i / 3) * 40 + Math.random() * 10}%`,
                  }}
                >
                  <div className={`w-9 h-9 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg transition-transform hover:scale-110 ${
                    driver.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    🏍️
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#1B3A6B] text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {driver.name}
                  </div>
                </button>
              ))}

              {/* Center marker - Balikpapan */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-[#1B3A6B] rounded-full border-2 border-white shadow"></div>
                <p className="text-xs text-[#1B3A6B] font-bold mt-1 whitespace-nowrap">Balikpapan</p>
              </div>
            </div>

            {/* Selected driver popup */}
            {selectedDriver && (
              <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 min-w-48">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm">{selectedDriver.name}</h4>
                  <button onClick={() => setSelectedDriver(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                </div>
                <p className="text-xs text-gray-500">{selectedDriver.plate}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                  selectedDriver.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedDriver.status === 'available' ? 'Tersedia' : 'Dalam Perjalanan'}
                </span>
                <p className="text-xs text-gray-500 mt-1">Order terakhir: {selectedDriver.lastOrder}</p>
              </div>
            )}
          </div>
        </div>

        {/* Driver List */}
        <div className="space-y-4">
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="font-semibold text-gray-800 text-sm">Driver Online ({onlineDrivers.length})</h3>
            </div>
            <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
              {onlineDrivers.map((driver) => (
                <div key={driver.id}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedDriver(driver)}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      driver.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.plate} · {driver.lastOrder}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      driver.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {driver.status === 'available' ? 'Free' : 'Trip'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Orders */}
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="font-semibold text-gray-800 text-sm">Order Aktif ({activeOrders.length})</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {activeOrders.map((order) => (
                <div key={order.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-semibold text-[#1B3A6B]">{order.id}</span>
                    <span className="text-xs text-gray-500">ETA: {order.eta}</span>
                  </div>
                  <p className="text-xs text-gray-800 font-medium">{order.passenger}</p>
                  <p className="text-xs text-gray-500 mt-0.5">↑ {order.pickup}</p>
                  <p className="text-xs text-gray-500">↓ {order.destination}</p>
                  {order.fare > 0 && (
                    <p className="text-xs font-semibold text-green-700 mt-1">{formatRupiah(order.fare)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
