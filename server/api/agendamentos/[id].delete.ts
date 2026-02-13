import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!

  const agendamento = await prisma.agendamento.findFirst({ where: { id, barbeariaId } })
  if (!agendamento) {
    throw createError({ statusCode: 404, statusMessage: 'Agendamento não encontrado' })
  }

  await prisma.agendamento.delete({ where: { id } })
  return { ok: true }
})
