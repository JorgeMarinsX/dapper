import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const query = getQuery(event)
  const search = (query.search as string) || ''

  return prisma.servico.findMany({
    where: {
      barbeariaId,
      ...(search && {
        OR: [
          { nome: { contains: search, mode: 'insensitive' } },
          { descricao: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { nome: 'asc' },
  })
})
