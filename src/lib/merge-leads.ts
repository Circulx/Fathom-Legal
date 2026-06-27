import type { ILead, LeadStatus } from '@/models/Lead'
import BookedSlot from '@/models/BookedSlot'
import { formatTimelineWhen } from '@/lib/crm-leads'
import {
  applyConsultationSchedule,
  bookedSlotSessionId,
  clearConsultationSchedule,
} from '@/lib/lead-consultation-schedule'

const STATUS_RANK: Record<LeadStatus, number> = {
  prospect: 0,
  booked: 1,
  proposal: 2,
  engagement: 3,
  engaged: 4,
  open: 5,
  closed: 6,
}

function pickRicherString(keeper: string, incoming: string): string {
  const a = keeper?.trim() || '—'
  const b = incoming?.trim() || '—'
  if (a === '—' && b !== '—') return b
  if (b === '—') return a
  return a.length >= b.length ? a : b
}

function unionAreas(keeper: string[], incoming: string[]): string[] {
  return Array.from(new Set([...keeper, ...incoming].filter(Boolean)))
}

function hasConsultation(lead: ILead): boolean {
  return lead.date !== '—' || Boolean(lead.consultationDateIso?.trim())
}

export async function mergeLeadIntoKeeper(
  keeper: ILead,
  source: ILead
): Promise<ILead> {
  if (String(keeper._id) === String(source._id)) {
    throw new Error('Cannot merge a lead with itself')
  }

  if (normalizeEmail(keeper.email) !== normalizeEmail(source.email)) {
    throw new Error('Leads must share the same email to merge')
  }

  const now = new Date()
  const sourceName = `${source.first} ${source.last}`.trim()

  keeper.phone = pickRicherString(keeper.phone, source.phone)
  keeper.company = pickRicherString(keeper.company, source.company)
  keeper.matter = pickRicherString(keeper.matter, source.matter)
  keeper.areas = unionAreas(keeper.areas ?? [], source.areas ?? [])

  if (keeper.source === 'Other' && source.source && source.source !== 'Other') {
    keeper.source = source.source
  }

  if (STATUS_RANK[source.status] > STATUS_RANK[keeper.status]) {
    keeper.status = source.status
  }

  if (!keeper.intakeSessionId && source.intakeSessionId) {
    keeper.intakeSessionId = source.intakeSessionId
  }

  const keeperHasConsult = hasConsultation(keeper)
  const sourceHasConsult = hasConsultation(source)

  if (!keeperHasConsult && sourceHasConsult && source.consultationDateIso && source.consultationTime24) {
    const sourceSessionId = bookedSlotSessionId(source)
    await BookedSlot.deleteOne({ sessionId: sourceSessionId })
    await applyConsultationSchedule(
      keeper,
      source.consultationDateIso,
      source.consultationTime24
    )
    if (source.googleMeetLink?.trim() && !keeper.googleMeetLink?.trim()) {
      keeper.googleMeetLink = source.googleMeetLink.trim()
    }
  } else if (sourceHasConsult) {
    await BookedSlot.deleteOne({ sessionId: bookedSlotSessionId(source) })
    if (!keeperHasConsult) {
      await clearConsultationSchedule(keeper)
    }
  }

  const mergedActionables = [
    ...(keeper.actionables ?? []),
    ...(source.actionables ?? []).map((task) => ({
      ...task,
      id: `merged_${task.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    })),
  ]

  const mergedTimeline = [
    ...(keeper.timeline ?? []),
    {
      icon: 'users',
      text: `Merged duplicate record for ${sourceName}`,
      when: formatTimelineWhen(now),
    },
    ...(source.timeline ?? []).map((item) => ({
      ...item,
      text: `[Merged] ${item.text}`,
    })),
  ]

  keeper.actionables = mergedActionables
  keeper.timeline = mergedTimeline

  if (source.createdAt && keeper.createdAt && source.createdAt < keeper.createdAt) {
    keeper.createdAt = source.createdAt
  }

  await keeper.save()
  await source.deleteOne()

  return keeper
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
