'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CRM_LEADS, type CrmLead } from './data'

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

const CARD_THEMES = {
  maroon: {
    bg: 'bg-[#fdf5f6]',
    border: 'border-l-[#7a1322]',
  },
  green: {
    bg: 'bg-[#f0f6f1]',
    border: 'border-l-[#3f7a52]',
  },
} as const

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function parseLeadDate(dateStr: string, referenceYear: number): Date | null {
  if (dateStr === '—') return null
  const match = dateStr.match(/^[A-Za-z]{3},\s+([A-Za-z]{3})\s+(\d+)$/)
  if (!match) return null
  const month = MONTH_MAP[match[1]]
  if (month === undefined) return null
  return new Date(referenceYear, month, parseInt(match[2], 10))
}

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i)
  if (!match) return 0
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatWeekRange(weekStart: Date): string {
  const fri = new Date(weekStart)
  fri.setDate(fri.getDate() + 4)
  const monMonth = weekStart.toLocaleDateString('en-US', { month: 'short' })
  const friMonth = fri.toLocaleDateString('en-US', { month: 'short' })
  if (monMonth === friMonth) {
    return `${monMonth} ${weekStart.getDate()}–${fri.getDate()}`
  }
  return `${monMonth} ${weekStart.getDate()} – ${friMonth} ${fri.getDate()}`
}

function getCardTheme(lead: CrmLead): keyof typeof CARD_THEMES {
  return lead.areas[0] === 'Startup & funding' ? 'green' : 'maroon'
}

function ConsultationCard({ lead }: { lead: CrmLead }) {
  const theme = CARD_THEMES[getCardTheme(lead)]
  return (
    <div
      className={`rounded-[10px] border border-[#efebe4] border-l-[3px] ${theme.bg} ${theme.border} px-3 py-2.5`}
    >
      <div className="text-[11px] font-medium text-[#736c63] mb-1">{lead.time}</div>
      <div className="text-[13px] font-medium text-[#1c1a18] leading-snug">
        {lead.first} {lead.last}
      </div>
      <div className="text-[11.5px] text-[#736c63] mt-0.5 truncate">{lead.areas[0]}</div>
    </div>
  )
}

export default function CrmConsultations() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(today))

  const weekDays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [weekStart])

  const consultationsByDay = useMemo(() => {
    const year = weekStart.getFullYear()
    const scheduled = CRM_LEADS.filter((l) => l.date !== '—')

    return weekDays.map((day) =>
      scheduled
        .filter((lead) => {
          const leadDate = parseLeadDate(lead.date, year)
          return leadDate && isSameDay(leadDate, day)
        })
        .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time))
    )
  }, [weekDays, weekStart])

  const isCurrentWeek = weekDays.some((day) => isSameDay(day, today))
  const weekLabel = isCurrentWeek
    ? `This week — ${formatWeekRange(weekStart)}`
    : formatWeekRange(weekStart)

  const goToPrevWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 7)
      return d
    })
  }

  const goToNextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7)
      return d
    })
  }

  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[14px] shadow-sm overflow-hidden">
      <div className="flex items-center px-5 py-4 border-b border-[#efebe4]">
        <h2 className="font-playfair text-[17px] font-medium text-[#1c1a18]">{weekLabel}</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={goToPrevWeek}
            className="w-8 h-8 rounded-lg border border-[#e7e1d9] bg-white flex items-center justify-center text-[#736c63] hover:border-[#7a1322] hover:text-[#7a1322] transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goToNextWeek}
            className="w-8 h-8 rounded-lg border border-[#e7e1d9] bg-white flex items-center justify-center text-[#736c63] hover:border-[#7a1322] hover:text-[#7a1322] transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 border-b border-[#efebe4]">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today)
          return (
            <div
              key={day.toISOString()}
              className="px-3 py-3 text-center border-r border-[#efebe4] last:border-r-0"
            >
              <div className="text-[10.5px] font-semibold tracking-wider text-[#736c63] uppercase">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div
                className={`text-[15px] font-medium mt-0.5 ${
                  isToday ? 'text-[#7a1322]' : 'text-[#1c1a18]'
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-5 min-h-[320px]">
        {weekDays.map((day, i) => (
          <div
            key={day.toISOString()}
            className="px-2.5 py-3 border-r border-[#efebe4] last:border-r-0 space-y-2.5"
          >
            {consultationsByDay[i].map((lead) => (
              <ConsultationCard key={lead.id} lead={lead} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
