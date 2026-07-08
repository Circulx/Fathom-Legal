import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import InternalWorkAssociate from '@/models/InternalWorkAssociate'
import InternalWorkTask from '@/models/InternalWorkTask'
import {
  formatInternalWorkAssociate,
  formatInternalWorkTask,
  getNextTaskNumber,
} from '@/lib/internal-work-format'
import { isValidEmail } from '@/lib/assignee-emails'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

interface LegacyAssociate {
  id: string
  name: string
  role?: string
  email?: string
}

interface LegacyTask {
  id: number
  section: 'client' | 'admin'
  category: string
  title: string
  assignee?: string
  priority?: string
  due: string
  status?: string
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const [associateCount, taskCount] = await Promise.all([
      InternalWorkAssociate.countDocuments(),
      InternalWorkTask.countDocuments(),
    ])

    if (associateCount > 0 || taskCount > 0) {
      return NextResponse.json({ error: 'Database already has internal work data' }, { status: 409 })
    }

    const body = await request.json()
    const legacyAssociates = Array.isArray(body.associates) ? (body.associates as LegacyAssociate[]) : []
    const legacyTasks = Array.isArray(body.tasks) ? (body.tasks as LegacyTask[]) : []

    const idMap = new Map<string, string>()
    const createdAssociates = []

    for (const legacy of legacyAssociates) {
      const name = typeof legacy.name === 'string' ? legacy.name.trim() : ''
      if (!name) continue

      const email =
        typeof legacy.email === 'string' ? legacy.email.trim().toLowerCase() : ''
      if (email && !isValidEmail(email)) continue

      const associate = await InternalWorkAssociate.create({
        name,
        role:
          typeof legacy.role === 'string' && legacy.role.trim()
            ? legacy.role.trim()
            : 'Associate',
        email,
      })

      if (legacy.id) {
        idMap.set(legacy.id, String(associate._id))
      }
      createdAssociates.push(formatInternalWorkAssociate(associate))
    }

    let taskNumber = await getNextTaskNumber()
    const createdTasks = []

    for (const legacy of legacyTasks) {
      const title = typeof legacy.title === 'string' ? legacy.title.trim() : ''
      if (!title) continue

      const section = legacy.section === 'admin' ? 'admin' : 'client'
      const legacyAssignee = typeof legacy.assignee === 'string' ? legacy.assignee : ''
      const assignee = legacyAssignee ? idMap.get(legacyAssignee) ?? '' : ''

      const task = await InternalWorkTask.create({
        taskNumber,
        section,
        category: typeof legacy.category === 'string' ? legacy.category : '',
        title,
        assignee,
        priority:
          legacy.priority === 'high' || legacy.priority === 'low' ? legacy.priority : 'med',
        due: typeof legacy.due === 'string' ? legacy.due : new Date().toISOString().slice(0, 10),
        status:
          legacy.status === 'progress' ||
          legacy.status === 'blocked' ||
          legacy.status === 'done'
            ? legacy.status
            : 'todo',
        notes: typeof legacy.notes === 'string' ? legacy.notes : '',
      })

      taskNumber += 1
      createdTasks.push(formatInternalWorkTask(task))
    }

    return NextResponse.json({
      migrated: true,
      associates: createdAssociates,
      tasks: createdTasks,
    })
  } catch (error) {
    console.error('Migrate internal work error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
