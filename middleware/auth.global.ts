export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Load auth from storage on first access
  if (process.client && !authStore.isAuthenticated) {
    await authStore.loadFromStorage()
  }

  // Allow access to login page
  if (to.path === '/login') {
    // If already authenticated, redirect to dashboard
    if (authStore.isAuthenticated) {
      const role = authStore.user?.role
      if (role === 'OPERATOR') return navigateTo('/operator')
      if (role === 'ADMIN') return navigateTo('/admin')
      if (role === 'PEMBELI') return navigateTo('/buyer')
    }
    return
  }

  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
