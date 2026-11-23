'use client'

import type { ReactNode } from 'react'
import { useInternalWork } from './InternalWorkContext'

export function InternalWorkLoadingGate({ children }: { children: ReactNode }) {
  const { loading, error, refresh } = useInternalWork()

  if (loading) {
    return (
      <div className="py-20 text-center text-[#736c63] text-sm">Loading internal work…</div>
    )
  }

  if (error) {
    return (
      <div className="py-16 text-center px-4">
        <p className="text-[#8C3B3B] mb-4 text-sm">{error}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="px-4 py-2 rounded-[6px] bg-[#7a1322] text-white text-[13px] font-semibold"
        >
          Retry
        </button>
      </div>
    )
  }

  return <>{children}</>
}
