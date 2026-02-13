import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!

  const servico = await prisma.servico.findFirst({ where: { id, barbeariaId } })
  if (!servico) {
    throw createError({ statusCode: 404, statusMessage: 'Serviço não encontrado' })
  }

  await prisma.servico.delete({ where: { id } })
  return { ok: true }
})
