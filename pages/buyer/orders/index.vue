<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
      <p class="mt-2 text-sm text-gray-600">
        Lihat status pesanan Anda
      </p>
    </div>

    <!-- Orders List -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Memuat data...</p>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <Icon name="lucide:package" class="mx-auto h-16 w-16 text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada pesanan</h3>
      <p class="mt-2 text-sm text-gray-500">
        Pesanan yang Anda buat akan muncul di sini
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/buyer/products"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Mulai Belanja
        </NuxtLink>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateTo(`/buyer/orders/${order.id}`)"
      >
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">
                {{ order.orderNumber }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ formatDate(order.createdAt, true) }}
              </p>
            </div>
            <span :class="getOrderStatusColor(order.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
              {{ getOrderStatusLabel(order.status) }}
            </span>
          </div>
        </div>
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">
                {{ order.items?.length || 0 }} item
              </p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-gray-900">
                {{ formatCurrency(order.totalAmount) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '~/utils/helpers'
import type { Order } from '~/types'

definePageMeta({
  layout: 'buyer',
  middleware: ['role'],
})

const ordersApi = useOrdersApi()

const loading = ref(true)
const orders = ref<Order[]>([])

onMounted(async () => {
  try {
    const data = await ordersApi.getAllOrders()
    orders.value = data || []
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    loading.value = false
  }
})
</script>
