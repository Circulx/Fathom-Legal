'use client'

import { useState, useMemo } from 'react'
import { X, Calendar } from 'lucide-react'
import { useInternalWork } from './InternalWorkContext'
import type { TaskSection, TaskPriority, TaskStatus } from './types'

interface NewTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES_BY_SECTION: Record<TaskSection, string[]> = {
  client: ['Drafting', 'Research', 'Correspondence', 'Meetings', 'Filing', 'Other'],
  admin: ['LinkedIn & Content', 'Business Dev', 'Research', 'Study/CPD', 'Marketing', 'Firm Ops', 'Internal'],
}

const PRIORITIES: Array<{ value: TaskPriority; label: string }> = [
  { value: 'high', label: 'High' },
  { value: 'med', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const STATUSES: Array<{ value: TaskStatus; label: string }> = [
  { value: 'todo', label: 'To Do' },
  { value: 'progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
]

export function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const { associates, saveTask, tasks } = useInternalWork()
  const [workType, setWorkType] = useState<TaskSection>('client')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('med')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const categories = useMemo(() => CATEGORIES_BY_SECTION[workType], [workType])

  // Generate task number based on work type and existing tasks
  const taskNumber = useMemo(() => {
    const sectionTasks = tasks.filter((t) => t.section === workType)
    const maxNum = sectionTasks.length > 0 ? Math.max(...sectionTasks.map((t) => t.taskNumber)) : 0
    return maxNum + 1
  }, [tasks, workType])

  const taskId = `${workType === 'client' ? 'CLI' : 'PRC'}-${String(taskNumber).padStart(3, '0')}`

  const handleWorkTypeChange = (type: TaskSection) => {
    setWorkType(type)
    setCategory('')
    setAssignee('')
  }

  const handleSave = async () => {
    setError('')

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
      await saveTask({
        section: workType,
        category,
        title,
        assignee,
        priority,
        due: dueDate,
        status,
        notes,
      })
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setWorkType('client')
    setTitle('')
    setCategory('')
    setAssignee('')
    setPriority('med')
    setDueDate('')
    setStatus('todo')
    setNotes('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: '#FBF9F4', borderRadius: '3px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #D9D0BC' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0', color: '#221F1D' }}>New task</h2>
            <p style={{ fontSize: '12px', color: '#4A4642', margin: '4px 0 0' }}>Assign work and it&apos;ll appear on the register and calendar.</p>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A4642', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {/* Work Type Selection */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '10px' }}>Work Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => handleWorkTypeChange('client')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  backgroundColor: workType === 'client' ? '#FBF9F4' : '#221F1D',
                  color: workType === 'client' ? '#221F1D' : '#FBF9F4',
                  transition: 'all 0.2s',
                }}
              >
                Client Deliverable
              </button>
              <button
                onClick={() => handleWorkTypeChange('admin')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  backgroundColor: workType === 'admin' ? '#FBF9F4' : '#221F1D',
                  color: workType === 'admin' ? '#221F1D' : '#FBF9F4',
                  transition: 'all 0.2s',
                }}
              >
                Practice & Firm Work
              </button>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Title</label>
            <input
              type="text"
              placeholder="e.g. Draft LinkedIn post on RBI circular"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 11px',
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1px solid #D9D0BC',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  backgroundColor: '#FBF9F4',
                  color: '#221F1D',
                  outline: 'none',
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
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1px solid #D9D0BC',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  backgroundColor: '#FBF9F4',
                  color: '#221F1D',
                  outline: 'none',
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1px solid #D9D0BC',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  backgroundColor: '#FBF9F4',
                  color: '#221F1D',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Due Date</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 11px',
                    border: '1px solid #D9D0BC',
                    borderRadius: '3px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    backgroundColor: '#FBF9F4',
                    color: '#221F1D',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
                <Calendar size={16} style={{ position: 'absolute', right: '8px', color: '#4A4642', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1px solid #D9D0BC',
                borderRadius: '3px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#FBF9F4',
                color: '#221F1D',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Notes</label>
            <textarea
              placeholder="Optional context for the associate"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1px solid #D9D0BC',
                borderRadius: '3px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#FBF9F4',
                color: '#221F1D',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #8C2A2A')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ marginBottom: '18px', padding: '9px 11px', backgroundColor: '#F1DEDC', color: '#8C3B3B', fontSize: '13px', borderRadius: '3px' }}>
              {error}
            </div>
          )}

          {/* Task ID */}
          <div style={{ fontSize: '11px', color: '#4A4642', marginBottom: '18px' }}>{taskId}</div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #D9D0BC', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={handleClose}
            style={{
              padding: '9px 16px',
              borderRadius: '3px',
              border: '1px solid #D9D0BC',
              backgroundColor: '#FBF9F4',
              color: '#221F1D',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E8E2D4')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FBF9F4')}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '9px 16px',
              borderRadius: '3px',
              border: 'none',
              backgroundColor: '#8C2A2A',
              color: '#FBF3F1',
              fontSize: '13px',
              fontWeight: '600',
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
  )
}
