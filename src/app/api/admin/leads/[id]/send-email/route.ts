import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { leadDocToCrmLead, formatTimelineWhen } from '@/lib/crm-leads'
import { sendCustomEmail } from '@/lib/consultation-email'

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
    const body = await request.json().catch(() => ({}))
    const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
    const message = typeof body.body === 'string' ? body.body.trim() : ''

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    await connectDB()

    const lead = await Lead.findById(id)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const { emailSent, emailError } = await sendCustomEmail({
      to: lead.email,
      subject,
      body: message,
    })

    if (emailSent) {
      lead.timeline.push({
        icon: 'mail',
        text: `Email sent: ${subject}`,
        when: formatTimelineWhen(new Date()),
      })
      await lead.save()
    }

    return NextResponse.json({
      lead: leadDocToCrmLead(lead),
      emailSent,
      emailError,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Send lead email error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
