<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <div class="flex items-center space-x-3">
        <NuxtLink
          to="/operator/products"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5 text-gray-600" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
          <p class="mt-1 text-sm text-gray-600">
            Isi form di bawah untuk menambahkan produk baru
          </p>
        </div>
      </div>
    </div>

    <AlertMessage
      v-if="error"
      type="error"
      title="Terjadi Kesalahan"
      :message="error"
      :dismissible="true"
      @dismiss="error = ''"
    />

    <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow">
      <!-- Nama Produk -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk <span class="text-red-600">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Contoh: Kopi Arabica Premium"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <!-- Kategori -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
          Kategori <span class="text-red-600">*</span>
        </label>
        <input
          id="category"
          v-model="form.category"
          type="text"
          required
          placeholder="Contoh: Kopi, Minuman, Makanan"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <!-- Deskripsi -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          placeholder="Deskripsi produk..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        ></textarea>
      </div>

      <!-- Image Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Gambar Produk <span class="text-red-600">*</span>
        </label>
        
        <!-- Image Preview -->
        <div v-if="imagePreview" class="mb-4 relative inline-block">
          <img 
            :src="imagePreview" 
            alt="Preview" 
            class="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            @click="clearImage"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- File Input -->
        <div class="mt-2">
          <label
            for="imageFile"
            class="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': uploading }"
          >
            <div class="flex flex-col items-center space-y-2">
              <Icon 
                :name="uploading ? 'lucide:loader-2' : 'lucide:upload'" 
                class="w-8 h-8 text-gray-400"
                :class="{ 'animate-spin': uploading }"
              />
              <span class="text-sm text-gray-600">
                {{ uploading ? 'Uploading...' : 'Klik untuk upload gambar' }}
              </span>
              <span class="text-xs text-gray-500">
                PNG, JPG, WebP (Max 5MB)
              </span>
            </div>
            <input
              id="imageFile"
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              @change="handleFileSelect"
              :disabled="uploading"
              class="hidden"
            />
          </label>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploading" class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-500 mt-1 text-center">{{ uploadProgress }}%</p>
        </div>

        <!-- Alternative: URL Input -->
        <div v-if="!imagePreview" class="mt-4">
          <div class="flex items-center space-x-2 mb-2">
            <div class="flex-1 border-t border-gray-300"></div>
            <span class="text-xs text-gray-500">atau</span>
            <div class="flex-1 border-t border-gray-300"></div>
          </div>
          <input
            id="imageUrl"
            v-model="form.imageUrl"
            type="url"
            placeholder="Masukkan URL gambar"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <!-- Status Aktif -->
      <div class="flex items-center">
        <input
          id="isActive"
          v-model="form.isActive"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="isActive" class="ml-2 block text-sm text-gray-700">
          Produk Aktif (dapat dilihat pembeli)
        </label>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-3 pt-4">
        <NuxtLink
          to="/operator/products"
          class="px-4 py-2 bg-white border-2 border-secondary-300 text-secondary-700 font-semibold rounded-lg hover:bg-secondary-50 hover:border-secondary-400 transition-colors shadow-sm"
        >
          Batal
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {{ submitting ? 'Menyimpan...' : 'Simpan Produk' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CreateProductDto } from '~/types'

definePageMeta({
  layout: 'operator',
  middleware: 'role',
})

const router = useRouter()
const productsApi = useProductsApi()
const toast = useToast()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const submitting = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const imagePreview = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive<CreateProductDto>({
  name: '',
  category: '',
  description: '',
  imageUrl: '',
  isActive: true,
})

/**
 * Handle file selection dengan validasi
 */
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validasi file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    toast.error('Format file tidak valid. Hanya JPEG, PNG, dan WebP yang diperbolehkan.', 'Error')
    return
  }

  // Validasi file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    toast.error('Ukuran file terlalu besar. Maksimal 5MB.', 'Error')
    return
  }

  // Show preview immediately
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Upload ke backend
  await uploadImage(file)
}

/**
 * Upload image ke backend (yang akan forward ke Cloudinary)
 */
const uploadImage = async (file: File) => {
  uploading.value = true
  uploadProgress.value = 0
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    const response = await $fetch<{
      success: boolean
      data: { url: string; publicId: string; width: number; height: number }
    }>(`${config.public.apiBase}/upload/image`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.success && response.data) {
      form.imageUrl = response.data.url
      toast.success('Gambar berhasil diupload', 'Berhasil')
    } else {
      throw new Error('Upload failed')
    }
  } catch (err: any) {
    console.error('Upload error:', err)
    error.value = err.data?.message || err.message || 'Gagal upload gambar'
    toast.error(error.value, 'Upload Gagal')
    imagePreview.value = '' // Clear preview on error
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

/**
 * Clear selected image
 */
const clearImage = () => {
  imagePreview.value = ''
  form.imageUrl = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  // Validasi bahwa ada gambar
  if (!form.imageUrl) {
    toast.error('Gambar produk wajib diisi', 'Validasi')
    return
  }

  submitting.value = true
  error.value = ''
  
  try {
    const data: CreateProductDto = {
      name: form.name,
      category: form.category,
      description: form.description || undefined,
      imageUrl: form.imageUrl,
      isActive: form.isActive,
    }

    await productsApi.createProduct(data)
    toast.success('Produk berhasil dibuat', 'Berhasil')
    router.push('/operator/products')
  } catch (err: any) {
    error.value = err.message || 'Gagal membuat produk'
    toast.error(err.message || 'Gagal membuat produk', 'Gagal')
  } finally {
    submitting.value = false
  }
}
</script>
