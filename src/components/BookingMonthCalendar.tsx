'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { buildMonthCalendarWeeks, monthFromDateKey, toDateKey } from '@/lib/booking-calendar'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type CalendarVariant = 'intake' | 'crm'

interface BookingMonthCalendarProps {
  selectedDate: string
  onDateSelect: (dateKey: string) => void
  variant?: CalendarVariant
  compact?: boolean
  yearsAhead?: number
  showTitle?: boolean
  title?: string
  helperText?: string
}

export default function BookingMonthCalendar({
  selectedDate,
  onDateSelect,
  variant = 'intake',
  compact = false,
  yearsAhead = 5,
  showTitle = true,
  title = 'Select Your Preferred Date',
  helperText = 'Only weekdays from today onwards are available. Select a date to view time slots.',
}: BookingMonthCalendarProps) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [displayMonth, setDisplayMonth] = useState(() => {
    return monthFromDateKey(selectedDate) ?? new Date(today.getFullYear(), today.getMonth(), 1)
  })

  useEffect(() => {
    const fromSelected = monthFromDateKey(selectedDate)
    if (fromSelected) {
      setDisplayMonth(fromSelected)
    }
  }, [selectedDate])

  const monthCalendar = useMemo(() => buildMonthCalendarWeeks(displayMonth), [displayMonth])

  const accent = variant === 'crm' ? '#7a1322' : '#A5292A'
  const isIntake = variant === 'intake'

  const handlePrevMonth = () => {
    const prevMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1)
    if (
      prevMonth.getFullYear() > today.getFullYear() ||
      (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() >= today.getMonth())
    ) {
      setDisplayMonth(prevMonth)
    }
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

  const prevDisabled =
    displayMonth.getMonth() === today.getMonth() &&
    displayMonth.getFullYear() === today.getFullYear()

  const navBtnClass = compact
    ? 'p-1.5 rounded-lg bg-white border transition-all disabled:opacity-50 disabled:cursor-not-allowed'
    : 'p-2 rounded-lg bg-white border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400'

  const selectClass = compact
    ? 'px-2 py-1 border rounded-lg text-[11px] font-semibold bg-white focus:outline-none cursor-pointer'
    : 'px-4 py-2 border-2 rounded-lg font-semibold bg-white focus:outline-none focus:ring-2 cursor-pointer'

  const dayHeaderClass = compact
    ? 'aspect-square flex items-center justify-center text-[10px] font-bold rounded-md'
    : 'aspect-square flex items-center justify-center text-xs font-bold rounded-lg'

  const dayCellClass = compact
    ? 'aspect-square rounded-md border font-semibold transition-all text-center flex items-center justify-center text-[11px]'
    : 'aspect-square rounded-lg border-2 font-semibold transition-all text-center flex items-center justify-center text-sm'

  const wrapperClass = isIntake
    ? 'border border-gray-200 rounded-lg p-6 mb-6 bg-white'
    : 'rounded-[10px]'

  const gridGap = compact ? 'gap-1' : 'gap-2'
  const navGap = compact ? 'gap-2' : 'gap-4'
  const navPadding = compact ? 'p-2 mb-3' : 'p-4 mb-6'

  return (
    <div className={wrapperClass}>
      {showTitle && (
        <h3
          className={`font-bold flex items-center gap-2 ${
            compact ? 'text-[13px] text-[#1c1a18] mb-3' : 'text-base text-[#A5292A] mb-5'
          }`}
        >
          <Calendar className={compact ? 'w-4 h-4 text-[#7a1322]' : 'w-5 h-5'} style={isIntake ? { color: accent } : undefined} />
          {title}
        </h3>
      )}

      <div
        className={`flex items-center justify-center ${navGap} ${navPadding} rounded-lg`}
        style={{ backgroundColor: `${accent}${isIntake ? '0d' : '08'}` }}
      >
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={prevDisabled}
          className={navBtnClass}
          style={{ borderColor: prevDisabled ? undefined : accent, color: prevDisabled ? undefined : accent }}
          title="Previous month"
        >
          <ChevronLeft className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>

        <select
          value={displayMonth.getMonth()}
          onChange={(e) => handleYearMonthChange(e, false)}
          className={selectClass}
          style={{ borderColor: accent, color: accent }}
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i}>
              {compact ? m.slice(0, 3) : m}
            </option>
          ))}
        </select>

        <select
          value={displayMonth.getFullYear()}
          onChange={(e) => handleYearMonthChange(e, true)}
          className={selectClass}
          style={{ borderColor: accent, color: accent }}
        >
          {Array.from({ length: yearsAhead }, (_, i) => today.getFullYear() + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleNextMonth}
          className={navBtnClass}
          style={{ borderColor: accent, color: accent }}
          title="Next month"
        >
          <ChevronRight className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>
      </div>

      <div
        className={`bg-white rounded-lg ${compact ? 'p-2' : 'p-4'}`}
        style={{ border: `1px solid ${accent}1a` }}
      >
        <div className={`grid grid-cols-7 ${gridGap} mb-2`}>
          {DAY_HEADERS.map((day) => (
            <div
              key={day}
              className={dayHeaderClass}
              style={{ color: accent, backgroundColor: `${accent}14` }}
            >
              {compact ? day.charAt(0) : day}
            </div>
          ))}
        </div>

        <div className={`grid grid-cols-7 ${gridGap}`}>
          {monthCalendar.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const dateKey = day.date ? toDateKey(day.date) : ''
              const isSelected = Boolean(day.date && selectedDate === dateKey)
              const isToday = Boolean(day.date && day.date.getTime() === today.getTime())

              return (
                <button
                  key={`${weekIndex}-${dayIndex}`}
                  type="button"
                  onClick={() => day.date && !day.isDisabled && onDateSelect(dateKey)}
                  disabled={day.isDisabled}
                  className={dayCellClass}
                  style={
                    day.isDisabled && !day.isCurrentMonth
                      ? { background: 'transparent', borderColor: 'transparent', color: 'transparent', cursor: 'default' }
                      : day.isDisabled
                      ? { borderColor: '#e5e7eb', backgroundColor: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }
                      : isSelected
                      ? { borderColor: accent, backgroundColor: accent, color: '#fff' }
                      : isToday
                      ? { borderColor: accent, backgroundColor: `${accent}1f`, color: accent }
                      : { borderColor: isIntake ? '#d1d5db' : '#e7e1d9', backgroundColor: '#fff', color: '#1c1a18' }
                  }
                  title={
                    day.isDisabled && day.isCurrentMonth
                      ? day.date?.getDay() === 0 || day.date?.getDay() === 6
                        ? 'Weekend — not available'
                        : 'Past date'
                      : ''
                  }
                >
                  {day.dateNum}
                </button>
              )
            })
          )}
        </div>
      </div>

      {helperText && (
        <p className={`mt-3 ${compact ? 'text-[11px] text-[#736c63]' : 'text-xs text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  )
}
