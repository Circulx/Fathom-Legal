import { STATUS_LABEL } from './constants'
import { assocName, fmtDate } from './utils'
import type { InternalAssociate, InternalTask, TaskPriority, TaskSection, TaskStatus } from './types'

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'High',
  med: 'Medium',
  low: 'Low',
}

export interface TaskFieldChange {
  field: string
  from: string
  to: string
}

export interface TaskSnapshot {
  title: string
  category: string
  assignee: string
  priority: TaskPriority
  due: string
  status: TaskStatus
  notes: string
  section: TaskSection
}

export function getTaskChanges(
  before: InternalTask,
  after: TaskSnapshot,
  categories: Record<string, { label: string }>,
  associates: InternalAssociate[]
): TaskFieldChange[] {
  const changes: TaskFieldChange[] = []
  const categoryLabel = (key: string) => categories[key]?.label ?? key

  if (before.title !== after.title.trim()) {
    changes.push({ field: 'Title', from: before.title, to: after.title.trim() })
  }
  if (before.category !== after.category) {
    changes.push({
      field: 'Category',
      from: categoryLabel(before.category),
      to: categoryLabel(after.category),
    })
  }
  if (before.assignee !== after.assignee) {
    changes.push({
      field: 'Assignee',
      from: assocName(associates, before.assignee),
      to: assocName(associates, after.assignee),
    })
  }
  if (before.priority !== after.priority) {
    changes.push({
      field: 'Priority',
      from: PRIORITY_LABELS[before.priority],
      to: PRIORITY_LABELS[after.priority],
    })
  }
  if (before.due !== after.due) {
    changes.push({
      field: 'Due date',
      from: fmtDate(before.due),
      to: fmtDate(after.due),
    })
  }
  if (before.status !== after.status) {
    changes.push({
      field: 'Status',
      from: STATUS_LABEL[before.status] ?? before.status,
      to: STATUS_LABEL[after.status] ?? after.status,
    })
  }
  const beforeNotes = before.notes.trim()
  const afterNotes = after.notes.trim()
  if (beforeNotes !== afterNotes) {
    changes.push({
      field: 'Notes',
      from: beforeNotes || '—',
      to: afterNotes || '—',
    })
  }

  return changes
}
