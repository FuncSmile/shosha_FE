<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="loadOrder" class="mt-2 text-red-600 hover:text-red-800 text-sm font-medium">
        Coba Lagi
      </button>
    </div>

    <!-- Order Content -->
    <div v-else-if="order" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
          <p class="text-sm text-gray-500 mt-1">{{ order.orderNumber }}</p>
        </div>
        <NuxtLink
          to="/buyer/orders"
          class="inline-flex items-center px-4 py-2 border-2 border-secondary-300 rounded-lg text-sm font-semibold text-secondary-700 bg-white hover:bg-secondary-50 hover:border-secondary-400 transition-colors shadow-sm"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
          Kembali
        </NuxtLink>
      </div>

      <!-- Status Banner -->
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Status Pesanan</p>
            <p class="mt-1">
              <span :class="getOrderStatusColor(order.status)" class="inline-flex px-3 py-1 text-sm font-medium rounded-full">
                {{ getOrderStatusLabel(order.status) }}
              </span>
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Total Pembayaran</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ formatCurrency(order.totalAmount) }}</p>
          </div>
        </div>
      </div>

      <!-- Order Info -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informasi Pesanan</h2>
        <dl class="grid grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Nomor Pesanan</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ order.orderNumber }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Tanggal</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(order.createdAt, true) }}</dd>
          </div>
          <div v-if="order.approvedAt">
            <dt class="text-sm font-medium text-gray-500">Disetujui</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(order.approvedAt, true) }}</dd>
          </div>
          <div v-if="order.invoicePrintedAt">
            <dt class="text-sm font-medium text-gray-500">Invoice Dicetak</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(order.invoicePrintedAt, true) }}</dd>
          </div>
        </dl>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Daftar Produk</h2>
        <div class="space-y-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between py-4 border-b last:border-b-0"
          >
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900">{{ item.productName }}</h3>
              <p class="text-sm text-gray-500">{{ item.variantName }}</p>
              <p class="text-xs text-gray-400 mt-1">SKU: {{ item.sku }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-900">{{ formatCurrency(item.pricePerUnit) }} x {{ item.quantity }}</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">{{ formatCurrency(item.subtotal) }}</p>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t flex justify-between items-center">
          <span class="text-base font-semibold text-gray-900">Total:</span>
          <span class="text-xl font-bold text-gray-900">{{ formatCurrency(order.totalAmount) }}</span>
        </div>
      </div>

      <!-- Order Timeline -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Status Pengiriman</h2>
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="
                order.status === 'PENDING' || order.status === 'DITOLAK' ? 'bg-yellow-100' : 'bg-green-100'
              ">
                <Icon 
                  :name="order.status === 'DITOLAK' ? 'lucide:x' : 'lucide:check'" 
                  class="w-4 h-4" 
                  :class="order.status === 'DITOLAK' ? 'text-red-600' : 'text-green-600'"
                />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Pesanan Diterima</p>
              <p class="text-xs text-gray-500">{{ formatDate(order.createdAt, true) }}</p>
            </div>
          </div>

          <div v-if="order.status !== 'PENDING' && order.status !== 'DITOLAK'" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Icon name="lucide:check" class="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Pesanan Disetujui</p>
              <p class="text-xs text-gray-500">{{ order.approvedAt ? formatDate(order.approvedAt, true) : '-' }}</p>
            </div>
          </div>

          <div v-if="order.status === 'DIKEMAS' || order.status === 'SEGERA_DIKIRIM' || order.status === 'SELESAI'" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon name="lucide:package" class="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Pesanan Sedang Dikemas</p>
              <p class="text-xs text-gray-500">Pesanan Anda sedang diproses</p>
            </div>
          </div>

          <div v-if="order.status === 'SEGERA_DIKIRIM' || order.status === 'SELESAI'" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Icon name="lucide:truck" class="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Siap Dikirim</p>
              <p class="text-xs text-gray-500">Pesanan siap untuk pengiriman</p>
            </div>
          </div>

          <div v-if="order.status === 'SELESAI'" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon name="lucide:check-circle" class="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Pesanan Selesai</p>
              <p class="text-xs text-gray-500">Terima kasih telah berbelanja</p>
            </div>
          </div>

          <div v-if="order.status === 'DITOLAK'" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Icon name="lucide:x-circle" class="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Pesanan Ditolak</p>
              <p class="text-xs text-gray-500">Silakan hubungi customer service</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments -->
      <div v-if="comments && comments.length > 0" class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Catatan & Komentar</h2>
        <div class="space-y-4">
          <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-900">{{ comment.user?.name || 'Admin' }}</span>
              <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt, true) }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '~/utils/helpers'
import type { Order, Comment } from '~/types'

definePageMeta({
  layout: 'buyer',
  middleware: 'role',
})

const route = useRoute()
const ordersApi = useOrdersApi()
const commentsApi = useCommentsApi()

const order = ref<Order | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const error = ref('')

const loadOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const orderId = route.params.id as string
    order.value = await ordersApi.getOrder(orderId)
    
    // Load comments
    try {
      const orderComments = await commentsApi.getCommentsForOrder(orderId)
      comments.value = orderComments || []
    } catch {
      // Comments are optional, don't fail if can't load
      comments.value = []
    }
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat detail pesanan'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrder()
})
</script>
