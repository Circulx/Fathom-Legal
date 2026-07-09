'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useInternalWork } from './InternalWorkContext'

interface NewTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const CLIENT_CATEGORIES = ['Drafting', 'Research', 'Correspondence', 'Meetings', 'Filing', 'Other']
const ADMIN_CATEGORIES = ['LinkedIn & Content', 'Business Development', 'Research', 'Study / CPD', 'Marketing', 'Firm Ops', 'Internal']

// Priority mapping: display value → API value
const PRIORITY_MAP: Record<string, 'high' | 'med' | 'low'> = {
  'High': 'high',
  'Medium': 'med',
  'Low': 'low',
}

// Status mapping: display value → API value
const STATUS_MAP: Record<string, 'todo' | 'progress' | 'blocked' | 'done'> = {
  'To Do': 'todo',
  'In Progress': 'progress',
  'Blocked': 'blocked',
  'Done': 'done',
}

export function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const { associates, tasks, saveTask } = useInternalWork()
  const [workType, setWorkType] = useState<'client' | 'admin'>('client')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('To Do')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const categories = workType === 'client' ? CLIENT_CATEGORIES : ADMIN_CATEGORIES

  // Reset category when work type changes
  useEffect(() => {
    setCategory('')
    setError('')
  }, [workType])

  // Generate task number
  const taskNumber = tasks.filter((t) => t.section === workType).length + 1
  const taskId = workType === 'client' ? `CLI-${String(taskNumber).padStart(3, '0')}` : `PRC-${String(taskNumber).padStart(3, '0')}`

  const handleSave = async () => {
    setError('')

    // Validation
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!category) {
      setError('Category is required')
      return
    }
    if (!assignee) {
      setError('Assignee is required')
      return
    }
    if (!dueDate) {
      setError('Due date is required')
      return
    }

    setSaving(true)
    try {
      // Convert YYYY-MM-DD to ISO string: YYYY-MM-DDTHH:MM:SS.sssZ
      const dueISO = dueDate ? `${dueDate}T00:00:00.000Z` : new Date().toISOString()
      
      // Map display values to API values
      const priorityValue = PRIORITY_MAP[priority] || 'med'
      const statusValue = STATUS_MAP[status] || 'todo'
      
      await saveTask({
        title: title.trim(),
        category,
        assignee,
        priority: priorityValue,
        due: dueISO,
        status: statusValue,
        notes: notes.trim(),
        section: workType,
      })

      // Reset form
      setTitle('')
      setCategory('')
      setAssignee('')
      setPriority('Medium')
      setDueDate('')
      setStatus('To Do')
      setNotes('')
      setWorkType('client')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#FBF9F4', borderRadius: '6px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #D9D0BC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px', color: '#221F1D' }}>New task</h2>
            <p style={{ fontSize: '12px', color: '#4A4642', margin: '0' }}>Assign work and it&apos;ll appear on the register and calendar.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#4A4642', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Work Type Toggle */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '8px' }}>Work Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => setWorkType('client')}
                style={{
                  padding: '10px 16px',
                  borderRadius: '3px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  backgroundColor: workType === 'client' ? '#221F1D' : '#FBF9F4',
                  color: workType === 'client' ? '#FBF9F4' : '#221F1D',
                  transition: 'all 0.2s',
                }}
              >
                Client Deliverable
              </button>
              <button
                onClick={() => setWorkType('admin')}
                style={{
                  padding: '10px 16px',
                  borderRadius: '3px',
                  border: '1px solid #D9D0BC',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  backgroundColor: workType === 'admin' ? '#221F1D' : '#FBF9F4',
                  color: workType === 'admin' ? '#FBF9F4' : '#221F1D',
                  transition: 'all 0.2s',
                }}
              >
                Practice & Firm Work
              </button>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '8px' }}>Title</label>
            <input
              type="text"
              placeholder="e.g. Draft LinkedIn post on RBI circular"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D9D0BC',
                borderRadius: '3px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#FBF9F4',
                color: '#221F1D',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #8C2A2A')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {/* Category & Assignee Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '8px' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #D9D0BC',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  backgroundColor: '#FBF9F4',
                  color: '#221F1D',
                  cursor: 'pointer',
                }}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '8px' }}>Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #D9D0BC',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  backgroundColor: '#FBF9F4',
                  color: '#221F1D',
                  cursor: 'pointer',
                }}
              >
                <option value="">Select assignee</option>
                {associates.map((assoc) => (
                  <option key={assoc.id} value={assoc.id}>
                    {assoc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Due Date Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '8px' }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #D9D0BC',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  backgroundColor: '#FBF9F4',
                  color: '#221F1D',
                  cursor: 'pointer',
                }}
              >
                <option value="High">High</option>
                <option value="Medium" selected>Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '8px' }}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #D9D0BC',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  backgroundColor: '#FBF9F4',
                  color: '#221F1D',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '8px' }}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D9D0BC',
                borderRadius: '3px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#FBF9F4',
                color: '#221F1D',
                cursor: 'pointer',
              }}
            >
              <option value="To Do" selected>To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '8px' }}>Notes</label>
            <textarea
              placeholder="Optional context for the associate"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D9D0BC',
                borderRadius: '3px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#FBF9F4',
                color: '#221F1D',
                outline: 'none',
                minHeight: '80px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ marginBottom: '20px', padding: '10px 12px', backgroundColor: '#F1DEDC', color: '#8C3B3B', fontSize: '13px', borderRadius: '3px' }}>
              {error}
            </div>
          )}

          {/* Task ID */}
          <div style={{ marginBottom: '20px', fontSize: '12px', color: '#4A4642', fontFamily: "'IBM Plex Mono', monospace" }}>
            {taskId}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '3px',
                border: '1px solid #D9D0BC',
                backgroundColor: '#FBF9F4',
                color: '#221F1D',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 20px',
                borderRadius: '3px',
                border: 'none',
                backgroundColor: '#8C2A2A',
                color: '#FBF3F1',
                fontWeight: '600',
                fontSize: '13px',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#6E1F1F')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8C2A2A')}
            >
              {saving ? 'Saving...' : 'Save task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
