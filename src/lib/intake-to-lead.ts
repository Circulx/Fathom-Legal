import type { IIntakeSubmission } from '@/models/IntakeSubmission'
import type { ILead } from '@/models/Lead'
import Lead from '@/models/Lead'
import { LEAD_SOURCE_OPTIONS } from '@/components/CRM/data'
import { formatTimelineWhen } from '@/lib/crm-leads'

const SERVICE_ID_TO_AREA: Record<string, string> = {
  corporate: 'Corporate advisory',
  startup: 'Startup & funding',
  web3: 'Web3 & blockchain',
  contract: 'Contract review',
  dispute: 'Dispute resolution',
  ip: 'Intellectual property',
}

function mapServicesToAreas(services: string[] = []): string[] {
  const areas = services
    .map((id) => SERVICE_ID_TO_AREA[id] ?? id)
    .filter(Boolean)
  return areas.length > 0 ? areas : ['Corporate advisory']
}

function mapHeardAboutToSource(heardAbout?: string): string {
  if (!heardAbout?.trim()) return 'Client intake form'
  const normalized = heardAbout.trim().toLowerCase()
  const match = LEAD_SOURCE_OPTIONS.find(
    (option) => option.toLowerCase() === normalized
  )
  return match ?? heardAbout.trim()
}

export function formatConsultationDate(isoDate?: string): string {
  if (!isoDate || isoDate === '—') return '—'
  const d = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function buildMatter(submission: IIntakeSubmission): string {
  if (submission.matterDescription?.trim()) {
    return submission.matterDescription.trim()
  }
  if (submission.customNeeds?.trim()) {
    return submission.customNeeds.trim()
  }
  const areas = mapServicesToAreas(submission.selectedServices)
  return areas.join(', ')
}

export async function syncLeadFromIntake(
  submission: IIntakeSubmission
): Promise<ILead | null> {
  const first = submission.firstName?.trim()
  const last = submission.lastName?.trim()
  const email = (submission.confirmedEmail || submission.email)?.trim().toLowerCase()

  if (!first || !last || !email) {
    console.warn('Intake submission missing contact fields; skipping CRM lead sync', {
      sessionId: submission.sessionId,
    })
    return null
  }

  const now = new Date()
  const date = formatConsultationDate(submission.selectedDate)
  const time = submission.selectedTime?.trim() || '—'
  const areas = mapServicesToAreas(submission.selectedServices)
  const matter = buildMatter(submission)
  const source = mapHeardAboutToSource(submission.heardAbout)

  const existing = await Lead.findOne({ intakeSessionId: submission.sessionId })

  if (existing) {
    existing.first = first
    existing.last = last
    existing.email = email
    existing.phone = submission.phone?.trim() || '—'
    existing.company = submission.company?.trim() || '—'
    existing.source = source
    existing.areas = areas
    existing.matter = matter
    existing.date = date
    existing.time = time
    existing.status = 'booked'
    await existing.save()
    return existing
  }

  return Lead.create({
    intakeSessionId: submission.sessionId,
    first,
    last,
    email,
    phone: submission.phone?.trim() || '—',
    company: submission.company?.trim() || '—',
    source,
    areas,
    matter,
    date,
    time,
    status: 'booked',
    timeline: [
      {
        icon: 'inbox',
        text: 'Enquiry submitted via client intake',
        when: formatTimelineWhen(submission.createdAt ?? now),
      },
      {
        icon: 'calendar',
        text: 'Consultation scheduled via client intake',
        when: formatTimelineWhen(now),
      },
    ],
    actionables: [],
  })
}
