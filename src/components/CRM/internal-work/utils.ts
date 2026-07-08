import type { InternalAssociate, InternalTask, TaskPriority } from './types'

export function addDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function fmtDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isOverdue(iso: string, status: string): boolean {
  return status !== 'done' && new Date(iso) < new Date(new Date().toDateString())
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function docketId(task: InternalTask): string {
  const prefix = task.section === 'client' ? 'CLI' : 'PRC'
  return `${prefix}-${String(task.taskNumber).padStart(3, '0')}`
}

export function assocName(associates: InternalAssociate[], id: string): string {
  return associates.find((a) => a.id === id)?.name ?? 'Unassigned'
}

const PRIORITY_RANK: Record<TaskPriority, number> = { high: 0, med: 1, low: 2 }

export function compareTasks(
  a: InternalTask,
  b: InternalTask,
  key: string,
  dir: 1 | -1,
  associates: InternalAssociate[],
  getCategoryLabel: (task: InternalTask) => string
): number {
  let av: string | number
  let bv: string | number

  switch (key) {
    case 'title':
      av = a.title
      bv = b.title
      break
    case 'category':
      av = getCategoryLabel(a)
      bv = getCategoryLabel(b)
      break
    case 'assignee':
      av = assocName(associates, a.assignee)
      bv = assocName(associates, b.assignee)
      break
    case 'priority':
      av = PRIORITY_RANK[a.priority]
      bv = PRIORITY_RANK[b.priority]
      break
    case 'due':
      av = a.due
      bv = b.due
      break
    case 'status':
      av = a.status
      bv = b.status
      break
    default:
      av = a.due
      bv = b.due
  }

  if (av < bv) return -1 * dir
  if (av > bv) return 1 * dir
  return 0
}
