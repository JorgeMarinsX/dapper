import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const query = getQuery(event)
  const search = (query.search as string) || ''

  return prisma.cliente.findMany({
    where: {
      barbeariaId,
      ...(search && {
        OR: [
          { nome: { contains: search, mode: 'insensitive' } },
          { telefone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      _count: { select: { agendamentos: true } },
    },
    orderBy: { nome: 'asc' },
  })
})
