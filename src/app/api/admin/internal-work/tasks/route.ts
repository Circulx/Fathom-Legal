import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import InternalWorkTask from '@/models/InternalWorkTask'
import {
  formatInternalWorkTask,
  getNextTaskNumber,
} from '@/lib/internal-work-format'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

const VALID_SECTIONS = new Set(['client', 'admin'])
const VALID_PRIORITIES = new Set(['high', 'med', 'low'])
const VALID_STATUSES = new Set(['todo', 'progress', 'blocked', 'done'])

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const tasks = await InternalWorkTask.find()
      .sort({ taskNumber: 1 })
      .lean<
        {
          _id: unknown
          taskNumber: number
          section: 'client' | 'admin'
          category: string
          title: string
          assignee?: string | null
          priority: 'high' | 'med' | 'low'
          due: string
          status: 'todo' | 'progress' | 'blocked' | 'done'
          notes?: string | null
        }[]
      >()
    return NextResponse.json({
      tasks: tasks.map((doc) => formatInternalWorkTask(doc)),
    })
  } catch (error) {
    console.error('Get internal work tasks error:', error)
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
    const section = body.section === 'admin' ? 'admin' : 'client'
    const category = typeof body.category === 'string' ? body.category.trim() : ''
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const assignee = typeof body.assignee === 'string' ? body.assignee.trim() : ''
    const priority = VALID_PRIORITIES.has(body.priority) ? body.priority : 'med'
    const status = VALID_STATUSES.has(body.status) ? body.status : 'todo'
    const due = typeof body.due === 'string' ? body.due.trim() : ''
    const notes = typeof body.notes === 'string' ? body.notes.trim() : ''

    if (!VALID_SECTIONS.has(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!due) {
      return NextResponse.json({ error: 'Due date is required' }, { status: 400 })
    }

    await connectDB()

    const taskNumber = await getNextTaskNumber()
    const task = await InternalWorkTask.create({
      taskNumber,
      section,
      category,
      title,
      assignee,
      priority,
      due,
      status,
      notes,
    })

    return NextResponse.json({
      task: formatInternalWorkTask(task),
    })
  } catch (error) {
    console.error('Create internal work task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
