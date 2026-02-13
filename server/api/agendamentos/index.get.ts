import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const query = getQuery(event)
  const search = (query.search as string) || ''
  const status = (query.status as string) || ''
  const date = (query.date as string) || ''
  const unidadeId = query.unidade as string | undefined

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
    const start = new Date(`${date}T00:00:00.000Z`)
    const end = new Date(`${date}T23:59:59.999Z`)
    where.dataHora = { gte: start, lte: end }
  }

  return prisma.agendamento.findMany({
    where,
    include: {
      cliente: { select: { id: true, nome: true } },
      barbeiro: { select: { id: true, nome: true } },
      servico: { select: { id: true, nome: true, preco: true } },
      unidade: { select: { id: true, nome: true } },
    },
    orderBy: { dataHora: 'asc' },
  })
})
