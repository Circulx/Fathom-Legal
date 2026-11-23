'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import type { CrmLead } from './data'
import { groupLeadsByConsultationDate } from '@/lib/crm-consultation-dates'
import { buildMonthCalendarWeeks, monthFromDateKey, toDateKey } from '@/lib/booking-calendar'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

function getCardTheme(lead: CrmLead): keyof typeof CARD_THEMES {
  return lead.areas[0] === 'Startup & funding' ? 'green' : 'maroon'
}

function ConsultationCard({
  lead,
  onClick,
}: {
  lead: CrmLead
  onClick: () => void
}) {
  const theme = CARD_THEMES[getCardTheme(lead)]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-[10px] border border-[#efebe4] border-l-[3px] ${theme.bg} ${theme.border} px-3 py-2.5 hover:shadow-sm hover:border-[#7a1322]/30 transition-all cursor-pointer`}
    >
      <div className="text-[11px] font-medium text-[#736c63] mb-1">{lead.time}</div>
      <div className="text-[13px] font-medium text-[#1c1a18] leading-snug">
        {lead.first} {lead.last}
      </div>
      <div className="text-[11.5px] text-[#736c63] mt-0.5 truncate">{lead.areas[0]}</div>
    </button>
  )
}

export default function CrmConsultations({
  leads,
  onLeadClick,
}: {
  leads: CrmLead[]
  onLeadClick: (lead: CrmLead) => void
}) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const todayKey = toDateKey(today)

  const leadsByDate = useMemo(
    () => groupLeadsByConsultationDate(leads, today),
    [leads, today]
  )

  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [displayMonth, setDisplayMonth] = useState(
    () => monthFromDateKey(todayKey) ?? new Date(today.getFullYear(), today.getMonth(), 1)
  )

  useEffect(() => {
    const fromSelected = monthFromDateKey(selectedDate)
    if (fromSelected) {
      setDisplayMonth(fromSelected)
    }
  }, [selectedDate])

  const monthCalendar = useMemo(() => buildMonthCalendarWeeks(displayMonth), [displayMonth])

  const selectedDayLeads = leadsByDate.get(selectedDate) ?? []

  const selectedDayLabel = useMemo(() => {
    const match = selectedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!match) return 'Selected day'
    const d = new Date(
      parseInt(match[1], 10),
      parseInt(match[2], 10) - 1,
      parseInt(match[3], 10)
    )
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [selectedDate])

  const yearOptions = useMemo(() => {
    const current = today.getFullYear()
    return Array.from({ length: 5 }, (_, i) => current - 1 + i)
  }, [today])

  const monthConsultationCount = useMemo(() => {
    let count = 0
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    for (const [dateKey, dayLeads] of leadsByDate) {
      const d = monthFromDateKey(dateKey)
      if (d && d.getFullYear() === year && d.getMonth() === month) {
        count += dayLeads.length
      }
    }
    return count
  }, [displayMonth, leadsByDate])

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1))
  }

  const handleYearMonthChange = (e: React.ChangeEvent<HTMLSelectElement>, isYear: boolean) => {
    const next = new Date(displayMonth)
    if (isYear) {
      next.setFullYear(parseInt(e.target.value, 10))
    } else {
      next.setMonth(parseInt(e.target.value, 10))
    }
    setDisplayMonth(next)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4">
      <div className="bg-white border border-[#e7e1d9] rounded-[14px] shadow-sm overflow-hidden">
        <div className="flex items-center px-5 py-4 border-b border-[#efebe4]">
          <div>
            <h2 className="font-playfair text-[17px] font-medium text-[#1c1a18]">
              Consultation calendar
            </h2>
            <p className="text-[12px] text-[#736c63] mt-0.5">
              {monthConsultationCount} scheduled this month
            </p>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-center gap-2 mb-4 p-3 rounded-lg bg-[#7a1322]/5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-white border border-[#7a1322] text-[#7a1322] hover:bg-[#7a1322]/10 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={displayMonth.getMonth()}
              onChange={(e) => handleYearMonthChange(e, false)}
              className="px-2 py-1 border border-[#7a1322] rounded-lg text-[12px] font-semibold text-[#7a1322] bg-white focus:outline-none cursor-pointer"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={displayMonth.getFullYear()}
              onChange={(e) => handleYearMonthChange(e, true)}
              className="px-2 py-1 border border-[#7a1322] rounded-lg text-[12px] font-semibold text-[#7a1322] bg-white focus:outline-none cursor-pointer"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-white border border-[#7a1322] text-[#7a1322] hover:bg-[#7a1322]/10 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-lg border border-[#7a1322]/10 p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_HEADERS.map((day) => (
                <div
                  key={day}
                  className="aspect-square flex items-center justify-center text-[10px] font-bold text-[#7a1322] bg-[#7a1322]/8 rounded-md"
                >
                  {day.charAt(0)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthCalendar.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  if (!day.date || !day.isCurrentMonth) {
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="aspect-square"
                        aria-hidden
                      />
                    )
                  }

                  const dateKey = toDateKey(day.date)
                  const isSelected = selectedDate === dateKey
                  const isToday = dateKey === todayKey
                  const count = leadsByDate.get(dateKey)?.length ?? 0

                  return (
                    <button
                      key={`${weekIndex}-${dayIndex}`}
                      type="button"
                      onClick={() => setSelectedDate(dateKey)}
                      className={`aspect-square rounded-md border font-semibold transition-all flex flex-col items-center justify-center gap-0.5 text-[12px] ${
                        isSelected
                          ? 'border-[#7a1322] bg-[#7a1322] text-white shadow-sm'
                          : isToday
                          ? 'border-[#7a1322] bg-[#7a1322]/12 text-[#7a1322]'
                          : count > 0
                          ? 'border-[#e7e1d9] bg-white text-[#1c1a18] hover:border-[#7a1322]'
                          : 'border-[#efebe4] bg-white text-[#736c63] hover:border-[#7a1322]/40'
                      }`}
                    >
                      <span>{day.dateNum}</span>
                      {count > 0 && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-[#7a1322]'
                          }`}
                          title={`${count} consultation${count === 1 ? '' : 's'}`}
                        />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#736c63] mt-3">
            Days with a dot have scheduled consultations. Select a day to view details.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#e7e1d9] rounded-[14px] shadow-sm overflow-hidden flex flex-col min-h-[360px]">
        <div className="px-5 py-4 border-b border-[#efebe4]">
          <div className="flex items-start gap-2">
            <CalendarDays className="w-5 h-5 text-[#7a1322] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[15px] font-medium text-[#1c1a18]">{selectedDayLabel}</h3>
              <p className="text-[12px] text-[#736c63] mt-0.5">
                {selectedDayLeads.length === 0
                  ? 'No consultations'
                  : `${selectedDayLeads.length} consultation${selectedDayLeads.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2.5 overflow-y-auto">
          {selectedDayLeads.length === 0 ? (
            <p className="text-sm text-[#736c63] text-center py-10">
              Nothing scheduled for this day.
            </p>
          ) : (
            selectedDayLeads.map((lead) => (
              <ConsultationCard
                key={lead.id}
                lead={lead}
                onClick={() => onLeadClick(lead)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
