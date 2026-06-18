'use client'

import { useState } from 'react'

const statusConfig = {
  completed: { label: 'Selesai', bg: 'bg-green-100', text: 'text-green-700' },
  ongoing: { label: 'Berlangsung', bg: 'bg-blue-100', text: 'text-blue-700' },
  cancelled: { label: 'Dibatalkan', bg: 'bg-red-100', text: 'text-red-700' },
  pending: { label: 'Menunggu', bg: 'bg-yellow-100', text: 'text-yellow-700' },
}

export default function OrdersTable({ orders, showPagination = false, onViewDetail }) {
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleView = (order) => {
    setSelectedOrder(order)
    if (onViewDetail) onViewDetail(order)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Penumpang</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Driver</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Rute</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fare</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Waktu</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbo>
            {orders.map((order, idx) => {
              const s = statusConfig[order.status] || statusConfig.pending
              return (
                <tr
                  key={order.id}
                  className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                >
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      #{order.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#1B3A6B] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {order.passenger?.charAt(0) || 'P'}
                      </div>
                      <span className="font-medium text-gray-700 truncate max-w-[100px]">{order.passenger}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-gray-600 truncate max-w-[100px] block">{order.driver}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="text-xs text-gray-500 max-w-[160px]">
                      <p className="truncate">📍 {order.from}</p>
                      <p className="truncate">🏁 {order.to}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-800 text-sm">{order.fare}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-xs text-gray-400">{order.time}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleView(order)}
                      className="text-[#1B3A6B] hover:underline text-xs font-semibold"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbo>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Detail Order #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Penumpang</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.passenger}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Driver</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.driver}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Titik Jemput</p>
                  <p className="font-medium text-gray-700">{selectedOrder.from}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tujuan</p>
                  <p className="font-medium text-gray-700">{selectedOrder.to}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Fare</p>
                  <p className="text-xl font-bold text-[#1B3A6B]">{selectedOrder.fare}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.text}`}>
                    {statusConfig[selectedOrder.status]?.label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Waktu</p>
                  <p className="font-medium text-gray-700">{selectedOrder.time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  <p className="font-medium text-gray-700">{selectedOrder.payment || 'Cash'}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#142D52] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
