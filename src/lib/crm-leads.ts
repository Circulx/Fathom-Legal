import type { ILead } from '@/models/Lead'
import type { CrmLead } from '@/components/CRM/data'
import { DEFAULT_GOOGLE_MEET_LINK } from '@/lib/consultation-meet-link'

export function formatLeadAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatTimelineWhen(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function leadDocToCrmLead(doc: ILead | Record<string, unknown>): CrmLead {
  const lead = doc as ILead
  const createdAt = lead.createdAt ? new Date(lead.createdAt) : new Date()

  return {
    id: String(lead._id),
    first: lead.first,
    last: lead.last,
    email: lead.email,
    phone: lead.phone || '—',
    company: lead.company || '—',
    source: lead.source,
    areas: lead.areas?.length ? lead.areas : ['Corporate advisory'],
    matter: lead.matter || '—',
    date: lead.date || '—',
    time: lead.time || '—',
    consultationDateIso: lead.consultationDateIso || '',
    consultationTime24: lead.consultationTime24 || '',
    googleMeetLink:
      lead.googleMeetLink ||
      (lead.date && lead.date !== '—' ? DEFAULT_GOOGLE_MEET_LINK : ''),
    status: lead.status,
    ago: formatLeadAgo(createdAt),
    createdAt: createdAt.toISOString(),
    timeline: lead.timeline ?? [],
    actionables: lead.actionables ?? [],
  }
}
