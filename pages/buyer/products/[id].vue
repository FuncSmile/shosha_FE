<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <Icon name="lucide:alert-circle" class="h-12 w-12 text-red-400 mx-auto mb-4" />
      <p class="text-red-800 font-medium">{{ error }}</p>
      <NuxtLink
        to="/buyer/products"
        class="mt-4 inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
      >
        <Icon name="lucide:arrow-left" class="w-4 h-4 mr-1" />
        Kembali ke Galeri Produk
      </NuxtLink>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="space-y-8">
      <!-- Breadcrumbs -->
      <nav class="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <NuxtLink to="/buyer" class="hover:text-primary-600">Dashboard</NuxtLink>
          </li>
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
          <li>
            <NuxtLink to="/buyer/products" class="hover:text-primary-600">Produk</NuxtLink>
          </li>
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
          <li class="font-medium text-gray-900 truncate max-w-xs">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Left Column: Image -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl shadow-sm border overflow-hidden aspect-square flex items-center justify-center bg-gray-50">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
            <Icon v-else name="lucide:image" class="w-24 h-24 text-gray-300" />
          </div>
          
          <div v-if="product.category" class="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full tracking-wide uppercase">
            {{ product.category }}
          </div>
        </div>

        <!-- Right Column: Details & Actions -->
        <div class="flex flex-col">
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 leading-tight mb-2">{{ product.name }}</h1>
            <p v-if="product.description" class="text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
            <!-- Variant Selection -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Pilih Varian:</label>
              <div class="grid grid-cols-1 gap-3">
                <div
                  v-for="pricing in pricings"
                  :key="pricing.id"
                  @click="selectedPricing = pricing"
                  :class="[
                    selectedPricing?.id === pricing.id 
                      ? 'border-primary-600 ring-1 ring-primary-600 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300'
                  ]"
                  class="relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all duration-200"
                >
                  <div class="flex justify-between items-start mb-1">
                    <span class="font-bold text-gray-900 text-lg">{{ pricing.variant.name }}</span>
                    <span v-if="selectedPricing?.id === pricing.id" class="text-primary-600">
                      <Icon name="lucide:check-circle-2" class="w-5 h-5 fill-primary-50" />
                    </span>
                  </div>
                  <div class="flex justify-between items-end">
                    <div class="space-y-1">
                      <p class="text-xs text-gray-500 font-medium tracking-wider">SKU: {{ pricing.variant.sku }}</p>
                      <p class="text-2xl font-black text-primary-600">
                        {{ formatCurrency(pricing.price) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <span 
                        :class="pricing.variant.stock > 10 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'"
                        class="px-2 py-0.5 rounded text-xs font-bold"
                      >
                        Stok: {{ pricing.variant.stock }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div v-if="selectedPricing" class="pt-4 border-t space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-700">Jumlah:</span>
                <div class="flex items-center border rounded-lg bg-gray-50 px-2 h-10">
                  <button 
                    @click="quantity > 1 ? quantity-- : null"
                    :disabled="quantity <= 1"
                    class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-30"
                  >
                    <Icon name="lucide:minus" class="w-4 h-4" />
                  </button>
                  <input 
                    v-model.number="quantity" 
                    type="number" 
                    min="1" 
                    :max="selectedPricing.variant.stock"
                    class="w-12 text-center bg-transparent border-none focus:ring-0 text-sm font-bold"
                  />
                  <button 
                    @click="quantity < selectedPricing.variant.stock ? quantity++ : null"
                    :disabled="quantity >= selectedPricing.variant.stock"
                    class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-30"
                  >
                    <Icon name="lucide:plus" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600">Subtotal:</span>
                  <span class="text-xl font-bold text-gray-900">{{ formatCurrency(selectedPricing.price * quantity) }}</span>
                </div>
                
                <button
                  @click="addToCart"
                  :disabled="selectedPricing.variant.stock === 0"
                  class="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-100 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                >
                  <Icon name="lucide:shopping-cart" class="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  {{ selectedPricing.variant.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang' }}
                </button>
              </div>
            </div>
            
            <div v-else class="text-center py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p class="text-sm text-gray-500 font-medium">Silakan pilih varian untuk melanjutkan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '~/utils/helpers'
import type { PricingWithProduct, Product } from '~/types'

definePageMeta({
  layout: 'buyer',
  middleware: ['role'],
})

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const pricingApi = usePricingApi()
const toast = useToast()

const loading = ref(true)
const error = ref('')
const product = ref<Product | null>(null)
const pricings = ref<PricingWithProduct[]>([])
const selectedPricing = ref<PricingWithProduct | null>(null)
const quantity = ref(1)

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const productId = route.params.id as string
    
    // Fetch all pricings for the user
    // In a real app we might have a specific endpoint for product-detail-with-my-pricing
    // For now we fetch all and filter locally as consistent with existing patterns
    const pricingData = await pricingApi.getMyPricing()
    
    // Filter by product ID
    const productPricings = pricingData.filter(p => p.variant.product.id === productId)
    
    if (productPricings.length === 0) {
      error.value = 'Produk tidak ditemukan atau tidak tersedia untuk akun Anda.'
      return
    }

    pricings.value = productPricings
    product.value = productPricings[0].variant.product
    
    // Select first available variant by default
    const available = productPricings.find(p => p.variant.stock > 0)
    selectedPricing.value = available || productPricings[0]
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat detail produk'
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!selectedPricing.value || selectedPricing.value.variant.stock === 0) return

  cartStore.addItem({
    variantId: selectedPricing.value.variant.id,
    productName: selectedPricing.value.variant.product.name,
    variantName: selectedPricing.value.variant.name,
    sku: selectedPricing.value.variant.sku,
    pricePerUnit: selectedPricing.value.price,
    quantity: quantity.value,
    subtotal: selectedPricing.value.price * quantity.value,
    variant: {
      id: selectedPricing.value.variant.id,
      name: selectedPricing.value.variant.name,
      sku: selectedPricing.value.variant.sku,
      stock: selectedPricing.value.variant.stock,
      product: {
        name: selectedPricing.value.variant.product.name,
        imageUrl: selectedPricing.value.variant.product.imageUrl,
      },
    },
  })
  
  toast.success(`${selectedPricing.value.variant.name} ditambahkan ke keranjang`, 'Berhasil')
}

// Ensure quantity doesn't exceed stock if pricing changes
watch(selectedPricing, (newVal) => {
  if (newVal && quantity.value > newVal.variant.stock) {
    quantity.value = newVal.variant.stock || 1
  }
})

onMounted(() => {
  loadData()
})
</script>
