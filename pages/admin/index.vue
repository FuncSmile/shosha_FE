<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
      <p class="mt-2 text-sm text-gray-600">
        Selamat datang, {{ authStore.user?.name }} ({{ authStore.user?.userCode }})
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon name="lucide:clock" class="h-6 w-6 text-yellow-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Menunggu Approval
                </dt>
                <dd class="text-2xl font-semibold text-gray-900">
                  {{ stats.pendingOrders }}
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
              <Icon name="lucide:check-circle" class="h-6 w-6 text-green-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Disetujui Hari Ini
                </dt>
                <dd class="text-2xl font-semibold text-gray-900">
                  {{ stats.approvedToday }}
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
              <Icon name="lucide:message-square" class="h-6 w-6 text-blue-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Komentar Belum Dibaca
                </dt>
                <dd class="text-2xl font-semibold text-gray-900">
                  {{ stats.unreadComments }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Orders -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Pesanan Menunggu Approval
        </h3>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <div v-if="loading" class="text-center py-4">
          <p class="text-gray-500">Memuat data...</p>
        </div>
        <div v-else-if="pendingOrders.length === 0" class="text-center py-4">
          <p class="text-gray-500">Tidak ada pesanan yang menunggu approval</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pembeli
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode User
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
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
              <tr v-for="order in pendingOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ order.orderNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.buyer?.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.buyerUserCode }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(order.totalAmount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt, true) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <NuxtLink
                    :to="`/admin/orders/${order.id}`"
                    class="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    Review
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '~/utils/helpers'
import { OrderStatus } from '~/types'
import type { Order } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: ['role'],
})

const authStore = useAuthStore()
const ordersApi = useOrdersApi()
const commentsApi = useCommentsApi()

const loading = ref(true)
const pendingOrders = ref<Order[]>([])
const stats = ref({
  pendingOrders: 0,
  approvedToday: 0,
  unreadComments: 0,
})

onMounted(async () => {
  try {
    // Load pending orders
    const orders = await ordersApi.getOrdersByStatus(OrderStatus.PENDING)
    // Filter by userCode (admin hanya lihat order dengan userCode yang sama)
    pendingOrders.value = orders?.filter(o => o.buyerUserCode === authStore.user?.userCode) || []
    stats.value.pendingOrders = pendingOrders.value.length

    // Calculate approved today
    const allOrders = await ordersApi.getAllOrders()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    stats.value.approvedToday = allOrders?.filter(o => 
      o.approvedAt && new Date(o.approvedAt) >= today
    ).length || 0

    // Load unread comments
    const comments = await commentsApi.getUnreadComments()
    stats.value.unreadComments = comments?.length || 0
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>
