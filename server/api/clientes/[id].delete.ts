import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!

  const cliente = await prisma.cliente.findFirst({ where: { id, barbeariaId } })
  if (!cliente) {
    throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' })
  }

  await prisma.cliente.delete({ where: { id } })
  return { ok: true }
})
