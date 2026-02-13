import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!

  const unidade = await prisma.unidade.findFirst({ where: { id, barbeariaId } })
  if (!unidade) {
    throw createError({ statusCode: 404, statusMessage: 'Unidade não encontrada' })
  }

  await prisma.unidade.delete({ where: { id } })
  return { success: true }
})
