/**
 * StatsCard Component
 * Displays a metric card with icon, label, value, and percent change
 */
export default function StatsCard({ icon, label, value, change, positive, color = 'blue', subtitle }) {
  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>

        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
        )}

        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1.5">
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${
              positive ? 'text-green-600' : 'text-red-500'
            }`}>
              <span>{positive ? '▲' : '▼'}</span>
              <span>{change}</span>
            </span>
            <span className="text-xs text-gray-400">dari kemarin</span>
          </div>
        )}
      </div>
    </div>
  );
}
