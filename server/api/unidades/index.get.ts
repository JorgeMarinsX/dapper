import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId

  return prisma.unidade.findMany({
    where: { barbeariaId },
    include: {
      _count: { select: { barbeiros: true, agendamentos: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
})
