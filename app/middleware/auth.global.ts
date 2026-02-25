const AUTH_ROUTES = new Set(['/login', '/register'])

const PROTECTED_ROUTES = new Set([
  '/', '/agendamentos', '/barbeiros', '/clientes',
  '/servicos', '/unidades', '/calendario', '/configuracoes',
])

function isPublicRoute(path: string): boolean {
  if (AUTH_ROUTES.has(path)) return true
  // Any top-level path not matching a known app route is a barbershop slug page
  if (!PROTECTED_ROUTES.has(path)) return true
  return false
}

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetchUser } = useAuth()
  const initialized = useState('auth-initialized', () => false)

  if (!initialized.value) {
    initialized.value = true
    await fetchUser()
  }

  if (!loggedIn.value && !isPublicRoute(to.path)) {
    return navigateTo('/login')
  }

  if (loggedIn.value && AUTH_ROUTES.has(to.path)) {
    return navigateTo('/')
  }
})
