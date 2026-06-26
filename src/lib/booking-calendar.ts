export type CalendarDayCell = {
  date: Date | null
  dateNum: number | null
  isCurrentMonth: boolean
  isDisabled: boolean
}

/** Local YYYY-MM-DD (avoids UTC shift from toISOString). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function buildMonthCalendarWeeks(monthDate: Date): CalendarDayCell[][] {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const weeks: CalendarDayCell[][] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let currentWeek: CalendarDayCell[] = []

  for (let i = 0; i < startingDayOfWeek; i++) {
    currentWeek.push({ date: null, dateNum: null, isCurrentMonth: false, isDisabled: true })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day)
    const dayOfWeek = cellDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isPast = cellDate < today
    const isDisabled = isWeekend || isPast

    currentWeek.push({
      date: cellDate,
      dateNum: day,
      isCurrentMonth: true,
      isDisabled,
    })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({ date: null, dateNum: null, isCurrentMonth: false, isDisabled: true })
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return weeks
}

export function monthFromDateKey(dateKey: string): Date | null {
  const match = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, 1)
}
