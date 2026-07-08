import type { TaskSection } from './types'

export const CLIENT_CATEGORIES: Record<string, { label: string; className: string }> = {
  drafting: { label: 'Drafting', className: 'text-[#7a1322] bg-[#f6ecee] border-[#7a1322]' },
  filing: { label: 'Filing', className: 'text-[#4C5F6B] bg-[#E1E7E9] border-[#4C5F6B]' },
  comms: { label: 'Client Comms', className: 'text-[#4B6650] bg-[#E2E9DF] border-[#4B6650]' },
  diligence: { label: 'Due Diligence', className: 'text-[#94702C] bg-[#F1E6CD] border-[#94702C]' },
}

export const ADMIN_CATEGORIES: Record<string, { label: string; className: string }> = {
  linkedin: { label: 'LinkedIn & Content', className: 'text-[#4C5F6B] bg-[#E1E7E9] border-[#4C5F6B]' },
  outreach: { label: 'Business Development', className: 'text-[#7a1322] bg-[#f6ecee] border-[#7a1322]' },
  research: { label: 'Research', className: 'text-[#4B6650] bg-[#E2E9DF] border-[#4B6650]' },
  study: { label: 'Study / CPD', className: 'text-[#94702C] bg-[#F1E6CD] border-[#94702C]' },
  marketing: { label: 'Marketing', className: 'text-[#6E4C8C] bg-[#EAE2F1] border-[#6E4C8C]' },
  ops: { label: 'Firm Ops', className: 'text-[#736c63] bg-[#EDE7DA] border-[#736c63]' },
}

export const SECTION_CATEGORIES: Record<TaskSection, Record<string, { label: string; className: string }>> = {
  client: CLIENT_CATEGORIES,
  admin: ADMIN_CATEGORIES,
}

export const BOARD_STATUSES = [
  { key: 'todo' as const, label: 'To Do', dot: '#736c63' },
  { key: 'progress' as const, label: 'In Progress', dot: '#94702C' },
  { key: 'blocked' as const, label: 'Blocked', dot: '#8C3B3B' },
  { key: 'done' as const, label: 'Done', dot: '#4B6650' },
]

export const FILTER_STATUSES = [
  { key: '', label: 'All' },
  { key: 'todo', label: 'To Do' },
  { key: 'progress', label: 'In Progress' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'done', label: 'Done' },
]

export const STATUS_LABEL: Record<string, string> = {
  todo: 'To Do',
  progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
}

export const STATUS_PILL_CLASS: Record<string, string> = {
  todo: 'bg-[#EDE7DA] text-[#736c63]',
  progress: 'bg-[#f6ecee] text-[#7a1322]',
  blocked: 'bg-[#F1DEDC] text-[#8C3B3B]',
  done: 'bg-[#E2E9DF] text-[#4B6650]',
}
