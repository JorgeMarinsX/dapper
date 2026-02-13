export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useAuth()
  const publicRoutes = ['/login', '/register']

  if (!loggedIn.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (loggedIn.value && publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
