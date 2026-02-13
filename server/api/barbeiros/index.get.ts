import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const query = getQuery(event)
  const unidadeId = query.unidade as string | undefined

  const where: any = { barbeariaId }
  if (unidadeId) where.unidadeId = unidadeId

  return prisma.barbeiro.findMany({
    where,
    include: { unidade: { select: { id: true, nome: true } } },
    orderBy: { nome: 'asc' },
  })
})
