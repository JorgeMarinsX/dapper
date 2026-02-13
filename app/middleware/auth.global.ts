export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetchUser } = useAuth()
  const initialized = useState('auth-initialized', () => false)
  const publicRoutes = ['/login', '/register']

  if (!initialized.value) {
    initialized.value = true
    await fetchUser()
  }

  if (!loggedIn.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (loggedIn.value && publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
