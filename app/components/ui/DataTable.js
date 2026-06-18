'use client'

import { useState, useMemo } from 'react'

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = 'Tidak ada data',
  emptyIcon = '📭',
  onRowClick,
  striped = true,
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (!key) return
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = String(av).localeCompare(String(bv), 'id', { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {columns.map((col) => (
              <th
                key={col.key || col.label}
                className={`text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase select-none
                  ${col.sortable ? 'cursor-pointer hover:text-gray-600' : ''}
                  ${col.hidden ? 'hidden md:table-cell' : ''}
                  ${col.className || ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbo>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center text-gray-400">
                <div className="text-3xl mb-2 animate-spin inline-block">⟳</div>
                <p className="text-sm">Memuat data...</p>
              </td>
            </tr>
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center text-gray-400">
                <div className="text-4xl mb-2">{emptyIcon}</div>
                <p className="text-sm font-medium">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={row.id || i}
                className={`border-b border-gray-50 transition-colors
                  ${striped && i % 2 !== 0 ? 'bg-gray-50/30' : ''}
                  ${onRowClick ? 'cursor-pointer hover:bg-blue-50/30' : 'hover:bg-gray-50/50'}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.label}
                    className={`py-3 px-4 ${col.hidden ? 'hidden md:table-cell' : ''} ${col.tdClassName || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row, i) : (row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbo>
      </table>
    </div>
  )
}
