import type { ILead } from '@/models/Lead'
import { formatTimelineWhen } from '@/lib/crm-leads'
import { sendConsultationConfirmationEmail } from '@/lib/consultation-email'
import { bookedSlotSessionId } from '@/lib/lead-consultation-schedule'
import { toTime24 } from '@/lib/time-format'

const DEFAULT_MEET_LINK = 'https://meet.google.com/wkd-evwz-dxw'

export function leadHasBookedConsultation(lead: ILead): boolean {
  return lead.date !== '—'
}

export async function sendLeadConsultationConfirmationEmail(lead: ILead) {
  const dateIso = lead.consultationDateIso?.trim()
  if (!dateIso) {
    throw new Error('This lead has no consultation date on file')
  }

  const time24 = lead.consultationTime24?.trim() || toTime24(lead.time)
  if (!time24) {
    throw new Error('This lead has no consultation time on file')
  }

  const meetLink = lead.googleMeetLink?.trim() || DEFAULT_MEET_LINK
  const matter =
    lead.matter && lead.matter !== '—'
      ? lead.matter
      : lead.areas?.join(', ') || 'Legal consultation'

  const { emailSent, emailError } = await sendConsultationConfirmationEmail({
    email: lead.email,
    firstName: lead.first,
    lastName: lead.last,
    selectedDate: dateIso,
    selectedTime: time24,
    googleMeetLink: meetLink,
    matter,
    sessionId: lead.intakeSessionId || bookedSlotSessionId(lead),
  })

  if (emailSent) {
    lead.timeline.push({
      icon: 'mail',
      text: 'Consultation confirmation emailed to client',
      when: formatTimelineWhen(new Date()),
    })
    await lead.save()
  }

  return { emailSent, emailError }
}
