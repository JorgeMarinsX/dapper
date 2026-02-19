import prisma from '../../../utils/prisma'
import { resolveSlug } from '../../../utils/resolve-slug'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const barbeariaId = await resolveSlug(slug)

  const servicos = await prisma.servico.findMany({
    where: { barbeariaId },
    select: { id: true, nome: true, preco: true, duracao: true },
    orderBy: { nome: 'asc' },
  })

  return servicos
})
