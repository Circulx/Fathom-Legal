import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { isValidEmail } from '@/lib/assignee-emails'
import { buildInternalWorkDeepLink } from '@/lib/crm-deep-link'
import { sendInternalWorkUpdateEmail } from '@/lib/internal-work-update-email'

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
    const changes = Array.isArray(body.changes) ? body.changes : []

    if (!assigneeName || !taskTitle) {
      return NextResponse.json({ error: 'Assignee name and task title are required' }, { status: 400 })
    }
    if (!assigneeEmail || !isValidEmail(assigneeEmail)) {
      return NextResponse.json({ error: 'A valid assignee email is required' }, { status: 400 })
    }

    const normalizedChanges = changes
      .map((change: { field?: unknown; from?: unknown; to?: unknown }) => ({
        field: typeof change.field === 'string' ? change.field.trim() : '',
        from: typeof change.from === 'string' ? change.from.trim() : '',
        to: typeof change.to === 'string' ? change.to.trim() : '',
      }))
      .filter(
        (change: { field: string; from: string; to: string }) =>
          change.field && (change.from || change.to)
      )

    if (normalizedChanges.length === 0) {
      return NextResponse.json({ error: 'At least one change is required' }, { status: 400 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://fathomlegal.com'
    const dashboardUrl = buildInternalWorkDeepLink({ section, baseUrl })

    const result = await sendInternalWorkUpdateEmail({
      assigneeName,
      assigneeEmail,
      taskTitle,
      sectionLabel: SECTION_LABELS[section],
      changes: normalizedChanges,
      dashboardUrl,
    })

    if (!result.emailSent) {
      return NextResponse.json(
        { error: result.emailError || 'Failed to send update email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ emailSent: true })
  } catch (error) {
    console.error('Internal work notify-update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
