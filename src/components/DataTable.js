/**
 * DataTable Component
 * Reusable table with headers, rows, loading state, and empty state
 *
 * Props:
 *   columns: [{ key, label, render?, className? }]
 *   data: array of row objects
 *   loading: boolean
 *   emptyIcon: string (emoji)
 *   emptyText: string
 *   keyField: string (default 'id')
 *   onRowClick: function(row)
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyIcon = '📋',
  emptyText = 'Tidak ada data ditemukan',
  keyField = 'id',
  onRowClick,
}) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide ${col.headerClass || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t border-slate-50">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-full max-w-32"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide ${col.headerClass || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="py-16 text-center text-gray-400">
                <p className="text-5xl mb-3">{emptyIcon}</p>
                <p className="text-base font-medium">{emptyText}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide ${col.headerClass || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((row, rowIndex) => (
            <tr
              key={row[keyField] ?? rowIndex}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 ${col.className || ''}`}
                >
                  {col.render
                    ? col.render(row[col.key], row, rowIndex)
                    : (row[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
