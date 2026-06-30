import type { ILead, ILeadActionable } from '@/models/Lead'
import type { CrmLead } from '@/components/CRM/data'
import { UNASSIGNED_ASSIGNEE } from '@/components/CRM/data'

const DEFAULT_MEET_LINK = 'https://meet.google.com/wkd-evwz-dxw'

export function formatLeadAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatTimelineWhen(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
}

export function getActionableTimelineEntries(
  previous: ILeadActionable[],
  next: ILeadActionable[],
  fallbackWhen: Date
): CrmLead['timeline'] {
  const entries: CrmLead['timeline'] = []
  const prevById = new Map(
    previous.map((task) => [
      task.id,
      {
        id: String(task.id),
        text: String(task.text),
        completed: Boolean(task.completed),
        assignee: String(task.assignee ?? 'Unassigned'),
        completedAt: task.completedAt ? String(task.completedAt) : '',
      },
    ])
  )

  for (const rawTask of next) {
    const task = {
      id: String(rawTask.id),
      text: String(rawTask.text),
      completed: Boolean(rawTask.completed),
      assignee: String(rawTask.assignee ?? 'Unassigned'),
      completedAt: rawTask.completedAt ? String(rawTask.completedAt) : '',
    }
    const old = prevById.get(task.id)
    if (!old) {
      entries.push({
        icon: 'file',
        text: `Task added: ${task.text}`,
        when: formatTimelineWhen(fallbackWhen),
      })
      continue
    }

    if (!old.completed && task.completed) {
      const completedAt = task.completedAt ? new Date(task.completedAt) : fallbackWhen
      entries.push({
        icon: 'check',
        text: `Task completed: ${task.text}`,
        when: formatTimelineWhen(
          Number.isNaN(completedAt.getTime()) ? fallbackWhen : completedAt
        ),
      })
    } else if (old.completed && !task.completed) {
      entries.push({
        icon: 'file',
        text: `Task reopened: ${task.text}`,
        when: formatTimelineWhen(fallbackWhen),
      })
    }
  }

  return entries
}

function isAssignedAssignee(assignee: string): boolean {
  const normalized = assignee.trim().toLowerCase()
  return Boolean(normalized) && normalized !== UNASSIGNED_ASSIGNEE.toLowerCase()
}

export interface ActionableAssignmentChange {
  taskId: string
  taskText: string
  assignee: string
}

export function getActionableAssignmentChanges(
  previous: ILeadActionable[],
  next: ILeadActionable[]
): ActionableAssignmentChange[] {
  const changes: ActionableAssignmentChange[] = []
  const prevById = new Map(
    previous.map((task) => [
      task.id,
      {
        assignee: String(task.assignee ?? UNASSIGNED_ASSIGNEE),
        text: String(task.text),
      },
    ])
  )

  for (const rawTask of next) {
    const task = {
      id: String(rawTask.id),
      text: String(rawTask.text),
      assignee: String(rawTask.assignee ?? UNASSIGNED_ASSIGNEE).trim() || UNASSIGNED_ASSIGNEE,
    }
    if (!isAssignedAssignee(task.assignee)) continue

    const old = prevById.get(task.id)
    if (!old) {
      changes.push({ taskId: task.id, taskText: task.text, assignee: task.assignee })
      continue
    }

    if (old.assignee.toLowerCase() !== task.assignee.toLowerCase()) {
      changes.push({ taskId: task.id, taskText: task.text, assignee: task.assignee })
    }
  }

  return changes
}

export function normalizeActionables(actionables: ILeadActionable[]): ILeadActionable[] {
  if (!Array.isArray(actionables)) return []
  return actionables.map((task) => ({
    id: String(task.id),
    text: String(task.text),
    completed: Boolean(task.completed),
    assignee: String(task.assignee ?? 'Unassigned').trim() || 'Unassigned',
    completedAt: task.completed ? String(task.completedAt ?? '') : '',
  }))
}

export function leadDocToCrmLead(doc: ILead | Record<string, unknown>): CrmLead {
  const lead = doc as ILead
  const createdAt = lead.createdAt ? new Date(lead.createdAt) : new Date()

  return {
    id: String(lead._id),
    first: lead.first,
    last: lead.last,
    email: lead.email,
    phone: lead.phone || '—',
    company: lead.company || '—',
    source: lead.source,
    areas: lead.areas?.length ? lead.areas : ['Corporate advisory'],
    matter: lead.matter || '—',
    date: lead.date || '—',
    time: lead.time || '—',
    consultationDateIso: lead.consultationDateIso || '',
    consultationTime24: lead.consultationTime24 || '',
    googleMeetLink:
      lead.googleMeetLink ||
      (lead.date && lead.date !== '—' ? DEFAULT_MEET_LINK : ''),
    status: lead.status,
    ago: formatLeadAgo(createdAt),
    createdAt: createdAt.toISOString(),
    timeline: lead.timeline ?? [],
    actionables: lead.actionables ?? [],
  }
}
