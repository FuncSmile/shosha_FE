export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Load auth from storage on app initialization
  if (process.client) {
    authStore.loadFromStorage()
  }
})
