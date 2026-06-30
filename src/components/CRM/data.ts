export type CrmStatus =
  | 'prospect'
  | 'booked'
  | 'proposal'
  | 'engagement'
  | 'engaged'
  | 'open'
  | 'closed'

export const CRM_STATUSES: Record<CrmStatus, string> = {
  prospect: 'Prospect',
  booked: 'Consultation booked',
  proposal: 'Proposal sent',
  engagement: 'LOE',
  engaged: 'Engaged',
  open: 'Open',
  closed: 'Closed',
}

export interface CrmTimelineItem {
  icon: string
  text: string
  when: string
}

export interface CrmActionable {
  id: string
  text: string
  completed: boolean
  assignee: string
  completedAt?: string
}

export const UNASSIGNED_ASSIGNEE = 'Unassigned'

export type CrmAssigneeRecord = { id: string; name: string }

export interface CrmLead {
  id: string
  first: string
  last: string
  email: string
  phone: string
  company: string
  source: string
  areas: string[]
  matter: string
  date: string
  time: string
  consultationDateIso?: string
  consultationTime24?: string
  googleMeetLink?: string
  status: CrmStatus
  ago: string
  createdAt: string
  timeline: CrmTimelineItem[]
  actionables: CrmActionable[]
}

export type LeadPatch = {
  status?: CrmStatus
  note?: string
  actionables?: CrmActionable[]
  first?: string
  last?: string
  email?: string
  phone?: string
  company?: string
  source?: string
  areas?: string[]
  matter?: string
  date?: string
  time?: string
  consultationDateIso?: string
  consultationTime24?: string
  clearConsultation?: boolean
}

export const PRACTICE_AREAS = [
  'Corporate advisory',
  'Startup & funding',
  'Web3 & blockchain',
  'Contract review',
  'Dispute resolution',
  'Intellectual property',
]

export const LEAD_SOURCE_OPTIONS = [
  'Referral',
  'Google search',
  'LinkedIn',
  'Social media',
  'Lawctopus / SuperLawyer',
  'Walk-in / phone',
  'Other',
]

export function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase()
}

export function normalizeStatus(status: string): CrmStatus {
  if (status in CRM_STATUSES) {
    return status as CrmStatus
  }
  return 'prospect'
}

export function filterLeadsBySearch(leads: CrmLead[], query: string): CrmLead[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return leads

  const terms = trimmed.split(/\s+/).filter(Boolean)

  return leads.filter((lead) => {
    const haystack = [
      lead.first,
      lead.last,
      `${lead.first} ${lead.last}`,
      lead.email,
      lead.phone,
      lead.company,
      lead.source,
      lead.matter,
      lead.date,
      lead.time,
      ...lead.areas,
      CRM_STATUSES[lead.status],
    ]
      .join(' ')
      .toLowerCase()

    return terms.every((term) => haystack.includes(term))
  })
}

export type LeadDateRangeField = 'enquiry' | 'consultation'

export type StatusFilter = 'all' | CrmStatus

export interface LeadListFilters {
  status?: StatusFilter
  statuses?: CrmStatus[]
  source?: string
  assignee?: string
  practiceArea?: string
  dateFrom?: string
  dateTo?: string
  dateField?: LeadDateRangeField
  search?: string
}

export const AWAITING_RESPONSE_STATUSES: CrmStatus[] = [
  'prospect',
  'booked',
  'proposal',
  'engagement',
]

export const RETAINED_STATUSES: CrmStatus[] = ['engaged', 'open', 'closed']

export const CONSULTATION_BOOKED_STATUSES: CrmStatus[] = [
  'booked',
  'proposal',
  'engagement',
  'engaged',
  'open',
  'closed',
]

export const PROPOSAL_SENT_STATUSES: CrmStatus[] = [
  'proposal',
  'engagement',
  'engaged',
  'open',
  'closed',
]

function dateInRange(date: Date | null, from?: string, to?: string): boolean {
  if (!date) return false
  if (!from && !to) return true
  const time = date.getTime()
  if (from) {
    const fromStart = new Date(`${from}T00:00:00`).getTime()
    if (time < fromStart) return false
  }
  if (to) {
    const toEnd = new Date(`${to}T23:59:59.999`).getTime()
    if (time > toEnd) return false
  }
  return true
}

export function leadMatchesAssigneeFilter(lead: CrmLead, assignee: string): boolean {
  if (assignee === 'all') return true
  if (assignee === 'unassigned') {
    return (
      lead.actionables.length === 0 ||
      lead.actionables.every(
        (task) => !task.assignee || task.assignee === UNASSIGNED_ASSIGNEE
      )
    )
  }
  const target = assignee.toLowerCase()
  return lead.actionables.some((task) => task.assignee.toLowerCase() === target)
}

export function filterLeads(leads: CrmLead[], filters: LeadListFilters): CrmLead[] {
  let result = leads

  if (filters.statuses && filters.statuses.length > 0) {
    const allowed = new Set(filters.statuses)
    result = result.filter((lead) => allowed.has(lead.status))
  } else if (filters.status && filters.status !== 'all') {
    result = result.filter((lead) => lead.status === filters.status)
  }

  if (filters.practiceArea && filters.practiceArea !== 'all') {
    result = result.filter((lead) => lead.areas.includes(filters.practiceArea!))
  }

  if (filters.source && filters.source !== 'all') {
    result = result.filter((lead) => lead.source === filters.source)
  }

  if (filters.assignee && filters.assignee !== 'all') {
    result = result.filter((lead) => leadMatchesAssigneeFilter(lead, filters.assignee!))
  }

  if (filters.dateFrom || filters.dateTo) {
    const field = filters.dateField ?? 'enquiry'
    result = result.filter((lead) => {
      const date =
        field === 'consultation'
          ? lead.consultationDateIso
            ? new Date(`${lead.consultationDateIso}T12:00:00`)
            : null
          : new Date(lead.createdAt)
      return dateInRange(date, filters.dateFrom, filters.dateTo)
    })
  }

  if (filters.search?.trim()) {
    result = filterLeadsBySearch(result, filters.search)
  }

  return result
}

export function collectLeadSourceOptions(leads: CrmLead[]): string[] {
  const sources = new Set(LEAD_SOURCE_OPTIONS)
  for (const lead of leads) {
    if (lead.source?.trim()) sources.add(lead.source.trim())
  }
  return Array.from(sources).sort((a, b) => a.localeCompare(b))
}

/** Merge official assignees and task assignees, deduplicating by case-insensitive name. */
export function collectAssigneeNames(
  officialNames: string[],
  taskActionables: CrmActionable[] = []
): string[] {
  const canonical = new Map<string, string>()

  const add = (raw: string) => {
    const name = raw.trim()
    if (!name || name === UNASSIGNED_ASSIGNEE) return
    const key = name.toLowerCase()
    if (!canonical.has(key)) canonical.set(key, name)
  }

  for (const name of officialNames) add(name)
  for (const task of taskActionables) add(task.assignee)

  return Array.from(canonical.values()).sort((a, b) => a.localeCompare(b))
}
