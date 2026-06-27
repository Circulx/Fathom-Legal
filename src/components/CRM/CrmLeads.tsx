'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
  Video,
  ExternalLink,
  Users,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  GitMerge,
} from 'lucide-react'
import {
  CRM_STATUSES,
  LEAD_SOURCE_OPTIONS,
  PRACTICE_AREAS,
  getInitials,
  normalizeStatus,
  filterLeads,
  collectLeadSourceOptions,
  UNASSIGNED_ASSIGNEE,
  type CrmAssigneeRecord,
  type CrmLead,
  type CrmStatus,
  type LeadDateRangeField,
  type LeadListFilters,
  type StatusFilter,
} from './data'
import { STATUS_STYLES, STATUS_SWATCH, CRM_INPUT_CLASS, CRM_SELECT_CLASS, CRM_TEXTAREA_CLASS, CRM_NOTE_INPUT_CLASS } from './shared'
import LeadActionables from './LeadActionables'
import CrmAssigneeManager from './CrmAssigneeManager'
import type { LeadPatch } from './data'
import { downloadLeadsCsv } from '@/lib/crm-export'
import { getDuplicateLeadIds, getDuplicateSiblings } from '@/lib/crm-duplicate-leads'
import { formatTimeDisplay, toTime24 } from '@/lib/time-format'
import BookingMonthCalendar from '@/components/BookingMonthCalendar'
import { getLeadConsultationDate } from '@/lib/crm-consultation-dates'
import { toDateKey } from '@/lib/booking-calendar'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

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
  users: Users,
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
  consultationDateIso: string
  consultationTime24: string
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
  consultationDateIso: '',
  consultationTime24: '',
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
  consultationDateIso: string
  consultationTime24: string
}

function leadToEditForm(lead: CrmLead): EditLeadForm {
  let consultationDateIso = lead.consultationDateIso || ''
  if (!consultationDateIso && lead.date !== '—') {
    const parsed = getLeadConsultationDate(lead, new Date())
    if (parsed) consultationDateIso = toDateKey(parsed)
  }

  let consultationTime24 = lead.consultationTime24 || ''
  if (!consultationTime24 && lead.time !== '—') {
    consultationTime24 = toTime24(lead.time) || ''
  }

  return {
    first: lead.first,
    last: lead.last,
    email: lead.email,
    phone: lead.phone === '—' ? '' : lead.phone,
    company: lead.company === '—' ? '' : lead.company,
    source: lead.source,
    areas: [...lead.areas],
    matter: lead.matter === '—' ? '' : lead.matter,
    consultationDateIso,
    consultationTime24,
  }
}

export default function CrmLeads({
  leads,
  loading: leadsLoading,
  assignees,
  onEnsureAssignee,
  onDeleteAssignee,
  onPatchLead,
  onLeadAdded,
  onLeadDeleted,
  onRescheduleLead,
  onResendConfirmationEmail,
  onMergeLead,
  searchQuery = '',
  onSearchQueryChange,
  drawerLeadId = null,
  onDrawerLeadIdChange,
  leadPool,
  drawerOnly = false,
  initialFilters = null,
}: {
  leads: CrmLead[]
  loading: boolean
  assignees: CrmAssigneeRecord[]
  onEnsureAssignee: (name: string) => Promise<void>
  onDeleteAssignee: (id: string) => Promise<void>
  onPatchLead: (id: string, patch: LeadPatch) => Promise<CrmLead>
  onLeadAdded: (lead: CrmLead) => void
  onLeadDeleted: (id: string) => Promise<void>
  onRescheduleLead: (
    id: string,
    date: string,
    time: string
  ) => Promise<{ lead: CrmLead; emailSent: boolean; emailError: string | null }>
  onResendConfirmationEmail?: (
    id: string
  ) => Promise<{ lead: CrmLead; emailSent: boolean; emailError: string | null }>
  onMergeLead?: (keeperId: string, mergeLeadId: string) => Promise<CrmLead>
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
  drawerLeadId?: string | null
  onDrawerLeadIdChange?: (id: string | null) => void
  leadPool?: CrmLead[]
  drawerOnly?: boolean
  initialFilters?: LeadListFilters | null
}) {
  const pool = leadPool ?? leads
  const knownAssignees = assignees.map((a) => a.name)
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [addError, setAddError] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [statusesFilter, setStatusesFilter] = useState<CrmStatus[] | null>(null)
  const [sourceFilter, setSourceFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [practiceAreaFilter, setPracticeAreaFilter] = useState('all')
  const [dateField, setDateField] = useState<LeadDateRangeField>('enquiry')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
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
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; available: boolean }>>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [addAvailableSlots, setAddAvailableSlots] = useState<Array<{ time: string; available: boolean }>>([])
  const [addLoadingSlots, setAddLoadingSlots] = useState(false)
  const [rescheduleError, setRescheduleError] = useState('')
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false)
  const [rescheduleNotice, setRescheduleNotice] = useState('')
  const [resendSubmitting, setResendSubmitting] = useState(false)
  const [resendNotice, setResendNotice] = useState('')
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false)
  const [mergeConfirmId, setMergeConfirmId] = useState<string | null>(null)
  const [mergeSubmitting, setMergeSubmitting] = useState(false)
  const [mergeError, setMergeError] = useState('')
  const [showAssigneeManager, setShowAssigneeManager] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(20)

  const sourceOptions = useMemo(() => collectLeadSourceOptions(leads), [leads])

  const assigneeOptions = useMemo(() => {
    const names = new Set<string>()
    for (const record of assignees) names.add(record.name)
    for (const lead of leads) {
      for (const task of lead.actionables) {
        if (task.assignee && task.assignee !== UNASSIGNED_ASSIGNEE) {
          names.add(task.assignee)
        }
      }
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [assignees, leads])

  const duplicateLeadIds = useMemo(() => getDuplicateLeadIds(leads), [leads])
  const duplicateGroupCount = useMemo(() => {
    const emails = new Set<string>()
    for (const id of duplicateLeadIds) {
      const lead = leads.find((l) => l.id === id)
      if (lead) emails.add(lead.email.trim().toLowerCase())
    }
    return emails.size
  }, [duplicateLeadIds, leads])

  const filteredLeads = useMemo(() => {
    let result = filterLeads(leads, {
      status: statusesFilter?.length ? 'all' : filter,
      statuses: statusesFilter ?? undefined,
      source: sourceFilter,
      assignee: assigneeFilter,
      practiceArea: practiceAreaFilter,
      dateFrom,
      dateTo,
      dateField,
      search: searchQuery,
    })
    if (showDuplicatesOnly) {
      result = result.filter((lead) => duplicateLeadIds.has(lead.id))
    }
    return result
  }, [
    leads,
    filter,
    statusesFilter,
    sourceFilter,
    assigneeFilter,
    practiceAreaFilter,
    dateFrom,
    dateTo,
    dateField,
    searchQuery,
    showDuplicatesOnly,
    duplicateLeadIds,
  ])

  const drawerDuplicates = useMemo(
    () => (drawerLead ? getDuplicateSiblings(drawerLead, pool) : []),
    [drawerLead, pool]
  )

  const hasExtraFilters =
    sourceFilter !== 'all' ||
    assigneeFilter !== 'all' ||
    practiceAreaFilter !== 'all' ||
    Boolean(statusesFilter?.length) ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    showDuplicatesOnly

  const clearExtraFilters = () => {
    setSourceFilter('all')
    setAssigneeFilter('all')
    setPracticeAreaFilter('all')
    setStatusesFilter(null)
    setDateFrom('')
    setDateTo('')
    setDateField('enquiry')
    setFilter('all')
    setShowDuplicatesOnly(false)
  }

  useEffect(() => {
    if (!initialFilters) return
    if (initialFilters.statuses?.length) {
      setStatusesFilter(initialFilters.statuses)
      setFilter('all')
    } else if (initialFilters.status !== undefined) {
      setStatusesFilter(null)
      setFilter(initialFilters.status)
    }
    if (initialFilters.source !== undefined) setSourceFilter(initialFilters.source)
    if (initialFilters.assignee !== undefined) setAssigneeFilter(initialFilters.assignee)
    if (initialFilters.practiceArea !== undefined) setPracticeAreaFilter(initialFilters.practiceArea)
    if (initialFilters.dateFrom !== undefined) setDateFrom(initialFilters.dateFrom)
    if (initialFilters.dateTo !== undefined) setDateTo(initialFilters.dateTo)
    if (initialFilters.dateField !== undefined) setDateField(initialFilters.dateField)
  }, [initialFilters])

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * pageSize
  const paginatedLeads = filteredLeads.slice(pageStart, pageStart + pageSize)

  useEffect(() => {
    setPage(1)
  }, [
    filter,
    statusesFilter,
    searchQuery,
    leads.length,
    pageSize,
    sourceFilter,
    assigneeFilter,
    practiceAreaFilter,
    dateFrom,
    dateTo,
    dateField,
    showDuplicatesOnly,
  ])

  useEffect(() => {
    if (!drawerLead) return
    const current = pool.find((l) => l.id === drawerLead.id)
    if (current) setDrawerLead(current)
  }, [pool, drawerLead?.id])

  useEffect(() => {
    if (!onDrawerLeadIdChange) return
    if (drawerLeadId) {
      const current = pool.find((l) => l.id === drawerLeadId)
      if (current) {
        setDrawerLead(current)
        setNoteInput('')
        setIsEditing(false)
        setEditForm(null)
        setEditError('')
        setShowDeleteConfirm(false)
        setIsRescheduling(false)
        setRescheduleDate('')
        setRescheduleTime('')
        setRescheduleError('')
        setRescheduleNotice('')
        setResendNotice('')
        setMergeConfirmId(null)
        setMergeError('')
      }
    } else {
      setDrawerLead(null)
      setIsEditing(false)
      setEditForm(null)
      setShowDeleteConfirm(false)
      setIsRescheduling(false)
    }
  }, [drawerLeadId, pool, onDrawerLeadIdChange])

  const updateLeadStatus = async (id: string, status: CrmStatus) => {
    try {
      const updated = await onPatchLead(id, { status })
      if (drawerLead?.id === id) setDrawerLead(updated)
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const openDrawer = (lead: CrmLead) => {
    const current = pool.find((l) => l.id === lead.id) || lead
    onDrawerLeadIdChange?.(current.id)
    if (!onDrawerLeadIdChange) {
      setDrawerLead(current)
      setNoteInput('')
      setIsEditing(false)
      setEditForm(null)
      setEditError('')
      setShowDeleteConfirm(false)
      setIsRescheduling(false)
      setRescheduleDate('')
      setRescheduleTime('')
      setRescheduleError('')
      setRescheduleNotice('')
    }
  }

  const closeDrawer = () => {
    onDrawerLeadIdChange?.(null)
    if (!onDrawerLeadIdChange) {
      setDrawerLead(null)
      setIsEditing(false)
      setEditForm(null)
      setShowDeleteConfirm(false)
      setIsRescheduling(false)
    }
  }

  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true)
    try {
      const response = await fetch('/api/intake/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      })
      const data = await response.json()
      if (data.success) {
        setAvailableSlots(data.slots)
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error)
      const slots: Array<{ time: string; available: boolean }> = []
      for (let hour = 9; hour < 17; hour++) {
        for (let min = 0; min < 60; min += 20) {
          slots.push({
            time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
            available: true,
          })
        }
      }
      setAvailableSlots(slots)
    } finally {
      setLoadingSlots(false)
    }
  }

  const fetchAddSlots = async (date: string) => {
    setAddLoadingSlots(true)
    try {
      const response = await fetch('/api/intake/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      })
      const data = await response.json()
      if (data.success) {
        setAddAvailableSlots(data.slots)
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error)
      const slots: Array<{ time: string; available: boolean }> = []
      for (let hour = 9; hour < 17; hour++) {
        for (let min = 0; min < 60; min += 20) {
          slots.push({
            time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
            available: true,
          })
        }
      }
      setAddAvailableSlots(slots)
    } finally {
      setAddLoadingSlots(false)
    }
  }

  const closeAddModal = () => {
    setShowModal(false)
    setForm(emptyForm)
    setFormError(false)
    setAddError('')
    setAddAvailableSlots([])
  }

  const handleAddDateSelect = (dateStr: string) => {
    setForm((prev) => ({
      ...prev,
      consultationDateIso: dateStr,
      consultationTime24: '',
    }))
    fetchAddSlots(dateStr)
  }

  const handleAddStatusChange = (status: CrmStatus) => {
    setForm((prev) => ({
      ...prev,
      status,
      ...(status !== 'booked'
        ? { consultationDateIso: '', consultationTime24: '' }
        : {}),
    }))
    if (status !== 'booked') {
      setAddAvailableSlots([])
    }
  }

  const startReschedule = () => {
    if (!drawerLead) return
    setIsRescheduling(true)
    setIsEditing(false)
    setShowDeleteConfirm(false)
    setRescheduleError('')
    const prefilledDate = drawerLead.consultationDateIso || ''
    const prefilledTime = drawerLead.consultationTime24 || ''
    setRescheduleDate(prefilledDate)
    setRescheduleTime(prefilledTime)
    if (prefilledDate) {
      fetchAvailableSlots(prefilledDate)
    } else {
      setAvailableSlots([])
    }
  }

  const cancelReschedule = () => {
    setIsRescheduling(false)
    setRescheduleDate('')
    setRescheduleTime('')
    setRescheduleError('')
    setAvailableSlots([])
    setRescheduleNotice('')
  }

  const handleRescheduleDateSelect = (dateStr: string) => {
    setRescheduleDate(dateStr)
    setRescheduleTime('')
    fetchAvailableSlots(dateStr)
  }

  const saveReschedule = async () => {
    if (!drawerLead || !rescheduleDate || !rescheduleTime) {
      setRescheduleError('Select a date and time slot.')
      return
    }

    setRescheduleSubmitting(true)
    setRescheduleError('')
    setRescheduleNotice('')
    try {
      const { lead: updated, emailSent, emailError } = await onRescheduleLead(
        drawerLead.id,
        rescheduleDate,
        rescheduleTime
      )
      setDrawerLead(updated)
      setIsRescheduling(false)
      setRescheduleDate('')
      setRescheduleTime('')
      setAvailableSlots([])
      setRescheduleNotice(
        emailSent
          ? 'Consultation rescheduled. The client has been notified by email.'
          : `Consultation rescheduled, but the notification email could not be sent${emailError ? ` (${emailError})` : ''}. Please contact the client directly.`
      )
    } catch (error) {
      setRescheduleError(error instanceof Error ? error.message : 'Failed to reschedule')
    } finally {
      setRescheduleSubmitting(false)
    }
  }

  const startEdit = () => {
    if (!drawerLead) return
    const form = leadToEditForm(drawerLead)
    setEditForm(form)
    setEditError('')
    setIsEditing(true)
    setShowDeleteConfirm(false)
    setIsRescheduling(false)
    if (form.consultationDateIso) {
      fetchAvailableSlots(form.consultationDateIso)
    } else {
      setAvailableSlots([])
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditForm(null)
    setEditError('')
    setAvailableSlots([])
  }

  const handleEditDateSelect = (dateStr: string) => {
    setEditForm((prev) =>
      prev ? { ...prev, consultationDateIso: dateStr, consultationTime24: '' } : prev
    )
    fetchAvailableSlots(dateStr)
  }

  const clearEditConsultation = () => {
    setEditForm((prev) =>
      prev ? { ...prev, consultationDateIso: '', consultationTime24: '' } : prev
    )
    setAvailableSlots([])
  }

  const saveEdit = async () => {
    if (!drawerLead || !editForm) return
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!editForm.first.trim() || !editForm.last.trim() || !emailRe.test(editForm.email.trim())) {
      setEditError('Enter a first name, last name, and valid email.')
      return
    }

    const hadConsultation =
      Boolean(drawerLead.consultationDateIso) || drawerLead.date !== '—'
    const wantsConsultation = Boolean(editForm.consultationDateIso)

    if (wantsConsultation && !editForm.consultationTime24) {
      setEditError('Select a time slot for the consultation.')
      return
    }

    setEditSubmitting(true)
    setEditError('')
    try {
      const patch: LeadPatch = {
        first: editForm.first.trim(),
        last: editForm.last.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        company: editForm.company.trim(),
        source: editForm.source,
        areas: editForm.areas.length > 0 ? editForm.areas : ['Corporate advisory'],
        matter: editForm.matter.trim(),
      }

      if (wantsConsultation) {
        patch.consultationDateIso = editForm.consultationDateIso
        patch.consultationTime24 = editForm.consultationTime24
      } else if (hadConsultation) {
        patch.clearConsultation = true
      }

      const updated = await onPatchLead(drawerLead.id, patch)
      setDrawerLead(updated)
      setIsEditing(false)
      setEditForm(null)
      setAvailableSlots([])
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
    const subject =
      lead.date !== '—'
        ? `Your consultation with Fathom Legal - ${lead.date}`
        : 'Re: Your enquiry with Fathom Legal'
    let body = `Hi ${lead.first},\n\n`
    if (lead.date !== '—') {
      body += `Regarding your consultation on ${lead.date} at ${lead.time} IST`
      if (lead.googleMeetLink) {
        body += `:\n${lead.googleMeetLink}`
      }
      body += '\n\n'
    }
    const composeUrl = `https://mail.zoho.in/zm/#compose?to=${encodeURIComponent(lead.email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(composeUrl, '_blank', 'noopener,noreferrer')
  }

  const handleResendConfirmation = async () => {
    if (!drawerLead || !onResendConfirmationEmail) return
    if (drawerLead.date === '—') {
      setResendNotice('This lead does not have a scheduled consultation.')
      return
    }

    setResendSubmitting(true)
    setResendNotice('')
    setRescheduleNotice('')
    try {
      const { lead: updated, emailSent, emailError } = await onResendConfirmationEmail(
        drawerLead.id
      )
      setDrawerLead(updated)
      setResendNotice(
        emailSent
          ? 'Confirmation email sent to the client from client.accounts@fathomlegal.com.'
          : `Could not send confirmation email${emailError ? ` (${emailError})` : ''}. Check Zoho credentials or contact the client directly.`
      )
    } catch (error) {
      setResendNotice(error instanceof Error ? error.message : 'Failed to resend confirmation email')
    } finally {
      setResendSubmitting(false)
    }
  }

  const handleMergeDuplicate = async (mergeLeadId: string) => {
    if (!drawerLead || !onMergeLead) return

    setMergeSubmitting(true)
    setMergeError('')
    try {
      const updated = await onMergeLead(drawerLead.id, mergeLeadId)
      setDrawerLead(updated)
      setMergeConfirmId(null)
      setRescheduleNotice('')
      setResendNotice('')
    } catch (error) {
      setMergeError(error instanceof Error ? error.message : 'Failed to merge leads')
    } finally {
      setMergeSubmitting(false)
    }
  }

  const handleAddProspect = async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.first.trim() || !form.last.trim() || !emailRe.test(form.email.trim())) {
      setFormError(true)
      return
    }

    if (form.status === 'booked') {
      if (!form.consultationDateIso || !form.consultationTime24) {
        setAddError('Select a consultation date and time slot.')
        return
      }
    }

    setAddSubmitting(true)
    setAddError('')

    try {
      const payload: Record<string, unknown> = {
        first: form.first.trim(),
        last: form.last.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        source: form.source,
        status: form.status,
        areas: form.areas.length > 0 ? form.areas : ['Corporate advisory'],
        matter: form.matter.trim(),
      }

      if (form.status === 'booked') {
        payload.consultationDateIso = form.consultationDateIso
        payload.consultationTime24 = form.consultationTime24
      }

      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      closeAddModal()
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
      {!drawerOnly && (
        <>
      <div className="flex flex-wrap items-center gap-2.5 mb-5">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                setFilter(chip.id)
                setStatusesFilter(null)
                setShowDuplicatesOnly(false)
              }}
              className={`border rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors ${
                filter === chip.id && !statusesFilter?.length && !showDuplicatesOnly
                  ? 'bg-[#7a1322] text-white border-[#7a1322]'
                  : 'bg-white text-[#736c63] border-[#e7e1d9] hover:border-[#7a1322] hover:text-[#7a1322]'
              }`}
            >
              {chip.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setShowDuplicatesOnly((prev) => !prev)
              setStatusesFilter(null)
              setFilter('all')
            }}
            className={`border rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors inline-flex items-center gap-1.5 ${
              showDuplicatesOnly
                ? 'bg-[#7a1322] text-white border-[#7a1322]'
                : 'bg-white text-[#736c63] border-[#e7e1d9] hover:border-[#7a1322] hover:text-[#7a1322]'
            }`}
          >
            Duplicates
            {duplicateGroupCount > 0 && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                  showDuplicatesOnly ? 'bg-white/20 text-white' : 'bg-[#f6ecee] text-[#7a1322]'
                }`}
              >
                {duplicateGroupCount}
              </span>
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowAssigneeManager(true)}
          className="inline-flex items-center gap-1.5 border border-[#e7e1d9] bg-white text-[#2a2724] rounded-full px-4 py-2 text-[13px] font-medium hover:border-[#7a1322] hover:text-[#7a1322] transition-colors"
        >
          <Users className="w-4 h-4" />
          Assignees
          {assignees.length > 0 && (
            <span className="text-[11px] font-semibold bg-[#f6ecee] text-[#7a1322] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {assignees.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm)
            setFormError(false)
            setAddError('')
            setAddAvailableSlots([])
            setShowModal(true)
          }}
          className="inline-flex items-center gap-1.5 bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] text-white rounded-full px-4 py-2 text-[13px] font-medium shadow-md hover:-translate-y-px transition-transform"
        >
          <span className="text-[17px] leading-none font-semibold">+</span>
          Add prospect
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-4 p-3.5 bg-[#fbf9f6] border border-[#e7e1d9] rounded-[10px]">
        <div className="min-w-[140px]">
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
            Source
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className={`${CRM_SELECT_CLASS} text-[13px] py-2`}
          >
            <option value="all">All sources</option>
            {sourceOptions.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[140px]">
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
            Assignee
          </label>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className={`${CRM_SELECT_CLASS} text-[13px] py-2`}
          >
            <option value="all">All assignees</option>
            <option value="unassigned">Unassigned tasks</option>
            {assigneeOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[160px]">
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
            Practice area
          </label>
          <select
            value={practiceAreaFilter}
            onChange={(e) => setPracticeAreaFilter(e.target.value)}
            className={`${CRM_SELECT_CLASS} text-[13px] py-2`}
          >
            <option value="all">All areas</option>
            {PRACTICE_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[130px]">
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
            Date type
          </label>
          <select
            value={dateField}
            onChange={(e) => setDateField(e.target.value as LeadDateRangeField)}
            className={`${CRM_SELECT_CLASS} text-[13px] py-2`}
          >
            <option value="enquiry">Enquiry date</option>
            <option value="consultation">Consultation date</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={`${CRM_INPUT_CLASS} text-[13px] py-2 w-[148px]`}
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={`${CRM_INPUT_CLASS} text-[13px] py-2 w-[148px]`}
          />
        </div>

        {hasExtraFilters && (
          <button
            type="button"
            onClick={clearExtraFilters}
            className="text-[12.5px] font-medium text-[#7a1322] hover:underline pb-2"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 bg-white border border-[#e7e1d9] rounded-full px-3.5 py-2 flex-1 min-w-[200px] max-w-md focus-within:border-[#7a1322] focus-within:ring-2 focus-within:ring-[#f6ecee]">
          <Search className="w-4 h-4 text-[#736c63] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
            placeholder="Search name, email, matter…"
            className="border-none bg-transparent text-[13.5px] text-[#2a2724] w-full focus:outline-none placeholder:text-[#736c63]"
          />
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => onSearchQueryChange?.('')}
              className="text-[#736c63] hover:text-[#7a1322] flex-shrink-0"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => downloadLeadsCsv(filteredLeads)}
          disabled={filteredLeads.length === 0}
          className="inline-flex items-center gap-1.5 border border-[#e7e1d9] bg-white text-[#2a2724] rounded-full px-4 py-2 text-[13px] font-medium hover:border-[#7a1322] hover:text-[#7a1322] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
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
                    {searchQuery.trim()
                      ? `No leads match “${searchQuery.trim()}”.`
                      : filter !== 'all' || hasExtraFilters
                      ? 'No leads match the current filters.'
                      : 'No prospects yet. Use "Add prospect" to create one.'}
                  </td>
                </tr>
              ) : (
              paginatedLeads.map((lead) => (
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
                          {duplicateLeadIds.has(lead.id) && (
                            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-[#9a6b1f] bg-[#f5ecdb] px-1.5 py-0.5 rounded-full align-middle">
                              Duplicate
                            </span>
                          )}
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
        {!leadsLoading && filteredLeads.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-[#e7e1d9] bg-[#fbf9f6]">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-[12.5px] text-[#736c63]">
                Showing {pageStart + 1}–{Math.min(pageStart + pageSize, filteredLeads.length)} of{' '}
                {filteredLeads.length}
                {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ''}
              </p>
              <label className="flex items-center gap-2 text-[12.5px] text-[#736c63]">
                Per page
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-8 rounded-lg border border-[#e7e1d9] bg-white px-2 text-[12.5px] text-[#2a2724] focus:outline-none focus:border-[#7a1322]"
                  aria-label="Leads per page"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="w-8 h-8 rounded-lg border border-[#e7e1d9] bg-white flex items-center justify-center text-[#736c63] hover:border-[#7a1322] hover:text-[#7a1322] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[12.5px] text-[#736c63] min-w-[88px] text-center">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="w-8 h-8 rounded-lg border border-[#e7e1d9] bg-white flex items-center justify-center text-[#736c63] hover:border-[#7a1322] hover:text-[#7a1322] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add prospect modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1c1a18]/45 z-50 flex items-start justify-center p-8 overflow-y-auto">
          <div className="bg-[#fbf9f6] text-[#1c1a18] [color-scheme:light] rounded-[14px] w-full max-w-[560px] shadow-2xl">
            <div className="flex items-center px-6 py-5 border-b border-[#e7e1d9]">
              <h3 className="text-xl font-medium text-[#1c1a18]">Add a prospect</h3>
              <button
                type="button"
                onClick={closeAddModal}
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
                    onChange={(e) => handleAddStatusChange(e.target.value as CrmStatus)}
                    className={CRM_SELECT_CLASS}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="booked">Consultation booked</option>
                  </select>
                </div>
              </div>

              {form.status === 'booked' && (
                <div className="border border-[#e7e1d9] rounded-[10px] p-3 bg-white">
                  <p className="text-[12.5px] font-medium text-[#1c1a18] mb-2">
                    Schedule consultation *
                  </p>
                  <BookingMonthCalendar
                    selectedDate={form.consultationDateIso}
                    onDateSelect={handleAddDateSelect}
                    variant="crm"
                    compact
                    showTitle={false}
                    helperText="Pick a weekday, then choose an available time slot."
                  />
                  {form.consultationDateIso && (
                    <div className="mt-3">
                      <p className="text-[12px] text-[#736c63] mb-2">
                        Time slot {addLoadingSlots ? '(loading…)' : '*'}
                      </p>
                      <div className="grid grid-cols-3 gap-1.5 max-h-[120px] overflow-y-auto">
                        {addAvailableSlots.map((slot) => {
                          const isSelected = form.consultationTime24 === slot.time
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() =>
                                slot.available &&
                                setForm((p) => ({ ...p, consultationTime24: slot.time }))
                              }
                              className={`p-2 rounded-lg border text-[11px] transition-colors ${
                                isSelected
                                  ? 'border-[#7a1322] bg-[#7a1322] text-white font-medium'
                                  : !slot.available
                                  ? 'border-[#e7e1d9] bg-[#f5f5f5] text-[#9ca3af] cursor-not-allowed'
                                  : 'border-[#e7e1d9] bg-white hover:border-[#7a1322]'
                              }`}
                            >
                              {formatTimeDisplay(slot.time)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                onClick={closeAddModal}
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
        </>
      )}

      <CrmAssigneeManager
        open={showAssigneeManager}
        onClose={() => setShowAssigneeManager(false)}
        assignees={assignees}
        onAdd={onEnsureAssignee}
        onDelete={onDeleteAssignee}
      />

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
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[12.5px] font-medium text-[#1c1a18]">
                        Consultation
                      </label>
                      {(editForm.consultationDateIso || editForm.consultationTime24) && (
                        <button
                          type="button"
                          onClick={clearEditConsultation}
                          className="text-[11.5px] font-medium text-[#7a1322] hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <BookingMonthCalendar
                      selectedDate={editForm.consultationDateIso}
                      onDateSelect={handleEditDateSelect}
                      variant="crm"
                      compact
                      showTitle={false}
                      helperText="Optional. Weekdays only — pick a date, then a time slot."
                    />
                    {editForm.consultationDateIso && (
                      <div className="mt-3">
                        <p className="text-[12px] text-[#736c63] mb-2">
                          Time slot {loadingSlots ? '(loading…)' : ''}
                        </p>
                        <div className="grid grid-cols-3 gap-1.5 max-h-[120px] overflow-y-auto">
                          {availableSlots.map((slot) => {
                            const isSelected = editForm.consultationTime24 === slot.time
                            const isCurrentSlot =
                              drawerLead.consultationDateIso === editForm.consultationDateIso &&
                              drawerLead.consultationTime24 === slot.time
                            const selectable = slot.available || isCurrentSlot
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!selectable}
                                onClick={() =>
                                  selectable &&
                                  setEditForm((p) =>
                                    p ? { ...p, consultationTime24: slot.time } : p
                                  )
                                }
                                className={`p-2 rounded-lg border text-[11px] transition-colors ${
                                  isSelected
                                    ? 'border-[#7a1322] bg-[#7a1322] text-white font-medium'
                                    : !selectable
                                    ? 'border-[#e7e1d9] bg-[#f5f5f5] text-[#9ca3af] cursor-not-allowed'
                                    : 'border-[#e7e1d9] bg-white hover:border-[#7a1322]'
                                }`}
                              >
                                {formatTimeDisplay(slot.time)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
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
              {drawerDuplicates.length > 0 && onMergeLead && (
                <section className="mb-4">
                  <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold mb-2">
                    Possible duplicates
                  </h4>
                  <p className="text-[12.5px] text-[#736c63] mb-3">
                    {drawerDuplicates.length} other record
                    {drawerDuplicates.length === 1 ? '' : 's'} share{' '}
                    <span className="font-medium text-[#1c1a18]">{drawerLead.email}</span>
                  </p>
                  <div className="space-y-2">
                    {drawerDuplicates.map((dup) => (
                      <div
                        key={dup.id}
                        className="bg-[#fff8eb] border border-[#fcd34d] rounded-[10px] p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-medium text-[#1c1a18]">
                              {dup.first} {dup.last}
                            </p>
                            <p className="text-[12px] text-[#736c63] mt-0.5">
                              {CRM_STATUSES[normalizeStatus(dup.status)]}
                              {dup.date !== '—' ? ` · ${dup.date} at ${dup.time}` : ''}
                            </p>
                          </div>
                        </div>
                        {mergeConfirmId === dup.id ? (
                          <div className="mt-3 pt-3 border-t border-[#fcd34d]/60">
                            <p className="text-[12.5px] text-[#2a2724] mb-3">
                              Merge <strong>{dup.first} {dup.last}</strong> into this lead?
                              The other record will be deleted and its notes/tasks combined here.
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => void handleMergeDuplicate(dup.id)}
                                disabled={mergeSubmitting}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white rounded-full bg-[#7a1322] hover:bg-[#5c0e1a] disabled:opacity-50"
                              >
                                <GitMerge className="w-3.5 h-3.5" />
                                {mergeSubmitting ? 'Merging…' : 'Confirm merge'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setMergeConfirmId(null)}
                                disabled={mergeSubmitting}
                                className="px-3 py-1.5 text-[12px] font-medium border border-[#e7e1d9] rounded-full bg-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setMergeConfirmId(dup.id)
                              setMergeError('')
                            }}
                            className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#7a1322] hover:text-[#5c0e1a]"
                          >
                            <GitMerge className="w-3.5 h-3.5" />
                            Merge into this lead
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {mergeError && (
                    <p className="text-[12px] text-[#7a1322] font-medium mt-2">{mergeError}</p>
                  )}
                </section>
              )}

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

              {(rescheduleNotice || resendNotice) && !isRescheduling && (
                <div
                  className={`rounded-[10px] p-3 text-[13px] ${
                    (rescheduleNotice || resendNotice || '').includes('notified by email') ||
                    (rescheduleNotice || resendNotice || '').includes('sent to the client')
                      ? 'bg-[#f0f6f1] border border-[#86efac] text-[#166534]'
                      : 'bg-[#fef3c7] border border-[#fcd34d] text-[#92400e]'
                  }`}
                >
                  {rescheduleNotice || resendNotice}
                </div>
              )}

              <section>
                <h4 className="text-[11px] uppercase tracking-widest text-[#736c63] font-semibold mb-2">
                  Consultation
                </h4>
                {isRescheduling ? (
                  <div className="bg-[#fbf9f6] border border-[#e7e1d9] rounded-[10px] p-4 space-y-4">
                    <p className="text-[13px] font-medium text-[#1c1a18]">Pick a new date and time</p>
                    <BookingMonthCalendar
                      selectedDate={rescheduleDate}
                      onDateSelect={handleRescheduleDateSelect}
                      variant="crm"
                      compact
                      showTitle={false}
                      helperText="Weekdays only. Select a date to view available slots."
                    />
                    {rescheduleDate && (
                      <div>
                        <p className="text-[12px] text-[#736c63] mb-2">
                          Available slots {loadingSlots ? '(loading…)' : ''}
                        </p>
                        <div className="grid grid-cols-3 gap-1.5 max-h-[120px] overflow-y-auto">
                          {availableSlots.map((slot) => {
                            const isSelected = rescheduleTime === slot.time
                            const isCurrentSlot =
                              drawerLead.consultationDateIso === rescheduleDate &&
                              drawerLead.consultationTime24 === slot.time
                            const selectable = slot.available || isCurrentSlot
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!selectable}
                                onClick={() => selectable && setRescheduleTime(slot.time)}
                                className={`p-2 rounded-lg border text-[11px] transition-colors ${
                                  isSelected
                                    ? 'border-[#7a1322] bg-[#7a1322] text-white font-medium'
                                    : !selectable
                                    ? 'border-[#e7e1d9] bg-[#f5f5f5] text-[#9ca3af] cursor-not-allowed'
                                    : 'border-[#e7e1d9] bg-white hover:border-[#7a1322]'
                                }`}
                              >
                                {formatTimeDisplay(slot.time)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    {rescheduleError && (
                      <p className="text-[12px] text-[#7a1322] font-medium">{rescheduleError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveReschedule}
                        disabled={rescheduleSubmitting || !rescheduleDate || !rescheduleTime}
                        className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white rounded-full bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {rescheduleSubmitting ? 'Saving…' : 'Confirm reschedule'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelReschedule}
                        disabled={rescheduleSubmitting}
                        className="px-4 py-2 text-[13px] font-medium border border-[#e7e1d9] rounded-full bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                    {drawerLead.googleMeetLink && drawerLead.date !== '—' && (
                      <div className="flex gap-2.5 py-2 text-[13.5px]">
                        <Video className="w-4 h-4 text-[#7a1322] flex-shrink-0 mt-0.5" />
                        <span className="text-[#736c63] min-w-[74px]">Meet</span>
                        <a
                          href={drawerLead.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7a1322] font-medium hover:underline inline-flex items-center gap-1 min-w-0"
                        >
                          <span className="truncate">Join Google Meet</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      </div>
                    )}
                  </>
                )}
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

            {!isEditing && !isRescheduling && (
            <div className="p-4 border-t border-[#e7e1d9] flex flex-wrap gap-2.5 bg-[#fbf9f6]">
              {drawerLead.date !== '—' && onResendConfirmationEmail && (
                <button
                  type="button"
                  onClick={() => void handleResendConfirmation()}
                  disabled={resendSubmitting}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 text-[13.5px] font-medium text-white rounded-full bg-gradient-to-br from-[#7a1322] to-[#5c0e1a] disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  {resendSubmitting ? 'Sending…' : 'Resend confirmation'}
                </button>
              )}
              <button
                type="button"
                onClick={() => openEmailClient(drawerLead)}
                className={`inline-flex items-center justify-center gap-2 py-3 text-[13.5px] font-medium border border-[#e7e1d9] rounded-full bg-white hover:border-[#7a1322] hover:text-[#7a1322] ${
                  drawerLead.date !== '—' && onResendConfirmationEmail ? 'px-5' : 'flex-1'
                }`}
              >
                <Mail className="w-4 h-4" />
                Compose
              </button>
              <button
                type="button"
                onClick={startReschedule}
                disabled={drawerLead.date === '—'}
                className="inline-flex items-center gap-2 px-5 py-3 text-[13.5px] font-medium border border-[#e7e1d9] rounded-full bg-white hover:border-[#7a1322] hover:text-[#7a1322] disabled:opacity-40 disabled:cursor-not-allowed"
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
