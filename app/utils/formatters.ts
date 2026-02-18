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
