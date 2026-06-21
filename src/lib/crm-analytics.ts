import type { CrmLead } from '@/components/CRM/data'
import { PRACTICE_AREAS } from '@/components/CRM/data'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

export function computePracticeAreaDemand(leads: CrmLead[]) {
  const counts = new Map<string, number>()
  for (const lead of leads) {
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

export function computeMonthlyEnquiries(leads: CrmLead[]) {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { month: MONTH_LABELS[d.getMonth()], year: d.getFullYear(), monthIndex: d.getMonth(), value: 0 }
  })

  for (const lead of leads) {
    const created = new Date(lead.createdAt)
    const bucket = months.find(
      (m) => m.year === created.getFullYear() && m.monthIndex === created.getMonth()
    )
    if (bucket) bucket.value += 1
  }

  return months.map(({ month, value }) => ({ month, value }))
}

export function computeConversionFunnel(leads: CrmLead[]) {
  const total = leads.length
  if (total === 0) {
    return [
      { label: 'Enquiries', value: 0, pct: null },
      { label: 'Consultation booked', value: 0, pct: 0 },
      { label: 'Proposal sent', value: 0, pct: 0 },
      { label: 'Retained', value: 0, pct: 0 },
    ]
  }

  const booked = leads.filter((l) =>
    ['booked', 'proposal', 'engagement', 'engaged', 'open', 'closed'].includes(l.status)
  ).length
  const proposal = leads.filter((l) =>
    ['proposal', 'engagement', 'engaged', 'open', 'closed'].includes(l.status)
  ).length
  const retained = leads.filter((l) =>
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

export function computeCrmStats(leads: CrmLead[]) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentLeads = leads.filter((l) => new Date(l.createdAt).getTime() >= sevenDaysAgo)
  const consultationsScheduled = leads.filter((l) => l.date !== '—')
  const consultationsHeld = leads.filter((l) =>
    ['proposal', 'engagement', 'engaged', 'open', 'closed'].includes(l.status)
  )
  const retained = leads.filter((l) => ['engaged', 'open', 'closed'].includes(l.status))
  const awaitingResponse = leads.filter((l) =>
    ['prospect', 'booked', 'proposal', 'engagement'].includes(l.status)
  )
  const retainedRate = leads.length
    ? Math.round((retained.length / leads.length) * 100)
    : 0

  return {
    recentCount: recentLeads.length,
    consultationsScheduled: consultationsScheduled.length,
    consultationsHeld: consultationsHeld.length,
    retained: retained.length,
    awaitingResponse: awaitingResponse.length,
    engaged: leads.filter((l) => l.status === 'engaged').length,
    open: leads.filter((l) => l.status === 'open').length,
    closed: leads.filter((l) => l.status === 'closed').length,
    retainedRate,
  }
}
