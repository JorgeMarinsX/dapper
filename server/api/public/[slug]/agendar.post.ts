import prisma from '../../../utils/prisma'
import { resolveSlug } from '../../../utils/resolve-slug'
import { parseLocalDateTime } from '../../../utils/timezone'
import { checkBusinessHours, checkConflict } from '../../../utils/agendamento-validators'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const barbeariaId = await resolveSlug(slug)

  const body = await readBody(event)
  const { nome, telefone, email, servicoId, barbeiroId, unidadeId, dataHora } = body

  if (!nome || !telefone || !servicoId || !barbeiroId || !unidadeId || !dataHora) {
    throw createError({ statusCode: 400, statusMessage: 'Campos obrigatórios: nome, telefone, servicoId, barbeiroId, unidadeId, dataHora' })
  }

  // Validate entities belong to this barbearia
  const [barbeiro, servico, unidade] = await Promise.all([
    prisma.barbeiro.findFirst({ where: { id: barbeiroId, barbeariaId, unidadeId } }),
    prisma.servico.findFirst({ where: { id: servicoId, barbeariaId } }),
    prisma.unidade.findFirst({ where: { id: unidadeId, barbeariaId } }),
  ])

  if (!unidade) throw createError({ statusCode: 404, statusMessage: 'Unidade não encontrada' })
  if (!barbeiro) throw createError({ statusCode: 404, statusMessage: 'Barbeiro não encontrado nesta unidade' })
  if (!servico) throw createError({ statusCode: 404, statusMessage: 'Serviço não encontrado' })

  // Parse datetime and validate business hours + conflicts
  const startUTC = parseLocalDateTime(dataHora)

  await checkBusinessHours(prisma, unidadeId, startUTC, servico.duracao)
  await checkConflict(prisma, barbeiroId, startUTC, servico.duracao)

  // Upsert client by (barbeariaId, telefone)
  const cliente = await prisma.cliente.upsert({
    where: { barbeariaId_telefone: { barbeariaId, telefone } },
    update: {
      nome,
      ...(email !== undefined && { email }),
    },
    create: {
      nome,
      telefone,
      email: email || null,
      barbeariaId,
    },
  })

  // Create appointment
  const agendamento = await prisma.agendamento.create({
    data: {
      dataHora: startUTC,
      status: 'AGUARDANDO',
      clienteId: cliente.id,
      barbeiroId,
      servicoId,
      barbeariaId,
      unidadeId,
    },
    include: {
      cliente: { select: { nome: true, telefone: true } },
      barbeiro: { select: { nome: true } },
      servico: { select: { nome: true, preco: true, duracao: true } },
      unidade: { select: { nome: true } },
    },
  })

  return {
    id: agendamento.id,
    dataHora: agendamento.dataHora,
    status: agendamento.status,
    cliente: agendamento.cliente,
    barbeiro: agendamento.barbeiro,
    servico: agendamento.servico,
    unidade: agendamento.unidade,
  }
})
