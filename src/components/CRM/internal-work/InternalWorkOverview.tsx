'use client'

import { useState } from 'react'
import { isValidEmail } from '@/lib/assignee-emails'
import { useInternalWork } from './InternalWorkContext'
import { assocName, docketId, fmtDate, initials, isOverdue } from './utils'
import type { InternalAssociate, InternalTask, InternalWorkCategory, TaskSection } from './types'

export function InternalWorkOverview() {
  const { tasks, associates, categories, addAssociate, updateAssociate, deleteAssociate, addCategory, deleteCategory } =
    useInternalWork()
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null)
  const [editingEmail, setEditingEmail] = useState('')

  const openTasks = tasks.filter((t) => t.status !== 'done')
  const clientOpen = openTasks.filter((t) => t.section === 'client').length
  const adminOpen = openTasks.filter((t) => t.section === 'admin').length
  const overdueCount = tasks.filter((t) => isOverdue(t.due, t.status)).length
  const doneCount = tasks.filter((t) => t.status === 'done').length
  const maxTotal = Math.max(
    ...associates.map((a) => tasks.filter((t) => t.assignee === a.id && t.status !== 'done').length),
    1
  )

  const dueSoon = [...openTasks]
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, 6)

  const handleAddAssociate = async () => {
    const name = newName.trim()
    const email = newEmail.trim().toLowerCase()
    if (!name) return
    if (email && !isValidEmail(email)) {
      setAddError('Enter a valid email address')
      return
    }
    setAddError('')
    setAdding(true)
    try {
      await addAssociate(name, newRole, email)
      setNewName('')
      setNewRole('')
      setNewEmail('')
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add associate')
    } finally {
      setAdding(false)
    }
  }

  const startEditingEmail = (associate: InternalAssociate) => {
    setEditingEmailId(associate.id)
    setEditingEmail(associate.email ?? '')
    setAddError('')
  }

  const saveEditingEmail = async (id: string) => {
    const email = editingEmail.trim().toLowerCase()
    if (email && !isValidEmail(email)) {
      setAddError('Enter a valid email address')
      return
    }
    setAddError('')
    try {
      await updateAssociate(id, { email })
      setEditingEmailId(null)
      setEditingEmail('')
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to update email')
    }
  }

  const handleDeleteAssociate = async (id: string) => {
    if (!window.confirm('Remove this associate? Their open tasks will be unassigned.')) return
    try {
      await deleteAssociate(id)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to remove associate')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Open · Client" value={clientOpen} note="Matter-specific tasks" />
        <StatCard label="Open · Practice & Firm" value={adminOpen} note="Non-client work" accent />
        <StatCard
          label="Overdue"
          value={overdueCount}
          note="Across both streams"
          valueClassName={overdueCount ? 'text-[#8C3B3B]' : undefined}
        />
        <StatCard label="Completed" value={doneCount} note="Marked done" />
      </div>

      <Panel title="Team" hint="Add associates with email for task notifications">
        {associates.length === 0 ? (
          <p className="text-[13px] text-[#736c63] mb-4">
            No team members yet. Add an associate below to start assigning work.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {associates.map((associate) => {
              const client = tasks.filter(
                (t) => t.assignee === associate.id && t.section === 'client' && t.status !== 'done'
              ).length
              const admin = tasks.filter(
                (t) => t.assignee === associate.id && t.section === 'admin' && t.status !== 'done'
              ).length
              return (
                <div
                  key={associate.id}
                  className="bg-[#fbf9f6] border border-[#e7e1d9] rounded-[8px] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-[#7a1322] text-[#7a1322] bg-[#f6ecee] flex items-center justify-center text-[12px] font-semibold">
                      {initials(associate.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-[#1c1a18] truncate">
                        {associate.name}
                      </div>
                      <div className="text-[11.5px] text-[#736c63]">{associate.role}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDeleteAssociate(associate.id)}
                      className="text-[11px] text-[#8C3B3B] font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2.5">
                    {editingEmailId === associate.id ? (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={editingEmail}
                          onChange={(e) => setEditingEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="flex-1 px-2.5 py-1.5 border border-[#e7e1d9] rounded-[6px] text-[12px] bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => saveEditingEmail(associate.id)}
                          className="text-[11px] font-semibold text-[#7a1322] hover:underline"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditingEmail(associate)}
                        className="text-left text-[12px] text-[#736c63] hover:text-[#1c1a18]"
                      >
                        {associate.email ? (
                          <span>{associate.email}</span>
                        ) : (
                          <span className="italic">Add email for notifications</span>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-4 mt-3 pt-3 border-t border-[#e7e1d9] text-[12px] text-[#736c63]">
                    <span>
                      <strong className="text-[#1c1a18]">{client}</strong> client open
                    </span>
                    <span>
                      <strong className="text-[#1c1a18]">{admin}</strong> firm open
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {addError && <p className="text-[12px] text-[#8C3B3B] mb-2">{addError}</p>}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAssociate()}
            placeholder="Full name"
            className="flex-1 min-w-[140px] px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] bg-white"
          />
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAssociate()}
            placeholder="Role (e.g. Associate)"
            className="flex-1 min-w-[120px] px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] bg-white"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAssociate()}
            placeholder="Email (for notifications)"
            className="flex-1 min-w-[180px] px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] bg-white"
          />
          <button
            type="button"
            onClick={handleAddAssociate}
            disabled={!newName.trim() || adding}
            className="px-4 py-2 rounded-[6px] bg-[#7a1322] text-white text-[13px] font-semibold disabled:opacity-50"
          >
            {adding ? 'Adding…' : 'Add associate'}
          </button>
        </div>
      </Panel>

      <Panel title="Task categories" hint="Add your own categories per stream">
        <div className="space-y-5">
          <CategoryManager
            title="Client Deliverables"
            section="client"
            categories={categories.filter((category) => category.section === 'client')}
            onAdd={addCategory}
            onDelete={deleteCategory}
          />
          <CategoryManager
            title="Practice & Firm Work"
            section="admin"
            categories={categories.filter((category) => category.section === 'admin')}
            onAdd={addCategory}
            onDelete={deleteCategory}
          />
        </div>
      </Panel>

      <Panel title="Workload by associate" hint="Client vs practice & firm">
        {associates.length === 0 ? (
          <p className="text-[13px] text-[#736c63]">Add team members above to see workload breakdown.</p>
        ) : (
          <div className="space-y-0">
            {associates.map((associate) => {
              const client = tasks.filter(
                (t) => t.assignee === associate.id && t.section === 'client' && t.status !== 'done'
              ).length
              const admin = tasks.filter(
                (t) => t.assignee === associate.id && t.section === 'admin' && t.status !== 'done'
              ).length
              const clientPct = (client / maxTotal) * 100
              const adminPct = (admin / maxTotal) * 100

              return (
                <div
                  key={associate.id}
                  className="flex items-center gap-3.5 py-2.5 border-b border-[#e7e1d9] last:border-b-0"
                >
                  <div className="w-8 h-8 rounded-full border border-[#7a1322] text-[#7a1322] bg-[#f6ecee] flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
                    {initials(associate.name)}
                  </div>
                  <div className="w-[150px] flex-none text-[13px] font-semibold text-[#1c1a18]">
                    {associate.name}
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-[#EDE7DA] overflow-hidden flex">
                    <div className="bg-[#7a1322] h-full" style={{ width: `${clientPct}%` }} />
                    <div className="bg-[#4C5F6B] h-full" style={{ width: `${adminPct}%` }} />
                  </div>
                  <div className="w-[118px] flex-none text-right text-[11.5px] text-[#736c63]">
                    {client} client · {admin} firm
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Panel>

      <Panel title="Due this week" hint="Across both streams">
        {dueSoon.length === 0 ? (
          <p className="text-[13px] text-[#736c63]">No open tasks yet. Add tasks from Client Deliverables or Practice & Firm Work.</p>
        ) : (
          <div className="space-y-0">
            {dueSoon.map((task) => (
              <DueSoonRow key={task.id} task={task} assignee={assocName(associates, task.assignee)} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

function CategoryManager({
  title,
  section,
  categories,
  onAdd,
  onDelete,
}: {
  title: string
  section: TaskSection
  categories: InternalWorkCategory[]
  onAdd: (section: TaskSection, label: string) => Promise<InternalWorkCategory>
  onDelete: (id: string) => Promise<void>
}) {
  const [newLabel, setNewLabel] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    const label = newLabel.trim()
    if (!label) return
    setAdding(true)
    setError('')
    try {
      await onAdd(section, label)
      setNewLabel('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this category?')) return
    setError('')
    try {
      await onDelete(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove category')
    }
  }

  return (
    <div>
      <h3 className="text-[14px] font-semibold text-[#1c1a18] mb-2">{title}</h3>
      {categories.length === 0 ? (
        <p className="text-[13px] text-[#736c63] mb-3">No categories yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <span
              key={category.id}
              className={`inline-flex items-center gap-2 text-[11.5px] font-semibold px-2.5 py-1 rounded-full border ${category.className}`}
            >
              {category.label}
              <button
                type="button"
                onClick={() => void handleDelete(category.id)}
                className="text-[10px] opacity-70 hover:opacity-100"
                aria-label={`Remove ${category.label}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-[12px] text-[#8C3B3B] mb-2">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void handleAdd()}
          placeholder="New category name"
          className="flex-1 min-w-[180px] px-3 py-2 border border-[#e7e1d9] rounded-[6px] text-[13px] bg-white"
        />
        <button
          type="button"
          onClick={() => void handleAdd()}
          disabled={!newLabel.trim() || adding}
          className="px-4 py-2 rounded-[6px] bg-[#7a1322] text-white text-[13px] font-semibold disabled:opacity-50"
        >
          {adding ? 'Adding…' : 'Add category'}
        </button>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  note,
  accent,
  valueClassName,
}: {
  label: string
  value: number
  note: string
  accent?: boolean
  valueClassName?: string
}) {
  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[10px] p-4 shadow-sm">
      <div className="text-[11px] uppercase tracking-wide text-[#736c63] font-semibold">{label}</div>
      <div
        className={`text-[30px] font-semibold mt-1.5 leading-none ${
          valueClassName ?? (accent ? 'text-[#7a1322]' : 'text-[#1c1a18]')
        }`}
      >
        {value}
      </div>
      <div className="text-[12px] text-[#736c63] mt-1">{note}</div>
    </div>
  )
}

function Panel({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[10px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-semibold text-[#1c1a18]">{title}</h2>
        {hint && <span className="text-[12px] text-[#736c63]">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function DueSoonRow({ task, assignee }: { task: InternalTask; assignee: string }) {
  const overdue = isOverdue(task.due, task.status)
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-[#e7e1d9] last:border-b-0 text-[13px]">
      <span className="text-[#1c1a18]">
        <span className="font-mono text-[11px] text-[#736c63] mr-2">{docketId(task)}</span>
        {task.title}
      </span>
      <span className="text-[#736c63] whitespace-nowrap">
        {assignee} ·{' '}
        <span className={overdue ? 'text-[#8C3B3B] font-semibold' : ''}>
          {overdue ? 'Overdue · ' : ''}
          {fmtDate(task.due)}
        </span>
      </span>
    </div>
  )
}
