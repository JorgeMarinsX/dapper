import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const query = getQuery(event)
  const slug = (query.slug as string || '').toLowerCase().trim()

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug é obrigatório' })
  }

  const existing = await prisma.barbearia.findUnique({
    where: { slug },
    select: { id: true },
  })

  return {
    available: !existing || existing.id === barbeariaId,
  }
})
