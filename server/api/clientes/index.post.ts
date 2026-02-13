import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const body = await readBody(event)
  const { nome, email, telefone, foto } = body

  if (!nome || !telefone) {
    throw createError({ statusCode: 400, statusMessage: 'Nome e telefone são obrigatórios' })
  }

  return prisma.cliente.create({
    data: { nome, email, telefone, foto, barbeariaId },
  })
})
