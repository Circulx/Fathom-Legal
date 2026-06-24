'use client'

import { useState } from 'react'
import { X, User, Trash2, Plus, Users } from 'lucide-react'
import type { CrmAssigneeRecord } from './data'
import { CRM_INPUT_CLASS } from './shared'

interface CrmAssigneeManagerProps {
  open: boolean
  onClose: () => void
  assignees: CrmAssigneeRecord[]
  onAdd: (name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function CrmAssigneeManager({
  open,
  onClose,
  assignees,
  onAdd,
  onDelete,
}: CrmAssigneeManagerProps) {
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  if (!open) return null

  const handleAdd = async () => {
    const name = newName.trim()
    if (!name) return

    setAdding(true)
    setError('')
    try {
      await onAdd(name)
      setNewName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add assignee')
    } finally {
      setAdding(false)
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

  return (
    <div className="fixed inset-0 bg-[#1c1a18]/45 z-50 flex items-start justify-center p-8 overflow-y-auto">
      <div className="bg-[#fbf9f6] text-[#1c1a18] [color-scheme:light] rounded-[14px] w-full max-w-[480px] shadow-2xl">
        <div className="flex items-center px-6 py-5 border-b border-[#e7e1d9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#f6ecee] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#7a1322]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#1c1a18]">Team assignees</h3>
              <p className="text-[12px] text-[#736c63]">Used when assigning tasks on leads</p>
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
          <div className="flex gap-2 mb-5">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleAdd()}
              placeholder="Add team member…"
              className={CRM_INPUT_CLASS}
            />
            <button
              type="button"
              onClick={() => void handleAdd()}
              disabled={adding || !newName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium text-white rounded-full bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] disabled:opacity-50 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {error && (
            <p className="text-[12px] text-[#7a1322] font-medium mb-4">{error}</p>
          )}

          {assignees.length === 0 ? (
            <p className="text-sm text-[#736c63] text-center py-8 border border-dashed border-[#e7e1d9] rounded-[10px]">
              No assignees yet. Add team members who can be assigned to lead tasks.
            </p>
          ) : (
            <ul className="space-y-2 max-h-[320px] overflow-y-auto">
              {assignees.map((assignee) => (
                <li
                  key={assignee.id}
                  className="flex items-center gap-3 px-3 py-2.5 bg-white border border-[#e7e1d9] rounded-[10px]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f6ecee] text-[#7a1322] flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[13.5px] font-medium text-[#1c1a18] flex-1 min-w-0 truncate">
                    {assignee.name}
                  </span>
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
