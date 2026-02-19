import prisma from '../../../../../utils/prisma'
import { resolveSlug } from '../../../../../utils/resolve-slug'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const unidadeId = getRouterParam(event, 'unidadeId')!
  const barbeariaId = await resolveSlug(slug)

  const unidade = await prisma.unidade.findFirst({
    where: { id: unidadeId, barbeariaId },
  })

  if (!unidade) {
    throw createError({ statusCode: 404, statusMessage: 'Unidade não encontrada' })
  }

  const horarios = await prisma.horarioFuncionamento.findMany({
    where: { unidadeId },
    select: { diaSemana: true, aberto: true, inicio: true, fim: true },
    orderBy: { diaSemana: 'asc' },
  })

  return horarios
})
