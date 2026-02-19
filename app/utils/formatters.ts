/**
 * Format a name into initials (max 2 characters)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const TIMEZONE = 'America/Sao_Paulo'

/**
 * Format a datetime string to time only (HH:mm)
 */
export function formatHorario(dataHora: string): string {
  return new Date(dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
  })
}

/**
 * Format a datetime string to date only (DD/MM/YYYY)
 */
export function formatData(dataHora: string): string {
  return new Date(dataHora).toLocaleDateString('pt-BR', {
    timeZone: TIMEZONE,
  })
}

/**
 * Format a number to BRL currency
 */
export function formatPreco(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/**
 * Format minutes to human-readable duration
 */
export function formatDuracao(minutos: number): string {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

/**
 * Format minutes since midnight to HH:mm string
 */
export function formatMinutes(minute: number): string {
  const h = Math.floor(minute / 60)
  const m = minute % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Convert minutes since midnight to pixel position in the timeline
 */
export function minuteToPixel(minute: number, gridStart: number, slotInterval: number, rowHeight: number): number {
  return ((minute - gridStart) / slotInterval) * rowHeight
}

/**
 * Generate time labels for a timeline grid
 */
export function generateTimeLabels(gridStart: number, gridEnd: number, slotInterval: number, rowHeight: number) {
  const labels: { minute: number; label: string; top: number }[] = []
  for (let m = gridStart; m < gridEnd; m += slotInterval) {
    labels.push({
      minute: m,
      label: formatMinutes(m),
      top: minuteToPixel(m, gridStart, slotInterval, rowHeight),
    })
  }
  return labels
}

/**
 * Convert a UTC datetime string to minutes since midnight in São Paulo timezone
 */
export function dateToSaoPauloMinutes(dateStr: string): number {
  const date = new Date(dateStr)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const h = Number(parts.find(p => p.type === 'hour')!.value)
  const m = Number(parts.find(p => p.type === 'minute')!.value)
  return h * 60 + m
}

/**
 * Get the current time as minutes since midnight in São Paulo timezone
 */
export function getNowMinutes(): number {
  return dateToSaoPauloMinutes(new Date().toISOString())
}

/**
 * Get today's date in ISO format (YYYY-MM-DD) in São Paulo timezone
 */
export function getTodayISO(): string {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  return parts
}
