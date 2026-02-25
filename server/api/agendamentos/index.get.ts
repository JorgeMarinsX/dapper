import prisma from '../../utils/prisma'
import { getDayRangeSaoPaulo } from '../../utils/timezone'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const query = getQuery(event)
  const search = (query.search as string) || ''
  const status = (query.status as string) || ''
  const date = (query.date as string) || ''
  const unidadeId = query.unidade as string | undefined
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const skip = (page - 1) * limit

  const where: any = { barbeariaId }

  if (unidadeId) where.unidadeId = unidadeId

  if (search) {
    where.OR = [
      { cliente: { nome: { contains: search, mode: 'insensitive' } } },
      { barbeiro: { nome: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (status) {
    where.status = status
  }

  if (date) {
    const { start, end } = getDayRangeSaoPaulo(date)
    where.dataHora = { gte: start, lte: end }
  }

  // Stats where: same filters but without status (so stats reflect all statuses)
  const { status: _excludedStatus, ...statsWhere } = where

  const [data, total, statsTotal, concluidos, aguardando, cancelados] = await Promise.all([
    prisma.agendamento.findMany({
      where,
      include: {
        cliente: { select: { id: true, nome: true } },
        barbeiro: { select: { id: true, nome: true } },
        servico: { select: { id: true, nome: true, preco: true, duracao: true } },
        unidade: { select: { id: true, nome: true } },
      },
      orderBy: { dataHora: 'asc' },
      skip,
      take: limit,
    }),
    prisma.agendamento.count({ where }),
    prisma.agendamento.count({ where: statsWhere }),
    prisma.agendamento.count({ where: { ...statsWhere, status: 'CONCLUIDO' } }),
    prisma.agendamento.count({ where: { ...statsWhere, status: 'AGUARDANDO' } }),
    prisma.agendamento.count({ where: { ...statsWhere, status: 'CANCELADO' } }),
  ])

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    stats: [
      { label: 'Total', value: String(statsTotal), icon: 'i-lucide-calendar' },
      { label: 'Concluídos', value: String(concluidos), icon: 'i-lucide-calendar-check' },
      { label: 'Aguardando', value: String(aguardando), icon: 'i-lucide-clock' },
      { label: 'Cancelados', value: String(cancelados), icon: 'i-lucide-calendar-x' },
    ],
  }
})
