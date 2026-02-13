import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const body = await readBody(event)
  const { nome, email, telefone, foto, unidadeId } = body

  if (!nome || !email || !telefone || !unidadeId) {
    throw createError({ statusCode: 400, statusMessage: 'Nome, e-mail, telefone e unidade são obrigatórios' })
  }

  const unidade = await prisma.unidade.findFirst({ where: { id: unidadeId, barbeariaId } })
  if (!unidade) {
    throw createError({ statusCode: 400, statusMessage: 'Unidade não encontrada' })
  }

  return prisma.barbeiro.create({
    data: { nome, email, telefone, foto, barbeariaId, unidadeId },
  })
})
