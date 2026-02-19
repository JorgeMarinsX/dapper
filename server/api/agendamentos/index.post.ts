import prisma from '../../utils/prisma'
import { parseLocalDateTime } from '../../utils/timezone'
import { checkBusinessHours, checkConflict } from '../../utils/agendamento-validators'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const body = await readBody(event)
  const { dataHora, clienteId, barbeiroId, servicoId, unidadeId, observacoes } = body

  if (!dataHora || !clienteId || !barbeiroId || !servicoId || !unidadeId) {
    throw createError({ statusCode: 400, statusMessage: 'Data/hora, cliente, barbeiro, serviço e unidade são obrigatórios' })
  }

  // Validate that all referenced entities belong to this barbearia
  const [cliente, barbeiro, servico, unidade] = await Promise.all([
    prisma.cliente.findFirst({ where: { id: clienteId, barbeariaId } }),
    prisma.barbeiro.findFirst({ where: { id: barbeiroId, barbeariaId } }),
    prisma.servico.findFirst({ where: { id: servicoId, barbeariaId } }),
    prisma.unidade.findFirst({ where: { id: unidadeId, barbeariaId } }),
  ])

  if (!cliente) throw createError({ statusCode: 400, statusMessage: 'Cliente não encontrado' })
  if (!barbeiro) throw createError({ statusCode: 400, statusMessage: 'Barbeiro não encontrado' })
  if (!servico) throw createError({ statusCode: 400, statusMessage: 'Serviço não encontrado' })
  if (!unidade) throw createError({ statusCode: 400, statusMessage: 'Unidade não encontrada' })

  // Validate barber belongs to the specified unit
  if (barbeiro.unidadeId !== unidadeId) {
    throw createError({ statusCode: 400, statusMessage: 'Barbeiro não pertence à unidade selecionada' })
  }

  // Validate business hours and barber availability
  const startUTC = parseLocalDateTime(dataHora)
  await checkBusinessHours(prisma, unidadeId, startUTC, servico.duracao)
  await checkConflict(prisma, barbeiroId, startUTC, servico.duracao)

  return prisma.agendamento.create({
    data: {
      dataHora: startUTC,
      observacoes,
      clienteId,
      barbeiroId,
      servicoId,
      barbeariaId,
      unidadeId,
    },
    include: {
      cliente: { select: { id: true, nome: true } },
      barbeiro: { select: { id: true, nome: true } },
      servico: { select: { id: true, nome: true, preco: true } },
      unidade: { select: { id: true, nome: true } },
    },
  })
})
