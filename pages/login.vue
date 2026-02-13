<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-bold text-gray-900">ShoshaMart</h1>
        <h2 class="mt-6 text-center text-2xl font-semibold text-gray-900">
          Masuk ke akun Anda
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Internal Marketplace System
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Memproses...</span>
            <span v-else>Masuk</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginDto } from '~/types'

definePageMeta({
  layout: 'auth',
  middleware: [],
})

const authStore = useAuthStore()
const router = useRouter()

const form = ref<LoginDto>({
  email: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (loading.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await authStore.login(form.value)

    if (response) {
      // Redirect based on role
      const role = response.user.role
      if (role === 'OPERATOR') {
        router.push('/operator')
      } else if (role === 'ADMIN') {
        router.push('/admin')
      } else if (role === 'PEMBELI') {
        router.push('/buyer')
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Login gagal. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  if (authStore.isAuthenticated) {
    const role = authStore.user?.role
    if (role === 'OPERATOR') {
      router.push('/operator')
    } else if (role === 'ADMIN') {
      router.push('/admin')
    } else if (role === 'PEMBELI') {
      router.push('/buyer')
    }
  }
})
</script>
