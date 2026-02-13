import prisma from '../../../utils/prisma'

interface HorarioInput {
  diaSemana: number
  aberto: boolean
  inicio: string
  fim: string
}

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const unidadeId = getRouterParam(event, 'id')!
  const body = await readBody<{ horarios: HorarioInput[] }>(event)

  const unidade = await prisma.unidade.findFirst({ where: { id: unidadeId, barbeariaId } })
  if (!unidade) {
    throw createError({ statusCode: 404, statusMessage: 'Unidade não encontrada' })
  }

  if (!body.horarios || !Array.isArray(body.horarios)) {
    throw createError({ statusCode: 400, statusMessage: 'Campo "horarios" é obrigatório' })
  }

  const results = await Promise.all(
    body.horarios.map((h) =>
      prisma.horarioFuncionamento.upsert({
        where: {
          unidadeId_diaSemana: { unidadeId, diaSemana: h.diaSemana },
        },
        update: {
          aberto: h.aberto,
          inicio: h.inicio,
          fim: h.fim,
        },
        create: {
          unidadeId,
          diaSemana: h.diaSemana,
          aberto: h.aberto,
          inicio: h.inicio,
          fim: h.fim,
        },
      }),
    ),
  )

  return results
})
