<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Manajemen Harga</h1>
      <p class="mt-1 text-sm text-gray-500">Atur harga produk per user code</p>
    </div>

    <!-- User Code Selection -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Pilih User Code</label>
      <select
        v-model="selectedUserCode"
        @change="loadPricing"
        class="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">-- Pilih User Code --</option>
        <option value="SHOSHA">SHOSHA</option>
        <option value="L24J">L24J</option>
      </select>
    </div>

    <!-- Pricing List -->
    <div v-if="selectedUserCode" class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b flex items-center justify-between">
        <h3 class="text-lg font-semibold">Daftar Harga - {{ selectedUserCode }}</h3>
        <button
          @click="showBulkModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <Icon name="lucide:upload" class="w-4 h-4 inline mr-2" />
          Set Bulk Pricing
        </button>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Memuat data...</p>
      </div>

      <div v-else-if="pricingList.length === 0" class="p-8 text-center">
        <Icon name="lucide:tag" class="w-12 h-12 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Belum ada harga yang diatur</p>
        <p class="text-sm text-gray-400 mt-1">Klik "Set Bulk Pricing" untuk mengatur harga</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="pricing in pricingList" :key="pricing.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ pricing.variant?.product?.name || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500">{{ pricing.variant?.name || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 font-mono">{{ pricing.variant?.sku || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="text-sm font-semibold text-gray-900">
                  {{ formatCurrency(pricing.price) }}
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="editPricing(pricing)"
                  class="text-primary-700 hover:text-primary-900 hover:bg-primary-50 rounded p-1 mr-3 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                >
                  <Icon name="lucide:edit" class="w-5 h-5" />
                </button>
                <button
                  @click="deletePricing(pricing)"
                  class="text-red-700 hover:text-red-900 hover:bg-red-50 rounded p-1 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  <Icon name="lucide:trash-2" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Pricing Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Edit Harga</h3>

        <form @submit.prevent="handleUpdate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Produk</label>
            <p class="text-sm text-gray-900">{{ editForm.productName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Variant</label>
            <p class="text-sm text-gray-900">{{ editForm.variantName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Harga Baru</label>
            <input
              v-model.number="editForm.price"
              required
              type="number"
              min="0"
              step="1000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 px-4 py-2 border-2 border-secondary-300 text-secondary-700 font-semibold rounded-lg hover:bg-secondary-50 hover:border-secondary-400 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 shadow-sm bg-white"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bulk Pricing Modal -->
    <div v-if="showBulkModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
        <h3 class="text-lg font-semibold mb-4">Set Bulk Pricing - {{ selectedUserCode }}</h3>

        <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-700">
            <Icon name="lucide:info" class="w-4 h-4 inline mr-1" />
            Atur harga untuk semua variant. Kosongkan jika tidak ingin mengubah harga variant tersebut.
          </p>
        </div>

        <div class="max-h-96 overflow-y-auto border rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="variant in allVariants" :key="variant.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">{{ variant.product?.name || 'N/A' }}</td>
                <td class="px-4 py-3 text-sm">{{ variant.name }}</td>
                <td class="px-4 py-3 text-sm font-mono">{{ variant.sku }}</td>
                <td class="px-4 py-3 text-right">
                  <input
                    v-model.number="bulkPricing[variant.id]"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Harga..."
                    class="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="button"
            @click="closeBulkModal"
            class="flex-1 px-4 py-2 border-2 border-secondary-300 text-secondary-700 font-semibold rounded-lg hover:bg-secondary-50 hover:border-secondary-400 shadow-sm bg-white"
          >
            Batal
          </button>
          <button
            @click="handleBulkUpdate"
            :disabled="submitting"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {{ submitting ? 'Menyimpan...' : 'Simpan Semua' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { PricingWithProduct, ProductVariant, SetPricingDto } from '~/types'
import { formatCurrency } from '~/utils/helpers'

definePageMeta({
  layout: 'operator',
  middleware: 'role',
})

const pricingApi = usePricingApi()
const productsApi = useProductsApi()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const selectedUserCode = ref('')
const pricingList = ref<PricingWithProduct[]>([])
const allVariants = ref<ProductVariant[]>([])
const showEditModal = ref(false)
const showBulkModal = ref(false)
const bulkPricing = reactive<Record<string, number>>({})

const editForm = reactive({
  variantId: '',
  productName: '',
  variantName: '',
  price: 0,
})

const loadPricing = async () => {
  if (!selectedUserCode.value) return
  
  loading.value = true
  try {
    const data = await pricingApi.getAllPricingsByUserCode(selectedUserCode.value)
    pricingList.value = data || []
  } catch (err) {
    console.error('Failed to load pricing:', err)
  } finally {
    loading.value = false
  }
}

const loadAllVariants = async () => {
  try {
    const data = await productsApi.getAllVariants()
    allVariants.value = data || []
  } catch (err) {
    console.error('Failed to load variants:', err)
  }
}

const editPricing = (pricing: PricingWithProduct) => {
  editForm.variantId = pricing.variantId
  editForm.productName = pricing.variant?.product?.name || 'N/A'
  editForm.variantName = pricing.variant?.name || 'N/A'
  editForm.price = pricing.price
  showEditModal.value = true
}

const handleUpdate = async () => {
  if (!selectedUserCode.value) return
  
  submitting.value = true
  error.value = ''
  try {
    await pricingApi.setPricing({
      variantId: editForm.variantId,
      userCode: selectedUserCode.value,
      price: editForm.price,
    })
    closeEditModal()
    await loadPricing()
  } catch (err: any) {
    error.value = err.message || 'Gagal update harga'
  } finally {
    submitting.value = false
  }
}

const deletePricing = async (pricing: PricingWithProduct) => {
  if (!confirm('Hapus harga ini?')) return
  
  try {
    await pricingApi.deletePricing(pricing.variantId, pricing.userCode)
    await loadPricing()
  } catch (err) {
    alert('Gagal menghapus harga')
  }
}

const handleBulkUpdate = async () => {
  if (!selectedUserCode.value) return
  
  const items: SetPricingDto[] = []
  Object.entries(bulkPricing).forEach(([variantId, price]) => {
    if (price && price > 0) {
      items.push({
        variantId,
        userCode: selectedUserCode.value,
        price,
      })
    }
  })

  if (items.length === 0) {
    error.value = 'Masukkan minimal 1 harga'
    return
  }

  submitting.value = true
  error.value = ''
  try {
    await pricingApi.bulkSetPricing({ pricings: items })
    closeBulkModal()
    await loadPricing()
  } catch (err: any) {
    error.value = err.message || 'Gagal set bulk pricing'
  } finally {
    submitting.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  error.value = ''
}

const closeBulkModal = () => {
  showBulkModal.value = false
  error.value = ''
  Object.keys(bulkPricing).forEach(key => delete bulkPricing[key])
}

onMounted(() => {
  loadAllVariants()
})
</script>
