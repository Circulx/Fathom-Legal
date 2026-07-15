'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useInternalWork } from './InternalWorkContext'
import { initials } from './utils'
import type { InternalAssociate } from './types'

const ROLE_COLORS: Record<string, string> = {
  'Senior Associate': '#8C2A2A',
  'Associate': '#4C5F6B',
  'Paralegal': '#94702C',
  'Associate Attorney': '#4B6650',
}

const AVATAR_BG_COLORS = ['#F3E4E1', '#E1E7E9', '#F1E6CD', '#E2E9DF']

const getAvatarBgColor = (id: string) => {
  return AVATAR_BG_COLORS[id.charCodeAt(0) % AVATAR_BG_COLORS.length]
}

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

  return (
    <div style={{ backgroundColor: '#FBF9F4', border: '1px solid #D9D0BC', borderRadius: '3px', boxShadow: '0 1px 2px rgba(34,31,29,0.06), 0 6px 20px rgba(34,31,29,0.05)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '22px 24px', borderBottom: '1px solid #D9D0BC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Associates</div>
            <h2 style={{ fontSize: '28px', fontWeight: '600', margin: '0', color: '#221F1D' }}>Team</h2>
            <p style={{ fontSize: '13.5px', color: '#4A4642', marginTop: '6px', maxWidth: '560px', lineHeight: '1.5' }}>
              Add associates here so they appear as assignees on both client and firm-work tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Associates Grid */}
      {associates.length > 0 ? (
        <div style={{ padding: '22px 24px', borderBottom: '1px solid #D9D0BC' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {associates.map((associate) => {
              const stats = getAssociateStats(associate)
              const roleColor = ROLE_COLORS[associate.role] || '#4A4642'
              const avatarBg = getAvatarBgColor(associate.id)

              return (
                <div
                  key={associate.id}
                  style={{
                    backgroundColor: '#FBF9F4',
                    border: '1px solid #D9D0BC',
                    borderRadius: '3px',
                    padding: '18px',
                    boxShadow: '0 1px 2px rgba(34,31,29,0.06), 0 6px 20px rgba(34,31,29,0.05)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(34,31,29,0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 2px rgba(34,31,29,0.06), 0 6px 20px rgba(34,31,29,0.05)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: `1.5px solid ${roleColor}`,
                        color: roleColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Source Serif 4', serif",
                        fontWeight: '600',
                        fontSize: '14px',
                        backgroundColor: avatarBg,
                        flexShrink: 0,
                      }}
                    >
                      {initials(associate.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0', color: '#221F1D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {associate.name}
                      </h3>
                      <p style={{ fontSize: '11.5px', color: roleColor, margin: '2px 0 0', fontWeight: '500' }}>{associate.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDeleteAssociate(associate.id, associate.name)}
                      aria-label={`Remove ${associate.name}`}
                      title="Remove associate"
                      style={{
                        background: 'none',
                        border: '1px solid #D9D0BC',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        color: '#8C2A2A',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F1DEDC'
                        e.currentTarget.style.borderColor = '#8C2A2A'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.borderColor = '#D9D0BC'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '18px', fontSize: '12px', color: '#4A4642', borderTop: '1px solid #D9D0BC', paddingTop: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#4A4642', fontSize: '12px', marginBottom: '4px' }}>Client tasks open</div>
                      <div style={{ fontFamily: "'Source Serif 4', serif", color: '#221F1D', fontSize: '15px', fontWeight: '600', display: 'block' }}>
                        {stats.clientOpen}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#4A4642', fontSize: '12px', marginBottom: '4px' }}>Firm tasks open</div>
                      <div style={{ fontFamily: "'Source Serif 4', serif", color: '#221F1D', fontSize: '15px', fontWeight: '600', display: 'block' }}>
                        {stats.firmOpen}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#4A4642', fontSize: '13px', borderBottom: '1px solid #D9D0BC' }}>
          No associates yet. Add one below to get started.
        </div>
      )}

      {/* Add Associate Form */}
      <div style={{ padding: '22px 24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px', color: '#221F1D' }}>Add associate</h3>
        {addError && (
          <div style={{ marginBottom: '14px', padding: '9px 11px', backgroundColor: '#F1DEDC', color: '#8C3B3B', fontSize: '13px', borderRadius: '3px' }}>
            {addError}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Full name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #D9D0BC',
                borderRadius: '3px',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                backgroundColor: '#FBF9F4',
                color: '#221F1D',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #8C2A2A')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Role (e.g. Associate, Paralegal)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #D9D0BC',
                borderRadius: '3px',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                backgroundColor: '#FBF9F4',
                color: '#221F1D',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #8C2A2A')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>
          <button
            onClick={handleAddAssociate}
            disabled={adding}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 16px',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              backgroundColor: '#8C2A2A',
              color: '#FBF3F1',
              cursor: adding ? 'not-allowed' : 'pointer',
              opacity: adding ? 0.6 : 1,
            }}
            onMouseEnter={(e) => !adding && (e.currentTarget.style.backgroundColor = '#6E1F1F')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8C2A2A')}
          >
            {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
