import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { isValidEmail } from '@/lib/assignee-emails'
import { buildInternalWorkDeepLink } from '@/lib/crm-deep-link'
import { sendInternalWorkAssignmentEmail } from '@/lib/internal-work-assignment-email'

const PRIORITY_LABELS: Record<string, string> = {
  high: 'High',
  med: 'Medium',
  low: 'Low',
}

const SECTION_LABELS: Record<string, string> = {
  client: 'Client Deliverables',
  admin: 'Practice & Firm Work',
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const assigneeName = typeof body.assigneeName === 'string' ? body.assigneeName.trim() : ''
    const assigneeEmail = typeof body.assigneeEmail === 'string' ? body.assigneeEmail.trim().toLowerCase() : ''
    const taskTitle = typeof body.taskTitle === 'string' ? body.taskTitle.trim() : ''
    const section = body.section === 'admin' ? 'admin' : 'client'
    const categoryLabel =
      typeof body.categoryLabel === 'string' && body.categoryLabel.trim()
        ? body.categoryLabel.trim()
        : '—'
    const dueDate = typeof body.dueDate === 'string' && body.dueDate.trim() ? body.dueDate.trim() : '—'
    const priority = typeof body.priority === 'string' ? body.priority : 'med'

    if (!assigneeName || !taskTitle) {
      return NextResponse.json({ error: 'Assignee name and task title are required' }, { status: 400 })
    }
    if (!assigneeEmail || !isValidEmail(assigneeEmail)) {
      return NextResponse.json({ error: 'A valid assignee email is required' }, { status: 400 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://fathomlegal.com'
    const dashboardUrl = buildInternalWorkDeepLink({ section, baseUrl })

    const result = await sendInternalWorkAssignmentEmail({
      assigneeName,
      assigneeEmail,
      taskTitle,
      sectionLabel: SECTION_LABELS[section],
      categoryLabel,
      dueDate,
      priorityLabel: PRIORITY_LABELS[priority] ?? priority,
      dashboardUrl,
    })

    if (!result.emailSent) {
      return NextResponse.json(
        { error: result.emailError || 'Failed to send assignment email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ emailSent: true })
  } catch (error) {
    console.error('Internal work notify-assignment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
