import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const { nome, endereco, telefone } = body

  const unidade = await prisma.unidade.findFirst({ where: { id, barbeariaId } })
  if (!unidade) {
    throw createError({ statusCode: 404, statusMessage: 'Unidade não encontrada' })
  }

  return prisma.unidade.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome }),
      ...(endereco !== undefined && { endereco }),
      ...(telefone !== undefined && { telefone }),
    },
  })
})
