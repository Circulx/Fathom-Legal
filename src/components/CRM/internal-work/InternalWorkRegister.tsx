'use client'

import { useMemo, useState } from 'react'
import { LayoutGrid, List, Plus, Trash2 } from 'lucide-react'
import { useInternalWork } from './InternalWorkContext'
import {
  FILTER_STATUSES,
  SECTION_CATEGORIES,
  STATUS_PILL_CLASS,
  BOARD_STATUSES,
} from './constants'
import {
  assocName,
  compareTasks,
  docketId,
  fmtDate,
  initials,
  isOverdue,
  todayStr,
} from './utils'
import type { InternalTask, TaskPriority, TaskSection, TaskStatus } from './types'
import { notifyInternalWorkAssignment } from './notify-assignment'

interface InternalWorkRegisterProps {
  section: TaskSection
}

export default function InternalWorkRegister({ section }: InternalWorkRegisterProps) {
  const {
    tasks,
    associates,
    registerView,
    statusFilter,
    sortState,
    setRegisterView,
    setStatusFilter,
    toggleSort,
    saveTask,
    deleteTask,
  } = useInternalWork()

  const [assocFilter, setAssocFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<InternalTask | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const categories = SECTION_CATEGORIES[section]
  const viewMode = registerView[section]
  const currentStatusFilter = statusFilter[section]
  const currentSort = sortState[section]

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => t.section === section)
    if (assocFilter) list = list.filter((t) => t.assignee === assocFilter)
    if (catFilter) list = list.filter((t) => t.category === catFilter)
    if (currentStatusFilter) list = list.filter((t) => t.status === currentStatusFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((t) => t.title.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) =>
      compareTasks(a, b, currentSort.key, currentSort.dir, associates, (task) =>
        categories[task.category]?.label ?? task.category
      )
    )
  }, [
    tasks,
    section,
    assocFilter,
    catFilter,
    currentStatusFilter,
    search,
    currentSort,
    associates,
    categories,
  ])

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (task: InternalTask) => {
    setEditing(task)
    setModalOpen(true)
  }

  const handleDelete = async (task: InternalTask) => {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return
    try {
      await deleteTask(task.id)
      if (editing?.id === task.id) {
        setEditing(null)
        setModalOpen(false)
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const handleSave = async (
    task: Omit<InternalTask, 'id' | 'taskNumber'> & { id?: string }
  ) => {
    const previousAssignee = editing?.assignee ?? ''
    setSaveError(null)
    try {
      const saved = await saveTask({
        ...task,
        id: editing?.id,
        section: task.section || section,
      })
      setModalOpen(false)
      setEditing(null)

      const nextAssignee = saved.assignee ?? ''
      if (!nextAssignee || nextAssignee === previousAssignee) return

      const associate = associates.find((a) => a.id === nextAssignee)
      if (!associate?.email?.trim()) return

      const { emailSent, error } = await notifyInternalWorkAssignment({
        assignee: associate,
        taskTitle: saved.title,
        section: saved.section,
        categoryLabel: categories[saved.category]?.label ?? saved.category,
        dueDate: fmtDate(saved.due),
        priority: saved.priority,
      })

      if (!emailSent && error) {
        console.warn('Internal work assignment email failed:', error)
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save task')
    }
  }

  const handleStatusChange = async (task: InternalTask, status: TaskStatus) => {
    if (task.status === status) return
    setSaveError(null)
    try {
      await saveTask({ ...task, status })
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  return (
    <div className="space-y-5">
      {saveError && (
        <p className="text-[13px] text-[#8C3B3B] bg-[#F1DEDC] border border-[#e7e1d9] rounded-[6px] px-3 py-2">
          {saveError}
        </p>
      )}
      <div className="flex flex-wrap gap-2.5 items-center">
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#7a1322] text-white text-[13px] font-semibold hover:bg-[#5c0e1a] mr-1"
        >
          <Plus className="w-4 h-4" />
          New task
        </button>
        <div className="flex border border-[#e7e1d9] rounded-[6px] overflow-hidden">
          <button
            type="button"
            onClick={() => setRegisterView(section, 'list')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold border-r border-[#e7e1d9] ${
              viewMode === 'list' ? 'bg-[#7a1322] text-white' : 'bg-white text-[#736c63]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Live
          </button>
          <button
            type="button"
            onClick={() => setRegisterView(section, 'kanban')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold ${
              viewMode === 'kanban' ? 'bg-[#7a1322] text-white' : 'bg-white text-[#736c63]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Kanban
          </button>
        </div>

        <div className="flex border border-[#e7e1d9] rounded-[6px] overflow-hidden">
          {FILTER_STATUSES.map((item) => (
            <button
              key={item.key || 'all'}
              type="button"
              onClick={() => setStatusFilter(section, item.key)}
              className={`px-3 py-2 text-[12.5px] font-semibold border-r border-[#e7e1d9] last:border-r-0 ${
                currentStatusFilter === item.key
                  ? 'bg-[#1c1a18] text-[#F4F0E7]'
                  : 'bg-white text-[#736c63]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <select
          value={assocFilter}
          onChange={(e) => setAssocFilter(e.target.value)}
          className="text-[12.5px] px-2.5 py-2 border border-[#e7e1d9] rounded-[6px] bg-white text-[#1c1a18]"
        >
          <option value="">All associates</option>
          {associates.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="text-[12.5px] px-2.5 py-2 border border-[#e7e1d9] rounded-[6px] bg-white text-[#1c1a18]"
        >
          <option value="">All categories</option>
          {Object.entries(categories).map(([key, cat]) => (
            <option key={key} value={key}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks…"
          className="text-[12.5px] px-3 py-2 border border-[#e7e1d9] rounded-[6px] bg-white text-[#1c1a18] min-w-[190px]"
        />
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white border border-[#e7e1d9] rounded-[10px] overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#EDE7DA] border-b border-[#e7e1d9]">
                {[
                  { key: 'title', label: 'Task' },
                  { key: 'category', label: 'Category' },
                  { key: 'assignee', label: 'Assignee' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'due', label: 'Due' },
                  { key: 'status', label: 'Status' },
                  { key: 'actions', label: '' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`text-left text-[11px] uppercase tracking-wide text-[#736c63] font-semibold px-4 py-3 ${
                      col.key !== 'actions' ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => {
                      if (col.key !== 'actions') {
                        toggleSort(section, col.key as typeof currentSort.key)
                      }
                    }}
                  >
                    {col.label}
                    {col.key !== 'actions' && (
                      <span className="ml-1 text-[9px] text-[#A69E8E]">↕</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#736c63]">
                    {tasks.filter((t) => t.section === section).length === 0
                      ? 'No tasks yet. Click “New task” to add one.'
                      : 'No tasks match these filters.'}
                  </td>
                </tr>
              ) : (
                filtered.map((task) => {
                  const cat = categories[task.category]
                  const overdue = isOverdue(task.due, task.status)
                  const name = assocName(associates, task.assignee)
                  return (
                    <tr
                      key={task.id}
                      onClick={() => openEdit(task)}
                      className="border-b border-[#e7e1d9] last:border-b-0 hover:bg-[#fbf9f6] cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 max-w-[360px]">
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              task.priority === 'high'
                                ? 'bg-[#7a1322]'
                                : task.priority === 'med'
                                  ? 'bg-[#94702C]'
                                  : 'bg-[#4B6650]'
                            }`}
                          />
                          <div>
                            <div className="text-[13px] font-semibold text-[#1c1a18] leading-snug">
                              {task.title}
                            </div>
                            <div className="font-mono text-[10.5px] text-[#736c63] mt-0.5">
                              {docketId(task)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#736c63]">{cat?.label ?? task.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border border-[#7a1322] text-[#7a1322] bg-[#f6ecee] flex items-center justify-center text-[8.5px] font-bold">
                            {initials(name)}
                          </div>
                          <span className="text-[12.5px] text-[#1c1a18]">{name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] capitalize text-[#736c63]">{task.priority}</td>
                      <td className={`px-4 py-3 text-[13px] ${overdue ? 'text-[#8C3B3B] font-semibold' : 'text-[#736c63]'}`}>
                        {overdue ? 'Overdue · ' : ''}
                        {fmtDate(task.due)}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <TaskStatusSelect
                          value={task.status}
                          onChange={(status) => void handleStatusChange(task, status)}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(task)
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#736c63] hover:text-[#8C3B3B] hover:bg-[#F1DEDC]"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {BOARD_STATUSES.map((col) => {
            const items = filtered.filter((t) => t.status === col.key)
            return (
              <div key={col.key}>
                <div className="flex items-center gap-2 mb-2.5 px-0.5">
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: col.dot }} />
                  <span className="text-[12px] font-bold uppercase tracking-wide text-[#736c63]">
                    {col.label}
                  </span>
                  <span className="ml-auto text-[11.5px] text-[#736c63] bg-[#EDE7DA] px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {items.length === 0 ? (
                    <div className="text-[11.5px] text-[#A69E8E] px-1 py-3.5 border border-dashed border-[#e7e1d9] rounded-[6px] text-center">
                      No tasks
                    </div>
                  ) : (
                    items.map((task) => {
                      const cat = categories[task.category]
                      const name = assocName(associates, task.assignee)
                      const overdue = isOverdue(task.due, task.status)
                      return (
                        <div
                          key={task.id}
                          className={`relative w-full text-left bg-white border border-[#e7e1d9] rounded-[6px] p-3.5 shadow-sm hover:border-[#736c63] border-l-[3px] ${
                            task.priority === 'high'
                              ? 'border-l-[#7a1322]'
                              : task.priority === 'med'
                                ? 'border-l-[#94702C]'
                                : 'border-l-[#4B6650]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => openEdit(task)}
                            className="w-full text-left"
                          >
                            <div className="flex justify-between gap-2 items-start pr-7">
                              <span className="font-mono text-[10px] text-[#736c63]">{docketId(task)}</span>
                              {cat && (
                                <span
                                  className={`text-[9.5px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded-full border ${cat.className}`}
                                >
                                  {cat.label}
                                </span>
                              )}
                            </div>
                            <div className="text-[13.5px] font-semibold text-[#1c1a18] mt-1 leading-snug">
                              {task.title}
                            </div>
                            <div className="flex justify-between items-center mt-2.5 gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="w-5 h-5 rounded-full border border-[#7a1322] text-[#7a1322] bg-[#f6ecee] flex items-center justify-center text-[8.5px] font-bold flex-shrink-0">
                                  {initials(name)}
                                </div>
                                <span className="text-[11.5px] text-[#736c63] truncate">{name.split(' ')[0]}</span>
                              </div>
                              <span className={`text-[11px] flex-shrink-0 ${overdue ? 'text-[#8C3B3B] font-semibold' : 'text-[#736c63]'}`}>
                                {overdue ? 'Overdue · ' : ''}
                                {fmtDate(task.due)}
                              </span>
                            </div>
                          </button>
                          <div className="mt-2.5">
                            <TaskStatusSelect
                              value={task.status}
                              onChange={(status) => void handleStatusChange(task, status)}
                              compact
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(task)}
                            className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-7 h-7 rounded-md text-[#736c63] hover:text-[#8C3B3B] hover:bg-[#F1DEDC]"
                            aria-label={`Delete ${task.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <TaskModal
          section={section}
          task={editing}
          associates={associates}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={
            editing
              ? () => {
                  if (!window.confirm(`Delete “${editing.title}”? This cannot be undone.`)) return false
                  void deleteTask(editing.id).then(() => {
                    setEditing(null)
                  })
                  return true
                }
              : undefined
          }
        />
      )}
    </div>
  )
}

function TaskModal({
  section,
  task,
  associates,
  categories,
  onClose,
  onSave,
  onDelete,
}: {
  section: TaskSection
  task: InternalTask | null
  associates: { id: string; name: string; email?: string }[]
  categories: Record<string, { label: string; className: string }>
  onClose: () => void
  onSave: (task: Omit<InternalTask, 'id' | 'taskNumber'> & { id?: string }) => void | Promise<void>
  onDelete?: () => boolean | void
}) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [category, setCategory] = useState(task?.category ?? Object.keys(categories)[0] ?? '')
  const [assignee, setAssignee] = useState(task?.assignee ?? associates[0]?.id ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'med')
  const [due, setDue] = useState(task?.due ?? todayStr())
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo')
  const [notes, setNotes] = useState(task?.notes ?? '')

  return (
    <div className="fixed inset-0 bg-[#1c1a18]/45 z-50 flex items-start justify-center p-8 overflow-y-auto">
      <div className="bg-white w-full max-w-[480px] rounded-[10px] p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#736c63] hover:text-[#1c1a18]"
        >
          ✕
        </button>
        <h3 className="text-[18px] font-semibold text-[#1c1a18]">{task ? 'Edit task' : 'New task'}</h3>
        <p className="text-[12px] text-[#736c63] mt-1 mb-4">
          Assign work and they&apos;ll be emailed if the assignee has an email on file.
        </p>

        <div className="space-y-3.5">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px]"
              placeholder="Task title"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] bg-white"
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assignee">
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] bg-white"
              >
                <option value="">Unassigned</option>
                {associates.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {associates.length === 0 && (
                <p className="text-[11px] text-[#736c63] mt-1">
                  Add team members on Internal work → Overview first.
                </p>
              )}
              {assignee && !associates.find((a) => a.id === assignee)?.email && (
                <p className="text-[11px] text-[#94702C] mt-1">
                  No email on file — add one on Overview to send notifications.
                </p>
              )}
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] bg-white"
              >
                <option value="high">High</option>
                <option value="med">Medium</option>
                <option value="low">Low</option>
              </select>
            </Field>
            <Field label="Due date">
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px]"
              />
            </Field>
          </div>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] bg-white"
            >
              <option value="todo">To Do</option>
              <option value="progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
          </Field>
          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] min-h-[60px]"
              placeholder="Optional context"
            />
          </Field>
        </div>

        <div className="flex justify-between items-center mt-5">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (onDelete?.() !== false) onClose()
              }}
              className="text-[11.5px] font-semibold text-[#8C3B3B]"
            >
              Delete task
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            disabled={!title.trim()}
            onClick={() =>
              onSave({
                id: task?.id,
                section,
                title: title.trim(),
                category,
                assignee,
                priority,
                due,
                status,
                notes,
              })
            }
            className="px-4 py-2.5 rounded-[6px] bg-[#7a1322] text-white text-[13px] font-semibold disabled:opacity-50"
          >
            Save task
          </button>
        </div>
      </div>
    </div>
  )
}

function TaskStatusSelect({
  value,
  onChange,
  compact,
}: {
  value: TaskStatus
  onChange: (status: TaskStatus) => void
  compact?: boolean
}) {
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as TaskStatus)}
      aria-label="Task status"
      className={`text-[11px] font-semibold rounded-full border border-[#e7e1d9] bg-white cursor-pointer ${
        STATUS_PILL_CLASS[value]
      } ${compact ? 'w-full px-2 py-1' : 'px-2.5 py-1'}`}
    >
      {BOARD_STATUSES.map((status) => (
        <option key={status.key} value={status.key}>
          {status.label}
        </option>
      ))}
    </select>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11.5px] font-semibold uppercase tracking-wide text-[#736c63] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
