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

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const assignees = await CrmAssignee.find().sort({ name: 1 }).lean()

    return NextResponse.json({
      assignees: assignees.map((assignee) => formatAssigneeRecord(assignee)),
    })
  } catch (error) {
    console.error('Get assignees error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const emails = normalizeEmailList(body.emails ?? body.email)
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (name.toLowerCase() === 'unassigned') {
      return NextResponse.json({ error: 'This name is reserved' }, { status: 400 })
    }

    await connectDB()

    const existing = await CrmAssignee.findOne({
      name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    })
    if (existing) {
      return NextResponse.json({ error: 'Assignee already exists' }, { status: 409 })
    }

    const assignee = await CrmAssignee.create({
      name,
      emails,
      email: emails[0] || '',
    })

    return NextResponse.json({
      assignee: formatAssigneeRecord(assignee),
    })
  } catch (error) {
    console.error('Create assignee error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
