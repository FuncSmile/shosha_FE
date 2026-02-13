<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Pesanan</h1>
      <p class="mt-2 text-sm text-gray-600">
        Kelola approval pesanan untuk {{ authStore.user?.userCode }}
      </p>
    </div>

    <!-- Status Filter -->
    <div class="mb-6">
      <div class="sm:hidden">
        <select
          v-model="selectedStatus"
          class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">Semua Status</option>
          <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      <div class="hidden sm:block">
        <nav class="flex space-x-4" aria-label="Tabs">
          <button
            @click="selectedStatus = 'all'"
            :class="[
              selectedStatus === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700',
              'px-3 py-2 font-medium text-sm rounded-md'
            ]"
          >
            Semua
          </button>
          <button
            v-for="status in orderStatuses"
            :key="status.value"
            @click="selectedStatus = status.value"
            :class="[
              selectedStatus === status.value
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700',
              'px-3 py-2 font-medium text-sm rounded-md'
            ]"
          >
            {{ status.label }}
            <span
              v-if="getOrderCount(status.value) > 0"
              :class="[
                selectedStatus === status.value
                  ? 'bg-primary-200'
                  : 'bg-gray-200',
                'ml-2 py-0.5 px-2 rounded-full text-xs'
              ]"
            >
              {{ getOrderCount(status.value) }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Orders List -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Memuat data...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-8 bg-white rounded-lg shadow">
      <p class="text-gray-500">Tidak ada pesanan</p>
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No. Order
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pembeli
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ order.orderNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.buyer?.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatCurrency(order.totalAmount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getOrderStatusColor(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getOrderStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.createdAt, true) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <NuxtLink
                :to="`/admin/orders/${order.id}`"
                class="text-primary-600 hover:text-primary-900"
              >
                Detail
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '~/utils/helpers'
import { OrderStatus } from '~/types'
import type { Order } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: ['role'],
})

const authStore = useAuthStore()
const ordersApi = useOrdersApi()

const loading = ref(true)
const orders = ref<Order[]>([])
const selectedStatus = ref<string>('all')

const orderStatuses = [
  { value: OrderStatus.PENDING, label: 'Pending' },
  { value: OrderStatus.APPROVED_BY_ADMIN, label: 'Disetujui Admin' },
  { value: OrderStatus.DISETUJUI, label: 'Disetujui' },
  { value: OrderStatus.DITOLAK, label: 'Ditolak' },
]

const filteredOrders = computed(() => {
  if (!Array.isArray(orders.value)) {
    return []
  }
  if (selectedStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(o => o.status === selectedStatus.value)
})

const getOrderCount = (status: string) => {
  if (!Array.isArray(orders.value)) return 0
  if (status === 'all') return orders.value.length
  return orders.value.filter(o => o.status === status).length
}

onMounted(async () => {
  try {
    const data = await ordersApi.getAllOrders()
    // Admin hanya lihat order dengan userCode yang sama
    orders.value = data?.filter(o => o.buyerUserCode === authStore.user?.userCode) || []
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    loading.value = false
  }
})
</script>
