import type { CrmLead } from '@/components/CRM/data'
import { parseTimeToMinutes } from '@/lib/time-format'
import { toDateKey } from '@/lib/booking-calendar'

export { parseTimeToMinutes } from '@/lib/time-format'

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

export function parseDisplayDate(dateStr: string): { month: number; day: number } | null {
  if (dateStr === '—') return null
  const match = dateStr.match(/^[A-Za-z]{3},\s+([A-Za-z]{3})\s+(\d+)$/)
  if (!match) return null
  const month = MONTH_MAP[match[1]]
  if (month === undefined) return null
  return { month, day: parseInt(match[2], 10) }
}

/** Resolve a lead's consultation date, preferring ISO when stored. */
export function getLeadConsultationDate(lead: CrmLead, nearDate: Date): Date | null {
  if (lead.consultationDateIso) {
    const d = new Date(`${lead.consultationDateIso}T12:00:00`)
    if (!Number.isNaN(d.getTime())) return d
  }

  const parsed = parseDisplayDate(lead.date)
  if (!parsed) return null

  const refYear = nearDate.getFullYear()
  const candidates = [refYear - 1, refYear, refYear + 1].map(
    (year) => new Date(year, parsed.month, parsed.day)
  )

  return candidates.reduce<Date | null>((best, candidate) => {
    if (!best) return candidate
    const bestDiff = Math.abs(best.getTime() - nearDate.getTime())
    const candDiff = Math.abs(candidate.getTime() - nearDate.getTime())
    return candDiff < bestDiff ? candidate : best
  }, null)
}

export function leadConsultationMatchesDay(lead: CrmLead, calendarDay: Date): boolean {
  if (lead.date === '—') return false
  const leadDate = getLeadConsultationDate(lead, calendarDay)
  if (!leadDate) return false
  return (
    leadDate.getFullYear() === calendarDay.getFullYear() &&
    leadDate.getMonth() === calendarDay.getMonth() &&
    leadDate.getDate() === calendarDay.getDate()
  )
}

export function getLeadConsultationDateKey(
  lead: CrmLead,
  nearDate: Date = new Date()
): string | null {
  if (lead.consultationDateIso) return lead.consultationDateIso
  const resolved = getLeadConsultationDate(lead, nearDate)
  return resolved ? toDateKey(resolved) : null
}

export function groupLeadsByConsultationDate(
  leads: CrmLead[],
  referenceDate: Date = new Date()
): Map<string, CrmLead[]> {
  const map = new Map<string, CrmLead[]>()

  for (const lead of leads) {
    if (lead.date === '—') continue
    const key = getLeadConsultationDateKey(lead, referenceDate)
    if (!key) continue
    const list = map.get(key) ?? []
    list.push(lead)
    map.set(key, list)
  }

  for (const list of map.values()) {
    list.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time))
  }

  return map
}

export function compareLeadConsultationDates(
  a: CrmLead,
  b: CrmLead,
  nearDate: Date = new Date()
): number {
  const dateA = getLeadConsultationDate(a, nearDate)
  const dateB = getLeadConsultationDate(b, nearDate)
  if (!dateA && !dateB) return 0
  if (!dateA) return 1
  if (!dateB) return -1
  const timeDiff = dateA.getTime() - dateB.getTime()
  if (timeDiff !== 0) return timeDiff
  return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
}
