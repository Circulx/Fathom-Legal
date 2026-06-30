import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { formatTimelineWhen, leadDocToCrmLead, getActionableTimelineEntries, normalizeActionables } from '@/lib/crm-leads'
import { CRM_STATUSES, type CrmStatus } from '@/components/CRM/data'
import {
  applyConsultationSchedule,
  clearConsultationSchedule,
} from '@/lib/lead-consultation-schedule'

const VALID_STATUSES: CrmStatus[] = [
  'prospect',
  'booked',
  'proposal',
  'engagement',
  'engaged',
  'open',
  'closed',
]

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const lead = await Lead.findById(id)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const body = await request.json()
    const now = new Date()
    let detailsUpdated = false

    if (body.first !== undefined) {
      const first = body.first?.trim()
      if (!first) {
        return NextResponse.json({ error: 'First name is required' }, { status: 400 })
      }
      if (first !== lead.first) {
        lead.first = first
        detailsUpdated = true
      }
    }

    if (body.last !== undefined) {
      const last = body.last?.trim()
      if (!last) {
        return NextResponse.json({ error: 'Last name is required' }, { status: 400 })
      }
      if (last !== lead.last) {
        lead.last = last
        detailsUpdated = true
      }
    }

    if (body.email !== undefined) {
      const email = body.email?.trim().toLowerCase()
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRe.test(email)) {
        return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
      }
      if (email !== lead.email) {
        lead.email = email
        detailsUpdated = true
      }
    }

    if (body.phone !== undefined) {
      const phone = body.phone?.trim() || '—'
      if (phone !== lead.phone) {
        lead.phone = phone
        detailsUpdated = true
      }
    }

    if (body.company !== undefined) {
      const company = body.company?.trim() || '—'
      if (company !== lead.company) {
        lead.company = company
        detailsUpdated = true
      }
    }

    if (body.source !== undefined) {
      const source = body.source?.trim()
      if (!source) {
        return NextResponse.json({ error: 'Source is required' }, { status: 400 })
      }
      if (source !== lead.source) {
        lead.source = source
        detailsUpdated = true
      }
    }

    if (body.areas !== undefined) {
      const areas =
        Array.isArray(body.areas) && body.areas.length > 0
          ? body.areas.map((a: string) => a.trim()).filter(Boolean)
          : ['Corporate advisory']
      const prev = JSON.stringify(lead.areas)
      const next = JSON.stringify(areas)
      if (prev !== next) {
        lead.areas = areas
        detailsUpdated = true
      }
    }

    if (body.matter !== undefined) {
      const matter = body.matter?.trim() || '—'
      if (matter !== lead.matter) {
        lead.matter = matter
        detailsUpdated = true
      }
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      if (body.status !== lead.status) {
        lead.status = body.status
        lead.timeline.push({
          icon: 'check',
          text: `Status changed to "${CRM_STATUSES[body.status as CrmStatus]}"`,
          when: formatTimelineWhen(now),
        })
      }
    }

    if (typeof body.note === 'string' && body.note.trim()) {
      lead.timeline.push({
        icon: 'file',
        text: body.note.trim(),
        when: formatTimelineWhen(now),
      })
    }

    if (body.actionables !== undefined) {
      const previousActionables = normalizeActionables([...(lead.actionables ?? [])])
      const nextActionables = normalizeActionables(body.actionables)
      const timelineEntries = getActionableTimelineEntries(
        previousActionables,
        nextActionables,
        now
      )
      for (const entry of timelineEntries) {
        lead.timeline.push(entry)
      }
      lead.actionables = nextActionables
      lead.markModified('actionables')
      if (timelineEntries.length > 0) {
        lead.markModified('timeline')
      }
    }

    let consultationTimelineAdded = false

    if (body.clearConsultation === true) {
      const hadConsultation =
        lead.date !== '—' || lead.consultationDateIso || lead.consultationTime24
      if (hadConsultation) {
        await clearConsultationSchedule(lead)
        detailsUpdated = true
        consultationTimelineAdded = true
        lead.timeline.push({
          icon: 'calendar',
          text: 'Consultation removed',
          when: formatTimelineWhen(now),
        })
      }
    } else if (body.consultationDateIso !== undefined && body.consultationTime24 !== undefined) {
      const dateIso = body.consultationDateIso?.trim() || ''
      const time24 = body.consultationTime24?.trim() || ''
      if (dateIso && time24) {
        const scheduleChanged =
          dateIso !== lead.consultationDateIso || time24 !== lead.consultationTime24
        if (scheduleChanged) {
          const { displayDate, displayTime } = await applyConsultationSchedule(
            lead,
            dateIso,
            time24
          )
          detailsUpdated = true
          consultationTimelineAdded = true
          lead.timeline.push({
            icon: 'calendar',
            text: `Consultation set to ${displayDate} at ${displayTime}`,
            when: formatTimelineWhen(now),
          })
        }
      }
    } else if (body.date !== undefined || body.time !== undefined) {
      // Legacy display-only updates (avoid when using consultationDateIso)
      if (body.date !== undefined) {
        const date = body.date?.trim() || '—'
        if (date !== lead.date) {
          lead.date = date
          detailsUpdated = true
        }
      }

      if (body.time !== undefined) {
        const time = body.time?.trim() || '—'
        if (time !== lead.time) {
          lead.time = time
          detailsUpdated = true
        }
      }
    }

    if (detailsUpdated && !consultationTimelineAdded) {
      lead.timeline.push({
        icon: 'file',
        text: 'Lead details updated',
        when: formatTimelineWhen(now),
      })
    }

    await lead.save()

    return NextResponse.json({ lead: leadDocToCrmLead(lead) })
  } catch (error) {
    if (error instanceof Error && error.message === 'This time slot is no longer available') {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error('Update lead error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const lead = await Lead.findByIdAndDelete(id)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete lead error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
