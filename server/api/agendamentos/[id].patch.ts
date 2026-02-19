import prisma from '../../utils/prisma'
import { parseLocalDateTime } from '../../utils/timezone'
import { checkBusinessHours, checkConflict } from '../../utils/agendamento-validators'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const agendamento = await prisma.agendamento.findFirst({
    where: { id, barbeariaId },
    include: { servico: { select: { duracao: true } } },
  })
  if (!agendamento) {
    throw createError({ statusCode: 404, statusMessage: 'Agendamento não encontrado' })
  }

  const { dataHora, status, observacoes, clienteId, barbeiroId, servicoId } = body

  // If time, barber, or service changes, re-validate conflicts and business hours
  if (dataHora !== undefined || barbeiroId !== undefined || servicoId !== undefined) {
    const effectiveStartUTC = dataHora !== undefined
      ? parseLocalDateTime(dataHora)
      : agendamento.dataHora

    let effectiveDuration = agendamento.servico.duracao
    if (servicoId !== undefined && servicoId !== agendamento.servicoId) {
      const newServico = await prisma.servico.findFirst({ where: { id: servicoId, barbeariaId } })
      if (!newServico) throw createError({ statusCode: 400, statusMessage: 'Serviço não encontrado' })
      effectiveDuration = newServico.duracao
    }

    const effectiveBarbeiroId = barbeiroId ?? agendamento.barbeiroId

    await checkBusinessHours(prisma, agendamento.unidadeId, effectiveStartUTC, effectiveDuration)
    await checkConflict(prisma, effectiveBarbeiroId, effectiveStartUTC, effectiveDuration, id)
  }

  return prisma.agendamento.update({
    where: { id },
    data: {
      ...(dataHora !== undefined && { dataHora: parseLocalDateTime(dataHora) }),
      ...(status !== undefined && { status }),
      ...(observacoes !== undefined && { observacoes }),
      ...(clienteId !== undefined && { clienteId }),
      ...(barbeiroId !== undefined && { barbeiroId }),
      ...(servicoId !== undefined && { servicoId }),
    },
    include: {
      cliente: { select: { id: true, nome: true } },
      barbeiro: { select: { id: true, nome: true } },
      servico: { select: { id: true, nome: true, preco: true } },
    },
  })
})
