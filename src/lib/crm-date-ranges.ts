import { toDateKey } from '@/lib/booking-calendar'

export type AnalyticsDatePreset = '7d' | '30d' | '90d' | '6m' | 'ytd' | 'all' | 'custom'

export interface AnalyticsDateRange {
  from?: Date
  to?: Date
}

export function isoDateRangeLastNDays(days: number): { dateFrom: string; dateTo: string } {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - (days - 1))
  return { dateFrom: toDateKey(from), dateTo: toDateKey(to) }
}

export function monthIsoDateRange(year: number, monthIndex: number): { dateFrom: string; dateTo: string } {
  const from = new Date(year, monthIndex, 1)
  const to = new Date(year, monthIndex + 1, 0)
  return { dateFrom: toDateKey(from), dateTo: toDateKey(to) }
}

export function resolveAnalyticsDateRange(
  preset: AnalyticsDatePreset,
  customFrom?: string,
  customTo?: string
): AnalyticsDateRange {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  if (preset === 'all') return {}

  if (preset === 'custom') {
    const from = customFrom ? new Date(`${customFrom}T00:00:00`) : undefined
    const to = customTo ? new Date(`${customTo}T23:59:59.999`) : undefined
    return { from, to }
  }

  const start = new Date(end)
  if (preset === '7d') start.setDate(start.getDate() - 6)
  else if (preset === '30d') start.setDate(start.getDate() - 29)
  else if (preset === '90d') start.setDate(start.getDate() - 89)
  else if (preset === '6m') start.setMonth(start.getMonth() - 5, 1)
  else if (preset === 'ytd') {
    start.setMonth(0, 1)
  }
  start.setHours(0, 0, 0, 0)
  return { from: start, to: end }
}

export function filterLeadsByEnquiryDateRange<T extends { createdAt: string }>(
  leads: T[],
  range?: AnalyticsDateRange
): T[] {
  if (!range?.from && !range?.to) return leads
  return leads.filter((lead) => {
    const created = new Date(lead.createdAt)
    if (range.from && created.getTime() < range.from.getTime()) return false
    if (range.to && created.getTime() > range.to.getTime()) return false
    return true
  })
}

export function formatAnalyticsRangeLabel(preset: AnalyticsDatePreset): string {
  const labels: Record<AnalyticsDatePreset, string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '6m': 'Last 6 months',
    ytd: 'This year',
    all: 'All time',
    custom: 'Custom range',
  }
  return labels[preset]
}
