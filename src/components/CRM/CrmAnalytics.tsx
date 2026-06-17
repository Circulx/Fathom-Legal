'use client'

import { Inbox, CalendarDays, Trophy, Clock } from 'lucide-react'

const KPI_STATS = [
  {
    label: 'Total enquiries (90 days)',
    value: '47',
    icon: Inbox,
    iconBg: 'bg-[#f6ecee]',
    iconColor: 'text-[#7a1322]',
  },
  {
    label: 'Consultations held',
    value: '31',
    icon: CalendarDays,
    iconBg: 'bg-[#e6eef5]',
    iconColor: 'text-[#2f5d8a]',
  },
  {
    label: 'Clients retained',
    value: '20',
    icon: Trophy,
    iconBg: 'bg-[#e8f1ea]',
    iconColor: 'text-[#3f7a52]',
  },
  {
    label: 'Avg. response time',
    value: '3.2h',
    icon: Clock,
    iconBg: 'bg-[#f5ecdb]',
    iconColor: 'text-[#9a6b1f]',
  },
]

const MONTHLY_ENQUIRIES = [
  { month: 'Jan', value: 9 },
  { month: 'Feb', value: 12 },
  { month: 'Mar', value: 11 },
  { month: 'Apr', value: 15 },
  { month: 'May', value: 14 },
  { month: 'Jun', value: 18 },
]

const CONVERSION_FUNNEL = [
  { label: 'Enquiries', value: 47, pct: null },
  { label: 'Contacted', value: 39, pct: 83 },
  { label: 'Consultation booked', value: 31, pct: 66 },
  { label: 'Proposal sent', value: 25, pct: 53 },
  { label: 'Retained', value: 20, pct: 42 },
]

const PRACTICE_AREA_DEMAND = [
  { area: 'Startup & funding', pct: 28 },
  { area: 'Web3 & blockchain', pct: 24 },
  { area: 'Corporate advisory', pct: 19 },
  { area: 'Contract review', pct: 15 },
  { area: 'Dispute resolution', pct: 9 },
  { area: 'Intellectual property', pct: 5 },
]

const MAX_MONTHLY = Math.max(...MONTHLY_ENQUIRIES.map((m) => m.value))
const MAX_FUNNEL = CONVERSION_FUNNEL[0].value

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: (typeof KPI_STATS)[number]) {
  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
      <div className={`w-9 h-9 rounded-[10px] ${iconBg} flex items-center justify-center mb-3.5`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="text-[30px] font-medium text-[#1c1a18] leading-none tracking-tight">{value}</div>
      <div className="text-[12.5px] text-[#736c63] mt-1.5">{label}</div>
    </div>
  )
}

function EnquiriesChart() {
  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#efebe4]">
        <h3 className="font-playfair text-base font-medium text-[#1c1a18]">Enquiries per month</h3>
      </div>
      <div className="px-5 py-6">
        <div className="flex items-end justify-between gap-3 h-[200px]">
          {MONTHLY_ENQUIRIES.map((item) => {
            const heightPct = (item.value / MAX_MONTHLY) * 100
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[12px] font-medium text-[#1c1a18]">{item.value}</span>
                <div
                  className="w-full max-w-[52px] rounded-t-lg bg-gradient-to-t from-[#7a1322] to-[#9a2a3a] relative overflow-hidden"
                  style={{ height: `${heightPct}%`, minHeight: '24px' }}
                >
                  <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/25 to-transparent" />
                </div>
                <span className="text-[11.5px] text-[#736c63] font-medium">{item.month}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ConversionFunnel() {
  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#efebe4]">
        <h3 className="font-playfair text-base font-medium text-[#1c1a18]">Conversion funnel</h3>
      </div>
      <div className="px-5 py-5 space-y-3.5">
        {CONVERSION_FUNNEL.map((stage) => {
          const widthPct = (stage.value / MAX_FUNNEL) * 100
          return (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="text-[12.5px] text-[#2a2724] w-[130px] flex-shrink-0">{stage.label}</span>
              <div className="flex-1 min-w-0">
                <div
                  className="h-8 rounded-lg bg-gradient-to-r from-[#7a1322] to-[#5c0e1a] flex items-center px-3 min-w-[48px]"
                  style={{ width: `${widthPct}%` }}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PracticeAreaDemand() {
  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#efebe4]">
        <h3 className="font-playfair text-base font-medium text-[#1c1a18]">Demand by practice area</h3>
      </div>
      <div className="px-5 py-5 space-y-4">
        {PRACTICE_AREA_DEMAND.map((item) => (
          <div key={item.area}>
            <div className="flex justify-between text-[12.5px] mb-1.5">
              <span className="text-[#2a2724]">{item.area}</span>
              <span className="text-[#736c63] font-medium">{item.pct}%</span>
            </div>
            <div className="h-[7px] rounded-md bg-[#efebe4] overflow-hidden">
              <div
                className="h-full rounded-md bg-gradient-to-r from-[#7a1322] to-[#5c0e1a]"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CrmAnalytics() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
        {KPI_STATS.map((stat) => (
          <KpiCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-7">
        <EnquiriesChart />
        <ConversionFunnel />
      </div>

      <PracticeAreaDemand />
    </>
  )
}
