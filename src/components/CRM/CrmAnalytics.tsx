'use client'

import { useMemo, useState } from 'react'
import { Inbox, CalendarDays, Trophy, Clock, Download } from 'lucide-react'
import type { CrmLead } from './data'
import {
  AWAITING_RESPONSE_STATUSES,
  CONSULTATION_BOOKED_STATUSES,
  PROPOSAL_SENT_STATUSES,
  RETAINED_STATUSES,
  type LeadListFilters,
} from './data'
import {
  computeConversionFunnel,
  computeCrmStats,
  computeMonthlyEnquiries,
  computePracticeAreaDemand,
  type MonthlyEnquiryBucket,
} from '@/lib/crm-analytics'
import {
  filterLeadsByEnquiryDateRange,
  formatAnalyticsRangeLabel,
  monthIsoDateRange,
  resolveAnalyticsDateRange,
  type AnalyticsDatePreset,
} from '@/lib/crm-date-ranges'
import { downloadLeadsCsv } from '@/lib/crm-export'

const DATE_PRESETS: AnalyticsDatePreset[] = ['7d', '30d', '90d', '6m', 'ytd', 'all', 'custom']

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  onClick,
}: {
  label: string
  value: string | number
  icon: typeof Inbox
  iconBg: string
  iconColor: string
  onClick?: () => void
}) {
  const className =
    'bg-white border border-[#e7e1d9] rounded-[14px] p-5 text-left w-full hover:border-[#7a1322]/30 hover:shadow-sm transition-all'
  const content = (
    <>
      <div className={`w-9 h-9 rounded-[10px] ${iconBg} flex items-center justify-center mb-3.5`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">{value}</div>
      <div className="text-[12.5px] text-[#736c63] mt-1.5">{label}</div>
    </>
  )

  if (!onClick) {
    return <div className={className}>{content}</div>
  }

  return (
    <button type="button" onClick={onClick} className={`${className} cursor-pointer`}>
      {content}
    </button>
  )
}

function EnquiriesChart({
  data,
  onMonthClick,
}: {
  data: MonthlyEnquiryBucket[]
  onMonthClick?: (bucket: MonthlyEnquiryBucket) => void
}) {
  const maxValue = Math.max(...data.map((m) => m.value), 1)

  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#efebe4]">
        <h3 className="font-playfair text-base font-medium text-[#1c1a18]">Enquiries per month</h3>
        <p className="text-[11.5px] text-[#736c63] mt-0.5">Click a month to view matching leads</p>
      </div>
      <div className="px-5 py-6">
        {data.length === 0 ? (
          <p className="text-sm text-[#736c63] text-center py-8">No enquiries in this period</p>
        ) : (
          <div className="flex items-end justify-between gap-3 h-[200px]">
            {data.map((item) => {
              const heightPct = (item.value / maxValue) * 100
              const key = `${item.year}-${item.monthIndex}`
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onMonthClick?.(item)}
                  disabled={!onMonthClick}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group disabled:cursor-default"
                  title={onMonthClick ? `View leads from ${item.month} ${item.year}` : undefined}
                >
                  <span className="text-[12px] font-medium text-[#1c1a18]">{item.value}</span>
                  <div
                    className={`w-full max-w-[52px] rounded-t-lg bg-gradient-to-t from-[#7a1322] to-[#9a2a3a] relative overflow-hidden ${
                      onMonthClick ? 'group-hover:from-[#5c0e1a] group-hover:to-[#7a1322]' : ''
                    }`}
                    style={{ height: `${heightPct}%`, minHeight: item.value > 0 ? '24px' : '4px' }}
                  >
                    <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/25 to-transparent" />
                  </div>
                  <span className="text-[11.5px] text-[#736c63] font-medium">{item.month}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function ConversionFunnel({
  data,
  onStageClick,
}: {
  data: { label: string; value: number; pct: number | null }[]
  onStageClick?: (label: string) => void
}) {
  const maxFunnel = Math.max(data[0]?.value ?? 1, 1)

  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#efebe4]">
        <h3 className="font-playfair text-base font-medium text-[#1c1a18]">Conversion funnel</h3>
        <p className="text-[11.5px] text-[#736c63] mt-0.5">Click a stage to drill into leads</p>
      </div>
      <div className="px-5 py-5 space-y-3.5">
        {data.map((stage) => {
          const widthPct = maxFunnel > 0 ? (stage.value / maxFunnel) * 100 : 0
          return (
            <button
              key={stage.label}
              type="button"
              onClick={() => onStageClick?.(stage.label)}
              disabled={!onStageClick}
              className="flex items-center gap-3 w-full text-left group disabled:cursor-default"
            >
              <span className="text-[12.5px] text-[#2a2724] w-[130px] flex-shrink-0 group-hover:text-[#7a1322]">
                {stage.label}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={`h-8 rounded-lg bg-gradient-to-r from-[#7a1322] to-[#5c0e1a] flex items-center px-3 min-w-[48px] ${
                    onStageClick ? 'group-hover:from-[#5c0e1a] group-hover:to-[#3a0a12]' : ''
                  }`}
                  style={{ width: `${Math.max(widthPct, stage.value > 0 ? 12 : 0)}%` }}
                >
                  <span className="text-[12.5px] font-semibold text-white">{stage.value}</span>
                </div>
              </div>
              {stage.pct !== null && (
                <span className="text-[12.5px] text-[#736c63] font-medium w-10 text-right flex-shrink-0">
                  {stage.pct}%
                </span>
              )}
              {stage.pct === null && <span className="w-10 flex-shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PracticeAreaDemand({
  data,
  onAreaClick,
}: {
  data: { area: string; pct: number }[]
  onAreaClick?: (area: string) => void
}) {
  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#efebe4]">
        <h3 className="font-playfair text-base font-medium text-[#1c1a18]">Demand by practice area</h3>
        <p className="text-[11.5px] text-[#736c63] mt-0.5">Click an area to view related leads</p>
      </div>
      <div className="px-5 py-5 space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-[#736c63] text-center py-4">No practice area data yet</p>
        ) : (
          data.map((item) => (
            <button
              key={item.area}
              type="button"
              onClick={() => onAreaClick?.(item.area)}
              disabled={!onAreaClick}
              className="w-full text-left group disabled:cursor-default"
            >
              <div className="flex justify-between text-[12.5px] mb-1.5">
                <span className="text-[#2a2724] group-hover:text-[#7a1322]">{item.area}</span>
                <span className="text-[#736c63] font-medium">{item.pct}%</span>
              </div>
              <div className="h-[7px] rounded-md bg-[#efebe4] overflow-hidden">
                <div
                  className={`h-full rounded-md bg-gradient-to-r from-[#7a1322] to-[#5c0e1a] ${
                    onAreaClick ? 'group-hover:from-[#5c0e1a]' : ''
                  }`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function funnelStageFilters(label: string): LeadListFilters {
  switch (label) {
    case 'Consultation booked':
      return { statuses: CONSULTATION_BOOKED_STATUSES }
    case 'Proposal sent':
      return { statuses: PROPOSAL_SENT_STATUSES }
    case 'Retained':
      return { statuses: RETAINED_STATUSES }
    default:
      return { status: 'all' }
  }
}

type CrmView = 'overview' | 'leads' | 'consultations' | 'analytics'

export default function CrmAnalytics({
  leads,
  onNavigate,
}: {
  leads: CrmLead[]
  onNavigate?: (view: CrmView, filters?: LeadListFilters) => void
}) {
  const [datePreset, setDatePreset] = useState<AnalyticsDatePreset>('6m')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const dateRange = useMemo(
    () => resolveAnalyticsDateRange(datePreset, customFrom, customTo),
    [datePreset, customFrom, customTo]
  )

  const scopedLeads = useMemo(
    () => filterLeadsByEnquiryDateRange(leads, dateRange),
    [leads, dateRange]
  )

  const stats = computeCrmStats(leads, dateRange)
  const monthly = computeMonthlyEnquiries(leads, dateRange)
  const funnel = computeConversionFunnel(leads, dateRange)
  const practiceAreas = computePracticeAreaDemand(leads, dateRange)

  const applyRangeToLeadFilters = (filters: LeadListFilters): LeadListFilters => {
    if (filters.dateFrom || filters.dateTo) return filters
    if (datePreset === 'all') return filters
    if (datePreset === 'custom') {
      return {
        ...filters,
        dateFrom: customFrom || undefined,
        dateTo: customTo || undefined,
        dateField: 'enquiry',
      }
    }
    const resolved = resolveAnalyticsDateRange(datePreset)
    const from = resolved.from ? resolved.from.toISOString().slice(0, 10) : undefined
    const to = resolved.to ? resolved.to.toISOString().slice(0, 10) : undefined
    return { ...filters, dateFrom: from, dateTo: to, dateField: 'enquiry' }
  }

  const drillToLeads = (filters: LeadListFilters) => {
    onNavigate?.('leads', applyRangeToLeadFilters(filters))
  }

  const kpiStats = [
    {
      label: 'Total enquiries',
      value: scopedLeads.length,
      icon: Inbox,
      iconBg: 'bg-[#f6ecee]',
      iconColor: 'text-[#7a1322]',
      onClick: onNavigate ? () => drillToLeads({ status: 'all' }) : undefined,
    },
    {
      label: 'Consultations held',
      value: stats.consultationsHeld,
      icon: CalendarDays,
      iconBg: 'bg-[#e6eef5]',
      iconColor: 'text-[#2f5d8a]',
      onClick: onNavigate
        ? () => drillToLeads({ statuses: CONSULTATION_BOOKED_STATUSES })
        : undefined,
    },
    {
      label: 'Clients retained',
      value: stats.retained,
      icon: Trophy,
      iconBg: 'bg-[#e8f1ea]',
      iconColor: 'text-[#3f7a52]',
      onClick: onNavigate ? () => drillToLeads({ statuses: RETAINED_STATUSES }) : undefined,
    },
    {
      label: 'Awaiting response',
      value: stats.awaitingResponse,
      icon: Clock,
      iconBg: 'bg-[#f5ecdb]',
      iconColor: 'text-[#9a6b1f]',
      onClick: onNavigate
        ? () => drillToLeads({ statuses: AWAITING_RESPONSE_STATUSES })
        : undefined,
    },
  ]

  const exportFilename = `fathom-analytics-${datePreset}-${new Date().toISOString().slice(0, 10)}.csv`

  return (
    <>
      <div className="flex flex-wrap items-end gap-3 mb-6 p-3.5 bg-white border border-[#e7e1d9] rounded-[14px]">
        <div className="min-w-[180px]">
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
            Date range
          </label>
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value as AnalyticsDatePreset)}
            className="w-full border border-[#e7e1d9] rounded-[10px] px-3 py-2 text-[13px] text-[#2a2724] bg-white focus:outline-none focus:border-[#7a1322] focus:ring-2 focus:ring-[#f6ecee]"
          >
            {DATE_PRESETS.map((preset) => (
              <option key={preset} value={preset}>
                {formatAnalyticsRangeLabel(preset)}
              </option>
            ))}
          </select>
        </div>

        {datePreset === 'custom' && (
          <>
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
                From
              </label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="border border-[#e7e1d9] rounded-[10px] px-3 py-2 text-[13px] w-[148px] focus:outline-none focus:border-[#7a1322] focus:ring-2 focus:ring-[#f6ecee]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1">
                To
              </label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="border border-[#e7e1d9] rounded-[10px] px-3 py-2 text-[13px] w-[148px] focus:outline-none focus:border-[#7a1322] focus:ring-2 focus:ring-[#f6ecee]"
              />
            </div>
          </>
        )}

        <div className="ml-auto flex items-center gap-2 pb-0.5">
          <span className="text-[12px] text-[#736c63]">
            {scopedLeads.length} lead{scopedLeads.length === 1 ? '' : 's'} in range
          </span>
          <button
            type="button"
            onClick={() => downloadLeadsCsv(scopedLeads, exportFilename)}
            disabled={scopedLeads.length === 0}
            className="inline-flex items-center gap-1.5 border border-[#e7e1d9] bg-white text-[#2a2724] rounded-full px-4 py-2 text-[13px] font-medium hover:border-[#7a1322] hover:text-[#7a1322] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
        {kpiStats.map((stat) => (
          <KpiCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-7">
        <EnquiriesChart
          data={monthly}
          onMonthClick={
            onNavigate
              ? (bucket) => {
                  const { dateFrom, dateTo } = monthIsoDateRange(bucket.year, bucket.monthIndex)
                  drillToLeads({ status: 'all', dateFrom, dateTo })
                }
              : undefined
          }
        />
        <ConversionFunnel
          data={funnel}
          onStageClick={
            onNavigate ? (label) => drillToLeads(funnelStageFilters(label)) : undefined
          }
        />
      </div>

      <PracticeAreaDemand
        data={practiceAreas}
        onAreaClick={onNavigate ? (area) => drillToLeads({ practiceArea: area }) : undefined}
      />
    </>
  )
}
