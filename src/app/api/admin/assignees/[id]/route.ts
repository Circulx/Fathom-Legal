import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import CrmAssignee from '@/models/CrmAssignee'
import { formatAssigneeRecord, normalizeEmailList } from '@/lib/assignee-emails'

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
    const body = await request.json()
    const emails = normalizeEmailList(body.emails ?? body.email)

    await connectDB()

    const assignee = await CrmAssignee.findById(id)
    if (!assignee) {
      return NextResponse.json({ error: 'Assignee not found' }, { status: 404 })
    }

    assignee.emails = emails
    assignee.email = emails[0] || ''
    await assignee.save()

    return NextResponse.json({
      assignee: formatAssigneeRecord(assignee),
    })
  } catch (error) {
    console.error('Update assignee error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const deleted = await CrmAssignee.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Assignee not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete assignee error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
