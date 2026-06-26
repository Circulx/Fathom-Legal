import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { formatTimelineWhen, leadDocToCrmLead } from '@/lib/crm-leads'
import type { CrmStatus } from '@/components/CRM/data'
import { applyConsultationSchedule } from '@/lib/lead-consultation-schedule'

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

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const leads = await Lead.find().sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      leads: leads.map((lead) => leadDocToCrmLead(lead)),
    })
  } catch (error) {
    console.error('Get leads error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const first = body.first?.trim()
    const last = body.last?.trim()
    const email = body.email?.trim()
    const phone = body.phone?.trim() || '—'
    const company = body.company?.trim() || '—'
    const source = body.source?.trim() || 'Walk-in / phone'
    const status = body.status as CrmStatus
    const areas = Array.isArray(body.areas) && body.areas.length > 0
      ? body.areas
      : ['Corporate advisory']
    const matter = body.matter?.trim() || '—'
    const consultationDateIso = body.consultationDateIso?.trim() || ''
    const consultationTime24 = body.consultationTime24?.trim() || ''

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!first || !last || !emailRe.test(email)) {
      return NextResponse.json(
        { error: 'First name, last name, and a valid email are required' },
        { status: 400 }
      )
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const resolvedStatus = status || 'prospect'

    if (resolvedStatus === 'booked' && (!consultationDateIso || !consultationTime24)) {
      return NextResponse.json(
        { error: 'Consultation date and time are required when status is booked' },
        { status: 400 }
      )
    }

    if (consultationDateIso && !consultationTime24) {
      return NextResponse.json(
        { error: 'Consultation time is required when a date is provided' },
        { status: 400 }
      )
    }

    const now = new Date()
    const lead = await Lead.create({
      first,
      last,
      email: email.toLowerCase(),
      phone,
      company,
      source,
      status: resolvedStatus,
      areas,
      matter,
      date: '—',
      time: '—',
      timeline: [
        {
          icon: 'inbox',
          text: 'Prospect added manually',
          when: formatTimelineWhen(now),
        },
      ],
      actionables: [],
    })

    if (consultationDateIso && consultationTime24) {
      const { displayDate, displayTime } = await applyConsultationSchedule(
        lead,
        consultationDateIso,
        consultationTime24
      )
      lead.timeline.push({
        icon: 'calendar',
        text: `Consultation set to ${displayDate} at ${displayTime}`,
        when: formatTimelineWhen(now),
      })
      await lead.save()
    }

    return NextResponse.json(
      { lead: leadDocToCrmLead(lead) },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'This time slot is no longer available') {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error('Create lead error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
