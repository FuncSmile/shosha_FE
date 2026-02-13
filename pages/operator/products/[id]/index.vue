<template>
  <div class="max-w-6xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          <p class="text-sm text-gray-500 mt-1">Kategori: {{ product.category }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <NuxtLink
            :to="`/operator/products/${product.id}/edit`"
            class="inline-flex items-center px-4 py-2 border-2 border-primary-600 text-primary-700 rounded-lg text-sm font-semibold bg-white hover:bg-primary-50 hover:border-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <Icon name="lucide:edit" class="w-4 h-4 mr-2" />
            Edit Produk
          </NuxtLink>
          <NuxtLink
            to="/operator/products"
            class="inline-flex items-center px-4 py-2 border-2 border-gray-400 rounded-lg text-sm font-semibold text-gray-800 bg-white hover:bg-gray-100 hover:border-gray-500 transition-colors"
          >
            <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Product Image & Info -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Product Image -->
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <div class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <Icon v-else name="lucide:image" class="w-24 h-24 text-gray-400" />
            </div>
          </div>

          <!-- Product Info -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informasi Produk</h2>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <span
                    :class="product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ product.isActive ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Deskripsi</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ product.description || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Total Varian</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ product.variants?.length || 0 }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Dibuat</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(product.createdAt) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Terakhir Update</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(product.updatedAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Right Column: Variants -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Varian Produk</h2>
                <button
                  @click="showAddVariantModal = true"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                  Tambah Varian
                </button>
              </div>
            </div>

            <!-- Variants List -->
            <div v-if="!product.variants || product.variants.length === 0" class="p-8 text-center">
              <Icon name="lucide:package" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">Belum ada varian untuk produk ini</p>
            </div>

            <div v-else class="divide-y divide-gray-200">
              <div
                v-for="variant in product.variants"
                :key="variant.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <h3 class="text-base font-semibold text-gray-900">{{ variant.name }}</h3>
                      <span
                        :class="variant.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                        class="px-2 py-0.5 text-xs font-medium rounded-full"
                      >
                        {{ variant.isActive ? 'Aktif' : 'Tidak Aktif' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">SKU: {{ variant.sku }}</p>
                    
                    <div class="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs font-medium text-gray-500">Stok</p>
                        <p class="text-sm font-semibold text-gray-900 mt-1">
                          {{ variant.stock }} unit
                        </p>
                      </div>
                      <div v-if="variant.attributes">
                        <p class="text-xs font-medium text-gray-500">Atribut</p>
                        <div class="mt-1 flex flex-wrap gap-1">
                          <span
                            v-for="(value, key) in variant.attributes"
                            :key="key"
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {{ key }}: {{ value }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="ml-4 flex items-center gap-2">
                    <button
                      @click="editVariant(variant)"
                      class="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Icon name="lucide:edit" class="w-5 h-5" />
                    </button>
                    <button
                      @click="confirmDeleteVariant(variant)"
                      class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Icon name="lucide:trash-2" class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Variant Modal -->
    <div
      v-if="showAddVariantModal || showEditVariantModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeVariantModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ showEditVariantModal ? 'Edit Varian' : 'Tambah Varian Baru' }}
        </h3>

        <form @submit.prevent="showEditVariantModal ? updateVariant() : createVariant()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Varian *</label>
            <input
              v-model="variantForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="contoh: Ukuran L"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input
              v-model="variantForm.sku"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="contoh: PROD-001-L"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
            <input
              v-model.number="variantForm.stock"
              type="number"
              required
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div v-if="showEditVariantModal">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="variantForm.isActive"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="true">Aktif</option>
              <option :value="false">Tidak Aktif</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeVariantModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Hapus Varian?</h3>
        <p class="text-sm text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus varian "{{ variantToDelete?.name }}"? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            @click="deleteVariant"
            :disabled="submitting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {{ submitting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductVariant, CreateVariantDto, UpdateVariantDto } from '~/types'

definePageMeta({
  layout: 'operator',
  middleware: ['role'],
})

const route = useRoute()
const productsApi = useProductsApi()

const loading = ref(true)
const error = ref('')
const product = ref<Product | null>(null)

// Variant modals
const showAddVariantModal = ref(false)
const showEditVariantModal = ref(false)
const showDeleteModal = ref(false)
const submitting = ref(false)
const variantToDelete = ref<ProductVariant | null>(null)
const editingVariant = ref<ProductVariant | null>(null)

// Variant form
const variantForm = ref({
  name: '',
  sku: '',
  stock: 0,
  isActive: true,
})

// Fetch product details
const fetchProduct = async () => {
  try {
    loading.value = true
    error.value = ''
    const id = route.params.id as string
    console.log('Fetching product with ID:', id, 'Type:', typeof id)
    
    if (!id || id === 'undefined') {
      error.value = 'ID produk tidak valid'
      return
    }
    
    const data = await productsApi.getProduct(id)
    console.log('Product fetched:', data)
    product.value = data
  } catch (err: any) {
    console.error('Fetch product error:', err)
    error.value = err.response?.data?.message || 'Gagal memuat detail produk'
  } finally {
    loading.value = false
  }
}

// Create variant
const createVariant = async () => {
  try {
    submitting.value = true
    const dto: CreateVariantDto = {
      productId: product.value!.id,
      name: variantForm.value.name,
      sku: variantForm.value.sku,
      stock: variantForm.value.stock,
    }
    await productsApi.createVariant(dto)
    await fetchProduct()
    closeVariantModal()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gagal menambah varian')
  } finally {
    submitting.value = false
  }
}

// Edit variant
const editVariant = (variant: ProductVariant) => {
  editingVariant.value = variant
  variantForm.value = {
    name: variant.name,
    sku: variant.sku,
    stock: variant.stock,
    isActive: variant.isActive,
  }
  showEditVariantModal.value = true
}

// Update variant
const updateVariant = async () => {
  try {
    submitting.value = true
    const dto: UpdateVariantDto = {
      name: variantForm.value.name,
      sku: variantForm.value.sku,
      stock: variantForm.value.stock,
      isActive: variantForm.value.isActive,
    }
    await productsApi.updateVariant(editingVariant.value!.id, dto)
    await fetchProduct()
    closeVariantModal()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gagal mengupdate varian')
  } finally {
    submitting.value = false
  }
}

// Confirm delete
const confirmDeleteVariant = (variant: ProductVariant) => {
  variantToDelete.value = variant
  showDeleteModal.value = true
}

// Delete variant
const deleteVariant = async () => {
  try {
    submitting.value = true
    await productsApi.deleteVariant(variantToDelete.value!.id)
    await fetchProduct()
    showDeleteModal.value = false
    variantToDelete.value = null
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gagal menghapus varian')
  } finally {
    submitting.value = false
  }
}

// Close modals
const closeVariantModal = () => {
  showAddVariantModal.value = false
  showEditVariantModal.value = false
  editingVariant.value = null
  variantForm.value = {
    name: '',
    sku: '',
    stock: 0,
    isActive: true,
  }
}

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Load on mount
onMounted(() => {
  fetchProduct()
})
</script>
