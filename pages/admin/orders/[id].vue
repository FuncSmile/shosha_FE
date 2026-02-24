<template>
  <div class="max-w-5xl mx-auto">
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
        <div class="flex items-center space-x-3">
          <button
            v-if="order.status === 'PENDING' && !isEditing"
            @click="startEditing"
            class="inline-flex items-center px-4 py-2 border-2 border-primary-300 rounded-lg text-sm font-semibold text-primary-700 bg-white hover:bg-primary-50 hover:border-primary-400 transition-colors shadow-sm"
          >
            <Icon name="lucide:edit" class="w-4 h-4 mr-2" />
            Edit Pesanan
          </button>
          <NuxtLink
            v-if="!isEditing"
            to="/admin/orders"
            class="inline-flex items-center px-4 py-2 border-2 border-secondary-300 rounded-lg text-sm font-semibold text-secondary-700 bg-white hover:bg-secondary-50 hover:border-secondary-400 transition-colors shadow-sm"
          >
            <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Order Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Summary -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informasi Pesanan</h2>
            <dl class="grid grid-cols-2 gap-4">
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
                <dt class="text-sm font-medium text-gray-500">Tanggal</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(order.createdAt, true) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Total</dt>
                <dd class="mt-1 text-sm font-semibold text-gray-900">
                  <span :class="{ 'text-primary-600 font-bold': isEditing && hasChanges }">
                    {{ formatCurrency(isEditing ? currentTotal : order.totalAmount) }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Order Items -->
          <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div class="p-6 border-b flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Daftar Item</h2>
              <span v-if="isEditing" class="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded-full animate-pulse">
                Mode Edit
              </span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    <th v-if="isEditing" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(item, index) in (isEditing ? editItems : order.items)" :key="item.id || index">
                    <td class="px-4 py-3">
                      <div class="text-sm font-medium text-gray-900">{{ item.productName }}</div>
                      <div class="text-sm text-gray-500">{{ item.variantName }}</div>
                      <div class="text-xs text-gray-400 font-mono">{{ item.sku }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-right whitespace-nowrap">{{ formatCurrency(item.pricePerUnit) }}</td>
                    <td class="px-4 py-3 text-sm text-center">
                      <div v-if="isEditing" class="flex items-center justify-center space-x-1">
                        <button 
                          @click="updateQty(index, -1)" 
                          type="button"
                          class="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                        >
                          <Icon name="lucide:minus" class="w-3 h-3" />
                        </button>
                        <input 
                          v-model.number="item.quantity" 
                          type="number" 
                          min="1"
                          class="w-16 h-8 text-center border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                        />
                        <button 
                          @click="updateQty(index, 1)" 
                          type="button"
                          class="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                        >
                          <Icon name="lucide:plus" class="w-3 h-3" />
                        </button>
                      </div>
                      <span v-else>{{ item.quantity }}</span>
                    </td>
                    <td class="px-4 py-3 text-sm font-medium text-right whitespace-nowrap">
                      {{ formatCurrency(isEditing ? (item.pricePerUnit * item.quantity) : item.subtotal) }}
                    </td>
                    <td v-if="isEditing" class="px-4 py-3 text-right">
                      <button 
                        @click="removeItem(index)" 
                        type="button"
                        class="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                        title="Hapus Item"
                      >
                        <Icon name="lucide:trash-2" class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-4 py-3 text-sm font-semibold text-right">Total:</td>
                    <td class="px-4 py-3 text-sm font-bold text-right text-gray-900 whitespace-nowrap">
                      {{ formatCurrency(isEditing ? currentTotal : order.totalAmount) }}
                    </td>
                    <td v-if="isEditing"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <!-- Edit Mode Actions -->
            <div v-if="isEditing" class="p-6 bg-primary-50 border-t space-y-4">
              <div>
                <label class="block text-sm font-medium text-primary-900 mb-1">
                  Alasan Perubahan <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="editComment"
                  rows="2"
                  placeholder="Berikan alasan mengapa pesanan diedit..."
                  class="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                ></textarea>
                <p v-if="editCommentError" class="mt-1 text-xs text-red-600 font-medium">
                  Alasan perubahan wajib diisi
                </p>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  @click="cancelEditing"
                  class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Batal
                </button>
                <button
                  @click="saveChanges"
                  :disabled="savingChanges || editItems.length === 0"
                  class="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm inline-flex items-center"
                >
                  <Icon v-if="savingChanges" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>

          <!-- Comments -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Komentar</h2>
            
            <!-- Add Comment Form -->
            <form @submit.prevent="submitComment" class="mb-6">
              <textarea
                v-model="newComment"
                rows="3"
                placeholder="Tambahkan catatan..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button
                  type="submit"
                  :disabled="!newComment.trim() || submittingComment"
                  class="px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 shadow-sm"
                >
                  {{ submittingComment ? 'Mengirim...' : 'Kirim' }}
                </button>
              </div>
            </form>

            <!-- Comments List -->
            <div class="space-y-4">
              <div v-if="!comments || comments.length === 0" class="text-center py-6 text-gray-500">
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
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-gray-900">{{ comment.user?.name || 'User' }}</span>
                      <span v-if="comment.user?.role === 'ADMIN'" class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">ADMIN</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt, true) }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="space-y-6">
          <!-- Admin Actions -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Aksi Admin</h2>
            <div class="space-y-3">
              <button
                v-if="order.status === 'PENDING' && !order.approvedByAdmin && !isEditing"
                @click="approveOrder"
                :disabled="updatingStatus"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 shadow-sm"
              >
                <Icon name="lucide:check" class="w-4 h-4 mr-2" />
                Setujui
              </button>

              <button
                v-if="order.status === 'PENDING' && !isEditing"
                @click="rejectOrder"
                :disabled="updatingStatus"
                class="w-full inline-flex justify-center items-center px-4 py-2 border-2 border-red-600 text-sm font-semibold rounded-lg text-red-700 bg-white hover:bg-red-50 hover:border-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Icon name="lucide:x" class="w-4 h-4 mr-2" />
                Tolak
              </button>

              <div v-if="order.approvedByAdmin" class="text-center py-4 bg-green-50 rounded-lg border border-green-100">
                <Icon name="lucide:check-circle" class="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p class="text-sm font-medium text-green-800">Pesanan sudah disetujui</p>
              </div>

              <div v-if="isEditing" class="p-4 bg-yellow-50 rounded-lg border border-yellow-100 italic text-sm text-yellow-800">
                Selesaikan pengeditan atau batalkan untuk melakukan aksi approval/reject.
              </div>
            </div>
          </div>

          <!-- Order Timeline -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Riwayat</h2>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Pesanan Dibuat</p>
                  <p class="text-xs text-gray-500">{{ formatDate(order.createdAt, true) }}</p>
                </div>
              </div>

              <div v-if="order.approvedByAdmin" class="flex items-start space-x-3">
                <div class="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Disetujui Admin</p>
                  <p class="text-xs text-gray-500">{{ order.approvedAt ? formatDate(order.approvedAt, true) : '-' }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 mt-2 rounded-full" :class="{
                  'bg-gray-400': order.status === 'SELESAI',
                  'bg-red-500': order.status === 'DITOLAK',
                  'bg-green-500': order.status !== 'PENDING' && order.status !== 'DITOLAK'
                }"></div>
                <div>
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
import type { Order, Comment, OrderItem, EditOrderDto } from '~/types'
import { OrderStatus } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'role',
})

const route = useRoute()
const authStore = useAuthStore()
const ordersApi = useOrdersApi()
const commentsApi = useCommentsApi()

const toast = useToast()

const order = ref<Order | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const error = ref('')
const updatingStatus = ref(false)
const newComment = ref('')
const submittingComment = ref(false)

// Edit logic
const isEditing = ref(false)
const editItems = ref<OrderItem[]>([])
const editComment = ref('')
const editCommentError = ref(false)
const savingChanges = ref(false)

const currentTotal = computed(() => {
  return editItems.value.reduce((total, item) => total + (item.pricePerUnit * item.quantity), 0)
})

const hasChanges = computed(() => {
  if (!order.value?.items) return false
  if (editItems.value.length !== order.value.items.length) return true
  
  return editItems.value.some((item, index) => {
    const original = order.value!.items![index]
    return item.quantity !== original.quantity || item.variantId !== original.variantId
  })
})

const startEditing = () => {
  if (!order.value?.items) return
  isEditing.value = true
  // Deep clone items
  editItems.value = JSON.parse(JSON.stringify(order.value.items))
  editComment.value = ''
  editCommentError.value = false
}

const cancelEditing = () => {
  isEditing.value = false
  editItems.value = []
  editComment.value = ''
  editCommentError.value = false
}

const updateQty = (index: number, delta: number) => {
  const newQty = editItems.value[index].quantity + delta
  if (newQty >= 1) {
    editItems.value[index].quantity = newQty
  }
}

const removeItem = (index: number) => {
  if (editItems.value.length <= 1) {
    toast.error('Pesanan harus memiliki minimal satu item.', 'Error')
    return
  }
  editItems.value.splice(index, 1)
}

const saveChanges = async () => {
  if (!editComment.value.trim()) {
    editCommentError.value = true
    return
  }

  savingChanges.value = true
  try {
    const data: EditOrderDto = {
      items: editItems.value.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      })),
      notes: editComment.value.trim()
    }

    await ordersApi.editOrder(order.value!.id, data)
    toast.success('Pesanan berhasil diperbarui', 'Berhasil')
    isEditing.value = false
    await loadOrder()
  } catch (err: any) {
    toast.error(err.message || 'Gagal memperbarui pesanan', 'Gagal')
  } finally {
    savingChanges.value = false
  }
}

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

const approveOrder = async () => {
  if (!confirm('Yakin ingin menyetujui pesanan ini?')) return
  
  updatingStatus.value = true
  try {
    await ordersApi.updateOrderStatus(order.value!.id, { 
      status: OrderStatus.APPROVED_BY_ADMIN
    })
    await loadOrder()
    toast.success('Pesanan berhasil disetujui', 'Berhasil')
  } catch (err: any) {
    toast.error(err.message || 'Gagal menyetujui pesanan', 'Gagal')
  } finally {
    updatingStatus.value = false
  }
}

const rejectOrder = async () => {
  const reason = prompt('Alasan penolakan:')
  if (!reason) return
  
  updatingStatus.value = true
  try {
    await ordersApi.updateOrderStatus(order.value!.id, { 
      status: OrderStatus.DITOLAK
    })
    
    await commentsApi.createComment({
      orderId: order.value!.id,
      content: `Pesanan ditolak oleh Admin. Alasan: ${reason}`
    })
    
    await loadOrder()
    toast.success('Pesanan berhasil ditolak', 'Berhasil')
  } catch (err: any) {
    toast.error(err.message || 'Gagal menolak pesanan', 'Gagal')
  } finally {
    updatingStatus.value = false
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
