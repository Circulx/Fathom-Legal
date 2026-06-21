import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { formatTimelineWhen, leadDocToCrmLead } from '@/lib/crm-leads'
import { CRM_STATUSES, type CrmStatus } from '@/components/CRM/data'

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
      lead.actionables = body.actionables
    }

    if (body.date !== undefined) {
      lead.date = body.date
    }

    if (body.time !== undefined) {
      lead.time = body.time
    }

    await lead.save()

    return NextResponse.json({ lead: leadDocToCrmLead(lead) })
  } catch (error) {
    console.error('Update lead error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
