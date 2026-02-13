import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const servico = await prisma.servico.findFirst({ where: { id, barbeariaId } })
  if (!servico) {
    throw createError({ statusCode: 404, statusMessage: 'Serviço não encontrado' })
  }

  const { nome, descricao, preco, duracao } = body

  return prisma.servico.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome }),
      ...(descricao !== undefined && { descricao }),
      ...(preco !== undefined && { preco }),
      ...(duracao !== undefined && { duracao }),
    },
  })
})
