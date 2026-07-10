'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Search,
  X,
  Inbox,
  CalendarDays,
  Clock,
  Trophy,
  AlertCircle,
  CircleCheck,
  FolderOpen,
  Archive,
} from 'lucide-react'
import { getInitials, normalizeStatus, filterLeadsBySearch, UNASSIGNED_ASSIGNEE, type CrmAssigneeRecord, type CrmLead, type LeadListFilters, type LeadPatch } from './data'
import { StatusBadge } from './shared'
import CrmLeads from './CrmLeads'
import CrmConsultations from './CrmConsultations'
import CrmAnalytics from './CrmAnalytics'
import { computeCrmStats, computeSourceBreakdown } from '@/lib/crm-analytics'
import { compareLeadConsultationDates } from '@/lib/crm-consultation-dates'
import { isoDateRangeLastNDays } from '@/lib/crm-date-ranges'
import {
  AWAITING_RESPONSE_STATUSES,
} from './data'
import { InternalWorkProvider } from './internal-work/InternalWorkContext'
import { InternalWorkOverview } from './internal-work/InternalWorkOverview'
import InternalWorkRegister from './internal-work/InternalWorkRegister'
import { InternalWorkLoadingGate } from './internal-work/InternalWorkLoadingGate'
import { InternalWorkCalendar } from './internal-work/InternalWorkCalendar'
import { InternalWorkAssociates } from './internal-work/InternalWorkAssociates'

export type CrmView =
  | 'overview'
  | 'leads'
  | 'consultations'
  | 'analytics'
  | 'internal-overview'
  | 'internal-client'
  | 'internal-firm'
  | 'internal-calendar'
  | 'internal-associates'

export type CrmNavigateHandler = (view: CrmView, filters?: LeadListFilters | null) => void

const VIEW_TITLES: Record<CrmView, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'A snapshot of your practice today' },
  leads: { title: 'Leads & enquiries', subtitle: 'Track every enquiry from first contact to retained' },
  consultations: { title: 'Consultations', subtitle: 'Your scheduled client meetings' },
  analytics: { title: 'Analytics', subtitle: 'How your intake is performing' },
  'internal-overview': {
    title: 'Overview',
    subtitle: 'How work is split between client matters and non-billable practice work',
  },
  'internal-client': {
    title: 'Client Deliverables',
    subtitle: 'Tasks tied to a specific client or matter',
  },
  'internal-firm': {
    title: 'Practice & Firm Work',
    subtitle: 'LinkedIn, BD, research, study/CPD, marketing and firm ops',
  },
  'internal-calendar': {
    title: 'Deadline calendar',
    subtitle: 'Everything due, last cut by date. Client work and firm work side by side',
  },
  'internal-associates': {
    title: 'Team',
    subtitle: 'Add associates here so they appear as assignees on both client and firm-work tasks',
  },
}

function OverviewKpiCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  hint,
  onClick,
}: {
  icon: typeof Inbox
  iconBg: string
  iconColor: string
  value: string | number
  label: string
  hint?: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white border border-[#e7e1d9] rounded-[14px] p-5 text-left w-full hover:border-[#7a1322]/30 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className={`w-9 h-9 rounded-[10px] ${iconBg} flex items-center justify-center mb-3.5`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">{value}</div>
      <div className="text-[12.5px] text-[#736c63] mt-1.5">{label}</div>
      {hint}
    </button>
  )
}

function CrmOverview({
  leads,
  onNavigate,
  onLeadClick,
}: {
  leads: CrmLead[]
  onNavigate: CrmNavigateHandler
  onLeadClick?: (lead: CrmLead) => void
}) {
  const stats = computeCrmStats(leads)
  const sourceBreakdown = computeSourceBreakdown(leads)
  const recentLeads = leads.slice(0, 5)
  const upcomingConsultations = useMemo(() => {
    const near = new Date()
    return [...leads]
      .filter((l) => l.date !== '—')
      .sort((a, b) => compareLeadConsultationDates(a, b, near))
      .slice(0, 4)
  }, [leads])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 mb-7">
        <OverviewKpiCard
          icon={Inbox}
          iconBg="bg-[#f6ecee]"
          iconColor="text-[#7a1322]"
          value={stats.recentCount}
          label="New enquiries (7 days)"
          onClick={() =>
            onNavigate('leads', {
              ...isoDateRangeLastNDays(7),
              dateField: 'enquiry',
            })
          }
        />

        <OverviewKpiCard
          icon={CalendarDays}
          iconBg="bg-[#e6eef5]"
          iconColor="text-[#2f5d8a]"
          value={stats.consultationsScheduled}
          label="Consultations scheduled"
          onClick={() => onNavigate('consultations')}
        />

        <OverviewKpiCard
          icon={Clock}
          iconBg="bg-[#f5ecdb]"
          iconColor="text-[#9a6b1f]"
          value={stats.awaitingResponse}
          label="Awaiting response"
          hint={
            <div className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#7a1322] mt-2">
              <AlertCircle className="w-3.5 h-3.5" />
              needs follow-up
            </div>
          }
          onClick={() => onNavigate('leads', { statuses: AWAITING_RESPONSE_STATUSES })}
        />

        <OverviewKpiCard
          icon={Trophy}
          iconBg="bg-[#e8f1ea]"
          iconColor="text-[#3f7a52]"
          value={`${stats.retainedRate}%`}
          label="Lead → retained rate"
          onClick={() => onNavigate('analytics')}
        />

        <OverviewKpiCard
          icon={CircleCheck}
          iconBg="bg-[#e8f1ea]"
          iconColor="text-[#3f7a52]"
          value={stats.engaged}
          label="Engaged"
          onClick={() => onNavigate('leads', { status: 'engaged' })}
        />

        <OverviewKpiCard
          icon={FolderOpen}
          iconBg="bg-[#e9eef5]"
          iconColor="text-[#3a5a8a]"
          value={stats.open}
          label="Open"
          onClick={() => onNavigate('leads', { status: 'open' })}
        />

        <OverviewKpiCard
          icon={Archive}
          iconBg="bg-[#eee]"
          iconColor="text-[#8a8178]"
          value={stats.closed}
          label="Closed"
          onClick={() => onNavigate('leads', { status: 'closed' })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-3.5 mb-7">
        <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
          <div className="flex items-center px-5 py-4 border-b border-[#efebe4]">
            <h3 className="text-base font-medium text-[#1c1a18]">Recent enquiries</h3>
            <button
              type="button"
              onClick={() => onNavigate('leads')}
              className="ml-auto text-[12.5px] font-medium text-[#7a1322] hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="px-5 py-1">
            {recentLeads.length === 0 ? (
              <p className="py-6 text-sm text-[#736c63] text-center">No enquiries yet</p>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  role={onLeadClick ? 'button' : undefined}
                  tabIndex={onLeadClick ? 0 : undefined}
                  onClick={() => onLeadClick?.(lead)}
                  onKeyDown={(e) => {
                    if (!onLeadClick) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onLeadClick(lead)
                    }
                  }}
                  className={`flex items-center gap-3 py-3 border-b border-[#efebe4] last:border-b-0 w-full text-left ${
                    onLeadClick
                      ? 'hover:bg-[#fdf5f6] -mx-5 px-5 transition-colors cursor-pointer'
                      : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#f6ecee] text-[#7a1322] flex items-center justify-center text-[13px] font-semibold flex-shrink-0">
                    {getInitials(lead.first, lead.last)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-medium text-[#1c1a18]">
                      {lead.first} {lead.last}
                    </div>
                    <div className="text-xs text-[#736c63] truncate">
                      {lead.areas[0]}
                      {lead.areas.length > 1 ? ` +${lead.areas.length - 1}` : ''}
                    </div>
                  </div>
                  <div className="text-[11.5px] text-[#736c63] whitespace-nowrap">{lead.ago}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
          <div className="flex items-center px-5 py-4 border-b border-[#efebe4]">
            <h3 className="text-base font-medium text-[#1c1a18]">Where leads come from</h3>
          </div>
          <div className="px-5 py-4 space-y-4">
            {sourceBreakdown.length === 0 ? (
              <p className="text-sm text-[#736c63] text-center py-4">No source data yet</p>
            ) : (
              sourceBreakdown.map((source) => (
                <div key={source.name}>
                  <div className="flex justify-between text-[12.5px] mb-1">
                    <span className="text-[#2a2724]">{source.name}</span>
                    <span className="text-[#736c63] font-medium">{source.value}%</span>
                  </div>
                  <div className="h-[7px] rounded-md bg-[#efebe4] overflow-hidden">
                    <div
                      className="h-full rounded-md bg-gradient-to-r from-[#7a1322] to-[#5c0e1a]"
                      style={{ width: `${source.value}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
        <div className="flex items-center px-5 py-4 border-b border-[#efebe4]">
          <h3 className="text-base font-medium text-[#1c1a18]">Upcoming consultations</h3>
          <button
            type="button"
            onClick={() => onNavigate('consultations')}
            className="ml-auto text-[12.5px] font-medium text-[#7a1322] hover:underline"
          >
            Open calendar →
          </button>
        </div>
        <div className="px-5 py-1">
          {upcomingConsultations.length === 0 ? (
            <p className="py-6 text-sm text-[#736c63] text-center">No consultations scheduled</p>
          ) : (
            upcomingConsultations.map((lead) => (
              <div
                key={lead.id}
                role={onLeadClick ? 'button' : undefined}
                tabIndex={onLeadClick ? 0 : undefined}
                onClick={() => onLeadClick?.(lead)}
                onKeyDown={(e) => {
                  if (!onLeadClick) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onLeadClick(lead)
                  }
                }}
                className={`flex items-center gap-3 py-3 border-b border-[#efebe4] last:border-b-0 w-full text-left ${
                  onLeadClick
                    ? 'hover:bg-[#fdf5f6] -mx-5 px-5 transition-colors cursor-pointer'
                    : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#f6ecee] text-[#7a1322] flex items-center justify-center text-[13px] font-semibold flex-shrink-0">
                  {getInitials(lead.first, lead.last)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-medium text-[#1c1a18]">
                    {lead.first} {lead.last} — {lead.areas[0]}
                  </div>
                  <div className="text-xs text-[#736c63]">
                    {lead.date} at {lead.time} · 20 min
                    {lead.googleMeetLink ? (
                      <>
                        {' · '}
                        <a
                          href={lead.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7a1322] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Google Meet
                        </a>
                      </>
                    ) : (
                      ' · Google Meet'
                    )}
                  </div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

interface CrmSectionProps {
  activeView: CrmView
  onNavigate: CrmNavigateHandler
  onLeadsCountChange?: (count: number) => void
  /** Filters passed from the admin dashboard home KPI cards */
  seedLeadsFilters?: LeadListFilters | null
  seedLeadsFilterKey?: number
  /** Open a specific lead (and optional task) from an email deep link */
  seedLeadId?: string | null
  seedTaskId?: string | null
  seedLeadKey?: number
}

export default function CrmSection({
  activeView,
  onNavigate,
  onLeadsCountChange,
  seedLeadsFilters = null,
  seedLeadsFilterKey = 0,
  seedLeadId = null,
  seedTaskId = null,
  seedLeadKey = 0,
}: CrmSectionProps) {
  const { title, subtitle } = VIEW_TITLES[activeView]
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [assignees, setAssignees] = useState<CrmAssigneeRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerLeadId, setDrawerLeadId] = useState<string | null>(null)
  const [highlightTaskId, setHighlightTaskId] = useState<string | null>(null)
  const [leadsInitialFilters, setLeadsInitialFilters] = useState<LeadListFilters | null>(null)
  const [leadsFilterKey, setLeadsFilterKey] = useState(0)

  const handleNavigate: CrmNavigateHandler = useCallback(
    (view, filters) => {
      if (filters) {
        setLeadsInitialFilters(filters)
        setLeadsFilterKey((k) => k + 1)
      }
      onNavigate(view, filters)
    },
    [onNavigate]
  )

  useEffect(() => {
    if (!seedLeadsFilterKey) return
    setLeadsInitialFilters(seedLeadsFilters)
    setLeadsFilterKey(seedLeadsFilterKey)
  }, [seedLeadsFilters, seedLeadsFilterKey])

  useEffect(() => {
    if (!seedLeadKey || !seedLeadId) return
    setDrawerLeadId(seedLeadId)
    setHighlightTaskId(seedTaskId ?? null)
  }, [seedLeadId, seedTaskId, seedLeadKey])

  const filteredLeads = useMemo(
    () => filterLeadsBySearch(leads, searchQuery),
    [leads, searchQuery]
  )
  const isSearching = searchQuery.trim().length > 0

  const fetchAssignees = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/assignees')
      if (!response.ok) return
      const data = await response.json()
      setAssignees(
        (data.assignees ?? []).map((assignee: CrmAssigneeRecord) => ({
          ...assignee,
          emails:
            assignee.emails?.length > 0
              ? assignee.emails
              : assignee.email
                ? [assignee.email]
                : [],
        }))
      )
    } catch (error) {
      console.error('Error fetching assignees:', error)
    }
  }, [])

  const fetchLeads = useCallback(async () => {
    try {
      setLeadsLoading(true)
      const response = await fetch('/api/admin/leads')
      if (!response.ok) throw new Error('Failed to load leads')
      const data = await response.json()
      const loaded = (data.leads ?? []).map((lead: CrmLead) => ({
        ...lead,
        status: normalizeStatus(lead.status),
        actionables: lead.actionables ?? [],
        createdAt: lead.createdAt ?? new Date().toISOString(),
      }))
      setLeads(loaded)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLeads([])
    } finally {
      setLeadsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
    fetchAssignees()
  }, [fetchLeads, fetchAssignees])

  const addAssignee = useCallback(async (name: string, emails: string[] = []) => {
    const trimmed = name.trim()
    if (!trimmed || trimmed.toLowerCase() === UNASSIGNED_ASSIGNEE.toLowerCase()) return

    const exists = assignees.some(
      (assignee) => assignee.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (exists) return

    const response = await fetch('/api/admin/assignees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed, emails }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add assignee')
    }
    setAssignees((prev) =>
      [...prev, data.assignee].sort((a, b) => a.name.localeCompare(b.name))
    )
  }, [assignees])

  const updateAssigneeEmails = useCallback(async (id: string, emails: string[]) => {
    const response = await fetch(`/api/admin/assignees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update assignee emails')
    }
    const updated = data.assignee as CrmAssigneeRecord
    if (emails.length > 0 && updated.emails.length === 0) {
      throw new Error('Emails were not saved. Please restart the dev server and try again.')
    }
    setAssignees((prev) =>
      prev
        .map((assignee) => (assignee.id === id ? updated : assignee))
        .sort((a, b) => a.name.localeCompare(b.name))
    )
  }, [])

  const deleteAssignee = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/assignees/${id}`, { method: 'DELETE' })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Failed to remove assignee')
    }
    setAssignees((prev) => prev.filter((a) => a.id !== id))
  }, [])

  useEffect(() => {
    if (!leadsLoading) {
      onLeadsCountChange?.(leads.length)
    }
  }, [leads.length, leadsLoading, onLeadsCountChange])

  const patchLead = useCallback(async (id: string, patch: LeadPatch) => {
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to update lead')
    }
    const data = await response.json()
    const updated: CrmLead = {
      ...data.lead,
      status: normalizeStatus(data.lead.status),
      actionables: data.lead.actionables ?? [],
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
    return updated
  }, [])

  const addLeadToList = useCallback((lead: CrmLead) => {
    setLeads((prev) => [lead, ...prev])
  }, [])

  const deleteLead = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to delete lead')
    }
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const rescheduleLead = useCallback(async (id: string, date: string, time: string) => {
    const response = await fetch(`/api/admin/leads/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Failed to reschedule consultation')
    }
    const updated: CrmLead = {
      ...data.lead,
      status: normalizeStatus(data.lead.status),
      actionables: data.lead.actionables ?? [],
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
    return {
      lead: updated,
      emailSent: Boolean(data.emailSent),
      emailError: data.emailError ?? null,
    }
  }, [])

  const resendConfirmationEmail = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/leads/${id}/resend-email`, {
      method: 'POST',
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Failed to resend confirmation email')
    }
    const updated: CrmLead = {
      ...data.lead,
      status: normalizeStatus(data.lead.status),
      actionables: data.lead.actionables ?? [],
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
    return {
      lead: updated,
      emailSent: Boolean(data.emailSent),
      emailError: data.emailError ?? null,
    }
  }, [])

  const sendLeadEmail = useCallback(async (id: string, subject: string, body: string) => {
    const response = await fetch(`/api/admin/leads/${id}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email')
    }
    const updated: CrmLead = {
      ...data.lead,
      status: normalizeStatus(data.lead.status),
      actionables: data.lead.actionables ?? [],
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
    return {
      lead: updated,
      emailSent: Boolean(data.emailSent),
      emailError: data.emailError ?? null,
    }
  }, [])

  const mergeLead = useCallback(async (keeperId: string, mergeLeadId: string) => {
    const response = await fetch(`/api/admin/leads/${keeperId}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mergeLeadId }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Failed to merge leads')
    }
    const updated: CrmLead = {
      ...data.lead,
      status: normalizeStatus(data.lead.status),
      actionables: data.lead.actionables ?? [],
    }
    setLeads((prev) =>
      prev.filter((l) => l.id !== mergeLeadId).map((l) => (l.id === keeperId ? updated : l))
    )
    return updated
  }, [])

  const crmLeadsProps = {
    loading: leadsLoading,
    assignees,
    onEnsureAssignee: addAssignee,
    onUpdateAssigneeEmails: updateAssigneeEmails,
    onDeleteAssignee: deleteAssignee,
    onPatchLead: patchLead,
    onLeadAdded: addLeadToList,
    onLeadDeleted: deleteLead,
    onRescheduleLead: rescheduleLead,
    onResendConfirmationEmail: resendConfirmationEmail,
    onSendLeadEmail: sendLeadEmail,
    onMergeLead: mergeLead,
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    drawerLeadId,
    onDrawerLeadIdChange: (id: string | null) => {
      setDrawerLeadId(id)
      if (!id) setHighlightTaskId(null)
    },
    highlightTaskId,
    leadPool: leads,
  }

  const isInternalView = activeView.startsWith('internal-')

  return (
    <InternalWorkProvider>
    <div className="bg-[#fbf9f6] text-[#2a2724] [color-scheme:light] -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-0 sm:px-0 lg:px-0 py-8 min-h-[calc(100vh-5rem)]">
      <div className="flex items-center gap-4 mb-7 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-[21px] font-medium text-[#1c1a18] tracking-tight">{title}</h1>
          <p className="text-[12.5px] text-[#736c63] mt-0.5">{subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          {activeView !== 'leads' && !isInternalView && (
          <div className="hidden sm:flex items-center gap-2 bg-white border border-[#e7e1d9] rounded-full px-3.5 py-2 w-[260px] focus-within:border-[#7a1322] focus-within:ring-2 focus-within:ring-[#f6ecee]">
            <Search className="w-4 h-4 text-[#736c63] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, matters…"
              className="border-none bg-transparent text-[13.5px] text-[#2a2724] w-full focus:outline-none placeholder:text-[#736c63]"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#736c63] hover:text-[#7a1322] flex-shrink-0"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          )}
        </div>
      </div>

      {isSearching && !leadsLoading && (
        <p className="text-[12.5px] text-[#736c63] mb-4 px-4 sm:px-6 lg:px-8">
          {filteredLeads.length === 0
            ? `No results for "${searchQuery.trim()}"`
            : `${filteredLeads.length} result${filteredLeads.length === 1 ? '' : 's'} for "${searchQuery.trim()}"`}
        </p>
      )}

      <div className="px-4 sm:px-6 lg:px-8">
        {leadsLoading && activeView !== 'leads' && !isInternalView ? (
          <div className="py-20 text-center text-[#736c63] text-sm">Loading CRM data…</div>
        ) : (
          <>
          {activeView === 'internal-overview' && (
            <InternalWorkLoadingGate>
              <InternalWorkOverview />
            </InternalWorkLoadingGate>
          )}
          {activeView === 'internal-client' && (
            <InternalWorkLoadingGate>
              <InternalWorkRegister section="client" />
            </InternalWorkLoadingGate>
          )}
          {activeView === 'internal-firm' && (
            <InternalWorkLoadingGate>
              <InternalWorkRegister section="admin" />
            </InternalWorkLoadingGate>
          )}
          {activeView === 'internal-calendar' && (
            <InternalWorkLoadingGate>
              <InternalWorkCalendar />
            </InternalWorkLoadingGate>
          )}
          {activeView === 'internal-associates' && (
            <InternalWorkLoadingGate>
              <InternalWorkAssociates />
            </InternalWorkLoadingGate>
          )}
          {activeView === 'overview' && (
            <>
              <CrmOverview
                leads={filteredLeads}
                onNavigate={handleNavigate}
                onLeadClick={(lead) => setDrawerLeadId(lead.id)}
              />
              {drawerLeadId && (
                <CrmLeads
                  leads={filteredLeads}
                  {...crmLeadsProps}
                  drawerOnly
                />
              )}
            </>
          )}
          {activeView === 'leads' && (
            <CrmLeads
              key={leadsFilterKey}
              leads={leads}
              {...crmLeadsProps}
              initialFilters={leadsInitialFilters}
            />
          )}
          {activeView === 'consultations' && (
            <>
              <CrmConsultations
                leads={filteredLeads}
                onLeadClick={(lead) => setDrawerLeadId(lead.id)}
              />
              {drawerLeadId && (
                <CrmLeads
                  leads={filteredLeads}
                  {...crmLeadsProps}
                  drawerOnly
                />
              )}
            </>
          )}
          {activeView === 'analytics' && (
            <CrmAnalytics leads={filteredLeads} onNavigate={handleNavigate} />
          )}
        </>
        )}
      </div>
    </div>
    </InternalWorkProvider>
  )
}
