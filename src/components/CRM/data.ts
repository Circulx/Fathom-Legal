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
  engagement: 'Letter of engagement',
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
  id: number
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
  timeline: CrmTimelineItem[]
  actionables: CrmActionable[]
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

export const CRM_LEADS: CrmLead[] = [
  {
    id: 1,
    first: 'Aarav',
    last: 'Mehta',
    email: 'aarav.mehta@novabyte.io',
    phone: '+91 98201 44321',
    company: 'NovaByte Labs',
    source: 'Google search',
    areas: ['Web3 & blockchain', 'Corporate advisory'],
    matter:
      'We are launching a DeFi lending protocol and need clarity on token classification and compliance under Indian regulations before our mainnet launch.',
    date: 'Tue, Jun 17',
    time: '10:00 AM',
    status: 'booked',
    ago: '2h ago',
    timeline: [
      { icon: 'inbox', text: 'Enquiry submitted via website', when: 'Jun 15, 9:12 AM' },
      { icon: 'phone', text: 'Called — left voicemail', when: 'Jun 15, 2:40 PM' },
      { icon: 'calendar', text: 'Consultation booked for Jun 17', when: 'Jun 15, 4:05 PM' },
    ],
    actionables: [
      {
        id: 'a1-1',
        text: 'Review token whitepaper before consultation',
        completed: true,
        assignee: 'Ishita Sharma',
      },
      {
        id: 'a1-2',
        text: 'Draft token classification memo',
        completed: true,
        assignee: 'Rahul Verma',
      },
      {
        id: 'a1-3',
        text: 'Prepare compliance checklist for consultation',
        completed: true,
        assignee: 'Ishita Sharma',
      },
      {
        id: 'a1-4',
        text: 'Send pre-consultation questionnaire',
        completed: false,
        assignee: 'Unassigned',
      },
    ],
  },
  {
    id: 2,
    first: 'Priya',
    last: 'Nair',
    email: 'priya@craftory.co',
    phone: '+91 99876 11203',
    company: 'Craftory',
    source: 'Referral',
    areas: ['Startup & funding'],
    matter:
      'Seed round closing next month. Need help reviewing the SHA and term sheet from our lead investor, plus cap table advice.',
    date: 'Wed, Jun 18',
    time: '2:30 PM',
    status: 'proposal',
    ago: '5h ago',
    timeline: [
      { icon: 'inbox', text: 'Enquiry submitted via website', when: 'Jun 14, 11:30 AM' },
      { icon: 'calendar', text: 'Consultation held', when: 'Jun 16, 2:30 PM' },
      { icon: 'file', text: 'Proposal & engagement letter sent', when: 'Jun 16, 6:00 PM' },
    ],
    actionables: [],
  },
  {
    id: 3,
    first: 'Rohan',
    last: 'Kapoor',
    email: 'rohan.kapoor@gmail.com',
    phone: '+91 98100 55678',
    company: '—',
    source: 'LinkedIn',
    areas: ['Dispute resolution'],
    matter:
      'Former employer is withholding my final settlement and ESOP payout. Looking for help recovering dues and exploring arbitration.',
    date: '—',
    time: '—',
    status: 'prospect',
    ago: '1d ago',
    timeline: [{ icon: 'inbox', text: 'Enquiry submitted via website', when: 'Jun 15, 8:45 PM' }],
    actionables: [],
  },
  {
    id: 4,
    first: 'Sara',
    last: 'Khan',
    email: 'sara@meridianhealth.in',
    phone: '+91 97654 33210',
    company: 'Meridian Health',
    source: 'Google search',
    areas: ['Contract review', 'Corporate advisory'],
    matter:
      'Need a master services agreement drafted for our B2B hospital software, plus a data processing addendum compliant with DPDP Act.',
    date: 'Thu, Jun 19',
    time: '11:00 AM',
    status: 'booked',
    ago: '1d ago',
    timeline: [
      { icon: 'inbox', text: 'Enquiry submitted via website', when: 'Jun 14, 3:20 PM' },
      { icon: 'mail', text: 'Intro email sent', when: 'Jun 14, 5:00 PM' },
      { icon: 'calendar', text: 'Consultation booked for Jun 19', when: 'Jun 15, 10:15 AM' },
    ],
    actionables: [],
  },
  {
    id: 5,
    first: 'Vikram',
    last: 'Desai',
    email: 'vikram@desaiventures.com',
    phone: '+91 90040 99887',
    company: 'Desai Ventures',
    source: 'Referral',
    areas: ['Intellectual property'],
    matter:
      'Want to file trademarks for three brand names across classes, and understand patent options for a hardware product.',
    date: '—',
    time: '—',
    status: 'prospect',
    ago: '2d ago',
    timeline: [
      { icon: 'inbox', text: 'Enquiry submitted via website', when: 'Jun 13, 1:10 PM' },
      { icon: 'phone', text: 'Spoke on call — sending availability', when: 'Jun 14, 11:00 AM' },
    ],
    actionables: [],
  },
  {
    id: 6,
    first: 'Ananya',
    last: 'Iyer',
    email: 'ananya.iyer@stitchlabs.in',
    phone: '+91 98455 77654',
    company: 'Stitch Labs',
    source: 'Lawctopus / SuperLawyer',
    areas: ['Startup & funding', 'Web3 & blockchain'],
    matter:
      'Building an NFT-based loyalty platform. Need incorporation advice and a regulatory opinion on our token rewards model.',
    date: 'Fri, Jun 20',
    time: '3:00 PM',
    status: 'engaged',
    ago: '3d ago',
    timeline: [
      { icon: 'inbox', text: 'Enquiry submitted via website', when: 'Jun 12, 10:00 AM' },
      { icon: 'calendar', text: 'Consultation held', when: 'Jun 13, 3:00 PM' },
      { icon: 'file', text: 'Engagement letter signed', when: 'Jun 14, 12:30 PM' },
      { icon: 'check', text: 'Client retained — matter opened', when: 'Jun 14, 1:00 PM' },
    ],
    actionables: [],
  },
]

export const LEAD_SOURCES = [
  { name: 'Google search', value: 38 },
  { name: 'Referral', value: 27 },
  { name: 'LinkedIn', value: 19 },
  { name: 'Lawctopus / SuperLawyer', value: 11 },
  { name: 'Social media', value: 5 },
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
