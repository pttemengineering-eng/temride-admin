'use client';
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Users, RefreshCw, Wifi } from 'lucide-react';

// Mock driver data untuk demo (akan diganti data real dari backend)
const mockDrivers = [
  { id: 1, name: 'Budi Santoso', plate: 'KT 1234 AB', status: 'available', lat: -1.2654, lng: 116.8312, earnings: 85000, trips: 6, battery: 78 },
  { id: 2, name: 'Andi Wijaya', plate: 'KT 5678 CD', status: 'on_trip', lat: -1.2780, lng: 116.8450, earnings: 120000, trips: 9, battery: 45 },
  { id: 3, name: 'Sari Dewi', plate: 'KT 9012 EF', status: 'available', lat: -1.2530, lng: 116.8200, earnings: 65000, trips: 5, battery: 92 },
  { id: 4, name: 'Deni Kurniawan', plate: 'KT 3456 GH', status: 'on_trip', lat: -1.2900, lng: 116.8600, earnings: 95000, trips: 7, battery: 33 },
  { id: 5, name: 'Rini Susanti', plate: 'KT 7890 IJ', status: 'offline', lat: -1.2400, lng: 116.8100, earnings: 40000, trips: 3, battery: 15 },
];

const statusConfig = {
  available: { label: 'Tersedia', color: '#10B981', bg: 'bg-green-100', text: 'text-green-800' },
  on_trip: { label: 'On Trip', color: '#F59E0B', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  offline: { label: 'Offline', color: '#6B7280', bg: 'bg-gray-100', text: 'text-gray-800' },
};

export default function LiveMapPage() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onlineDrivers = drivers.filter(d => d.status !== 'offline');
  const availableDrivers = drivers.filter(d => d.status === 'available');
  const onTripDrivers = drivers.filter(d => d.status === 'on_trip');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Map</h1>
          <p className="text-slate-500 text-sm mt-1">
            Tracking posisi driver real-time
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d54] transition-colors text-sm"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{onlineDrivers.length}</p>
              <p className="text-xs text-slate-500">Driver Online</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <MapPin size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{availableDrivers.length}</p>
              <p className="text-xs text-slate-500">Tersedia</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Navigation size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{onTripDrivers.length}</p>
              <p className="text-xs text-slate-500">Sedang Trip</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map + Driver List */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* OSM Map Embed */}
        <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden relative">
          {/* OpenStreetMap via iframe - Balikpapan center */}
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=116.7800%2C-1.3200%2C116.9000%2C-1.2200&layer=mapnik&marker=-1.2654%2C116.8312"
            width="100%"
            height="100%"
            style={{ border: 'none', minHeight: '400px' }}
            title="Balikpapan Live Map"
          />
          {/* Driver markers overlay info */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-xs text-slate-600 shadow">
            <div className="flex items-center gap-1.5">
              <Wifi size={12} className="text-green-500" />
              Live • Update tiap 30 detik
            </div>
            <div className="text-slate-400 mt-0.5">
              Last: {lastUpdated.toLocaleTimeString('id-ID')}
            </div>
          </div>
          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-xs shadow">
            <p className="font-semibold text-slate-700 mb-1">Legenda</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-slate-600">Tersedia</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /><span className="text-slate-600">On Trip</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-400" /><span className="text-slate-600">Offline</span></div>
            </div>
          </div>
        </div>

        {/* Driver List */}
        <div className="w-80 bg-white rounded-xl border border-slate-100 shadow-sm overflow-y-auto">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Daftar Driver</h3>
            <p className="text-xs text-slate-500 mt-0.5">{drivers.length} driver terdaftar</p>
          </div>
          <div className="divide-y divide-slate-50">
            {drivers.map(driver => {
              const cfg = statusConfig[driver.status];
              return (
                <div
                  key={driver.id}
                  onClick={() => setSelectedDriver(selectedDriver?.id === driver.id ? null : driver)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedDriver?.id === driver.id ? 'bg-blue-50 border-l-2 border-[#1B3A6B]' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{driver.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{driver.plate}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                  {selectedDriver?.id === driver.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-slate-500">Earnings</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(driver.earnings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Trips</p>
                        <p className="text-sm font-semibold text-slate-800">{driver.trips}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Baterai</p>
                        <p className={`text-sm font-semibold ${driver.battery < 30 ? 'text-red-600' : driver.battery < 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {driver.battery}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
        💡 <strong>Mode Demo:</strong> Posisi driver di atas adalah mock data. Setelah backend terhubung, posisi akan update real-time via Socket.io setiap 3–5 detik.
      </div>
    </div>
  );
}
