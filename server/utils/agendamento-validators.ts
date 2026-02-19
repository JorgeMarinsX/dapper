import type { PrismaClient } from '@prisma/client'

const TIMEZONE = 'America/Sao_Paulo'

/**
 * Convert a UTC Date to São Paulo local hours/minutes and day of week.
 */
function toSaoPaulo(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  }).formatToParts(date)

  const hour = Number(parts.find(p => p.type === 'hour')!.value)
  const minute = Number(parts.find(p => p.type === 'minute')!.value)

  // Get numeric day of week (0=Sunday)
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'long',
  })
  const dayName = dayFormatter.format(date)
  const dayMap: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6,
  }

  return { hour, minute, diaSemana: dayMap[dayName] ?? 0 }
}

/**
 * Convert "HH:mm" string to total minutes since midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Check that the appointment falls within the unit's business hours.
 */
export async function checkBusinessHours(
  prisma: PrismaClient,
  unidadeId: string,
  startUTC: Date,
  durationMinutes: number,
) {
  const endUTC = new Date(startUTC.getTime() + durationMinutes * 60_000)

  const startLocal = toSaoPaulo(startUTC)
  const endLocal = toSaoPaulo(endUTC)

  const horario = await prisma.horarioFuncionamento.findUnique({
    where: {
      unidadeId_diaSemana: { unidadeId, diaSemana: startLocal.diaSemana },
    },
  })

  // If no record exists or unit is closed on this day
  if (!horario || !horario.aberto) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unidade fechada neste dia da semana',
    })
  }

  const appointmentStart = startLocal.hour * 60 + startLocal.minute
  const appointmentEnd = endLocal.hour * 60 + endLocal.minute
  const businessStart = timeToMinutes(horario.inicio)
  const businessEnd = timeToMinutes(horario.fim)

  if (appointmentStart < businessStart || appointmentEnd > businessEnd) {
    throw createError({
      statusCode: 400,
      statusMessage: `Horário fora do expediente da unidade (${horario.inicio} - ${horario.fim})`,
    })
  }
}

/**
 * Check that the barber has no overlapping appointments.
 * Excludes cancelled and no-show appointments.
 * Pass excludeId to skip the appointment being edited (for PATCH).
 */
export async function checkConflict(
  prisma: PrismaClient,
  barbeiroId: string,
  startUTC: Date,
  durationMinutes: number,
  excludeId?: string,
) {
  const endUTC = new Date(startUTC.getTime() + durationMinutes * 60_000)

  // Fetch barber's active appointments that could possibly overlap
  // (same day range, with a generous margin)
  const dayStart = new Date(startUTC)
  dayStart.setUTCHours(0, 0, 0, 0)
  const dayEnd = new Date(startUTC)
  dayEnd.setUTCHours(23, 59, 59, 999)

  const existing = await prisma.agendamento.findMany({
    where: {
      barbeiroId,
      status: { notIn: ['CANCELADO', 'NAO_COMPARECEU'] },
      dataHora: { gte: dayStart, lte: dayEnd },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    include: {
      servico: { select: { duracao: true } },
    },
  })

  for (const ag of existing) {
    const existingStart = ag.dataHora.getTime()
    const existingEnd = existingStart + ag.servico.duracao * 60_000

    // Overlap: existingStart < newEnd AND existingEnd > newStart
    if (existingStart < endUTC.getTime() && existingEnd > startUTC.getTime()) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Barbeiro já possui agendamento neste horário',
      })
    }
  }
}
