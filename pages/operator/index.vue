<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Operator</h1>
      <p class="mt-2 text-sm text-gray-600">
        Selamat datang, {{ authStore.user?.name }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboard">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <!-- Total Products -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:package" class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Produk
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ dashboard.productStats.totalProducts }}
                  </dd>
                  <dd class="text-xs text-gray-500">
                    {{ dashboard.productStats.activeProducts }} aktif
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:clock" class="h-6 w-6 text-yellow-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Perlu Approval
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ dashboard.orderStats.pendingOrders + dashboard.orderStats.approvedByAdminOrders }}
                  </dd>
                  <dd class="text-xs text-gray-500">
                    {{ dashboard.orderStats.processingOrders }} sedang diproses
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Orders -->
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
                    {{ dashboard.orderStats.totalOrders }}
                  </dd>
                  <dd class="text-xs text-gray-500">
                    {{ dashboard.orderStats.completedOrders }} selesai
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Revenue -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:trending-up" class="h-6 w-6 text-purple-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Pendapatan Bulan Ini
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ formatCurrency(dashboard.salesStats.monthSales) }}
                  </dd>
                  <dd class="text-xs text-gray-500">
                    Total: {{ formatCurrency(dashboard.salesStats.totalRevenue) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <!-- Stock Alerts -->
        <div class="bg-white overflow-hidden shadow rounded-lg p-5">
          <h3 class="text-sm font-medium text-gray-500 mb-3">Stok Produk</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Stok Rendah</span>
              <span class="text-sm font-semibold text-yellow-600">
                {{ dashboard.productStats.lowStockVariants }} varian
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Stok Habis</span>
              <span class="text-sm font-semibold text-red-600">
                {{ dashboard.productStats.outOfStockVariants }} varian
              </span>
            </div>
          </div>
        </div>

        <!-- Sales Summary -->
        <div class="bg-white overflow-hidden shadow rounded-lg p-5">
          <h3 class="text-sm font-medium text-gray-500 mb-3">Penjualan</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Hari Ini</span>
              <span class="text-sm font-semibold text-gray-900">
                {{ formatCurrency(dashboard.salesStats.todaySales) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">7 Hari</span>
              <span class="text-sm font-semibold text-gray-900">
                {{ formatCurrency(dashboard.salesStats.weekSales) }}
              </span>
            </div>
          </div>
        </div>

        <!-- User Stats -->
        <div class="bg-white overflow-hidden shadow rounded-lg p-5">
          <h3 class="text-sm font-medium text-gray-500 mb-3">Pengguna</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total User</span>
              <span class="text-sm font-semibold text-gray-900">
                {{ dashboard.totalUsers }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">User Aktif</span>
              <span class="text-sm font-semibold text-green-600">
                {{ dashboard.activeUsers }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div v-if="dashboard.topProducts.length > 0" class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Produk Terpopuler (30 Hari Terakhir)
          </h3>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Produk
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Varian
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Terjual
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(product, index) in dashboard.topProducts" :key="index">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">
                    {{ product.productName }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ product.variantName }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 text-right">
                    {{ product.totalOrdered }} unit
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    {{ formatCurrency(product.revenue) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Pesanan Terbaru
            </h3>
            <NuxtLink to="/operator/orders" class="text-sm text-primary-600 hover:text-primary-800">
              Lihat Semua
            </NuxtLink>
          </div>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div v-if="dashboard.recentOrders.length === 0" class="text-center py-4">
            <p class="text-gray-500">Belum ada pesanan</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pembeli
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User Code
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tanggal
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in dashboard.recentOrders" :key="order.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ order.buyerName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.userCode }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.itemCount }} item
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
                    {{ formatDate(order.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <NuxtLink :to="`/operator/orders/${order.id}`" class="text-primary-600 hover:text-primary-900">
                      Detail
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '~/utils/helpers'
import type { OperatorDashboard } from '~/types'

definePageMeta({
  layout: 'operator',
  middleware: ['role'],
})

const authStore = useAuthStore()
const dashboardApi = useDashboardApi()

const loading = ref(true)
const dashboard = ref<OperatorDashboard | null>(null)

onMounted(async () => {
  try {
    dashboard.value = await dashboardApi.getOperatorDashboard()
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>
