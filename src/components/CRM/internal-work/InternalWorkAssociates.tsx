'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import type { InternalAssociate } from './types'

interface InternalWorkAssociatesProps {
  associates: InternalAssociate[]
  onAddAssociate: (name: string, role: string, email?: string) => Promise<void>
  onDeleteAssociate: (id: string) => Promise<void>
  onUpdateAssociate: (id: string, data: Partial<Pick<InternalAssociate, 'name' | 'role' | 'email'>>) => Promise<void>
}

export function InternalWorkAssociates({
  associates,
  onAddAssociate,
  onDeleteAssociate,
  onUpdateAssociate,
}: InternalWorkAssociatesProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', role: '', email: '' })
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFormData({ name: '', role: '', email: '' })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.role.trim()) return

    setLoading(true)
    try {
      if (editingId) {
        await onUpdateAssociate(editingId, {
          name: formData.name,
          role: formData.role,
          email: formData.email || undefined,
        })
      } else {
        await onAddAssociate(formData.name, formData.role, formData.email || undefined)
      }
      resetForm()
    } catch (error) {
      console.error('Error saving associate:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (associate: InternalAssociate) => {
    setFormData({
      name: associate.name,
      role: associate.role,
      email: associate.email || '',
    })
    setEditingId(associate.id)
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this associate?')) return
    try {
      await onDeleteAssociate(id)
    } catch (error) {
      console.error('Error deleting associate:', error)
    }
  }

  const roleColors: Record<string, string> = {
    'Senior Associate': 'bg-[#d4b3c2] text-[#5a2f3d]',
    'Associate': 'bg-[#c5d8eb] text-[#2a4a6d]',
    'Paralegal': 'bg-[#d4dfc4] text-[#3d5a29]',
    'Partner': 'bg-[#e8c4b5] text-[#6b3d2a]',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-medium text-[#1c1a18]">Team Members</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#a8476c] hover:bg-[#8c2a4d] text-white px-4 py-2 rounded-[8px] transition-colors"
            type="button"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[13px] font-medium">Add member</span>
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="border border-[#e7e1d9] rounded-[12px] p-4 bg-[#fafaf8]">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border border-[#e7e1d9] rounded-[8px] text-[13px]"
              required
            />
            <input
              type="text"
              placeholder="Role (e.g. Associate)"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-3 py-2 border border-[#e7e1d9] rounded-[8px] text-[13px]"
              required
            />
            <input
              type="email"
              placeholder="Email (for notifications)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-3 py-2 border border-[#e7e1d9] rounded-[8px] text-[13px]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#a8476c] hover:bg-[#8c2a4d] text-white px-4 py-2 rounded-[8px] text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-[#f5f5f5] hover:bg-[#e7e1d9] text-[#1c1a18] px-4 py-2 rounded-[8px] text-[13px] font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Associates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {associates.map((associate) => (
          <div
            key={associate.id}
            className="border border-[#e7e1d9] rounded-[12px] p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-[#a8476c] text-white flex items-center justify-center text-[12px] font-semibold">
                {associate.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(associate)}
                  className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
                  type="button"
                >
                  <Edit2 className="w-4 h-4 text-[#736c63]" />
                </button>
                <button
                  onClick={() => handleDelete(associate.id)}
                  className="p-2 hover:bg-[#ffebee] rounded-lg transition-colors"
                  type="button"
                >
                  <Trash2 className="w-4 h-4 text-[#c62828]" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-[14px] font-semibold text-[#1c1a18]">{associate.name}</h4>
              <div className="flex items-center gap-2">
                <span className={`inline-block px-2 py-1 rounded-[6px] text-[12px] font-medium ${roleColors[associate.role] || roleColors['Associate']}`}>
                  {associate.role}
                </span>
              </div>
              {associate.email && (
                <p className="text-[12px] text-[#736c63]">{associate.email}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {associates.length === 0 && !isAdding && (
        <div className="text-center py-8">
          <p className="text-[#736c63] text-[14px]">No team members added yet</p>
        </div>
      )}
    </div>
  )
}
