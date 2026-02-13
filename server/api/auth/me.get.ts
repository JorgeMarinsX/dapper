import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId

  const barbearia = await prisma.barbearia.findUnique({
    where: { id: barbeariaId },
    omit: { senha: true },
  })

  if (!barbearia) {
    throw createError({ statusCode: 404, statusMessage: 'Barbearia não encontrada' })
  }

  return barbearia
})
