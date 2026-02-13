<script setup lang="ts">
// Redirect to appropriate dashboard based on role
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  const role = authStore.user?.role
  
  if (role === 'OPERATOR') {
    router.push('/operator')
  } else if (role === 'ADMIN') {
    router.push('/admin')
  } else if (role === 'PEMBELI') {
    router.push('/buyer')
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-gray-600">Redirecting...</p>
    </div>
  </div>
</template>
