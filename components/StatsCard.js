'use client'

export default function StatsCard({ icon, title, value, change, changeType, subtitle, color = 'blue' }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
          )}
          {change !== undefined && change !== null && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-green-600' : changeType === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '→'} {change}
              </span>
              <span className="text-xs text-gray-400">vs kemarin</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${c.bg} ${c.border} border rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ml-3`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
