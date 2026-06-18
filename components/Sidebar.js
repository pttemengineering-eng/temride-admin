'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const menuItems = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard', exact: true },
  { icon: '📋', label: 'Orders', href: '/dashboard/orders' },
  { icon: '🛵', label: 'Drivers', href: '/dashboard/drivers', badge: 'kyc' },
  { icon: '📝', label: 'Pendaftaran Driver', href: '/dashboard/driver-applications', badge: 'reg' },
  { icon: '👤', label: 'Passengers', href: '/dashboard/passengers' },
  { icon: '📦', label: 'GoSend', href: '/dashboard/gosend' },
  { icon: '🍔', label: 'GoFood', href: '/dashboard/gofood' },
  { icon: '🏪', label: 'Restaurants', href: '/dashboard/restaurants' },
  { icon: '💰', label: 'Revenue', href: '/dashboard/revenue' },
  { icon: '🎟️', label: 'Vouchers', href: '/dashboard/vouchers' },
  { icon: '🗺️', label: 'Live Map', href: '/dashboard/livemap', badge: 'online' },
  { icon: '⚙️', label: 'Settings', href: '/dashboard/settings' },
]

export default function Sidebar({ onClose, isMobile }) {
  const pathname = usePathname()
  const [badges, setBadges] = useState({ online: 24, kyc: 7, reg: 0 })

  useEffect(() => {
    // Fetch pending registrations count
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://temride-backend-production.up.railway.app'}/api/driver-registration?status=PENDING&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data?.stats?.pending !== undefined) {
          setBadges(prev => ({ ...prev, reg: data.stats.pending }))
        }
      })
      .catch(() => {})
  }, [])

  const isActive = (href, exact) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="w-64 h-screen bg-[#1B3A6B] flex flex-col shadow-xl">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="TemRide"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-none">TemRide</h1>
            <p className="text-blue-300 text-xs mt-0.5">Admin Panel</p>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="ml-auto text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Menu Utama
        </p>
        <ul className="space-y-0.5">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive(item.href, item.exact)
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="text-lg w-6 text-center flex-shrink-0">{item.icon}</span>
                <span className="text-sm flex-1">{item.label}</span>
                {item.badge === 'online' && badges.online > 0 && (
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {badges.online}
                  </span>
                )}
                {item.badge === 'kyc' && badges.kyc > 0 && (
                  <span className="bg-[#F59E0B] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {badges.kyc}
                  </span>
                )}
                {item.badge === 'reg' && badges.reg > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {badges.reg}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
            Sistem
          </p>
          <div className="px-3 py-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs font-medium">Server Online</span>
            </div>
            <p className="text-blue-300 text-xs">v1.0.0 · TemRide Platform</p>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-blue-400 text-xs text-center">© 2024 TemRide</p>
      </div>
    </div>
  )
}
