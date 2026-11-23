import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { leadDocToCrmLead } from '@/lib/crm-leads'
import { mergeLeadIntoKeeper } from '@/lib/merge-leads'

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

    const { id: keeperId } = await params
    const { mergeLeadId } = await request.json()

    if (!mergeLeadId || typeof mergeLeadId !== 'string') {
      return NextResponse.json({ error: 'mergeLeadId is required' }, { status: 400 })
    }

    if (mergeLeadId === keeperId) {
      return NextResponse.json({ error: 'Cannot merge a lead with itself' }, { status: 400 })
    }

    await connectDB()

    const keeper = await Lead.findById(keeperId)
    const source = await Lead.findById(mergeLeadId)

    if (!keeper || !source) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const updated = await mergeLeadIntoKeeper(keeper, source)

    return NextResponse.json({
      lead: leadDocToCrmLead(updated),
      mergedLeadId: mergeLeadId,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('same email') || message.includes('itself') ? 400 : 500
    if (status === 500) {
      console.error('Merge leads error:', error)
    }
    return NextResponse.json({ error: message }, { status })
  }
}
