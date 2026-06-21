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

export const TEAM_MEMBERS = ['Ishita Sharma', 'Rahul Verma', 'Unassigned']

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
