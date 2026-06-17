'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Header({ onMenuToggle, sidebarOpen }) {
  const router = useRouter()
  const [admin, setAdmin] = useState({ name: 'Admin TemRide', email: 'admin@temride.id' })
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'KYC baru dari Budi Santoso', time: '5 menit lalu', unread: true },
    { id: 2, text: 'Revenue hari ini Rp 4.2M (+12%)', time: '1 jam lalu', unread: true },
    { id: 3, text: 'Driver baru: Ahmad Ridwan', time: '2 jam lalu', unread: false },
  ])
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    const stored = localStorage.getItem('temride_admin')
    if (stored) {
      try { setAdmin(JSON.parse(stored)) } catch {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('temride_admin')
    router.push('/login')
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center gap-4 shadow-sm z-10 flex-shrink-0">
      {/* Menu toggle */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 flex-shrink-0"
        aria-label="Toggle sidebar"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span className={`block h-0.5 bg-current transition-all duration-200 ${sidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block h-0.5 bg-current transition-all duration-200 ${sidebarOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 bg-current transition-all duration-200 ${sidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </div>
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-gray-700 truncate hidden sm:block">
          🏍️ TemRide Admin Platform
        </h2>
        <p className="text-xs text-gray-400 hidden md:block">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false) }}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm">Notifikasi</h3>
                <button onClick={markAllRead} className="text-xs text-[#1B3A6B] hover:underline">
                  Tandai semua dibaca
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${notif.unread ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {notif.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">{notif.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 text-center">
                <button className="text-xs text-[#1B3A6B] hover:underline">Lihat semua notifikasi</button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-[#1B3A6B] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-700 leading-none">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 mt-0.5">Super Admin</p>
            </div>
            <span className="text-gray-400 text-xs hidden md:block">▾</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{admin?.name}</p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <span>👤</span> Profil Saya
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <span>⚙️</span> Pengaturan
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <span>🚪</span> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {(dropdownOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setDropdownOpen(false); setNotifOpen(false) }}
        />
      )}
    </header>
  )
}
