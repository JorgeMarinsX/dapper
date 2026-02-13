import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const barbeiro = await prisma.barbeiro.findFirst({ where: { id, barbeariaId } })
  if (!barbeiro) {
    throw createError({ statusCode: 404, statusMessage: 'Barbeiro não encontrado' })
  }

  const { nome, email, telefone, foto, status } = body

  return prisma.barbeiro.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome }),
      ...(email !== undefined && { email }),
      ...(telefone !== undefined && { telefone }),
      ...(foto !== undefined && { foto }),
      ...(status !== undefined && { status }),
    },
  })
})
