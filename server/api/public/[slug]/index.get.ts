import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!

  const barbearia = await prisma.barbearia.findUnique({
    where: { slug },
    select: {
      id: true,
      nome: true,
      slug: true,
      unidades: {
        select: { id: true, nome: true, endereco: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!barbearia) {
    throw createError({ statusCode: 404, statusMessage: 'Barbearia não encontrada' })
  }

  return barbearia
})
