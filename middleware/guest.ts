export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // Redirect to login if authenticated
  if (authStore.isAuthenticated) {
    const role = authStore.user?.role
    if (role === 'OPERATOR') return navigateTo('/operator')
    if (role === 'ADMIN') return navigateTo('/admin')
    if (role === 'PEMBELI') return navigateTo('/buyer')
    return navigateTo('/')
  }
})
