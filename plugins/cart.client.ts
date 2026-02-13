export default defineNuxtPlugin(() => {
  const cartStore = useCartStore()

  // Load cart from storage on app initialization
  if (process.client) {
    cartStore.loadFromStorage()
  }
})
