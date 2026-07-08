import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import InternalWorkTask from '@/models/InternalWorkTask'
import { formatInternalWorkTask } from '@/lib/internal-work-format'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

const VALID_PRIORITIES = new Set(['high', 'med', 'low'])
const VALID_STATUSES = new Set(['todo', 'progress', 'blocked', 'done'])

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

    await connectDB()

    const task = await InternalWorkTask.findById(id)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (body.section === 'client' || body.section === 'admin') {
      task.section = body.section
    }
    if (typeof body.category === 'string') task.category = body.category.trim()
    if (typeof body.title === 'string' && body.title.trim()) task.title = body.title.trim()
    if (body.assignee !== undefined) {
      task.assignee = typeof body.assignee === 'string' ? body.assignee.trim() : ''
    }
    if (VALID_PRIORITIES.has(body.priority)) task.priority = body.priority
    if (typeof body.due === 'string' && body.due.trim()) task.due = body.due.trim()
    if (VALID_STATUSES.has(body.status)) task.status = body.status
    if (typeof body.notes === 'string') task.notes = body.notes.trim()

    await task.save()

    return NextResponse.json({
      task: formatInternalWorkTask(task),
    })
  } catch (error) {
    console.error('Update internal work task error:', error)
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

    const deleted = await InternalWorkTask.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete internal work task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
