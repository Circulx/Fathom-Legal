'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  InternalAssociate,
  InternalTask,
  InternalWorkCategory,
  RegisterViewMode,
  SortState,
  TaskSection,
} from './types'

const TASKS_KEY = 'fathom-internal-work-tasks-v2'
const ASSOCIATES_KEY = 'fathom-internal-work-associates-v2'

interface InternalWorkContextValue {
  tasks: InternalTask[]
  associates: InternalAssociate[]
  categories: InternalWorkCategory[]
  loading: boolean
  error: string | null
  registerView: Record<TaskSection, RegisterViewMode>
  statusFilter: Record<TaskSection, string>
  sortState: Record<TaskSection, SortState>
  setRegisterView: (section: TaskSection, mode: RegisterViewMode) => void
  setStatusFilter: (section: TaskSection, key: string) => void
  toggleSort: (section: TaskSection, key: SortState['key']) => void
  refresh: () => Promise<void>
  saveTask: (task: Omit<InternalTask, 'id' | 'taskNumber'> & { id?: string }) => Promise<InternalTask>
  deleteTask: (id: string) => Promise<void>
  addAssociate: (name: string, role: string, email?: string) => Promise<InternalAssociate>
  updateAssociate: (
    id: string,
    patch: Partial<Pick<InternalAssociate, 'name' | 'role' | 'email'>>
  ) => Promise<InternalAssociate>
  deleteAssociate: (id: string) => Promise<void>
  addCategory: (section: TaskSection, label: string) => Promise<InternalWorkCategory>
  deleteCategory: (id: string) => Promise<void>
}

const InternalWorkContext = createContext<InternalWorkContextValue | null>(null)

function loadLegacyLocalStorage() {
  if (typeof window === 'undefined') {
    return { associates: [] as InternalAssociate[], tasks: [] as InternalTask[] }
  }
  try {
    const associates = JSON.parse(
      window.localStorage.getItem(ASSOCIATES_KEY) || '[]'
    ) as InternalAssociate[]
    const tasks = JSON.parse(window.localStorage.getItem(TASKS_KEY) || '[]') as InternalTask[]
    return { associates, tasks }
  } catch {
    return { associates: [], tasks: [] }
  }
}

function clearLegacyLocalStorage() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TASKS_KEY)
  window.localStorage.removeItem(ASSOCIATES_KEY)
}

async function parseError(response: Response, fallback: string) {
  const data = await response.json().catch(() => ({}))
  return (data.error as string) || fallback
}

export function InternalWorkProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<InternalTask[]>([])
  const [associates, setAssociates] = useState<InternalAssociate[]>([])
  const [categories, setCategories] = useState<InternalWorkCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registerView, setRegisterViewState] = useState<Record<TaskSection, RegisterViewMode>>({
    client: 'list',
    admin: 'list',
  })
  const [statusFilter, setStatusFilterState] = useState<Record<TaskSection, string>>({
    client: '',
    admin: '',
  })
  const [sortState, setSortState] = useState<Record<TaskSection, SortState>>({
    client: { key: 'due', dir: 1 },
    admin: { key: 'due', dir: 1 },
  })

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [associatesRes, tasksRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/internal-work/associates'),
        fetch('/api/admin/internal-work/tasks'),
        fetch('/api/admin/internal-work/categories'),
      ])

      if (!associatesRes.ok || !tasksRes.ok || !categoriesRes.ok) {
        throw new Error(
          await parseError(
            !associatesRes.ok
              ? associatesRes
              : !tasksRes.ok
                ? tasksRes
                : categoriesRes,
            'Failed to load internal work data'
          )
        )
      }

      const associatesData = await associatesRes.json()
      const tasksData = await tasksRes.json()
      const categoriesData = await categoriesRes.json()
      let nextAssociates = associatesData.associates ?? []
      let nextTasks = tasksData.tasks ?? []
      let nextCategories = categoriesData.categories ?? []

      if (nextAssociates.length === 0 && nextTasks.length === 0) {
        const legacy = loadLegacyLocalStorage()
        if (legacy.associates.length > 0 || legacy.tasks.length > 0) {
          const migrateRes = await fetch('/api/admin/internal-work/migrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              associates: legacy.associates,
              tasks: legacy.tasks,
            }),
          })
          if (migrateRes.ok) {
            const migrated = await migrateRes.json()
            nextAssociates = migrated.associates ?? []
            nextTasks = migrated.tasks ?? []
            clearLegacyLocalStorage()
          }
        }
      }

      setAssociates(nextAssociates)
      setTasks(nextTasks)
      setCategories(nextCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load internal work data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const setRegisterView = useCallback((section: TaskSection, mode: RegisterViewMode) => {
    setRegisterViewState((prev) => ({ ...prev, [section]: mode }))
  }, [])

  const setStatusFilter = useCallback((section: TaskSection, key: string) => {
    setStatusFilterState((prev) => ({ ...prev, [section]: key }))
  }, [])

  const toggleSort = useCallback((section: TaskSection, key: SortState['key']) => {
    setSortState((prev) => {
      const current = prev[section]
      return {
        ...prev,
        [section]: {
          key,
          dir: current.key === key ? (current.dir === 1 ? -1 : 1) : 1,
        },
      }
    })
  }, [])

  const saveTask = useCallback(
    async (task: Omit<InternalTask, 'id' | 'taskNumber'> & { id?: string }) => {
      const payload = {
        section: task.section,
        category: task.category,
        title: task.title,
        assignee: task.assignee,
        priority: task.priority,
        due: task.due,
        status: task.status,
        notes: task.notes,
      }

      if (task.id) {
        const response = await fetch(`/api/admin/internal-work/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          throw new Error(await parseError(response, 'Failed to update task'))
        }
        const data = await response.json()
        const saved = data.task as InternalTask
        setTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)))
        return saved
      }

      const response = await fetch('/api/admin/internal-work/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error(await parseError(response, 'Failed to create task'))
      }
      const data = await response.json()
      const saved = data.task as InternalTask
      setTasks((prev) => [...prev, saved])
      return saved
    },
    []
  )

  const deleteTask = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/internal-work/tasks/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(await parseError(response, 'Failed to delete task'))
    }
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addAssociate = useCallback(async (name: string, role: string, email?: string) => {
    const response = await fetch('/api/admin/internal-work/associates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role, email }),
    })
    if (!response.ok) {
      throw new Error(await parseError(response, 'Failed to add associate'))
    }
    const data = await response.json()
    const saved = data.associate as InternalAssociate
    setAssociates((prev) => [...prev, saved].sort((a, b) => a.name.localeCompare(b.name)))
    return saved
  }, [])

  const updateAssociate = useCallback(
    async (id: string, patch: Partial<Pick<InternalAssociate, 'name' | 'role' | 'email'>>) => {
      const response = await fetch(`/api/admin/internal-work/associates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!response.ok) {
        throw new Error(await parseError(response, 'Failed to update associate'))
      }
      const data = await response.json()
      const saved = data.associate as InternalAssociate
      setAssociates((prev) =>
        prev.map((associate) => (associate.id === id ? saved : associate))
      )
      return saved
    },
    []
  )

  const deleteAssociate = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/internal-work/associates/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(await parseError(response, 'Failed to remove associate'))
    }
    setAssociates((prev) => prev.filter((a) => a.id !== id))
    setTasks((prev) =>
      prev.map((task) => (task.assignee === id ? { ...task, assignee: '' } : task))
    )
  }, [])

  const addCategory = useCallback(async (section: TaskSection, label: string) => {
    const response = await fetch('/api/admin/internal-work/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, label }),
    })
    if (!response.ok) {
      throw new Error(await parseError(response, 'Failed to add category'))
    }
    const data = await response.json()
    const saved = data.category as InternalWorkCategory
    setCategories((prev) =>
      [...prev, saved].sort((a, b) => a.label.localeCompare(b.label))
    )
    return saved
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/internal-work/categories/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(await parseError(response, 'Failed to remove category'))
    }
    setCategories((prev) => prev.filter((category) => category.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      tasks,
      associates,
      categories,
      loading,
      error,
      registerView,
      statusFilter,
      sortState,
      setRegisterView,
      setStatusFilter,
      toggleSort,
      refresh,
      saveTask,
      deleteTask,
      addAssociate,
      updateAssociate,
      deleteAssociate,
      addCategory,
      deleteCategory,
    }),
    [
      tasks,
      associates,
      categories,
      loading,
      error,
      registerView,
      statusFilter,
      sortState,
      setRegisterView,
      setStatusFilter,
      toggleSort,
      refresh,
      saveTask,
      deleteTask,
      addAssociate,
      updateAssociate,
      deleteAssociate,
      addCategory,
      deleteCategory,
    ]
  )

  return <InternalWorkContext.Provider value={value}>{children}</InternalWorkContext.Provider>
}

export function useInternalWork() {
  const ctx = useContext(InternalWorkContext)
  if (!ctx) throw new Error('useInternalWork must be used within InternalWorkProvider')
  return ctx
}
