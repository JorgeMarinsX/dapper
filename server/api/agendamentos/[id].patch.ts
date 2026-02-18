import prisma from '../../utils/prisma'
import { parseLocalDateTime } from '../../utils/timezone'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const agendamento = await prisma.agendamento.findFirst({ where: { id, barbeariaId } })
  if (!agendamento) {
    throw createError({ statusCode: 404, statusMessage: 'Agendamento não encontrado' })
  }

  const { dataHora, status, observacoes, clienteId, barbeiroId, servicoId } = body

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
