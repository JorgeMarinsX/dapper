import prisma from '../../utils/prisma'
import { parseLocalDateTime, getDayRangeSaoPaulo } from '../../utils/timezone'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId

  const query = getQuery(event)
  const data = query.data as string | undefined
  const barbeiroId = query.barbeiroId as string | undefined
  const servicoId = query.servicoId as string | undefined
  const unidadeId = query.unidadeId as string | undefined

  if (!data || !barbeiroId || !servicoId || !unidadeId) {
    throw createError({ statusCode: 400, statusMessage: 'Parâmetros data, barbeiroId, servicoId e unidadeId são obrigatórios' })
  }

  // Validate entities belong to this barbearia
  const [unidade, barbeiro, servico] = await Promise.all([
    prisma.unidade.findFirst({ where: { id: unidadeId, barbeariaId } }),
    prisma.barbeiro.findFirst({ where: { id: barbeiroId, barbeariaId, unidadeId } }),
    prisma.servico.findFirst({ where: { id: servicoId, barbeariaId } }),
  ])

  if (!unidade) throw createError({ statusCode: 404, statusMessage: 'Unidade não encontrada' })
  if (!barbeiro) throw createError({ statusCode: 404, statusMessage: 'Barbeiro não encontrado' })
  if (!servico) throw createError({ statusCode: 404, statusMessage: 'Serviço não encontrado' })

  // Get business hours for the requested date's day of week
  const dayOfWeek = getDayOfWeekSaoPaulo(data)

  const horario = await prisma.horarioFuncionamento.findUnique({
    where: { unidadeId_diaSemana: { unidadeId, diaSemana: dayOfWeek } },
  })

  if (!horario || !horario.aberto) {
    return { slots: [] }
  }

  // Generate 30-min slots within business hours
  const startMinutes = timeToMinutes(horario.inicio)
  const endMinutes = timeToMinutes(horario.fim)
  const serviceDuration = servico.duracao

  const allSlots: string[] = []
  for (let m = startMinutes; m + serviceDuration <= endMinutes; m += 30) {
    allSlots.push(minutesToTime(m))
  }

  // Fetch barber's existing appointments for this day
  const { start: dayStart, end: dayEnd } = getDayRangeSaoPaulo(data)

  const existing = await prisma.agendamento.findMany({
    where: {
      barbeiroId,
      status: { notIn: ['CANCELADO', 'NAO_COMPARECEU'] },
      dataHora: { gte: dayStart, lte: dayEnd },
    },
    include: { servico: { select: { duracao: true } } },
  })

  // Filter out slots that conflict with existing appointments
  const availableSlots = allSlots.filter((slot) => {
    const slotStartUTC = parseLocalDateTime(`${data}T${slot}`)
    const slotEndUTC = new Date(slotStartUTC.getTime() + serviceDuration * 60_000)

    for (const ag of existing) {
      const agStart = ag.dataHora.getTime()
      const agEnd = agStart + ag.servico.duracao * 60_000
      if (agStart < slotEndUTC.getTime() && agEnd > slotStartUTC.getTime()) {
        return false
      }
    }

    return true
  })

  // Filter out past slots if date is today
  const nowSP = getNowSaoPaulo()
  const todaySP = `${nowSP.year}-${String(nowSP.month).padStart(2, '0')}-${String(nowSP.day).padStart(2, '0')}`

  const finalSlots = data === todaySP
    ? availableSlots.filter((slot) => {
        const slotMinutes = timeToMinutes(slot)
        const nowMinutes = nowSP.hour * 60 + nowSP.minute
        return slotMinutes > nowMinutes
      })
    : availableSlots

  return { slots: finalSlots }
})

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function getDayOfWeekSaoPaulo(dateStr: string): number {
  const date = new Date(`${dateStr}T12:00:00Z`)
  const dayName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
  }).format(date)

  const dayMap: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6,
  }
  return dayMap[dayName] ?? 0
}

function getNowSaoPaulo() {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)

  return {
    year: Number(parts.find(p => p.type === 'year')!.value),
    month: Number(parts.find(p => p.type === 'month')!.value),
    day: Number(parts.find(p => p.type === 'day')!.value),
    hour: Number(parts.find(p => p.type === 'hour')!.value),
    minute: Number(parts.find(p => p.type === 'minute')!.value),
  }
}
