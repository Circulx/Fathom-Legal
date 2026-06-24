'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { getInitials, normalizeStatus, filterLeadsBySearch, UNASSIGNED_ASSIGNEE, type CrmAssigneeRecord, type CrmLead, type LeadPatch } from './data'
import { StatusBadge } from './shared'
import CrmLeads from './CrmLeads'
import CrmConsultations from './CrmConsultations'
import CrmAnalytics from './CrmAnalytics'
import { computeCrmStats, computeSourceBreakdown } from '@/lib/crm-analytics'
import { compareLeadConsultationDates } from '@/lib/crm-consultation-dates'

export type CrmView = 'overview' | 'leads' | 'consultations' | 'analytics'

const VIEW_TITLES: Record<CrmView, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'A snapshot of your practice today' },
  leads: { title: 'Leads & enquiries', subtitle: 'Track every enquiry from first contact to retained' },
  consultations: { title: 'Consultations', subtitle: 'Your scheduled client meetings' },
  analytics: { title: 'Analytics', subtitle: 'How your intake is performing' },
}

function CrmOverview({
  leads,
  onNavigate,
  onLeadClick,
}: {
  leads: CrmLead[]
  onNavigate: (view: CrmView) => void
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
        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <div className="w-9 h-9 rounded-[10px] bg-[#f6ecee] flex items-center justify-center mb-3.5">
            <Inbox className="w-5 h-5 text-[#7a1322]" />
          </div>
          <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">
            {stats.recentCount}
          </div>
          <div className="text-[12.5px] text-[#736c63] mt-1.5">New enquiries (7 days)</div>
        </div>

        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <div className="w-9 h-9 rounded-[10px] bg-[#e6eef5] flex items-center justify-center mb-3.5">
            <CalendarDays className="w-5 h-5 text-[#2f5d8a]" />
          </div>
          <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">
            {stats.consultationsScheduled}
          </div>
          <div className="text-[12.5px] text-[#736c63] mt-1.5">Consultations scheduled</div>
        </div>

        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <div className="w-9 h-9 rounded-[10px] bg-[#f5ecdb] flex items-center justify-center mb-3.5">
            <Clock className="w-5 h-5 text-[#9a6b1f]" />
          </div>
          <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">
            {stats.awaitingResponse}
          </div>
          <div className="text-[12.5px] text-[#736c63] mt-1.5">Awaiting response</div>
          <div className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#7a1322] mt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            needs follow-up
          </div>
        </div>

        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <div className="w-9 h-9 rounded-[10px] bg-[#e8f1ea] flex items-center justify-center mb-3.5">
            <Trophy className="w-5 h-5 text-[#3f7a52]" />
          </div>
          <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">
            {stats.retainedRate}%
          </div>
          <div className="text-[12.5px] text-[#736c63] mt-1.5">Lead → retained rate</div>
        </div>

        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <div className="w-9 h-9 rounded-[10px] bg-[#e8f1ea] flex items-center justify-center mb-3.5">
            <CircleCheck className="w-5 h-5 text-[#3f7a52]" />
          </div>
          <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">
            {stats.engaged}
          </div>
          <div className="text-[12.5px] text-[#736c63] mt-1.5">Engaged</div>
        </div>

        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <div className="w-9 h-9 rounded-[10px] bg-[#e9eef5] flex items-center justify-center mb-3.5">
            <FolderOpen className="w-5 h-5 text-[#3a5a8a]" />
          </div>
          <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">
            {stats.open}
          </div>
          <div className="text-[12.5px] text-[#736c63] mt-1.5">Open</div>
        </div>

        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <div className="w-9 h-9 rounded-[10px] bg-[#eee] flex items-center justify-center mb-3.5">
            <Archive className="w-5 h-5 text-[#8a8178]" />
          </div>
          <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">
            {stats.closed}
          </div>
          <div className="text-[12.5px] text-[#736c63] mt-1.5">Closed</div>
        </div>
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
  onNavigate: (view: CrmView) => void
  onLeadsCountChange?: (count: number) => void
}

export default function CrmSection({ activeView, onNavigate, onLeadsCountChange }: CrmSectionProps) {
  const { title, subtitle } = VIEW_TITLES[activeView]
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [assignees, setAssignees] = useState<CrmAssigneeRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerLeadId, setDrawerLeadId] = useState<string | null>(null)

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
      setAssignees(data.assignees ?? [])
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

  const addAssignee = useCallback(async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed || trimmed.toLowerCase() === UNASSIGNED_ASSIGNEE.toLowerCase()) return

    const exists = assignees.some(
      (assignee) => assignee.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (exists) return

    const response = await fetch('/api/admin/assignees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add assignee')
    }
    setAssignees((prev) =>
      [...prev, data.assignee].sort((a, b) => a.name.localeCompare(b.name))
    )
  }, [assignees])

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

  const crmLeadsProps = {
    loading: leadsLoading,
    assignees,
    onEnsureAssignee: addAssignee,
    onDeleteAssignee: deleteAssignee,
    onPatchLead: patchLead,
    onLeadAdded: addLeadToList,
    onLeadDeleted: deleteLead,
    onRescheduleLead: rescheduleLead,
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    drawerLeadId,
    onDrawerLeadIdChange: setDrawerLeadId,
    leadPool: leads,
  }

  return (
    <div className="bg-[#fbf9f6] text-[#2a2724] [color-scheme:light] -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-5rem)]">
      <div className="flex items-center gap-4 mb-7">
        <div>
          <h1 className="text-[21px] font-medium text-[#1c1a18] tracking-tight">{title}</h1>
          <p className="text-[12.5px] text-[#736c63] mt-0.5">{subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          {activeView !== 'leads' && (
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
        <p className="text-[12.5px] text-[#736c63] mb-4">
          {filteredLeads.length === 0
            ? `No results for “${searchQuery.trim()}”`
            : `${filteredLeads.length} result${filteredLeads.length === 1 ? '' : 's'} for “${searchQuery.trim()}”`}
        </p>
      )}

      {leadsLoading && activeView !== 'leads' ? (
        <div className="py-20 text-center text-[#736c63] text-sm">Loading CRM data…</div>
      ) : (
        <>
          {activeView === 'overview' && (
            <>
              <CrmOverview
                leads={filteredLeads}
                onNavigate={onNavigate}
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
            <CrmLeads leads={leads} {...crmLeadsProps} />
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
          {activeView === 'analytics' && <CrmAnalytics leads={filteredLeads} />}
        </>
      )}
    </div>
  )
}
