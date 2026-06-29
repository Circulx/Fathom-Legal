import type { ILead } from '@/models/Lead'
import BookedSlot from '@/models/BookedSlot'
import IntakeSubmission from '@/models/IntakeSubmission'
import { formatConsultationDate, formatConsultationTime } from '@/lib/intake-to-lead'
import { DEFAULT_GOOGLE_MEET_LINK } from '@/lib/consultation-meet-link'

export { DEFAULT_GOOGLE_MEET_LINK as DEFAULT_MEET_LINK }

export function bookedSlotSessionId(lead: ILead): string {
  return lead.intakeSessionId || `crm_${String(lead._id)}`
}

export async function assertConsultationSlotAvailable(
  lead: ILead,
  dateIso: string,
  time24: string
): Promise<void> {
  const sessionId = bookedSlotSessionId(lead)
  const conflicting = await BookedSlot.findOne({
    date: dateIso,
    time: time24,
    sessionId: { $ne: sessionId },
  })
  if (conflicting) {
    throw new Error('This time slot is no longer available')
  }
}

export async function applyConsultationSchedule(
  lead: ILead,
  dateIso: string,
  time24: string
): Promise<{ displayDate: string; displayTime: string }> {
  await assertConsultationSlotAvailable(lead, dateIso, time24)

  const sessionId = bookedSlotSessionId(lead)
  const displayDate = formatConsultationDate(dateIso)
  const displayTime = formatConsultationTime(time24)
  const meetLink = lead.googleMeetLink?.trim() || DEFAULT_GOOGLE_MEET_LINK

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

  return { displayDate, displayTime }
}

export async function clearConsultationSchedule(lead: ILead): Promise<void> {
  const sessionId = bookedSlotSessionId(lead)
  await BookedSlot.deleteOne({ sessionId })

  if (lead.intakeSessionId) {
    await IntakeSubmission.findOneAndUpdate(
      { sessionId: lead.intakeSessionId },
      {
        selectedDate: '',
        selectedTime: '',
      }
    )
  }

  lead.date = '—'
  lead.time = '—'
  lead.consultationDateIso = ''
  lead.consultationTime24 = ''
}
