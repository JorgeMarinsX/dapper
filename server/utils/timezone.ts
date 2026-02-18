const TIMEZONE = 'America/Sao_Paulo'

/**
 * Parse a datetime-local string (e.g. "2026-02-18T09:00") as São Paulo time
 * and return a UTC Date object for database storage.
 */
export function parseLocalDateTime(dateTimeLocal: string): Date {
  // datetime-local inputs produce "YYYY-MM-DDTHH:mm" without timezone info.
  // We need to interpret this as São Paulo time, not UTC.
  // São Paulo is UTC-3 (standard) or UTC-3 (no DST since 2019).
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'longOffset',
  })

  // Create a temp date to find the current UTC offset for São Paulo
  // We parse the naive datetime as UTC first, then adjust
  const naive = new Date(`${dateTimeLocal}:00.000Z`)

  // Get the São Paulo offset at the given date
  const parts = formatter.formatToParts(naive)
  const tzPart = parts.find(p => p.type === 'timeZoneName')
  // tzPart.value is like "GMT-03:00"
  const offsetMatch = tzPart?.value.match(/GMT([+-]\d{2}):(\d{2})/)

  if (!offsetMatch) {
    // Fallback: assume -03:00 for São Paulo
    return new Date(`${dateTimeLocal}:00.000-03:00`)
  }

  const sign = offsetMatch[1][0]
  const hours = offsetMatch[1].slice(1)
  const minutes = offsetMatch[2]

  return new Date(`${dateTimeLocal}:00.000${sign}${hours}:${minutes}`)
}

/**
 * Get start and end of a day in São Paulo timezone as UTC Date objects.
 * Used for date-range filtering of appointments.
 */
export function getDayRangeSaoPaulo(dateStr: string): { start: Date, end: Date } {
  const start = parseLocalDateTime(`${dateStr}T00:00`)
  const end = parseLocalDateTime(`${dateStr}T23:59`)
  // Set end to 23:59:59.999
  end.setSeconds(59, 999)
  return { start, end }
}
