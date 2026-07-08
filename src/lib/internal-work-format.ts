import type { InternalAssociate, InternalTask } from '@/components/CRM/internal-work/types'

export function formatInternalWorkAssociate(doc: {
  _id: unknown
  name: string
  role: string
  email?: string | null
}): InternalAssociate {
  const email = doc.email?.trim().toLowerCase() || undefined
  return {
    id: String(doc._id),
    name: doc.name,
    role: doc.role,
    ...(email ? { email } : {}),
  }
}

export function formatInternalWorkTask(doc: {
  _id: unknown
  taskNumber: number
  section: InternalTask['section']
  category: string
  title: string
  assignee?: string | null
  priority: InternalTask['priority']
  due: string
  status: InternalTask['status']
  notes?: string | null
}): InternalTask {
  return {
    id: String(doc._id),
    taskNumber: doc.taskNumber,
    section: doc.section,
    category: doc.category,
    title: doc.title,
    assignee: doc.assignee?.trim() || '',
    priority: doc.priority,
    due: doc.due,
    status: doc.status,
    notes: doc.notes?.trim() || '',
  }
}

export async function getNextTaskNumber(): Promise<number> {
  const InternalWorkTask = (await import('@/models/InternalWorkTask')).default
  const last = await InternalWorkTask.findOne()
    .sort({ taskNumber: -1 })
    .select('taskNumber')
    .lean<{ taskNumber?: number }>()
  return (last?.taskNumber ?? 0) + 1
}
