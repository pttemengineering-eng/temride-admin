import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export const formatRupiah = (value) => {
  if (typeof value === 'string' && value.startsWith('Rp')) return value
  const num = Number(value)
  if (isNaN(num)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}

export const formatRupiahShort = (value) => {
  const num = Number(value)
  if (isNaN(num)) return 'Rp 0'
  if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)}M`
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}Jt`
  if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}K`
  return `Rp ${num}`
}

export const formatDate = (dateStr) => {
  try {
    return format(typeof dateStr === 'string' ? parseISO(dateStr) : dateStr, 'dd MMM yyyy', { locale: idLocale })
  } catch {
    return dateStr
  }
}

export const formatDateTime = (dateStr) => {
  try {
    return format(typeof dateStr === 'string' ? parseISO(dateStr) : dateStr, 'dd MMM yyyy HH:mm', { locale: idLocale })
  } catch {
    return dateStr
  }
}

export const timeAgo = (dateStr) => {
  try {
    return formatDistanceToNow(typeof dateStr === 'string' ? parseISO(dateStr) : dateStr, { addSuffix: true, locale: idLocale })
  } catch {
    return dateStr
  }
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row =>
    Object.values(row).map(val =>
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(',')
  )
  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`
  link.click()
}

export const getStatusColor = (status) => {
  const map = {
    completed: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    ongoing: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    active: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    suspended: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    rejected: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    good: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    critical: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
  }
  return map[status] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
}

export const truncate = (str, len = 30) => {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '…' : str
}
