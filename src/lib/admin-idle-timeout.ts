export const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000
export const ADMIN_LAST_ACTIVITY_KEY = 'fathom-admin-last-activity'

export function recordAdminActivity(timestamp = Date.now()) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(timestamp))
}

export function getAdminLastActivity(): number {
  if (typeof window === 'undefined') return Date.now()
  const stored = window.localStorage.getItem(ADMIN_LAST_ACTIVITY_KEY)
  if (!stored) return Date.now()
  const parsed = Number.parseInt(stored, 10)
  return Number.isFinite(parsed) ? parsed : Date.now()
}

export function clearAdminActivity() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ADMIN_LAST_ACTIVITY_KEY)
}
