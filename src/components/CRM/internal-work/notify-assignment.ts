import type { InternalAssociate } from './types'

interface NotifyAssignmentParams {
  assignee: InternalAssociate
  taskTitle: string
  section: 'client' | 'admin'
  categoryLabel: string
  dueDate: string
  priority: string
}

export async function notifyInternalWorkAssignment({
  assignee,
  taskTitle,
  section,
  categoryLabel,
  dueDate,
  priority,
}: NotifyAssignmentParams): Promise<{ emailSent: boolean; error?: string }> {
  const email = assignee.email?.trim()
  if (!email) {
    return { emailSent: false }
  }

  try {
    const response = await fetch('/api/admin/internal-work/notify-assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assigneeName: assignee.name,
        assigneeEmail: email,
        taskTitle,
        section,
        categoryLabel,
        dueDate,
        priority,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return {
        emailSent: false,
        error: data.error || 'Failed to send assignment email',
      }
    }

    return { emailSent: true }
  } catch {
    return { emailSent: false, error: 'Failed to send assignment email' }
  }
}
