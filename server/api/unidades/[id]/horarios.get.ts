import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const unidadeId = getRouterParam(event, 'id')!

  const unidade = await prisma.unidade.findFirst({ where: { id: unidadeId, barbeariaId } })
  if (!unidade) {
    throw createError({ statusCode: 404, statusMessage: 'Unidade não encontrada' })
  }

  return prisma.horarioFuncionamento.findMany({
    where: { unidadeId },
    orderBy: { diaSemana: 'asc' },
  })
})
