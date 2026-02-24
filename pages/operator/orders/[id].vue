<template>
  <div class="max-w-7xl mx-auto">
    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Memuat detail pesanan..." />

    <!-- Error State -->
    <AlertMessage
      v-else-if="error"
      type="error"
      title="Terjadi Kesalahan"
      :message="error"
      :retryable="true"
      @retry="loadOrder"
    />

    <!-- Order Content -->
    <div v-else-if="order" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
          <p class="text-sm text-gray-500 mt-1">{{ order.orderNumber }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="order.status !== 'PENDING' && order.status !== 'DITOLAK'"
            @click="printInvoice"
            :disabled="printing"
            class="inline-flex items-center px-4 py-2 border-2 border-primary-100 rounded-lg text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 hover:border-primary-200 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Icon name="lucide:printer" class="w-4 h-4 mr-2" />
            {{ printing ? 'Memproses...' : (order.invoicePrintedAt ? 'Cetak Ulang' : 'Cetak Invoice') }}
          </button>
          <NuxtLink
            to="/operator/orders"
            class="inline-flex items-center px-4 py-2 border-2 border-secondary-300 rounded-lg text-sm font-semibold text-secondary-700 bg-white hover:bg-secondary-50 hover:border-secondary-400 transition-colors shadow-sm"
          >
            <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Order Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Summary -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informasi Pesanan</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Nomor Pesanan</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ order.orderNumber }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <span :class="getOrderStatusColor(order.status)" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                    {{ getOrderStatusLabel(order.status) }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Pembeli</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ order.buyer?.name || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Kode User</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ order.buyerUserCode }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Tanggal Pesanan</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(order.createdAt, true) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Total</dt>
                <dd class="mt-1 text-sm font-semibold text-gray-900">{{ formatCurrency(order.totalAmount) }}</dd>
              </div>
              <div v-if="order.approvedAt">
                <dt class="text-sm font-medium text-gray-500">Disetujui Pada</dt>
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
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Daftar Item</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in order.items" :key="item.id">
                    <td class="px-4 py-3">
                      <div class="text-sm font-medium text-gray-900">{{ item.productName }}</div>
                      <div class="text-sm text-gray-500">{{ item.variantName }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ item.sku }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{{ formatCurrency(item.pricePerUnit) }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-center">{{ item.quantity }}</td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">{{ formatCurrency(item.subtotal) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="4" class="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Total:</td>
                    <td class="px-4 py-3 text-sm font-bold text-gray-900 text-right">{{ formatCurrency(order.totalAmount) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Comments -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Komentar & Catatan</h2>
            
            <!-- Add Comment Form -->
            <form @submit.prevent="submitComment" class="mb-6">
              <textarea
                v-model="newComment"
                rows="3"
                placeholder="Tambahkan catatan atau komentar..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button
                  type="submit"
                  :disabled="!newComment.trim() || submittingComment"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {{ submittingComment ? 'Mengirim...' : 'Kirim Komentar' }}
                </button>
              </div>
            </form>

            <!-- Comments List -->
            <div class="space-y-4">
              <div v-if="!comments || comments.length === 0" class="text-center py-8 text-gray-500">
                Belum ada komentar
              </div>
              <div v-for="comment in comments" :key="comment.id" class="flex space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Icon name="lucide:user" class="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div class="flex-1 bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-gray-900">{{ comment.user?.name || 'User' }}</span>
                    <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt, true) }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Actions & Audit -->
        <div class="space-y-6">
          <!-- Status Actions -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Aksi</h2>
            <div class="space-y-3">
              <button
                v-if="order.status === 'APPROVED_BY_ADMIN' && order.approvedByAdmin"
                @click="approveOrder"
                :disabled="updatingStatus"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Icon name="lucide:check" class="w-4 h-4 mr-2" />
                Setujui Pesanan
              </button>

              <button
                v-if="order.status === 'DISETUJUI'"
                @click="updateStatus(OrderStatus.DIKEMAS)"
                :disabled="updatingStatus"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Icon name="lucide:package" class="w-4 h-4 mr-2" />
                Mulai Kemas
              </button>

              <button
                v-if="order.status === 'DIKEMAS'"
                @click="updateStatus(OrderStatus.SEGERA_DIKIRIM)"
                :disabled="updatingStatus"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Icon name="lucide:truck" class="w-4 h-4 mr-2" />
                Siap Kirim
              </button>

              <button
                v-if="order.status === 'SEGERA_DIKIRIM'"
                @click="updateStatus(OrderStatus.SELESAI)"
                :disabled="updatingStatus"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                <Icon name="lucide:check-circle" class="w-4 h-4 mr-2" />
                Selesai
              </button>

              <button
                v-if="!['SELESAI', 'DITOLAK'].includes(order.status)"
                @click="rejectOrder"
                :disabled="updatingStatus"
                class="w-full inline-flex justify-center items-center px-4 py-2 border-2 border-red-600 text-sm font-semibold rounded-lg text-red-700 bg-white hover:bg-red-50 hover:border-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                <Icon name="lucide:x" class="w-4 h-4 mr-2" />
                Tolak Pesanan
              </button>
            </div>
          </div>

          <!-- Audit Log -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Riwayat Status</h2>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Pesanan Dibuat</p>
                  <p class="text-xs text-gray-500">{{ formatDate(order.createdAt, true) }}</p>
                </div>
              </div>

              <div v-if="order.approvedByAdmin && order.approvedAt" class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Disetujui Admin</p>
                  <p class="text-xs text-gray-500">{{ formatDate(order.approvedAt, true) }}</p>
                </div>
              </div>

              <div v-if="order.approvedByOperator && order.approvedAt" class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Disetujui Operator</p>
                  <p class="text-xs text-gray-500">{{ formatDate(order.approvedAt, true) }}</p>
                </div>
              </div>

              <div v-if="order.invoicePrintedAt" class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Invoice Dicetak</p>
                  <p class="text-xs text-gray-500">{{ formatDate(order.invoicePrintedAt, true) }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full" :class="{
                  'bg-gray-400': order.status === 'SELESAI',
                  'bg-red-500': order.status === 'DITOLAK',
                  'bg-indigo-500': order.status === 'SEGERA_DIKIRIM',
                  'bg-purple-500': order.status === 'DIKEMAS',
                  'bg-green-500': order.status === 'DISETUJUI'
                }"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ getOrderStatusLabel(order.status) }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(order.updatedAt, true) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '~/utils/helpers'
import type { Order, Comment } from '~/types'
import { OrderStatus } from '~/types'

definePageMeta({
  layout: 'operator',
  middleware: 'role',
})

const route = useRoute()
const ordersApi = useOrdersApi()
const commentsApi = useCommentsApi()

const toast = useToast()

const order = ref<Order | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const error = ref('')
const updatingStatus = ref(false)
const printing = ref(false)
const newComment = ref('')
const submittingComment = ref(false)

const loadOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const orderId = route.params.id as string
    order.value = await ordersApi.getOrder(orderId)
    
    // Load comments
    const orderComments = await commentsApi.getCommentsForOrder(orderId)
    comments.value = orderComments || []
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat detail pesanan'
  } finally {
    loading.value = false
  }
}

const updateStatus = async (status: OrderStatus) => {
  if (!confirm(`Yakin ingin mengubah status pesanan menjadi "${getOrderStatusLabel(status)}"?`)) return
  
  updatingStatus.value = true
  try {
    await ordersApi.updateOrderStatus(order.value!.id, { status })
    await loadOrder()
    toast.success('Status pesanan berhasil diperbarui', 'Berhasil')
  } catch (err: any) {
    toast.error(err.message || 'Gagal mengubah status pesanan', 'Gagal')
  } finally {
    updatingStatus.value = false
  }
}

const approveOrder = async () => {
  await updateStatus(OrderStatus.DISETUJUI)
}

const rejectOrder = async () => {
  const reason = prompt('Alasan penolakan:')
  if (!reason) return
  
  updatingStatus.value = true
  try {
    await ordersApi.updateOrderStatus(order.value!.id, { status: OrderStatus.DITOLAK })
    
    // Add rejection comment
    await commentsApi.createComment({
      orderId: order.value!.id,
      content: `Pesanan ditolak. Alasan: ${reason}`
    })
    
    await loadOrder()
    toast.success('Pesanan berhasil ditolak', 'Berhasil')
  } catch (err: any) {
    toast.error(err.message || 'Gagal menolak pesanan', 'Gagal')
  } finally {
    updatingStatus.value = false
  }
}

const printInvoice = async () => {
  printing.value = true
  try {
    const { downloadInvoice } = useDownload()
    await downloadInvoice(order.value!.id)
    
    // Mark invoice as printed
    await ordersApi.printInvoice(order.value!.id)
    await loadOrder()
    toast.success('Invoice berhasil diunduh', 'Berhasil')
  } catch (err: any) {
    toast.error(err.message || 'Gagal mengunduh invoice', 'Gagal')
  } finally {
    printing.value = false
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  submittingComment.value = true
  try {
    await commentsApi.createComment({
      orderId: order.value!.id,
      content: newComment.value.trim()
    })
    
    newComment.value = ''
    
    // Reload comments
    const orderComments = await commentsApi.getCommentsForOrder(order.value!.id)
    comments.value = orderComments || []
    toast.success('Komentar berhasil ditambahkan', 'Berhasil')
  } catch (err: any) {
    toast.error(err.message || 'Gagal mengirim komentar', 'Gagal')
  } finally {
    submittingComment.value = false
  }
}

onMounted(() => {
  loadOrder()
})
</script>
