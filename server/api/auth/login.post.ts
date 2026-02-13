import prisma from '../../utils/prisma'
import { verifyPassword, signToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, senha } = body

  if (!email || !senha) {
    throw createError({ statusCode: 400, statusMessage: 'E-mail e senha são obrigatórios' })
  }

  const barbearia = await prisma.barbearia.findUnique({ where: { email } })
  if (!barbearia) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciais inválidas' })
  }

  const valid = await verifyPassword(senha, barbearia.senha)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciais inválidas' })
  }

  const token = await signToken(barbearia.id)
  setAuthCookie(event, token)

  const { senha: _, ...safe } = barbearia
  return safe
})
