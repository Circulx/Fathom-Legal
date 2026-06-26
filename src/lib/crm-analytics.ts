import type { CrmLead } from '@/components/CRM/data'
import { PRACTICE_AREAS } from '@/components/CRM/data'
import type { AnalyticsDateRange } from '@/lib/crm-date-ranges'
import { filterLeadsByEnquiryDateRange } from '@/lib/crm-date-ranges'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export type MonthlyEnquiryBucket = {
  month: string
  value: number
  year: number
  monthIndex: number
}

function leadsInRange(leads: CrmLead[], range?: AnalyticsDateRange): CrmLead[] {
  return filterLeadsByEnquiryDateRange(leads, range)
}

export function computeSourceBreakdown(leads: CrmLead[]) {
  if (leads.length === 0) return []

  const counts = new Map<string, number>()
  for (const lead of leads) {
    counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      value: Math.round((count / leads.length) * 100),
    }))
    .sort((a, b) => b.value - a.value)
}

export function computePracticeAreaDemand(leads: CrmLead[], range?: AnalyticsDateRange) {
  const scoped = leadsInRange(leads, range)
  const counts = new Map<string, number>()
  for (const lead of scoped) {
    for (const area of lead.areas) {
      counts.set(area, (counts.get(area) ?? 0) + 1)
    }
  }

  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0)
  if (total === 0) {
    return PRACTICE_AREAS.map((area) => ({ area, pct: 0 }))
  }

  return PRACTICE_AREAS.map((area) => ({
    area,
    pct: Math.round(((counts.get(area) ?? 0) / total) * 100),
  }))
    .filter((item) => item.pct > 0)
    .sort((a, b) => b.pct - a.pct)
}

export function computeMonthlyEnquiries(
  leads: CrmLead[],
  range?: AnalyticsDateRange
): MonthlyEnquiryBucket[] {
  const scoped = leadsInRange(leads, range)
  const now = new Date()
  const rangeEnd = range?.to ?? now
  const rangeStart =
    range?.from ?? new Date(rangeEnd.getFullYear(), rangeEnd.getMonth() - 5, 1)

  const months: MonthlyEnquiryBucket[] = []
  const cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1)
  const endMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1)

  while (cursor <= endMonth) {
    months.push({
      month: MONTH_LABELS[cursor.getMonth()],
      year: cursor.getFullYear(),
      monthIndex: cursor.getMonth(),
      value: 0,
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  if (months.length === 0) {
    months.push({
      month: MONTH_LABELS[rangeEnd.getMonth()],
      year: rangeEnd.getFullYear(),
      monthIndex: rangeEnd.getMonth(),
      value: 0,
    })
  }

  for (const lead of scoped) {
    const created = new Date(lead.createdAt)
    const bucket = months.find(
      (m) => m.year === created.getFullYear() && m.monthIndex === created.getMonth()
    )
    if (bucket) bucket.value += 1
  }

  return months
}

export function computeConversionFunnel(leads: CrmLead[], range?: AnalyticsDateRange) {
  const scoped = leadsInRange(leads, range)
  const total = scoped.length
  if (total === 0) {
    return [
      { label: 'Enquiries', value: 0, pct: null },
      { label: 'Consultation booked', value: 0, pct: 0 },
      { label: 'Proposal sent', value: 0, pct: 0 },
      { label: 'Retained', value: 0, pct: 0 },
    ]
  }

  const booked = scoped.filter((l) =>
    ['booked', 'proposal', 'engagement', 'engaged', 'open', 'closed'].includes(l.status)
  ).length
  const proposal = scoped.filter((l) =>
    ['proposal', 'engagement', 'engaged', 'open', 'closed'].includes(l.status)
  ).length
  const retained = scoped.filter((l) =>
    ['engaged', 'open', 'closed'].includes(l.status)
  ).length

  const pct = (n: number) => Math.round((n / total) * 100)

  return [
    { label: 'Enquiries', value: total, pct: null },
    { label: 'Consultation booked', value: booked, pct: pct(booked) },
    { label: 'Proposal sent', value: proposal, pct: pct(proposal) },
    { label: 'Retained', value: retained, pct: pct(retained) },
  ]
}

export function computeCrmStats(leads: CrmLead[], range?: AnalyticsDateRange) {
  const scoped = leadsInRange(leads, range)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentLeads = scoped.filter((l) => new Date(l.createdAt).getTime() >= sevenDaysAgo)
  const consultationsScheduled = scoped.filter((l) => l.date !== '—')
  const consultationsHeld = scoped.filter((l) =>
    ['proposal', 'engagement', 'engaged', 'open', 'closed'].includes(l.status)
  )
  const retained = scoped.filter((l) => ['engaged', 'open', 'closed'].includes(l.status))
  const awaitingResponse = scoped.filter((l) =>
    ['prospect', 'booked', 'proposal', 'engagement'].includes(l.status)
  )
  const retainedRate = scoped.length
    ? Math.round((retained.length / scoped.length) * 100)
    : 0

  return {
    recentCount: recentLeads.length,
    consultationsScheduled: consultationsScheduled.length,
    consultationsHeld: consultationsHeld.length,
    retained: retained.length,
    awaitingResponse: awaitingResponse.length,
    engaged: scoped.filter((l) => l.status === 'engaged').length,
    open: scoped.filter((l) => l.status === 'open').length,
    closed: scoped.filter((l) => l.status === 'closed').length,
    retainedRate,
  }
}
