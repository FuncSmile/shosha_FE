<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Produk</h1>
      <p class="mt-2 text-sm text-gray-600">
        Belanja produk dengan harga khusus untuk {{ authStore.user?.userCode }}
      </p>
    </div>

    <!-- Search & Filter -->
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
            v-model="filterCategory"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Kategori</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Memuat data...</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-8 bg-white rounded-lg shadow">
      <p class="text-gray-500">Tidak ada produk ditemukan</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="pricing in filteredProducts"
        :key="pricing.id"
        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
      >
        <NuxtLink :to="`/buyer/products/${pricing.variant.product.id}`">
          <div class="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              v-if="pricing.variant.product.imageUrl"
              :src="pricing.variant.product.imageUrl"
              :alt="pricing.variant.product.name"
              class="object-cover w-full h-48"
            />
            <div v-else class="flex items-center justify-center h-48">
              <Icon name="lucide:image" class="h-16 w-16 text-gray-400" />
            </div>
          </div>
        </NuxtLink>
        <div class="p-4">
          <NuxtLink :to="`/buyer/products/${pricing.variant.product.id}`">
            <h3 class="text-lg font-medium text-gray-900 hover:text-primary-600 mb-1">
              {{ pricing.variant.product.name }}
            </h3>
          </NuxtLink>
          <p class="text-sm text-gray-500 mb-2">
            {{ pricing.variant.name }}
          </p>
          <div class="flex items-center justify-between mb-3">
            <p class="text-xl font-bold text-primary-600">
              {{ formatCurrency(pricing.price) }}
            </p>
            <p class="text-xs text-gray-500">
              Stok: {{ pricing.variant.stock }}
            </p>
          </div>
          <button
            @click="addToCart(pricing)"
            :disabled="pricing.variant.stock === 0"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="lucide:shopping-cart" class="inline-block mr-2 h-4 w-4" />
            {{ pricing.variant.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils/helpers'
import type { PricingWithProduct } from '~/types'

definePageMeta({
  layout: 'buyer',
  middleware: ['role'],
})

const authStore = useAuthStore()
const cartStore = useCartStore()
const pricingApi = usePricingApi()

const loading = ref(true)
const products = ref<PricingWithProduct[]>([])
const searchQuery = ref('')
const filterCategory = ref('')

const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.variant.product.category))
  return Array.from(cats)
})

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filter by category
  if (filterCategory.value) {
    filtered = filtered.filter(p => p.variant.product.category === filterCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.variant.product.name.toLowerCase().includes(query) ||
      p.variant.name.toLowerCase().includes(query)
    )
  }

  return filtered
})

const addToCart = (pricing: PricingWithProduct) => {
  if (pricing.variant.stock === 0) return

  cartStore.addItem({
    variantId: pricing.variant.id,
    productName: pricing.variant.product.name,
    variantName: pricing.variant.name,
    sku: pricing.variant.sku,
    pricePerUnit: pricing.price,
    quantity: 1,
    subtotal: pricing.price,
    variant: {
      id: pricing.variant.id,
      name: pricing.variant.name,
      sku: pricing.variant.sku,
      stock: pricing.variant.stock,
      product: {
        name: pricing.variant.product.name,
        imageUrl: pricing.variant.product.imageUrl,
      },
    },
  })
}

onMounted(async () => {
  try {
    const data = await pricingApi.getMyPricing()
    products.value = data || []
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
})
</script>
