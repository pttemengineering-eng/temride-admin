/**
 * Format angka ke format Rupiah Indonesia
 * @param {number} number
 * @returns {string}
 */
export function formatRupiah(number) {
  if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date
 * @param {object} options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const defaultOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  };

  return d.toLocaleDateString('id-ID', defaultOptions);
}

/**
 * Format datetime lengkap
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format waktu relatif (misal: 5 menit lalu)
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTimeAgo(date) {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'Baru saja';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  return `${Math.floor(seconds / 86400)} hari lalu`;
}

/**
 * Dapatkan class CSS untuk status badge
 * @param {string} status
 * @returns {string}
 */
export function getStatusColor(status) {
  const map = {
    COMPLETED: 'badge-completed',
    PENDING: 'badge-pending',
    CANCELLED: 'badge-cancelled',
    APPROVED: 'badge-approved',
    SUSPENDED: 'badge-suspended',
    ACTIVE: 'badge-active',
    ON_GOING: 'bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full',
    REJECTED: 'bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full',
  };
  return map[status] || 'bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full';
}

/**
 * Dapatkan label Indonesia untuk status
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status) {
  const map = {
    COMPLETED: 'Selesai',
    PENDING: 'Menunggu',
    CANCELLED: 'Dibatalkan',
    APPROVED: 'Disetujui',
    SUSPENDED: 'Disuspend',
    ACTIVE: 'Aktif',
    ON_GOING: 'Berlangsung',
    REJECTED: 'Ditolak',
  };
  return map[status] || status;
}

/**
 * Gabungkan class names (utility)
 * @param  {...string} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Truncate string
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export function truncate(str, length = 30) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

/**
 * Debounce function
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
