<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
      <p class="mt-1 text-sm text-gray-500">Analisis dan reporting penjualan</p>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">User Code</label>
          <select
            v-model="filters.userCode"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Semua</option>
            <option value="SHOSHA">SHOSHA</option>
            <option value="L24J">L24J</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="loadReports"
            class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Icon name="lucide:search" class="w-4 h-4 inline mr-2" />
            Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-blue-100 rounded-lg">
              <Icon name="lucide:shopping-bag" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500">Total Orders</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ loading ? '...' : salesReport?.totalOrders || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-green-100 rounded-lg">
              <Icon name="lucide:dollar-sign" class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ loading ? '...' : formatCurrency(salesReport?.totalRevenue || 0) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-purple-100 rounded-lg">
              <Icon name="lucide:trending-up" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500">Avg Order Value</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ loading ? '...' : formatCurrency(avgOrderValue) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders by Status -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-4">Orders by Status</h3>
      <div class="space-y-3">
        <div v-for="(count, status) in salesReport?.ordersByStatus" :key="status">
          <div class="flex items-center justify-between text-sm mb-1">
            <span class="text-gray-700">{{ getOrderStatusLabel(status as any) }}</span>
            <span class="font-medium">{{ count }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all"
              :class="getStatusBarColor(status as any)"
              :style="{ width: getStatusPercentage(count) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue by User Code -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Revenue by User Code</h3>
        <button
          @click="downloadPDF"
          :disabled="downloadingPDF"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
        >
          <Icon name="lucide:download" class="w-4 h-4 inline mr-2" />
          {{ downloadingPDF ? 'Downloading...' : 'Download PDF' }}
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">User Code</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Orders</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Revenue</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Share</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in salesReport?.revenueByUserCode" :key="item.userCode" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ item.userCode }}</td>
              <td class="px-4 py-3 text-sm text-right">{{ item.orders }}</td>
              <td class="px-4 py-3 text-sm text-right font-semibold">{{ formatCurrency(item.revenue) }}</td>
              <td class="px-4 py-3 text-sm text-right">
                {{ ((item.revenue / (salesReport?.totalRevenue || 1)) * 100).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Products -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-4">Top 10 Products</h3>
      <div v-if="loadingProducts" class="text-center py-8">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto text-gray-400" />
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Variant</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Qty Sold</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in topProducts" :key="product.variantId" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3 text-sm">{{ product.productName }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ product.variantName }}</td>
              <td class="px-4 py-3 text-sm text-right font-medium">{{ product.totalQuantity }}</td>
              <td class="px-4 py-3 text-sm text-right font-semibold">{{ formatCurrency(product.totalRevenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { SalesReport, TopProduct } from '~/composables/useReportsApi'
import { formatCurrency, getOrderStatusLabel } from '~/utils/helpers'

definePageMeta({
  layout: 'operator',
  middleware: 'role',
})

const reportsApi = useReportsApi()

const loading = ref(false)
const loadingProducts = ref(false)
const downloadingPDF = ref(false)
const salesReport = ref<SalesReport | null>(null)
const topProducts = ref<TopProduct[]>([])

const filters = reactive({
  startDate: '',
  endDate: '',
  userCode: '',
})

const avgOrderValue = computed(() => {
  if (!salesReport.value || salesReport.value.totalOrders === 0) return 0
  return salesReport.value.totalRevenue / salesReport.value.totalOrders
})

const getStatusPercentage = (count: number) => {
  if (!salesReport.value || salesReport.value.totalOrders === 0) return 0
  return (count / salesReport.value.totalOrders) * 100
}

const getStatusBarColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500',
    APPROVED_BY_ADMIN: 'bg-blue-500',
    DISETUJUI: 'bg-green-500',
    DIKEMAS: 'bg-purple-500',
    SEGERA_DIKIRIM: 'bg-indigo-500',
    SELESAI: 'bg-gray-500',
    DITOLAK: 'bg-red-500',
  }
  return colors[status] || 'bg-gray-400'
}

const loadReports = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    if (filters.userCode) params.userCode = filters.userCode

    const data = await reportsApi.getSalesReport(params)
    salesReport.value = data || null
  } catch (err) {
    console.error('Failed to load sales report:', err)
  } finally {
    loading.value = false
  }
}

const loadTopProducts = async () => {
  loadingProducts.value = true
  try {
    const params: any = { limit: 10 }
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate

    const data = await reportsApi.getTopProducts(params)
    topProducts.value = data || []
  } catch (err) {
    console.error('Failed to load top products:', err)
  } finally {
    loadingProducts.value = false
  }
}

const downloadPDF = async () => {
  downloadingPDF.value = true
  try {
    const params: any = {}
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    if (filters.userCode) params.userCode = filters.userCode

    const { downloadSalesReport } = useDownload()
    await downloadSalesReport(params)
  } catch (err) {
    console.error('Failed to download PDF:', err)
    alert('Gagal download PDF')
  } finally {
    downloadingPDF.value = false
  }
}

onMounted(() => {
  // Set default date range (last 30 days)
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  filters.endDate = today.toISOString().split('T')[0]
  filters.startDate = thirtyDaysAgo.toISOString().split('T')[0]
  
  loadReports()
  loadTopProducts()
})
</script>
