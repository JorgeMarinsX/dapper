import prisma from '../../utils/prisma'
import { hashPassword, signToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nome, email, senha, cnpj, telefone, endereco } = body

  if (!nome || !email || !senha || !cnpj || !telefone || !endereco) {
    throw createError({ statusCode: 400, statusMessage: 'Todos os campos são obrigatórios' })
  }

  const existing = await prisma.barbearia.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'E-mail já cadastrado' })
  }

  const hashedPassword = await hashPassword(senha)

  const barbearia = await prisma.barbearia.create({
    data: {
      nome,
      email,
      senha: hashedPassword,
      cnpj,
      telefone,
      endereco,
      unidades: {
        create: {
          nome: 'Matriz',
          endereco,
          telefone,
          horarios: {
            createMany: {
              data: [
                { diaSemana: 0, aberto: false, inicio: '09:00', fim: '13:00' },
                { diaSemana: 1, aberto: true, inicio: '09:00', fim: '19:00' },
                { diaSemana: 2, aberto: true, inicio: '09:00', fim: '19:00' },
                { diaSemana: 3, aberto: true, inicio: '09:00', fim: '19:00' },
                { diaSemana: 4, aberto: true, inicio: '09:00', fim: '19:00' },
                { diaSemana: 5, aberto: true, inicio: '09:00', fim: '20:00' },
                { diaSemana: 6, aberto: true, inicio: '08:00', fim: '17:00' },
              ],
            },
          },
        },
      },
      notificacoes: {
        create: {
          emailConfirmacao: true,
          smsLembrete: true,
          antecedencia: 2,
        },
      },
    },
  })

  const token = await signToken(barbearia.id)
  setAuthCookie(event, token)

  const { senha: _, ...safe } = barbearia
  return safe
})
