import { getAuthCookie, verifyToken } from '../utils/auth'

const PUBLIC_ROUTES = ['/api/auth/login', '/api/auth/register']

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/')) return
  if (PUBLIC_ROUTES.includes(path)) return
  if (path.startsWith('/api/public/')) return

  const token = getAuthCookie(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
  }

  try {
    const { barbeariaId } = await verifyToken(token)
    event.context.barbeariaId = barbeariaId
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido' })
  }
})
