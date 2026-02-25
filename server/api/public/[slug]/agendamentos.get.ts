import prisma from '../../../utils/prisma'
import { resolveSlug } from '../../../utils/resolve-slug'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const barbeariaId = await resolveSlug(slug)

  const query = getQuery(event)
  const email = typeof query.email === 'string' ? query.email.trim().toLowerCase() : ''

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'O parâmetro email é obrigatório' })
  }

  // Reject wildcards, multiple emails, or anything that isn't a single valid email
  if (email.includes('*') || email.includes(',') || email.includes(';') || email.includes(' ')) {
    throw createError({ statusCode: 400, statusMessage: 'Informe apenas um endereço de e-mail válido' })
  }

  if (!EMAIL_REGEX.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Formato de e-mail inválido' })
  }

  const now = new Date()

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      barbeariaId,
      dataHora: { gte: now },
      cliente: { email },
      status: { notIn: ['CANCELADO', 'NAO_COMPARECEU'] },
    },
    orderBy: { dataHora: 'asc' },
    include: {
      cliente: { select: { nome: true, email: true } },
      barbeiro: { select: { nome: true } },
      servico: { select: { nome: true, preco: true, duracao: true } },
      unidade: { select: { nome: true } },
    },
  })

  if (agendamentos.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Nenhum agendamento futuro encontrado para este e-mail' })
  }

  return agendamentos.map((a) => ({
    id: a.id,
    dataHora: a.dataHora,
    status: a.status,
    cliente: a.cliente,
    barbeiro: a.barbeiro,
    servico: a.servico,
    unidade: a.unidade,
  }))
})
