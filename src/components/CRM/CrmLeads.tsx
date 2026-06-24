'use client'

import { useEffect, useRef, useState } from 'react'
import {
  X,
  ChevronDown,
  Check,
  Mail,
  Phone,
  Building2,
  Wind,
  Calendar,
  Clock,
  Send,
  Inbox,
  FileText,
  CircleCheck,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  CRM_STATUSES,
  LEAD_SOURCE_OPTIONS,
  PRACTICE_AREAS,
  getInitials,
  normalizeStatus,
  type CrmAssigneeRecord,
  type CrmLead,
  type CrmStatus,
} from './data'
import { STATUS_STYLES, STATUS_SWATCH, CRM_INPUT_CLASS, CRM_SELECT_CLASS, CRM_TEXTAREA_CLASS, CRM_NOTE_INPUT_CLASS } from './shared'
import LeadActionables from './LeadActionables'
import type { LeadPatch } from './data'

type StatusFilter = 'all' | CrmStatus

const FILTER_CHIPS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All leads' },
  { id: 'prospect', label: 'Prospect' },
  { id: 'booked', label: 'Consultation booked' },
  { id: 'proposal', label: 'Proposal sent' },
  { id: 'engagement', label: 'LOE' },
  { id: 'engaged', label: 'Engaged' },
  { id: 'open', label: 'Open' },
  { id: 'closed', label: 'Closed' },
]

const TIMELINE_ICONS: Record<string, typeof Inbox> = {
  inbox: Inbox,
  phone: Phone,
  calendar: Calendar,
  mail: Mail,
  file: FileText,
  check: CircleCheck,
}

function StatusDropdown({
  status,
  onChange,
}: {
  status: CrmStatus
  onChange: (status: CrmStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer border border-transparent hover:border-current ${STATUS_STYLES[status]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_SWATCH[status]}`} />
        {CRM_STATUSES[status]}
        <ChevronDown className="w-3 h-3 opacity-70" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-[#e7e1d9] rounded-[10px] shadow-lg py-1 min-w-[188px]">
          {(Object.keys(CRM_STATUSES) as CrmStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s)
                setOpen(false)
              }}
              className={`flex items-center gap-2 w-full px-2.5 py-2 text-left text-[12.5px] rounded-md hover:bg-[#f6ecee] ${
                s === status ? 'font-semibold text-[#7a1322]' : 'text-[#2a2724]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_SWATCH[s]}`} />
              {CRM_STATUSES[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface AddProspectForm {
  first: string
  last: string
  email: string
  phone: string
  company: string
  source: string
  status: CrmStatus
  areas: string[]
  matter: string
}

const emptyForm: AddProspectForm = {
  first: '',
  last: '',
  email: '',
  phone: '',
  company: '',
  source: 'Referral',
  status: 'prospect',
  areas: [],
  matter: '',
}

interface EditLeadForm {
  first: string
  last: string
  email: string
  phone: string
  company: string
  source: string
  areas: string[]
  matter: string
  date: string
  time: string
}

function leadToEditForm(lead: CrmLead): EditLeadForm {
  return {
    first: lead.first,
    last: lead.last,
    email: lead.email,
    phone: lead.phone === '—' ? '' : lead.phone,
    company: lead.company === '—' ? '' : lead.company,
    source: lead.source,
    areas: [...lead.areas],
    matter: lead.matter === '—' ? '' : lead.matter,
    date: lead.date === '—' ? '' : lead.date,
    time: lead.time === '—' ? '' : lead.time,
  }
}

export default function CrmLeads({
  leads,
  loading: leadsLoading,
  assignees,
  onEnsureAssignee,
  onPatchLead,
  onLeadAdded,
  onLeadDeleted,
}: {
  leads: CrmLead[]
  loading: boolean
  assignees: CrmAssigneeRecord[]
  onEnsureAssignee: (name: string) => Promise<void>
  onPatchLead: (id: string, patch: LeadPatch) => Promise<CrmLead>
  onLeadAdded: (lead: CrmLead) => void
  onLeadDeleted: (id: string) => Promise<void>
}) {
  const knownAssignees = assignees.map((a) => a.name)
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [addError, setAddError] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<AddProspectForm>(emptyForm)
  const [formError, setFormError] = useState(false)
  const [drawerLead, setDrawerLead] = useState<CrmLead | null>(null)
  const [noteInput, setNoteInput] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditLeadForm | null>(null)
  const [editError, setEditError] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  const filteredLeads =
    filter === 'all' ? leads : leads.filter((l) => l.status === filter)

  useEffect(() => {
    if (!drawerLead) return
    const current = leads.find((l) => l.id === drawerLead.id)
    if (current) setDrawerLead(current)
  }, [leads, drawerLead?.id])

  const updateLeadStatus = async (id: string, status: CrmStatus) => {
    try {
      const updated = await onPatchLead(id, { status })
      if (drawerLead?.id === id) setDrawerLead(updated)
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const openDrawer = (lead: CrmLead) => {
    const current = leads.find((l) => l.id === lead.id) || lead
    setDrawerLead(current)
    setNoteInput('')
    setIsEditing(false)
    setEditForm(null)
    setEditError('')
    setShowDeleteConfirm(false)
  }

  const closeDrawer = () => {
    setDrawerLead(null)
    setIsEditing(false)
    setEditForm(null)
    setShowDeleteConfirm(false)
  }

  const startEdit = () => {
    if (!drawerLead) return
    setEditForm(leadToEditForm(drawerLead))
    setEditError('')
    setIsEditing(true)
    setShowDeleteConfirm(false)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditForm(null)
    setEditError('')
  }

  const saveEdit = async () => {
    if (!drawerLead || !editForm) return
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!editForm.first.trim() || !editForm.last.trim() || !emailRe.test(editForm.email.trim())) {
      setEditError('Enter a first name, last name, and valid email.')
      return
    }

    setEditSubmitting(true)
    setEditError('')
    try {
      const updated = await onPatchLead(drawerLead.id, {
        first: editForm.first.trim(),
        last: editForm.last.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        company: editForm.company.trim(),
        source: editForm.source,
        areas: editForm.areas.length > 0 ? editForm.areas : ['Corporate advisory'],
        matter: editForm.matter.trim(),
        date: editForm.date.trim() || '—',
        time: editForm.time.trim() || '—',
      })
      setDrawerLead(updated)
      setIsEditing(false)
      setEditForm(null)
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Failed to save changes')
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDeleteLead = async () => {
    if (!drawerLead) return
    setDeleteSubmitting(true)
    try {
      await onLeadDeleted(drawerLead.id)
      closeDrawer()
    } catch (error) {
      console.error('Failed to delete lead:', error)
      setDeleteSubmitting(false)
    }
  }

  const toggleEditArea = (area: string) => {
    if (!editForm) return
    setEditForm((prev) =>
      prev
        ? {
            ...prev,
            areas: prev.areas.includes(area)
              ? prev.areas.filter((a) => a !== area)
              : [...prev.areas, area],
          }
        : prev
    )
  }

  const openEmailClient = (lead: CrmLead) => {
    const subject = 'Re: Your enquiry with Fathom Legal'
    const body = `Hi ${lead.first},\n\n`
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  const handleAddProspect = async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.first.trim() || !form.last.trim() || !emailRe.test(form.email.trim())) {
      setFormError(true)
      return
    }

    setAddSubmitting(true)
    setAddError('')

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first: form.first.trim(),
          last: form.last.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          source: form.source,
          status: form.status,
          areas: form.areas.length > 0 ? form.areas : ['Corporate advisory'],
          matter: form.matter.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to add prospect')
      }

      const data = await response.json()
      const newLead: CrmLead = {
        ...data.lead,
        status: normalizeStatus(data.lead.status),
        actionables: data.lead.actionables ?? [],
        createdAt: data.lead.createdAt ?? new Date().toISOString(),
      }

      onLeadAdded(newLead)
      setShowModal(false)
      setForm(emptyForm)
      setFormError(false)
    } catch (error) {
      console.error('Add prospect error:', error)
      setAddError(error instanceof Error ? error.message : 'Failed to add prospect')
    } finally {
      setAddSubmitting(false)
    }
  }

  const addNote = async () => {
    if (!drawerLead || !noteInput.trim()) return
    try {
      const updated = await onPatchLead(drawerLead.id, { note: noteInput.trim() })
      setDrawerLead(updated)
      setNoteInput('')
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }

  const updateActionables = async (actionables: CrmLead['actionables']) => {
    if (!drawerLead) return
    try {
      const updated = await onPatchLead(drawerLead.id, { actionables })
      setDrawerLead(updated)
    } catch (error) {
      console.error('Failed to update actionables:', error)
    }
  }

  const toggleArea = (area: string) => {
    setForm((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area],
    }))
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5 mb-5">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              className={`border rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors ${
                filter === chip.id
                  ? 'bg-[#7a1322] text-white border-[#7a1322]'
                  : 'bg-white text-[#736c63] border-[#e7e1d9] hover:border-[#7a1322] hover:text-[#7a1322]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm)
            setFormError(false)
            setAddError('')
            setShowModal(true)
          }}
          className="inline-flex items-center gap-1.5 bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] text-white rounded-full px-4 py-2 text-[13px] font-medium shadow-md hover:-translate-y-px transition-transform"
        >
          <span className="text-[17px] leading-none font-semibold">+</span>
          Add prospect
        </button>
      </div>

      <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#fbf9f6]">
                {['Client', 'Practice areas', 'Source', 'Consultation', 'Status'].map((col) => (
                  <th
                    key={col}
                    className="text-[11px] uppercase tracking-wide text-[#736c63] font-semibold text-left px-4 py-3 border-b border-[#e7e1d9]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leadsLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[#736c63] text-sm">
                    Loading leads…
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[#736c63] text-sm">
                    No prospects yet. Use &quot;Add prospect&quot; to create one.
                  </td>
                </tr>
              ) : (
              filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => openDrawer(lead)}
                  className="cursor-pointer hover:bg-[#f6ecee] transition-colors border-b border-[#efebe4] last:border-b-0 text-[#2a2724]"
                >
                  <td className="px-4 py-3 text-[#1c1a18]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[34px] h-[34px] rounded-full bg-[#f6ecee] text-[#7a1322] flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                        {getInitials(lead.first, lead.last)}
                      </div>
                      <div>
                        <div className="text-[13.5px] font-medium text-[#1c1a18]">
                          {lead.first} {lead.last}
                        </div>
                        <div className="text-[11.5px] text-[#736c63]">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {lead.areas.map((area) => (
                        <span
                          key={area}
                          className="text-[11px] bg-[#f6ecee] text-[#7a1322] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13.5px] text-[#736c63]">{lead.source}</td>
                  <td className="px-4 py-3 text-[13.5px]">
                    {lead.date === '—' ? (
                      <span className="text-[#736c63]">Not booked</span>
                    ) : (
                      <span className="text-[#7a1322] font-medium">
                        {lead.date} · {lead.time}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown
                      status={normalizeStatus(lead.status)}
                      onChange={(s) => updateLeadStatus(lead.id, s)}
                    />
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add prospect modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1c1a18]/45 z-50 flex items-start justify-center p-8 overflow-y-auto">
          <div className="bg-[#fbf9f6] text-[#1c1a18] [color-scheme:light] rounded-[14px] w-full max-w-[540px] shadow-2xl">
            <div className="flex items-center px-6 py-5 border-b border-[#e7e1d9]">
              <h3 className="text-xl font-medium text-[#1c1a18]">Add a prospect</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="ml-auto w-8 h-8 rounded-full border border-[#e7e1d9] bg-white flex items-center justify-center text-[#736c63] hover:border-[#7a1322] hover:text-[#7a1322]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                    First name *
                  </label>
                  <input
                    value={form.first}
                    onChange={(e) => setForm((p) => ({ ...p, first: e.target.value }))}
                    placeholder="Jane"
                    className={CRM_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                    Last name *
                  </label>
                  <input
                    value={form.last}
                    onChange={(e) => setForm((p) => ({ ...p, last: e.target.value }))}
                    placeholder="Smith"
                    className={CRM_INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className={CRM_INPUT_CLASS}
                />
                {formError && (
                  <p className="text-[12px] text-[#7a1322] font-medium mt-1">
                    Enter a first name, last name and valid email.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className={CRM_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                    Company / Organisation
                  </label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    placeholder="Optional"
                    className={CRM_INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                    How did they hear about us?
                  </label>
                  <select
                    value={form.source}
                    onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                    className={CRM_SELECT_CLASS}
                  >
                    {LEAD_SOURCE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                    Initial status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value as CrmStatus }))
                    }
                    className={CRM_SELECT_CLASS}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="booked">Consultation booked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                  Practice areas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRACTICE_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArea(area)}
                      className={`text-xs border rounded-full px-3 py-1.5 transition-colors ${
                        form.areas.includes(area)
                          ? 'bg-[#f6ecee] text-[#7a1322] border-[#7a1322] font-medium'
                          : 'bg-white text-[#736c63] border-[#e7e1d9] hover:border-[#7a1322]'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                  Matter description
                </label>
                <textarea
                  value={form.matter}
                  onChange={(e) => setForm((p) => ({ ...p, matter: e.target.value }))}
                  placeholder="Briefly describe the legal matter…"
                  rows={3}
                  className={CRM_TEXTAREA_CLASS}
                />
              </div>

              {addError && (
                <p className="text-[12px] text-[#7a1322] font-medium">{addError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-[#e7e1d9]">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-[13.5px] font-medium border border-[#e7e1d9] rounded-full bg-white hover:border-[#7a1322] hover:text-[#7a1322]"
                disabled={addSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProspect}
                disabled={addSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-medium text-white rounded-full bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {addSubmitting ? 'Adding…' : 'Add prospect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead detail drawer */}
      {drawerLead && (
        <>
          <div
            className="fixed inset-0 bg-[#1c1a18]/42 z-50"
            onClick={closeDrawer}
          />
          <aside className="fixed top-0 right-0 bottom-0 w-[440px] max-w-[92vw] bg-[#fbf9f6] text-[#2a2724] [color-scheme:light] z-[60] flex flex-col shadow-2xl">
            <div className="bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] text-white p-6 relative">
              <div className="absolute top-5 right-5 flex items-center gap-2">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={startEdit}
                    className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25"
                    title="Edit lead"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-[54px] h-[54px] rounded-full bg-white/18 border border-white/30 flex items-center justify-center text-lg font-semibold mb-3">
                {getInitials(drawerLead.first, drawerLead.last)}
              </div>
              <h2 className="text-[22px] font-medium">
                {drawerLead.first} {drawerLead.last}
              </h2>
              <p className="text-[12.5px] opacity-85 mt-1">
                {drawerLead.company !== '—'
                  ? `${drawerLead.company} · ${drawerLead.ago}`
                  : `Individual · ${drawerLead.ago}`}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {isEditing && editForm ? (
                <section className="space-y-4">
                  <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold">
                    Edit lead details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                        First name *
                      </label>
                      <input
                        value={editForm.first}
                        onChange={(e) => setEditForm((p) => p && { ...p, first: e.target.value })}
                        className={CRM_INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                        Last name *
                      </label>
                      <input
                        value={editForm.last}
                        onChange={(e) => setEditForm((p) => p && { ...p, last: e.target.value })}
                        className={CRM_INPUT_CLASS}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((p) => p && { ...p, email: e.target.value })}
                      className={CRM_INPUT_CLASS}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">Phone</label>
                      <input
                        value={editForm.phone}
                        onChange={(e) => setEditForm((p) => p && { ...p, phone: e.target.value })}
                        className={CRM_INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                        Company
                      </label>
                      <input
                        value={editForm.company}
                        onChange={(e) => setEditForm((p) => p && { ...p, company: e.target.value })}
                        className={CRM_INPUT_CLASS}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">Source</label>
                    <select
                      value={editForm.source}
                      onChange={(e) => setEditForm((p) => p && { ...p, source: e.target.value })}
                      className={CRM_SELECT_CLASS}
                    >
                      {LEAD_SOURCE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                      Practice areas
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRACTICE_AREAS.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleEditArea(area)}
                          className={`text-xs border rounded-full px-3 py-1.5 transition-colors ${
                            editForm.areas.includes(area)
                              ? 'bg-[#f6ecee] text-[#7a1322] border-[#7a1322] font-medium'
                              : 'bg-white text-[#736c63] border-[#e7e1d9] hover:border-[#7a1322]'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                      Matter description
                    </label>
                    <textarea
                      value={editForm.matter}
                      onChange={(e) => setEditForm((p) => p && { ...p, matter: e.target.value })}
                      rows={3}
                      className={CRM_TEXTAREA_CLASS}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                        Consultation date
                      </label>
                      <input
                        value={editForm.date}
                        onChange={(e) => setEditForm((p) => p && { ...p, date: e.target.value })}
                        placeholder="e.g. Wed, Jul 1"
                        className={CRM_INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-medium text-[#1c1a18] mb-1.5">
                        Consultation time
                      </label>
                      <input
                        value={editForm.time}
                        onChange={(e) => setEditForm((p) => p && { ...p, time: e.target.value })}
                        placeholder="e.g. 10:00 AM"
                        className={CRM_INPUT_CLASS}
                      />
                    </div>
                  </div>
                  {editError && (
                    <p className="text-[12px] text-[#7a1322] font-medium">{editError}</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={editSubmitting}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white rounded-full bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {editSubmitting ? 'Saving…' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={editSubmitting}
                      className="px-4 py-2.5 text-[13px] font-medium border border-[#e7e1d9] rounded-full bg-white hover:border-[#7a1322] hover:text-[#7a1322]"
                    >
                      Cancel
                    </button>
                  </div>
                </section>
              ) : (
                <>
              <section>
                <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold mb-2">
                  Contact
                </h4>
                {[
                  { icon: Mail, label: 'Email', value: drawerLead.email },
                  { icon: Phone, label: 'Phone', value: drawerLead.phone },
                  { icon: Building2, label: 'Company', value: drawerLead.company },
                  { icon: Wind, label: 'Source', value: drawerLead.source },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex gap-2.5 py-2 text-[13.5px] border-b border-[#efebe4] last:border-b-0"
                  >
                    <Icon className="w-4 h-4 text-[#7a1322] flex-shrink-0 mt-0.5" />
                    <span className="text-[#736c63] min-w-[74px]">{label}</span>
                    <span className="text-[#1c1a18] font-medium">{value}</span>
                  </div>
                ))}
              </section>

              <section>
                <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold mb-2">
                  Practice areas
                </h4>
                <div className="flex flex-wrap gap-1">
                  {drawerLead.areas.map((area) => (
                    <span
                      key={area}
                      className="text-[11px] bg-[#f6ecee] text-[#7a1322] px-2 py-0.5 rounded-full font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold mb-2">
                  Matter description
                </h4>
                <div className="bg-white border border-[#e7e1d9] rounded-[10px] p-3.5 text-[13.5px] leading-relaxed text-[#2a2724]">
                  {drawerLead.matter}
                </div>
              </section>

              <section>
                <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold mb-2">
                  Consultation
                </h4>
                {[
                  {
                    icon: Calendar,
                    label: 'Date',
                    value: drawerLead.date === '—' ? 'Not booked yet' : drawerLead.date,
                  },
                  {
                    icon: Clock,
                    label: 'Time',
                    value: drawerLead.time === '—' ? '—' : `${drawerLead.time} IST`,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex gap-2.5 py-2 text-[13.5px] border-b border-[#efebe4] last:border-b-0"
                  >
                    <Icon className="w-4 h-4 text-[#7a1322] flex-shrink-0 mt-0.5" />
                    <span className="text-[#736c63] min-w-[74px]">{label}</span>
                    <span className="text-[#1c1a18] font-medium">{value}</span>
                  </div>
                ))}
              </section>

              <section>
                <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold mb-2">
                  Status
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(CRM_STATUSES) as CrmStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateLeadStatus(drawerLead.id, s)}
                      className={`text-[11.5px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                        drawerLead.status === s
                          ? 'bg-[#7a1322] text-white border-[#7a1322]'
                          : 'bg-white text-[#736c63] border-[#e7e1d9] hover:border-[#7a1322]'
                      }`}
                    >
                      {CRM_STATUSES[s]}
                    </button>
                  ))}
                </div>
              </section>

              <LeadActionables
                actionables={drawerLead.actionables}
                knownAssignees={knownAssignees}
                onEnsureAssignee={onEnsureAssignee}
                onChange={updateActionables}
              />

              <section>
                <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold mb-2">
                  Activity
                </h4>
                <div className="space-y-0">
                  {drawerLead.timeline.map((item, i) => {
                    const Icon = TIMELINE_ICONS[item.icon] || Inbox
                    return (
                      <div key={i} className="flex gap-2.5 pb-4 relative">
                        {i < drawerLead.timeline.length - 1 && (
                          <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[#e7e1d9]" />
                        )}
                        <div className="w-[23px] h-[23px] rounded-full bg-[#f6ecee] flex items-center justify-center flex-shrink-0 z-10">
                          <Icon className="w-3 h-3 text-[#7a1322]" />
                        </div>
                        <div>
                          <p className="text-[12.5px] text-[#2a2724]">{item.text}</p>
                          <p className="text-[11px] text-[#736c63] mt-0.5">{item.when}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    placeholder="Add an internal note…"
                    className={CRM_NOTE_INPUT_CLASS}
                  />
                  <button
                    type="button"
                    onClick={addNote}
                    className="w-10 h-10 rounded-full bg-[#7a1322] text-white flex items-center justify-center flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </section>

              <section className="pt-2 border-t border-[#efebe4]">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[#7a1322] hover:text-[#5c0e1a]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete lead
                  </button>
                ) : (
                  <div className="bg-[#fdf5f6] border border-[#e7e1d9] rounded-[10px] p-4">
                    <p className="text-[13px] text-[#2a2724] mb-3">
                      Delete {drawerLead.first} {drawerLead.last}? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDeleteLead}
                        disabled={deleteSubmitting}
                        className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white rounded-full bg-[#7a1322] hover:bg-[#5c0e1a] disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleteSubmitting ? 'Deleting…' : 'Yes, delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleteSubmitting}
                        className="px-4 py-2 text-[13px] font-medium border border-[#e7e1d9] rounded-full bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>
                </>
              )}
            </div>

            {!isEditing && (
            <div className="p-4 border-t border-[#e7e1d9] flex gap-2.5 bg-[#fbf9f6]">
              <button
                type="button"
                onClick={() => openEmailClient(drawerLead)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-[13.5px] font-medium text-white rounded-full bg-gradient-to-br from-[#7a1322] to-[#5c0e1a]"
              >
                <Mail className="w-4 h-4" />
                Email client
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-3 text-[13.5px] font-medium border border-[#e7e1d9] rounded-full bg-white hover:border-[#7a1322] hover:text-[#7a1322]"
              >
                <Calendar className="w-4 h-4" />
                Reschedule
              </button>
            </div>
            )}
          </aside>
        </>
      )}
    </>
  )
}
