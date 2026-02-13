import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!

  const barbeiro = await prisma.barbeiro.findFirst({ where: { id, barbeariaId } })
  if (!barbeiro) {
    throw createError({ statusCode: 404, statusMessage: 'Barbeiro não encontrado' })
  }

  await prisma.barbeiro.delete({ where: { id } })
  return { ok: true }
})
