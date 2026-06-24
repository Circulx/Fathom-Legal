import type { ILead } from '@/models/Lead'
import BookedSlot from '@/models/BookedSlot'
import IntakeSubmission from '@/models/IntakeSubmission'
import { formatConsultationDate, formatConsultationTime } from '@/lib/intake-to-lead'
import { formatTimelineWhen } from '@/lib/crm-leads'

import { sendRescheduleNotificationEmail } from '@/lib/consultation-email'

const DEFAULT_MEET_LINK = 'https://meet.google.com/wkd-evwz-dxw'

function bookedSlotSessionId(lead: ILead): string {
  return lead.intakeSessionId || `crm_${String(lead._id)}`
}

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
  const sessionId = bookedSlotSessionId(lead)

  const conflicting = await BookedSlot.findOne({
    date: dateIso,
    time: time24,
    sessionId: { $ne: sessionId },
  })
  if (conflicting) {
    throw new Error('This time slot is no longer available')
  }

  const previousDate = lead.date
  const previousTime = lead.time
  const displayDate = formatConsultationDate(dateIso)
  const displayTime = formatConsultationTime(time24)
  const meetLink = lead.googleMeetLink?.trim() || DEFAULT_MEET_LINK
  const now = new Date()

  await BookedSlot.findOneAndUpdate(
    { sessionId },
    {
      date: dateIso,
      time: time24,
      email: lead.email,
      firstName: lead.first,
      lastName: lead.last,
      sessionId,
      googleMeetLink: meetLink,
      services: [],
    },
    { upsert: true, new: true }
  )

  if (lead.intakeSessionId) {
    await IntakeSubmission.findOneAndUpdate(
      { sessionId: lead.intakeSessionId },
      {
        selectedDate: dateIso,
        selectedTime: time24,
        googleMeetLink: meetLink,
      }
    )
  }

  lead.date = displayDate
  lead.time = displayTime
  lead.consultationDateIso = dateIso
  lead.consultationTime24 = time24
  if (!lead.googleMeetLink) {
    lead.googleMeetLink = meetLink
  }
  if (lead.status === 'prospect') {
    lead.status = 'booked'
  }

  lead.timeline.push({
    icon: 'calendar',
    text: `Consultation rescheduled to ${displayDate} at ${displayTime}`,
    when: formatTimelineWhen(now),
  })

  await lead.save()

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
    sessionId: lead.intakeSessionId || sessionId,
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
