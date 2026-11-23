'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, User } from 'lucide-react'
import { UNASSIGNED_ASSIGNEE, collectAssigneeNames, type CrmActionable } from './data'
import { formatTimelineWhen } from '@/lib/crm-leads'

interface LeadActionablesProps {
  actionables: CrmActionable[]
  knownAssignees: string[]
  onChange: (actionables: CrmActionable[]) => void
  onEnsureAssignee?: (name: string) => Promise<void>
  highlightTaskId?: string | null
}

function toAssigneeInputValue(assignee: string) {
  return assignee === UNASSIGNED_ASSIGNEE ? '' : assignee
}

function fromAssigneeInputValue(value: string) {
  const trimmed = value.trim()
  return trimmed || UNASSIGNED_ASSIGNEE
}

export default function LeadActionables({
  actionables,
  knownAssignees,
  onChange,
  onEnsureAssignee,
  highlightTaskId = null,
}: LeadActionablesProps) {
  const [newTask, setNewTask] = useState('')
  const [newAssignee, setNewAssignee] = useState('')
  const [assigneeDrafts, setAssigneeDrafts] = useState<Record<string, string>>({})
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null)

  useEffect(() => {
    setAssigneeDrafts({})
  }, [actionables])

  useEffect(() => {
    if (!highlightTaskId) return
    const taskExists = actionables.some((task) => task.id === highlightTaskId)
    if (!taskExists) return

    setActiveHighlightId(highlightTaskId)
    const frame = requestAnimationFrame(() => {
      const el = document.getElementById(`crm-task-${highlightTaskId}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    const timer = window.setTimeout(() => setActiveHighlightId(null), 4000)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [highlightTaskId, actionables])

  const assigneeSuggestions = useMemo(
    () => collectAssigneeNames(knownAssignees, actionables),
    [knownAssignees, actionables]
  )

  const completedCount = actionables.filter((a) => a.completed).length
  const totalCount = actionables.length

  const persistAssignee = async (raw: string) => {
    const name = raw.trim()
    if (!name || name === UNASSIGNED_ASSIGNEE) return
    await onEnsureAssignee?.(name)
  }

  const addTask = async () => {
    const text = newTask.trim()
    if (!text) return
    const assignee = fromAssigneeInputValue(newAssignee)
    if (assignee !== UNASSIGNED_ASSIGNEE) {
      await persistAssignee(newAssignee)
    }
    onChange([
      ...actionables,
      {
        id: `task-${Date.now()}`,
        text,
        completed: false,
        assignee,
      },
    ])
    setNewTask('')
    setNewAssignee('')
  }

  const toggleTask = (id: string) => {
    const completedAt = new Date().toISOString()
    onChange(
      actionables.map((a) => {
        if (a.id !== id) return a
        const completed = !a.completed
        return {
          ...a,
          completed,
          completedAt: completed ? completedAt : undefined,
        }
      })
    )
  }

  const deleteTask = (id: string) => {
    onChange(actionables.filter((a) => a.id !== id))
  }

  const setAssigneeDraft = (id: string, raw: string) => {
    setAssigneeDrafts((prev) => ({ ...prev, [id]: raw }))
  }

  const commitAssignee = async (id: string, raw: string) => {
    const assignee = fromAssigneeInputValue(raw)
    const current = actionables.find((task) => task.id === id)
    if (!current || current.assignee === assignee) {
      setAssigneeDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      return
    }

    if (assignee !== UNASSIGNED_ASSIGNEE) {
      await persistAssignee(raw)
    }

    onChange(actionables.map((task) => (task.id === id ? { ...task, assignee } : task)))
    setAssigneeDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  return (
    <section>
      <datalist id="crm-assignee-suggestions">
        {assigneeSuggestions.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <div className="flex items-center mb-3">
        <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold">
          Actionables
        </h4>
        {totalCount > 0 && (
          <span className="ml-auto text-[12px] font-medium text-[#7a1322]">
            {completedCount}/{totalCount} done
          </span>
        )}
      </div>

      <div className="space-y-1">
        {actionables.map((task) => (
          <div
            key={task.id}
            id={`crm-task-${task.id}`}
            className={`group flex gap-2.5 py-2.5 border-b border-[#efebe4] last:border-b-0 transition-colors ${
              activeHighlightId === task.id
                ? 'bg-[#fdf6f7] ring-2 ring-[#7a1322]/40 rounded-lg -mx-2 px-2'
                : ''
            }`}
          >
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              className={`mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                task.completed
                  ? 'bg-[#3f7a52] border-[#3f7a52] text-white'
                  : 'border-[#d4cdc3] bg-white hover:border-[#7a1322]'
              }`}
              aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {task.completed && (
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={`text-[13px] leading-snug ${
                  task.completed ? 'text-[#9a9289] line-through' : 'text-[#1c1a18]'
                }`}
              >
                {task.text}
              </p>
              {task.completed && task.completedAt && !Number.isNaN(new Date(task.completedAt).getTime()) && (
                <p className="text-[10.5px] text-[#9a9289] mt-0.5">
                  Completed {formatTimelineWhen(new Date(task.completedAt))}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <User className="w-3 h-3 text-[#9a9289] flex-shrink-0" />
                <input
                  type="text"
                  list="crm-assignee-suggestions"
                  value={
                    assigneeDrafts[task.id] ?? toAssigneeInputValue(task.assignee)
                  }
                  onChange={(e) => setAssigneeDraft(task.id, e.target.value)}
                  onBlur={(e) => void commitAssignee(task.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                  }}
                  placeholder="Assign to…"
                  className={`flex-1 min-w-0 text-[11.5px] bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:text-[#9a9289] ${
                    task.assignee === UNASSIGNED_ASSIGNEE ? 'text-[#9a9289]' : 'text-[#736c63]'
                  }`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-md flex items-center justify-center text-[#9a9289] hover:text-[#7a1322] hover:bg-[#f6ecee] transition-all flex-shrink-0"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-3">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void addTask()}
          placeholder="Add a task…"
          className="w-full border border-[#e7e1d9] rounded-full px-4 py-2 text-[13px] bg-white text-[#1c1a18] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7a1322]"
        />
        <div className="flex gap-2">
          <input
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void addTask()}
            list="crm-assignee-suggestions"
            placeholder="Assign to…"
            className="flex-1 min-w-0 border border-[#e7e1d9] rounded-full px-4 py-2 text-[13px] bg-white text-[#1c1a18] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7a1322]"
          />
          <button
            type="button"
            onClick={() => void addTask()}
            disabled={!newTask.trim()}
            className="w-9 h-9 rounded-full bg-[#7a1322] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-[#5c0e1a] transition-colors"
            aria-label="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
