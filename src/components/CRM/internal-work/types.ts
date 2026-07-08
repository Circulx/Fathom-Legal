export type TaskSection = 'client' | 'admin'

export type TaskPriority = 'high' | 'med' | 'low'

export type TaskStatus = 'todo' | 'progress' | 'blocked' | 'done'

export interface InternalAssociate {
  id: string
  name: string
  role: string
  email?: string
}

export interface InternalTask {
  id: string
  taskNumber: number
  section: TaskSection
  category: string
  title: string
  assignee: string
  priority: TaskPriority
  due: string
  status: TaskStatus
  notes: string
}

export type RegisterViewMode = 'list' | 'kanban'

export type SortKey = 'title' | 'category' | 'assignee' | 'priority' | 'due' | 'status'

export interface SortState {
  key: SortKey
  dir: 1 | -1
}
