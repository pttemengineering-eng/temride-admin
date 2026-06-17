'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'

const formatRupiah = (value) => {
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}K`
  return `Rp ${value}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-800">
              {entry.name === 'Revenue' ? formatRupiah(entry.value) : entry.value.toLocaleString('id-ID')}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function RevenueChart({ data, title = 'Revenue 7 Hari Terakhir', height = 300 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Bar = Revenue · Line = Jumlah Order</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#1B3A6B]"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <span className="text-gray-600">Order</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="revenue"
            orientation="left"
            tickFormatter={formatRupiah}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
            width={65}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="revenue"
            dataKey="revenue"
            name="Revenue"
            fill="#1B3A6B"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
          <Line
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            name="Order"
            stroke="#F59E0B"
            strokeWidth={2.5}
            dot={{ fill: '#F59E0B', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
