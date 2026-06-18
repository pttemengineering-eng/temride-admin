/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', 'temride-backend-production.up.railway.app'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://temride-backend-production.up.railway.app',
  },
}
module.exports = nextConfig
