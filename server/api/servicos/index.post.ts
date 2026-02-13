import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const body = await readBody(event)
  const { nome, descricao, preco, duracao } = body

  if (!nome || preco === undefined || duracao === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'Nome, preço e duração são obrigatórios' })
  }

  return prisma.servico.create({
    data: { nome, descricao, preco, duracao, barbeariaId },
  })
})
