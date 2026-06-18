'use client'
import { useState, useEffect, useRef } from 'react'

const API_URL = 'https://temride-backend-production.up.railway.app'

// Status config
const statusConfig = {
  available: { label: 'Tersedia', color: '#10B981', bg: 'bg-green-100', text: 'text-green-800', dot: '🟢' },
  on_trip: { label: 'On Trip', color: '#F59E0B', bg: 'bg-yellow-100', text: 'text-yellow-800', dot: '🟡' },
  offline: { label: 'Offline', color: '#6B7280', bg: 'bg-gray-100', text: 'text-gray-800', dot: '⚫' },
}

export default function LiveMapPage() {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isConnected, setIsConnected] = useState(false)
  const [connectionMode, setConnectionMode] = useState('polling') // 'socket' or 'polling'
  const socketRef = useRef(null)
  const pollIntervalRef = useRef(null)

  // Fetch driver positions dari backend REST API
  const fetchDriverPositions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/drivers?status=online&includeLocation=true`, {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : ''}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        const driverList = data.drivers || data.data || []
        // Map ke format display
        const mapped = driverList.map(d => ({
          id: d.id,
          name: d.name || d.user?.name || 'Driver',
          phone: d.phone || d.user?.phone || '',
          plate: d.vehiclePlate || d.driverProfile?.vehiclePlate || '-',
          status: d.isOnline ? (d.currentOrderId ? 'on_trip' : 'available') : 'offline',
          lat: d.currentLat || d.driverProfile?.lastLat || -1.2654,
          lng: d.currentLng || d.driverProfile?.lastLng || 116.8312,
          earnings: d.driverProfile?.walletBalance || d.todayEarnings || 0,
          trips: d.todayTrips || d._count?.orders || 0,
          rating: d.driverProfile?.rating || d.avgRating || 5.0,
          battery: d.batteryLevel || null,
          lastSeen: d.lastSeen || d.updatedAt,
        }))
        setDrivers(mapped)
        setLastUpdated(new Date())
        if (mapped.length > 0) setIsConnected(true)
      }
    } catch (err) {
      console.error('Fetch drivers error:', err)
    }
  }

  // Try Socket.io connection
  const connectSocket = async () => {
    try {
      const { io } = await import('socket.io-client')
      const socket = io(API_URL, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnectionAttempts: 3,
      })

      socket.on('connect', () => {
        console.log('LiveMap: Socket connected')
        setIsConnected(true)
        setConnectionMode('socket')
        // Join admin room
        socket.emit('admin:join')
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
        setConnectionMode('polling')
      })

      // Listen driver location updates
      socket.on('driver:location_update', (data) => {
        setDrivers(prev => prev.map(d => 
          d.id === data.driverId 
            ? { ...d, lat: data.lat, lng: data.lng, lastSeen: new Date() }
            : d
        ))
        setLastUpdated(new Date())
      })

      // Listen driver status changes
      socket.on('driver:status_change', (data) => {
        setDrivers(prev => prev.map(d =>
          d.id === data.driverId ? { ...d, status: data.status } : d
        ))
      })

      socketRef.current = socket
    } catch (err) {
      console.log('Socket failed, using polling mode')
      setConnectionMode('polling')
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchDriverPositions()
    
    // Try socket
    connectSocket()
    
    // Polling fallback setiap 10 detik
    pollIntervalRef.current = setInterval(fetchDriverPositions, 10000)

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [])

  const onlineDrivers = drivers.filter(d => d.status !== 'offline')
  const availableDrivers = drivers.filter(d => d.status === 'available')
  const onTripDrivers = drivers.filter(d => d.status === 'on_trip')

  // Hitung center peta berdasarkan driver aktif
  const mapCenter = onlineDrivers.length > 0
    ? { lat: onlineDrivers[0].lat, lng: onlineDrivers[0].lng }
    : { lat: -1.2654, lng: 116.8312 } // Balikpapan default

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.05},${mapCenter.lat - 0.05},${mapCenter.lng + 0.05},${mapCenter.lat + 0.05}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🗺️ Live Map — Driver Aktif</h1>
          <p className="text-gray-500 text-sm mt-1">Posisi real-time semua driver TemRide di Balikpapan</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isConnected ? `Live (${connectionMode})` : 'Offline'}
          </span>
          <span className="text-xs text-gray-400">Update: {lastUpdated.toLocaleTimeString('id-ID')}</span>
          <button onClick={fetchDriverPositions} className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Driver', value: drivers.length, color: 'blue', icon: '🛵' },
          { label: 'Tersedia', value: availableDrivers.length, color: 'green', icon: '🟢' },
          { label: 'On Trip', value: onTripDrivers.length, color: 'yellow', icon: '🟡' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-gray-500 text-xs">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map + Driver List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OpenStreetMap */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">📍 Peta Balikpapan</h3>
            <span className="text-xs text-gray-400">OpenStreetMap © contributors</span>
          </div>
          
          {/* Map dengan marker driver */}
          <div className="relative" style={{height: '450px'}}>
            <iframe
              src={osmUrl}
              className="w-full h-full border-0"
              title="TemRide Live Map Balikpapan"
            />
            {/* Overlay driver info */}
            {onlineDrivers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                  <div className="text-4xl mb-2">🛵</div>
                  <p className="font-semibold text-gray-700">Belum ada driver online</p>
                  <p className="text-sm text-gray-500 mt-1">Driver akan muncul saat toggle Online di App Driver</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Koordinat driver aktif di bawah peta */}
          {onlineDrivers.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2">POSISI DRIVER AKTIF:</p>
              <div className="flex flex-wrap gap-2">
                {onlineDrivers.map(d => (
                  <span key={d.id} className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1">
                    {statusConfig[d.status]?.dot} {d.name}: {d.lat?.toFixed(4)}, {d.lng?.toFixed(4)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Driver List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">🛵 Status Driver</h3>
          </div>
          <div className="overflow-y-auto" style={{maxHeight: '500px'}}>
            {drivers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">🛵</div>
                <p className="text-gray-500 text-sm">Belum ada driver terdaftar</p>
                <p className="text-gray-400 text-xs mt-1">Driver muncul setelah registrasi via App Driver</p>
              </div>
            ) : (
              drivers.map(driver => (
                <div
                  key={driver.id}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selectedDriver?.id === driver.id ? 'bg-blue-50 border-blue-100' : ''}`}
                  onClick={() => setSelectedDriver(selectedDriver?.id === driver.id ? null : driver)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800 text-sm">{driver.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[driver.status]?.bg} ${statusConfig[driver.status]?.text}`}>
                      {statusConfig[driver.status]?.label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div>📱 {driver.phone}</div>
                    <div>🏍️ {driver.plate}</div>
                    <div>⭐ {driver.rating} • {driver.trips} trip hari ini</div>
                    <div>💰 Rp {(driver.earnings || 0).toLocaleString('id-ID')}</div>
                    {driver.lastSeen && (
                      <div className="text-gray-400">🕐 {new Date(driver.lastSeen).toLocaleTimeString('id-ID')}</div>
                    )}
                  </div>
                  {selectedDriver?.id === driver.id && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-1">KOORDINAT:</p>
                      <p className="text-xs font-mono text-gray-600">{driver.lat?.toFixed(6)}, {driver.lng?.toFixed(6)}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Cara Kerja Live Map</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-blue-700">
          <div>📡 <strong>Real-time:</strong> Posisi driver diperbarui setiap 5 detik via Socket.io ketika driver toggle Online di App Driver</div>
          <div>🔄 <strong>Fallback:</strong> Jika Socket.io terputus, sistem otomatis beralih ke polling REST API setiap 10 detik</div>
          <div>📍 <strong>Akurasi:</strong> GPS dari ponsel driver. Akurasi ±5-10 meter di area terbuka</div>
        </div>
      </div>
    </div>
  )
}
