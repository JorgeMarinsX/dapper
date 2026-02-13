import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const cliente = await prisma.cliente.findFirst({ where: { id, barbeariaId } })
  if (!cliente) {
    throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' })
  }

  const { nome, email, telefone, foto } = body

  return prisma.cliente.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome }),
      ...(email !== undefined && { email }),
      ...(telefone !== undefined && { telefone }),
      ...(foto !== undefined && { foto }),
    },
  })
})
