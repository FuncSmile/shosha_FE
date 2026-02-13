<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Daftar Akun Baru
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Atau
          <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            login ke akun yang sudah ada
          </NuxtLink>
        </p>
      </div>

      <!-- Error Alert -->
      <AlertMessage
        v-if="error"
        type="error"
        :message="error"
        @close="error = undefined"
      />

      <!-- Success Alert -->
      <AlertMessage
        v-if="success"
        type="success"
        message="Registrasi berhasil! Silakan login."
      />

      <!-- Register Form -->
      <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Nama lengkap"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="email@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Minimal 6 karakter"
            />
            <p class="mt-1 text-xs text-gray-500">Minimal 6 karakter</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Ulangi password"
            />
          </div>

          <!-- User Code (for PEMBELI) -->
          <div>
            <label for="userCode" class="block text-sm font-medium text-gray-700 mb-1">
              Kode User
            </label>
            <select
              id="userCode"
              v-model="form.userCode"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
            >
              <option value="">Pilih Kode User</option>
              <option value="SHOSHA">SHOSHA</option>
              <option value="L24J">L24J</option>
              <option value="M3NT">M3NT</option>
              <option value="RS45">RS45</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">Hubungi admin jika tidak tahu kode user Anda</p>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Daftar</span>
            <span v-else class="flex items-center">
              <Icon name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
              Mendaftar...
            </span>
          </button>
        </div>

        <!-- Terms -->
        <p class="mt-4 text-center text-xs text-gray-500">
          Dengan mendaftar, Anda menyetujui 
          <a href="#" class="text-primary-600 hover:text-primary-500">Syarat & Ketentuan</a>
          dan 
          <a href="#" class="text-primary-600 hover:text-primary-500">Kebijakan Privasi</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '~/types'

definePageMeta({
  layout: false,
  middleware: 'guest',
});

const { register } = useAuthApi();
const toast = useToast();
const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  userCode: '',
});

const loading = ref(false);
const error = ref<string | undefined>();
const success = ref(false);

async function handleRegister() {
  error.value = undefined;

  // Validation
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Password dan konfirmasi password tidak cocok';
    return;
  }

  if (form.value.password.length < 6) {
    error.value = 'Password minimal 6 karakter';
    return;
  }

  if (!form.value.userCode) {
    error.value = 'Kode user harus dipilih';
    return;
  }

  loading.value = true;

  try {
    await register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      userCode: form.value.userCode,
      role: UserRole.PEMBELI, // Default role untuk self-registration
    });

    success.value = true;
    toast.success('Registrasi berhasil! Silakan login.');

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
    toast.error(error.value || 'Terjadi kesalahan');
  } finally {
    loading.value = false;
  }
}
</script>
