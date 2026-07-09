'use client'

import { useState } from 'react'
import { useInternalWork } from './InternalWorkContext'
import { initials } from './utils'
import type { InternalAssociate } from './types'

const ROLE_COLORS: Record<string, string> = {
  'Senior Associate': '#7a1322',
  'Associate': '#2f5d8a',
  'Paralegal': '#9a6b1f',
  'Junior': '#3f7a52',
  'Counsel': '#5a3a8a',
  'Partner': '#8C3B3B',
}

const AVATAR_BG_COLORS = [
  '#f6ecee', '#e6eef5', '#f5ecdb', '#e8f1ea', '#e9eef5', '#efe8f5', '#f0e8ec', '#e5eef5',
]

export function InternalWorkAssociates() {
  const { associates, tasks, addAssociate, deleteAssociate } = useInternalWork()
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAddAssociate = async () => {
    const name = newName.trim()
    const role = newRole.trim()
    if (!name) {
      setAddError('Please enter a full name')
      return
    }
    if (!role) {
      setAddError('Please enter a role')
      return
    }
    setAddError('')
    setAdding(true)
    try {
      await addAssociate(name, role)
      setNewName('')
      setNewRole('')
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add associate')
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteAssociate = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name}? Their open tasks will be unassigned.`)) return
    try {
      await deleteAssociate(id)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to remove associate')
    }
  }

  const getAssociateStats = (associate: InternalAssociate) => {
    const associateTasks = tasks.filter((t) => t.assignee === associate.id)
    const clientOpen = associateTasks.filter((t) => t.section === 'client' && t.status !== 'done').length
    const firmOpen = associateTasks.filter((t) => t.section === 'admin' && t.status !== 'done').length
    return { clientOpen, firmOpen }
  }

  const getAvatarBgColor = (id: string) => {
    const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
    return AVATAR_BG_COLORS[hash % AVATAR_BG_COLORS.length]
  }

  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#efebe4]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#736c63] uppercase tracking-wider">Associates</div>
            <h2 className="text-xl font-medium text-[#1c1a18] mt-1">Team</h2>
            <p className="text-sm text-[#736c63] mt-1">
              Add associates here so they appear as assignees on both client and firm-work tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Associates Grid */}
      {associates.length > 0 ? (
        <div className="p-5 border-b border-[#efebe4]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {associates.map((associate) => {
              const stats = getAssociateStats(associate)
              const roleColor = ROLE_COLORS[associate.role] || '#736c63'
              const avatarBg = getAvatarBgColor(associate.id)

              return (
                <div
                  key={associate.id}
                  className="border border-[#e7e1d9] rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm"
                      style={{ backgroundColor: avatarBg, color: roleColor }}
                    >
                      {initials(associate.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#1c1a18] truncate">{associate.name}</h3>
                      <p className="text-xs text-[#736c63]" style={{ color: roleColor }}>
                        {associate.role}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAssociate(associate.id, associate.name)}
                      className="text-[#736c63] hover:text-[#7a1322] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#736c63] mb-0.5">Client tasks open</span>
                      <span className="text-lg font-semibold text-[#1c1a18]">{stats.clientOpen}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#736c63] mb-0.5">Firm tasks open</span>
                      <span className="text-lg font-semibold text-[#1c1a18]">{stats.firmOpen}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border-b border-[#efebe4]">
          <p className="text-sm text-[#736c63]">No associates yet. Add one below to get started.</p>
        </div>
      )}

      {/* Add Associate Form */}
      <div className="p-5">
        <h3 className="font-medium text-[#1c1a18] mb-4">Add associate</h3>
        {addError && (
          <div className="mb-4 p-3 bg-[#ffe6e6] text-[#8C3B3B] text-sm rounded">
            {addError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Full name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3 py-2 border border-[#e7e1d9] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#7a1322]"
          />
          <input
            type="text"
            placeholder="Role (e.g. Associate, Paralegal)"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="px-3 py-2 border border-[#e7e1d9] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#7a1322]"
          />
          <button
            onClick={handleAddAssociate}
            disabled={adding}
            className="px-4 py-2 bg-[#7a1322] text-white rounded font-medium text-sm hover:bg-[#5c0e1a] transition-colors disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
