'use client'

export default function StatCard({ icon, title, value, subtitle, change, changeType, color = 'blue' }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'bg-yellow-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'bg-indigo-100' },
  }
  const colors = colorMap[color] || colorMap.blue

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">{value ?? '-'}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          {change && (
            <div className="flex items-center gap-1 mt-1.5">
              <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-green-600' : changeType === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
              </span>
              <span className="text-xs text-gray-400">vs kemarin</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
