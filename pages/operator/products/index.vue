<template>
  <div>
    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Produk</h1>
        <p class="mt-1 sm:mt-2 text-sm text-gray-600">
          Kelola produk dan variant
        </p>
      </div>
      <NuxtLink
        to="/operator/products/create"
        class="inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
      >
        <Icon name="lucide:plus" class="mr-2 h-5 w-5" />
        Tambah Produk
      </NuxtLink>
    </div>

    <!-- Filter -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari produk..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <select
            v-model="filterActive"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Non-aktif</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products List -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Memuat data...</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-8 bg-white rounded-lg shadow">
      <p class="text-gray-500">Belum ada produk</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
      >
        <div class="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="object-cover w-full h-48"
          />
          <div v-else class="flex items-center justify-center h-48">
            <Icon name="lucide:image" class="h-16 w-16 text-gray-400" />
          </div>
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">
                {{ product.name }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ product.category }}
              </p>
            </div>
            <span
              :class="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="px-2 py-1 text-xs font-semibold rounded-full"
            >
              {{ product.isActive ? 'Aktif' : 'Non-aktif' }}
            </span>
          </div>
          <p class="mt-2 text-sm text-gray-600 line-clamp-2">
            {{ product.description || 'Tidak ada deskripsi' }}
          </p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-gray-500">
              {{ product.variants?.length || 0 }} variant
            </span>
            <div class="flex gap-2">
              <NuxtLink
                v-if="product.id"
                :to="`/operator/products/${product.id}`"
                class="text-primary-700 hover:text-primary-900 hover:underline text-sm font-semibold"
              >
                Detail
              </NuxtLink>
              <span v-if="product.id" class="text-gray-400">•</span>
              <NuxtLink
                v-if="product.id"
                :to="`/operator/products/${product.id}/edit`"
                class="text-gray-700 hover:text-gray-900 hover:underline text-sm font-semibold"
              >
                Edit
              </NuxtLink>
              <span v-if="!product.id" class="text-xs text-red-500">No ID</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({
  layout: 'operator',
  middleware: ['role'],
})

const productsApi = useProductsApi()

const loading = ref(true)
const products = ref<Product[]>([])
const searchQuery = ref('')
const filterActive = ref('all')

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filter by active status
  if (filterActive.value !== 'all') {
    const isActive = filterActive.value === 'true'
    filtered = filtered.filter(p => p.isActive === isActive)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }

  return filtered
})

onMounted(async () => {
  try {
    const data = await productsApi.getAllProducts()
    console.log('Products API Response:', data)
    products.value = data || []
    console.log('Products loaded:', products.value.length)
    if (products.value.length > 0) {
      console.log('First product:', products.value[0])
    }
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
})
</script>
