'use client'

import { useState } from 'react'
import { Plus, Trash2, User } from 'lucide-react'
import { TEAM_MEMBERS, type CrmActionable } from './data'

interface LeadActionablesProps {
  actionables: CrmActionable[]
  onChange: (actionables: CrmActionable[]) => void
}

export default function LeadActionables({ actionables, onChange }: LeadActionablesProps) {
  const [newTask, setNewTask] = useState('')
  const [newAssignee, setNewAssignee] = useState('Unassigned')

  const completedCount = actionables.filter((a) => a.completed).length
  const totalCount = actionables.length

  const addTask = () => {
    const text = newTask.trim()
    if (!text) return
    onChange([
      ...actionables,
      {
        id: `task-${Date.now()}`,
        text,
        completed: false,
        assignee: newAssignee,
      },
    ])
    setNewTask('')
    setNewAssignee('Unassigned')
  }

  const toggleTask = (id: string) => {
    onChange(
      actionables.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    )
  }

  const deleteTask = (id: string) => {
    onChange(actionables.filter((a) => a.id !== id))
  }

  const updateAssignee = (id: string, assignee: string) => {
    onChange(actionables.map((a) => (a.id === id ? { ...a, assignee } : a)))
  }

  return (
    <section>
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
            className="group flex gap-2.5 py-2.5 border-b border-[#efebe4] last:border-b-0"
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
              <div className="flex items-center gap-2 mt-1">
                <User className="w-3 h-3 text-[#9a9289] flex-shrink-0" />
                <select
                  value={task.assignee}
                  onChange={(e) => updateAssignee(task.id, e.target.value)}
                  className={`text-[11.5px] bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer ${
                    task.assignee === 'Unassigned' ? 'text-[#9a9289]' : 'text-[#736c63]'
                  }`}
                >
                  {TEAM_MEMBERS.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
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

      <div className="flex gap-2 mt-3">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a task…"
          className="flex-1 min-w-0 border border-[#e7e1d9] rounded-full px-4 py-2 text-[13px] bg-white text-[#1c1a18] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7a1322]"
        />
        <select
          value={newAssignee}
          onChange={(e) => setNewAssignee(e.target.value)}
          className="border border-[#e7e1d9] rounded-full px-3 py-2 text-[12.5px] bg-white text-[#736c63] focus:outline-none focus:border-[#7a1322] max-w-[130px]"
        >
          {TEAM_MEMBERS.map((member) => (
            <option key={member} value={member}>
              {member === 'Unassigned' ? 'Assign to…' : member}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addTask}
          disabled={!newTask.trim()}
          className="w-9 h-9 rounded-full bg-[#7a1322] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-[#5c0e1a] transition-colors"
          aria-label="Add task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}
