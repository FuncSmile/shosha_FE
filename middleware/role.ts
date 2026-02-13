import { UserRole } from '~/types'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Check operator routes
  if (to.path.startsWith('/operator')) {
    if (authStore.user?.role !== UserRole.OPERATOR) {
      return navigateTo('/')
    }
  }

  // Check admin routes
  if (to.path.startsWith('/admin')) {
    if (authStore.user?.role !== UserRole.ADMIN) {
      return navigateTo('/')
    }
  }

  // Check buyer routes
  if (to.path.startsWith('/buyer')) {
    if (authStore.user?.role !== UserRole.PEMBELI) {
      return navigateTo('/')
    }
  }
})
