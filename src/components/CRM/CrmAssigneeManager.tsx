'use client'

import { useState } from 'react'
import { X, User, Trash2, Plus, Users, Mail } from 'lucide-react'
import type { CrmAssigneeRecord } from './data'
import { CRM_INPUT_CLASS } from './shared'

interface CrmAssigneeManagerProps {
  open: boolean
  onClose: () => void
  assignees: CrmAssigneeRecord[]
  onAdd: (name: string, emails?: string[]) => Promise<void>
  onUpdateEmails: (id: string, emails: string[]) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function cleanEmailInputs(values: string[]): string[] {
  return values.map((value) => value.trim().toLowerCase()).filter(Boolean)
}

export default function CrmAssigneeManager({
  open,
  onClose,
  assignees,
  onAdd,
  onUpdateEmails,
  onDelete,
}: CrmAssigneeManagerProps) {
  const [newName, setNewName] = useState('')
  const [newEmails, setNewEmails] = useState(['', ''])
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null)
  const [editingEmails, setEditingEmails] = useState<string[]>([''])
  const [savingEmailId, setSavingEmailId] = useState<string | null>(null)
  const [error, setError] = useState('')

  if (!open) return null

  const handleAdd = async () => {
    const name = newName.trim()
    if (!name) return

    const emails = cleanEmailInputs(newEmails)
    setAdding(true)
    setError('')
    try {
      await onAdd(name, emails)
      setNewName('')
      setNewEmails(['', ''])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add assignee')
    } finally {
      setAdding(false)
    }
  }

  const startEditingEmails = (assignee: CrmAssigneeRecord) => {
    setEditingEmailId(assignee.id)
    setEditingEmails(
      assignee.emails.length > 0 ? [...assignee.emails, ''] : ['', '']
    )
    setError('')
  }

  const handleSaveEmails = async (id: string) => {
    const emails = cleanEmailInputs(editingEmails)
    if (emails.length === 0) {
      setError('Add at least one email address')
      return
    }

    setSavingEmailId(id)
    setError('')
    try {
      await onUpdateEmails(id, emails)
      setEditingEmailId(null)
      setEditingEmails([''])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update emails')
    } finally {
      setSavingEmailId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError('')
    try {
      await onDelete(id)
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove assignee')
    } finally {
      setDeletingId(null)
    }
  }

  const updateNewEmail = (index: number, value: string) => {
    setNewEmails((prev) => prev.map((email, i) => (i === index ? value : email)))
  }

  const updateEditingEmail = (index: number, value: string) => {
    setEditingEmails((prev) => prev.map((email, i) => (i === index ? value : email)))
  }

  return (
    <div className="fixed inset-0 bg-[#1c1a18]/45 z-50 flex items-start justify-center p-8 overflow-y-auto">
      <div className="bg-[#fbf9f6] text-[#1c1a18] [color-scheme:light] rounded-[14px] w-full max-w-[520px] shadow-2xl">
        <div className="flex items-center px-6 py-5 border-b border-[#e7e1d9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#f6ecee] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#7a1322]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#1c1a18]">Team assignees</h3>
              <p className="text-[12px] text-[#736c63]">
                Add one or more emails per assignee for task notifications
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto w-8 h-8 rounded-full border border-[#e7e1d9] bg-white flex items-center justify-center text-[#736c63] hover:border-[#7a1322] hover:text-[#7a1322]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-2 mb-5">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleAdd()}
              placeholder="Team member name…"
              className={CRM_INPUT_CLASS}
            />
            {newEmails.map((email, index) => (
              <input
                key={`new-email-${index}`}
                type="email"
                value={email}
                onChange={(e) => updateNewEmail(index, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void handleAdd()}
                placeholder={index === 0 ? 'Email 1' : `Email ${index + 1} (optional)`}
                className={CRM_INPUT_CLASS}
              />
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNewEmails((prev) => [...prev, ''])}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium border border-[#e7e1d9] rounded-full bg-white text-[#736c63] hover:border-[#7a1322] hover:text-[#7a1322]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add another email
              </button>
              <button
                type="button"
                onClick={() => void handleAdd()}
                disabled={adding || !newName.trim()}
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium text-white rounded-full bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add assignee
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[12px] text-[#7a1322] font-medium mb-4">{error}</p>
          )}

          {assignees.length === 0 ? (
            <p className="text-sm text-[#736c63] text-center py-8 border border-dashed border-[#e7e1d9] rounded-[10px]">
              No assignees yet. Add team members who can be assigned to lead tasks.
            </p>
          ) : (
            <ul className="space-y-2 max-h-[360px] overflow-y-auto">
              {assignees.map((assignee) => (
                <li
                  key={assignee.id}
                  className="px-3 py-2.5 bg-white border border-[#e7e1d9] rounded-[10px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f6ecee] text-[#7a1322] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13.5px] font-medium text-[#1c1a18] block truncate">
                        {assignee.name}
                      </span>
                      {editingEmailId === assignee.id ? (
                        <div className="mt-2 space-y-2">
                          {editingEmails.map((email, index) => (
                            <input
                              key={`edit-${assignee.id}-${index}`}
                              type="email"
                              value={email}
                              onChange={(e) => updateEditingEmail(index, e.target.value)}
                              placeholder={index === 0 ? 'Email 1' : `Email ${index + 1}`}
                              className={`${CRM_INPUT_CLASS} text-[12px] py-2`}
                            />
                          ))}
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingEmails((prev) => [...prev, ''])}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium border border-[#e7e1d9] rounded-full bg-white text-[#736c63]"
                            >
                              <Plus className="w-3 h-3" />
                              Add email
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleSaveEmails(assignee.id)}
                              disabled={savingEmailId === assignee.id}
                              className="px-3 py-1.5 text-[11.5px] font-medium text-white rounded-full bg-[#7a1322] disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEmailId(null)
                                setEditingEmails([''])
                              }}
                              className="px-3 py-1.5 text-[11.5px] font-medium border border-[#e7e1d9] rounded-full bg-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : assignee.emails.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => startEditingEmails(assignee)}
                          className="mt-1 w-full text-left hover:text-[#7a1322]"
                        >
                          <span className="inline-flex items-start gap-1 text-[11.5px] text-[#736c63] max-w-full">
                            <Mail className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span className="min-w-0">
                              {assignee.emails.map((email) => (
                                <span key={email} className="block truncate">
                                  {email}
                                </span>
                              ))}
                            </span>
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditingEmails(assignee)}
                          className="mt-1 inline-flex items-center gap-1 text-[11.5px] text-[#736c63] hover:text-[#7a1322]"
                        >
                          <Mail className="w-3 h-3" />
                          Add emails for notifications
                        </button>
                      )}
                    </div>
                    {confirmDeleteId === assignee.id ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => void handleDelete(assignee.id)}
                          disabled={deletingId === assignee.id}
                          className="px-2.5 py-1 text-[11.5px] font-medium text-white rounded-full bg-[#7a1322] hover:bg-[#5c0e1a] disabled:opacity-50"
                        >
                          {deletingId === assignee.id ? '…' : 'Remove'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={deletingId === assignee.id}
                          className="px-2.5 py-1 text-[11.5px] font-medium border border-[#e7e1d9] rounded-full bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(assignee.id)}
                        className="w-8 h-8 rounded-full border border-[#e7e1d9] bg-white flex items-center justify-center text-[#736c63] hover:border-[#7a1322] hover:text-[#7a1322] flex-shrink-0"
                        aria-label={`Remove ${assignee.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
