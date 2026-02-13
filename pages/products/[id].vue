<template>
  <div class="max-w-4xl mx-auto">
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
          <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
          <p class="text-sm text-gray-500 mt-1">Kategori: {{ product.category }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <NuxtLink
            v-if="authStore.user?.role === 'OPERATOR'"
            :to="`/operator/products/${product.id}/edit`"
            class="inline-flex items-center px-4 py-2 border-2 border-primary-600 text-primary-700 rounded-lg text-sm font-semibold bg-white hover:bg-primary-50 hover:border-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <Icon name="lucide:edit" class="w-4 h-4 mr-2" />
            Edit Produk
          </NuxtLink>
          <NuxtLink
            :to="backLink"
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
                <dt class="text-sm font-medium text-gray-500">Dibuat</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(product.createdAt, true) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Terakhir Update</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(product.updatedAt, true) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Right Column: Variants -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Varian Produk</h2>
              <button
                v-if="authStore.user?.role === 'OPERATOR'"
                @click="openVariantModal()"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
              >
                <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                Tambah Varian
              </button>
            </div>

            <!-- Variants List -->
            <div v-if="!variants || variants.length === 0" class="text-center py-8 text-gray-500">
              Belum ada varian produk
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="variant in variants"
                :key="variant.id"
                class="border rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <h3 class="text-base font-medium text-gray-900">{{ variant.name }}</h3>
                      <span
                        :class="variant.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                        class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full"
                      >
                        {{ variant.isActive ? 'Aktif' : 'Nonaktif' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">SKU: {{ variant.sku }}</p>
                    <div class="mt-2 flex items-center space-x-4 text-sm">
                      <span class="text-gray-700">
                        <Icon name="lucide:package" class="w-4 h-4 inline mr-1" />
                        Stok: <span class="font-medium">{{ variant.stock }}</span>
                      </span>
                      <span
                        v-if="variant.pricing && variant.pricing.length > 0"
                        class="text-gray-700"
                      >
                        <Icon name="lucide:tag" class="w-4 h-4 inline mr-1" />
                        {{ variant.pricing.length }} Harga
                      </span>
                    </div>
                    <div v-if="variant.attributes" class="mt-2 flex flex-wrap gap-2">
                      <span
                        v-for="(value, key) in variant.attributes"
                        :key="key"
                        class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {{ key }}: {{ value }}
                      </span>
                    </div>
                  </div>
                  <div v-if="authStore.user?.role === 'OPERATOR'" class="flex items-center space-x-2">
                    <button
                      @click="openVariantModal(variant)"
                      class="p-2 text-primary-700 hover:text-primary-900 hover:bg-primary-50 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                      title="Edit"
                    >
                      <Icon name="lucide:edit" class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteVariant(variant)"
                      class="p-2 text-red-700 hover:text-red-900 hover:bg-red-50 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      title="Hapus"
                    >
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Variant Pricing -->
                <div v-if="variant.pricing && variant.pricing.length > 0" class="mt-4 pt-4 border-t">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Harga per User Code:</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div
                      v-for="price in variant.pricing"
                      :key="price.id"
                      class="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded"
                    >
                      <span class="font-medium text-gray-700">{{ price.userCode }}</span>
                      <span class="text-gray-900">{{ formatCurrency(price.price) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Variant Modal -->
    <div
      v-if="showVariantModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="closeVariantModal"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingVariant ? 'Edit Varian' : 'Tambah Varian' }}
        </h3>
        
        <form @submit.prevent="saveVariant" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Varian *</label>
            <input
              v-model="variantForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input
              v-model="variantForm.sku"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
            <input
              v-model.number="variantForm.stock"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="variantForm.isActive"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="true">Aktif</option>
              <option :value="false">Tidak Aktif</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeVariantModal"
              class="px-4 py-2 border-2 border-secondary-300 text-sm font-semibold rounded-lg text-secondary-700 bg-white hover:bg-secondary-50 hover:border-secondary-400 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 shadow-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="savingVariant"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {{ savingVariant ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '~/utils/helpers'
import type { Product, ProductVariant } from '~/types'

definePageMeta({
  layout: false,
})

const route = useRoute()
const authStore = useAuthStore()
const productsApi = useProductsApi()

const product = ref<Product | null>(null)
const variants = ref<ProductVariant[]>([])
const loading = ref(true)
const error = ref('')

const showVariantModal = ref(false)
const editingVariant = ref<ProductVariant | null>(null)
const savingVariant = ref(false)
const variantForm = ref({
  name: '',
  sku: '',
  stock: 0,
  isActive: true,
})

const backLink = computed(() => {
  const role = authStore.user?.role
  if (role === 'OPERATOR') return '/operator/products'
  if (role === 'ADMIN') return '/admin/products'
  return '/buyer/products'
})

const loadProduct = async () => {
  loading.value = true
  error.value = ''
  try {
    const productId = route.params.id as string
    product.value = await productsApi.getProduct(productId)
    
    // Load variants
    const allVariants = await productsApi.getAllVariants(productId)
    variants.value = allVariants || []
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat detail produk'
  } finally {
    loading.value = false
  }
}

const openVariantModal = (variant?: ProductVariant) => {
  if (variant) {
    editingVariant.value = variant
    variantForm.value = {
      name: variant.name,
      sku: variant.sku,
      stock: variant.stock,
      isActive: variant.isActive,
    }
  } else {
    editingVariant.value = null
    variantForm.value = {
      name: '',
      sku: '',
      stock: 0,
      isActive: true,
    }
  }
  showVariantModal.value = true
}

const closeVariantModal = () => {
  showVariantModal.value = false
  editingVariant.value = null
}

const saveVariant = async () => {
  savingVariant.value = true
  try {
    if (editingVariant.value) {
      await productsApi.updateVariant(editingVariant.value.id, variantForm.value)
    } else {
      await productsApi.createVariant({
        ...variantForm.value,
        productId: product.value!.id,
      })
    }
    
    closeVariantModal()
    await loadProduct()
    useToast().success('Varian berhasil disimpan', 'Berhasil')
  } catch (err: any) {
    useToast().error(err.message || 'Gagal menyimpan varian', 'Gagal')
  } finally {
    savingVariant.value = false
  }
}

const deleteVariant = async (variant: ProductVariant) => {
  if (!confirm(`Yakin ingin menghapus varian "${variant.name}"?`)) return
  
  try {
    await productsApi.deleteVariant(variant.id)
    await loadProduct()
    useToast().success('Varian berhasil dihapus', 'Berhasil')
  } catch (err: any) {
    useToast().error(err.message || 'Gagal menghapus varian', 'Gagal')
  }
}

onMounted(() => {
  loadProduct()
})
</script>
