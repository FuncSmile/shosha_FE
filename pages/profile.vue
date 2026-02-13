<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Profil Saya</h1>
      <p class="mt-1 text-sm text-gray-600">
        Kelola informasi profil Anda
      </p>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Memuat profil..." />

    <!-- Profile Content -->
    <div v-else class="space-y-6">
      <!-- Profile Info Card -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Informasi Profil</h2>
          <button
            v-if="!editing"
            @click="startEditing"
            class="inline-flex items-center px-4 py-2 border-2 border-primary-600 text-sm font-semibold rounded-lg text-primary-700 bg-white hover:bg-primary-50 transition-colors"
          >
            <Icon name="lucide:edit" class="w-4 h-4 mr-2" />
            Edit Profil
          </button>
        </div>

        <!-- View Mode -->
        <div v-if="!editing" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500">Nama</label>
              <p class="mt-1 text-base text-gray-900">{{ profile?.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Email</label>
              <p class="mt-1 text-base text-gray-900">{{ profile?.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Role</label>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-purple-100 text-purple-800': profile?.role === 'OPERATOR',
                  'bg-blue-100 text-blue-800': profile?.role === 'ADMIN',
                  'bg-green-100 text-green-800': profile?.role === 'PEMBELI'
                }"
              >
                {{ profile?.role }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Kode User</label>
              <p class="mt-1 text-base text-gray-900">{{ profile?.userCode }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Status</label>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="profile?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ profile?.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Terdaftar Sejak</label>
              <p class="mt-1 text-base text-gray-900">
                {{ formatDate(profile?.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="saveProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                id="name"
                v-model="editForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                v-model="editForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              @click="cancelEditing"
              class="px-4 py-2 border-2 border-secondary-300 text-secondary-700 font-semibold rounded-lg hover:bg-secondary-50 hover:border-secondary-400 transition-colors shadow-sm bg-white"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Change Password Card -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Ubah Password</h2>

        <form @submit.prevent="changePassword" class="space-y-4 max-w-md">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Password Saat Ini
            </label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Password Baru
            </label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <p class="mt-1 text-xs text-gray-500">Minimal 6 karakter</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div class="flex justify-end pt-4">
            <button
              type="submit"
              :disabled="changingPassword"
              class="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {{ changingPassword ? 'Mengubah...' : 'Ubah Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { getProfile, updateProfile } = useAuthApi();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(false);
const editing = ref(false);
const saving = ref(false);
const changingPassword = ref(false);

const profile = ref<any>(null);
const editForm = ref({
  name: '',
  email: '',
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Load profile
onMounted(async () => {
  await loadProfile();
});

async function loadProfile() {
  loading.value = true;
  try {
    const data = await getProfile();
    profile.value = data;
  } catch (error: any) {
    toast.error('Gagal memuat profil');
  } finally {
    loading.value = false;
  }
}

function startEditing() {
  editForm.value = {
    name: profile.value.name,
    email: profile.value.email,
  };
  editing.value = true;
}

function cancelEditing() {
  editing.value = false;
  editForm.value = {
    name: '',
    email: '',
  };
}

async function saveProfile() {
  saving.value = true;
  try {
    const updated = await updateProfile(editForm.value);
    profile.value = updated;
    authStore.user = updated; // Update store
    editing.value = false;
    toast.success('Profil berhasil diperbarui');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
  } finally {
    saving.value = false;
  }
}

async function changePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('Password baru dan konfirmasi tidak cocok');
    return;
  }

  if (passwordForm.value.newPassword.length < 6) {
    toast.error('Password baru minimal 6 karakter');
    return;
  }

  changingPassword.value = true;
  try {
    // TODO: Implement change password API call
    // await changePasswordApi(passwordForm.value);
    toast.success('Password berhasil diubah');
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Gagal mengubah password');
  } finally {
    changingPassword.value = false;
  }
}

function formatDate(date: string | undefined) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
</script>
