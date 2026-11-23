import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { leadDocToCrmLead } from '@/lib/crm-leads'
import { rescheduleLeadConsultation } from '@/lib/reschedule-consultation'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const date = body.date?.trim()
    const time = body.time?.trim()

    if (!date || !time) {
      return NextResponse.json(
        { error: 'Date and time are required' },
        { status: 400 }
      )
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    if (!/^\d{1,2}:\d{2}$/.test(time)) {
      return NextResponse.json({ error: 'Invalid time format' }, { status: 400 })
    }

    await connectDB()

    const lead = await Lead.findById(id)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const { lead: updated, emailSent, emailError } = await rescheduleLeadConsultation(
      lead,
      date,
      time
    )

    return NextResponse.json({
      lead: leadDocToCrmLead(updated),
      emailSent,
      emailError,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('no longer available') ? 409 : 500
    if (status === 500) {
      console.error('Reschedule lead error:', error)
    }
    return NextResponse.json({ error: message }, { status })
  }
}
