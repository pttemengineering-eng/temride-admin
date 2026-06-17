"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { icon: '🏠', label: 'Dashboard', href: '/dashboard', exact: true },
  { icon: '🗺️', label: 'Live Map', href: '/dashboard/map' },
  { icon: '🏍️', label: 'Drivers', href: '/dashboard/drivers' },
  { icon: '📦', label: 'Orders', href: '/dashboard/orders' },
  { icon: '💰', label: 'Revenue', href: '/dashboard/revenue' },
  { icon: '⚡', label: 'Vouchers', href: '/dashboard/vouchers' },
  { icon: '🎟️', label: 'Promo', href: '/dashboard/promo' },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState({ name: 'Admin TemRide', email: 'admin@temride.id' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('temride_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    try {
      const stored = localStorage.getItem('temride_admin');
      if (stored) setAdmin(JSON.parse(stored));
    } catch {}
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('temride_token');
    localStorage.removeItem('temride_admin');
    router.replace('/login');
  };

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#1B3A6B] flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-blue-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F59E0B] rounded-xl flex items-center justify-center text-xl shadow">
              🏍️
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">TemRide</h1>
              <p className="text-blue-300 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scroll">
          <p className="text-blue-300/60 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
            Menu Utama
          </p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(item)
                      ? 'bg-[#F59E0B] text-[#1B3A6B] shadow-md'
                      : 'text-blue-100 hover:bg-blue-700/40 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive(item) && (
                    <span className="ml-auto w-1.5 h-1.5 bg-[#1B3A6B] rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-blue-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#1B3A6B] font-bold text-sm flex-shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-blue-300 text-xs truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
          >
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              ☰
            </button>
            <div>
              <h2 className="text-gray-800 font-semibold text-base">
                {menuItems.find((m) => isActive(m))?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-400 text-xs hidden sm:block">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 hidden sm:inline">Sistem Online</span>
            <div className="w-8 h-8 bg-[#1B3A6B] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
