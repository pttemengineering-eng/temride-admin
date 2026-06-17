'use client'

import { useState } from 'react'
import Link from 'next/link'

const kycConfig = {
  approved: { label: 'Approved', bg: 'bg-green-100', text: 'text-green-700' },
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  rejected: { label: 'Ditolak', bg: 'bg-red-100', text: 'text-red-700' },
}

const creditConfig = {
  good: { label: 'Baik', bg: 'bg-green-100', text: 'text-green-700' },
  warning: { label: 'Peringatan', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  critical: { label: 'Kritis', bg: 'bg-red-100', text: 'text-red-700' },
}

export default function DriversTable({ drivers, onApproveKYC, onSuspend, onActivate }) {
  const [confirmModal, setConfirmModal] = useState(null)

  const handleAction = (action, driver) => {
    setConfirmModal({ action, driver })
  }

  const executeAction = () => {
    if (!confirmModal) return
    const { action, driver } = confirmModal
    if (action === 'approve' && onApproveKYC) onApproveKYC(driver.id)
    if (action === 'suspend' && onSuspend) onSuspend(driver.id)
    if (action === 'activate' && onActivate) onActivate(driver.id)
    setConfirmModal(null)
  }

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <span key={star} className={`text-xs ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  )

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">No HP</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Plat Motor</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">KYC</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Rating</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Total Trip</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Earnings/Bulan</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Kredit</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, idx) => {
              const kyc = kycConfig[driver.kycStatus] || kycConfig.pending
              const credit = creditConfig[driver.creditStatus] || creditConfig.good
              return (
                <tr
                  key={driver.id}
                  className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1B3A6B] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {driver.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{driver.name}</p>
                        <p className={`text-xs font-medium ${driver.status === 'active' ? 'text-green-600' : driver.status === 'suspended' ? 'text-red-500' : 'text-gray-400'}`}>
                          {driver.status === 'active' ? '● Aktif' : driver.status === 'suspended' ? '● Suspended' : '● Tidak Aktif'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-gray-600 text-xs">{driver.phone}</span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{driver.plate}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${kyc.bg} ${kyc.text}`}>
                      {kyc.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <StarRating rating={driver.rating} />
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="font-medium text-gray-700">{driver.totalTrips?.toLocaleString('id-ID')} trip</span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="font-medium text-gray-700">{driver.monthlyEarnings}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${credit.bg} ${credit.text}`}>
                      {credit.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {driver.kycStatus === 'pending' && (
                        <button
                          onClick={() => handleAction('approve', driver)}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors font-medium"
                        >
                          Approve KYC
                        </button>
                      )}
                      {driver.status === 'active' ? (
                        <button
                          onClick={() => handleAction('suspend', driver)}
                          className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors font-medium"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction('activate', driver)}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors font-medium"
                        >
                          Aktifkan
                        </button>
                      )}
                      <Link
                        href={`/dashboard/drivers/${driver.id}`}
                        className="text-xs px-2 py-1 bg-[#1B3A6B]/10 text-[#1B3A6B] rounded hover:bg-[#1B3A6B]/20 transition-colors font-medium"
                      >
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">
                {confirmModal.action === 'approve' ? '✅' : confirmModal.action === 'suspend' ? '⛔' : '✔️'}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {confirmModal.action === 'approve' ? 'Approve KYC Driver?' :
                 confirmModal.action === 'suspend' ? 'Suspend Driver?' : 'Aktifkan Driver?'}
              </h3>
              <p className="text-gray-500 text-sm">
                Driver: <span className="font-semibold text-gray-700">{confirmModal.driver.name}</span>
              </p>
              {confirmModal.action === 'approve' && (
                <p className="text-xs text-gray-400 mt-2">
                  Dokumen KYC driver ini akan disetujui dan driver dapat mulai beroperasi.
                </p>
              )}
              {confirmModal.action === 'suspend' && (
                <p className="text-xs text-red-400 mt-2">
                  Driver tidak akan bisa menerima order setelah disuspend.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={executeAction}
                className={`flex-1 py-2.5 text-white rounded-lg text-sm font-semibold transition-colors ${
                  confirmModal.action === 'suspend' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1B3A6B] hover:bg-[#142D52]'
                }`}
              >
                {confirmModal.action === 'approve' ? 'Ya, Approve' :
                 confirmModal.action === 'suspend' ? 'Ya, Suspend' : 'Ya, Aktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
