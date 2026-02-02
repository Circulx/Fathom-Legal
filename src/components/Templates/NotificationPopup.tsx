'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface NotificationPopupProps {
  message: string
  onClose: () => void
  onViewCart: () => void
}

export default function NotificationPopup({
  message,
  onClose,
  onViewCart
}: NotificationPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4 animate-popup">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Success!</h3>
            <p className="text-sm sm:text-base text-gray-600">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
          >
            Continue Shopping
          </button>
          <button
            onClick={onViewCart}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  )
}
