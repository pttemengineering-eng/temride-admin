'use client'

const variants = {
  // Status
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
  suspended: 'bg-red-100 text-red-600',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  // Order status
  completed: 'bg-green-100 text-green-700',
  ongoing: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-blue-100 text-blue-700',
  accepted: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-red-100 text-red-600',
  // Generic
  online: 'bg-green-100 text-green-700',
  offline: 'bg-gray-100 text-gray-500',
  open: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-600',
  // KYC
  kyc_pending: 'bg-yellow-100 text-yellow-700',
  kyc_approved: 'bg-green-100 text-green-700',
  kyc_rejected: 'bg-red-100 text-red-600',
}

const labels = {
  active: 'Aktif',
  inactive: 'Nonaktif',
  suspended: 'Suspended',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Selesai',
  ongoing: 'Berlangsung',
  in_progress: 'Berlangsung',
  accepted: 'Diterima',
  cancelled: 'Dibatalkan',
  online: 'Online',
  offline: 'Offline',
  open: 'Buka',
  closed: 'Tutup',
  kyc_pending: 'KYC Pending',
  kyc_approved: 'KYC OK',
  kyc_rejected: 'KYC Tolak',
}

export default function Badge({ status, label, className = '' }) {
  const key = status?.toLowerCase?.() || ''
  const colorClass = variants[key] || 'bg-gray-100 text-gray-600'
  const displayLabel = label || labels[key] || status || '-'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass} ${className}`}>
      {displayLabel}
    </span>
  )
}
