import type { ILead } from '@/models/Lead'
import { formatTimelineWhen } from '@/lib/crm-leads'
import { sendRescheduleNotificationEmail } from '@/lib/consultation-email'
import {
  applyConsultationSchedule,
  bookedSlotSessionId,
} from '@/lib/lead-consultation-schedule'
import { DEFAULT_GOOGLE_MEET_LINK } from '@/lib/consultation-meet-link'

export interface RescheduleResult {
  lead: ILead
  emailSent: boolean
  emailError: string | null
}

export async function rescheduleLeadConsultation(
  lead: ILead,
  dateIso: string,
  time24: string
): Promise<RescheduleResult> {
  const previousDate = lead.date
  const previousTime = lead.time
  const now = new Date()

  lead.googleMeetLink = DEFAULT_GOOGLE_MEET_LINK
  const { displayDate, displayTime } = await applyConsultationSchedule(lead, dateIso, time24)

  lead.timeline.push({
    icon: 'calendar',
    text: `Consultation rescheduled to ${displayDate} at ${displayTime}`,
    when: formatTimelineWhen(now),
  })

  await lead.save()

  const meetLink = lead.googleMeetLink?.trim() || DEFAULT_GOOGLE_MEET_LINK
  const matter =
    lead.matter && lead.matter !== '—'
      ? lead.matter
      : lead.areas?.join(', ') || 'Legal consultation'

  const { emailSent, emailError } = await sendRescheduleNotificationEmail({
    email: lead.email,
    firstName: lead.first,
    lastName: lead.last,
    selectedDate: dateIso,
    selectedTime: displayTime,
    googleMeetLink: meetLink,
    matter,
    sessionId: lead.intakeSessionId || bookedSlotSessionId(lead),
    previousDate: previousDate !== '—' ? previousDate : undefined,
    previousTime: previousTime !== '—' ? previousTime : undefined,
  })

  if (emailSent) {
    lead.timeline.push({
      icon: 'mail',
      text: 'Reschedule notification emailed to client',
      when: formatTimelineWhen(new Date()),
    })
    await lead.save()
  }

  return { lead, emailSent, emailError }
}
