/** Weekday dates from tomorrow through N calendar months ahead (inclusive). */
export function getBookableWeekdayDates(monthsAhead = 3): Date[] {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const end = new Date(today)
  end.setMonth(end.getMonth() + monthsAhead)

  const cursor = new Date(today)
  cursor.setDate(cursor.getDate() + 1)

  while (cursor <= end) {
    const dayOfWeek = cursor.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}
