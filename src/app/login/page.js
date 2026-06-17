"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Demo login bypass
      if (email === 'admin@temride.id' && password === 'admin123') {
        localStorage.setItem('temride_token', 'demo-token-12345');
        localStorage.setItem('temride_admin', JSON.stringify({ name: 'Admin TemRide', email }));
        router.push('/dashboard');
        return;
      }

      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      localStorage.setItem('temride_token', data.token);
      localStorage.setItem('temride_admin', JSON.stringify(data.admin));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B3A6B] to-[#0f2347]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B3A6B] px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F59E0B] rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">🏍️</span>
          </div>
          <h1 className="text-3xl font-bold text-white">TemRide</h1>
          <p className="text-blue-200 mt-1 text-sm">Admin Dashboard</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Selamat Datang</h2>
          <p className="text-gray-500 text-sm mb-6">Masuk ke panel administrasi TemRide</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@temride.id"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B3A6B] text-white py-3.5 rounded-lg font-semibold text-base hover:bg-[#152d54] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Memuat...
                </span>
              ) : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo: admin@temride.id / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
