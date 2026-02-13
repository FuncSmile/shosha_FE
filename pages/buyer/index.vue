<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Selamat Datang di ShoshaMart</h1>
      <p class="mt-2 text-sm text-gray-600">
        Halo, {{ authStore.user?.name }} ({{ authStore.user?.userCode }})
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon name="lucide:package" class="h-6 w-6 text-primary-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Produk Tersedia
                </dt>
                <dd class="text-2xl font-semibold text-gray-900">
                  {{ stats.availableProducts }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon name="lucide:shopping-bag" class="h-6 w-6 text-green-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Pesanan
                </dt>
                <dd class="text-2xl font-semibold text-gray-900">
                  {{ stats.totalOrders }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon name="lucide:shopping-cart" class="h-6 w-6 text-orange-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Item di Keranjang
                </dt>
                <dd class="text-2xl font-semibold text-gray-900">
                  {{ cartStore.itemCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Products -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Produk Unggulan</h2>
        <NuxtLink
          to="/buyer/products"
          class="text-primary-600 hover:text-primary-900 font-medium"
        >
          Lihat Semua →
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">Memuat data...</p>
      </div>

      <div v-else-if="featuredProducts.length === 0" class="text-center py-8 bg-white rounded-lg shadow">
        <p class="text-gray-500">Tidak ada produk tersedia</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateTo(`/buyer/products/${product.variant.product.id}`)"
        >
          <div class="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              v-if="product.variant.product.imageUrl"
              :src="product.variant.product.imageUrl"
              :alt="product.variant.product.name"
              class="object-cover w-full h-48"
            />
            <div v-else class="flex items-center justify-center h-48">
              <Icon name="lucide:image" class="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-1">
              {{ product.variant.product.name }}
            </h3>
            <p class="text-sm text-gray-500 mb-2">
              {{ product.variant.name }}
            </p>
            <p class="text-xl font-bold text-primary-600">
              {{ formatCurrency(product.price) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Stok: {{ product.variant.stock }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Pesanan Terbaru
        </h3>
        <NuxtLink
          to="/buyer/orders"
          class="text-sm text-primary-600 hover:text-primary-900 font-medium"
        >
          Lihat Semua
        </NuxtLink>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <div v-if="recentOrders.length === 0" class="text-center py-4">
          <p class="text-gray-500">Belum ada pesanan</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="navigateTo(`/buyer/orders/${order.id}`)"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ order.orderNumber }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(order.createdAt, true) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(order.totalAmount) }}</p>
              <span :class="getOrderStatusColor(order.status)" class="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getOrderStatusLabel(order.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '~/utils/helpers'
import type { Order, PricingWithProduct } from '~/types'

definePageMeta({
  layout: 'buyer',
  middleware: ['role'],
})

const authStore = useAuthStore()
const cartStore = useCartStore()
const pricingApi = usePricingApi()
const ordersApi = useOrdersApi()

const loading = ref(true)
const featuredProducts = ref<PricingWithProduct[]>([])
const recentOrders = ref<Order[]>([])
const stats = ref({
  availableProducts: 0,
  totalOrders: 0,
})

onMounted(async () => {
  try {
    // Load products with pricing
    const pricing = await pricingApi.getMyPricing()
    featuredProducts.value = pricing?.filter(p => p.variant.stock > 0).slice(0, 8) || []
    stats.value.availableProducts = pricing?.length || 0

    // Load orders
    const orders = await ordersApi.getAllOrders()
    recentOrders.value = orders?.slice(0, 5) || []
    stats.value.totalOrders = orders?.length || 0
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>
