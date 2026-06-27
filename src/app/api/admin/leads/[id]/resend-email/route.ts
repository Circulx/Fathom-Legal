import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { leadDocToCrmLead } from '@/lib/crm-leads'
import {
  leadHasBookedConsultation,
  sendLeadConsultationConfirmationEmail,
} from '@/lib/send-lead-confirmation-email'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

export async function POST(
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

    const lead = await Lead.findById(id)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    if (!leadHasBookedConsultation(lead)) {
      return NextResponse.json(
        { error: 'This lead does not have a scheduled consultation' },
        { status: 400 }
      )
    }

    const { emailSent, emailError } = await sendLeadConsultationConfirmationEmail(lead)

    return NextResponse.json({
      lead: leadDocToCrmLead(lead),
      emailSent,
      emailError,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Resend lead email error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
