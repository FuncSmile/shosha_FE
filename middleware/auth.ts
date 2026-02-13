export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
