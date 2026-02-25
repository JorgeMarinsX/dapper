import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const query = getQuery(event)
  const search = (query.search as string) || ''
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const skip = (page - 1) * limit

  const where: any = {
    barbeariaId,
    ...(search && {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      include: {
        _count: { select: { agendamentos: true } },
      },
      orderBy: { nome: 'asc' },
      skip,
      take: limit,
    }),
    prisma.cliente.count({ where }),
  ])

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})
