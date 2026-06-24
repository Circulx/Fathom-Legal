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
