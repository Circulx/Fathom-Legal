const TIME_24_RE = /^(\d{1,2}):(\d{2})$/
const TIME_12_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i

/** Normalize to 24-hour HH:MM for storage and API calls. */
export function toTime24(time: string): string | null {
  const trimmed = time?.trim()
  if (!trimmed || trimmed === '—') return null

  const match24 = trimmed.match(TIME_24_RE)
  if (match24) {
    const hours = parseInt(match24[1], 10)
    const minutes = parseInt(match24[2], 10)
    if (hours > 23 || minutes > 59) return null
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const match12 = trimmed.match(TIME_12_RE)
  if (match12) {
    let hours = parseInt(match12[1], 10)
    const minutes = parseInt(match12[2], 10)
    const period = match12[3].toUpperCase()
    if (hours < 1 || hours > 12 || minutes > 59) return null
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  return null
}

/** Display as h:MM AM/PM (e.g. 9:00 AM). Accepts 24h or 12h input. */
export function formatTimeDisplay(time?: string): string {
  if (!time || time === '—') return '—'

  const time24 = toTime24(time.trim())
  if (!time24) return time.trim()

  const [hourStr, minuteStr] = time24.split(':')
  let hours = parseInt(hourStr, 10)
  const period = hours >= 12 ? 'PM' : 'AM'
  if (hours > 12) hours -= 12
  if (hours === 0) hours = 12
  return `${hours}:${minuteStr} ${period}`
}

export function parseTimeToMinutes(timeStr: string): number {
  const time24 = toTime24(timeStr)
  if (!time24) return 0
  const [hourStr, minuteStr] = time24.split(':')
  return parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10)
}
