'use client'

import { useEffect, useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import {
  ADMIN_IDLE_TIMEOUT_MS,
  ADMIN_LAST_ACTIVITY_KEY,
  clearAdminActivity,
  getAdminLastActivity,
  recordAdminActivity,
} from '@/lib/admin-idle-timeout'

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const
const ACTIVITY_THROTTLE_MS = 30_000
const CHECK_INTERVAL_MS = 60_000

export default function AdminIdleTimeout() {
  const { status } = useSession()
  const pathname = usePathname()
  const lastRecordedRef = useRef(0)
  const signingOutRef = useRef(false)

  const isProtectedAdmin =
    status === 'authenticated' &&
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login')

  useEffect(() => {
    if (!isProtectedAdmin) return

    recordAdminActivity()
    lastRecordedRef.current = Date.now()
    signingOutRef.current = false

    const signOutForIdle = () => {
      if (signingOutRef.current) return
      signingOutRef.current = true
      clearAdminActivity()
      void signOut({ callbackUrl: '/admin/login?reason=idle' })
    }

    const checkIdle = () => {
      if (Date.now() - getAdminLastActivity() >= ADMIN_IDLE_TIMEOUT_MS) {
        signOutForIdle()
      }
    }

    const onActivity = () => {
      const now = Date.now()
      if (now - lastRecordedRef.current < ACTIVITY_THROTTLE_MS) return
      lastRecordedRef.current = now
      recordAdminActivity(now)
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_LAST_ACTIVITY_KEY) {
        lastRecordedRef.current = Date.now()
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkIdle()
      }
    }

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true })
    }
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVisibilityChange)

    checkIdle()
    const interval = window.setInterval(checkIdle, CHECK_INTERVAL_MS)

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity)
      }
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.clearInterval(interval)
    }
  }, [isProtectedAdmin])

  return null
}
