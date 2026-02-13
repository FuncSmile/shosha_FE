<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
      <p class="mt-2 text-sm text-gray-600">
        Review dan checkout pesanan Anda
      </p>
    </div>

    <div v-if="cartStore.isEmpty" class="text-center py-12 bg-white rounded-lg shadow">
      <Icon name="lucide:shopping-cart" class="mx-auto h-16 w-16 text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">Keranjang kosong</h3>
      <p class="mt-2 text-sm text-gray-500">
        Mulai belanja untuk menambahkan produk ke keranjang
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/buyer/products"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Belanja Sekarang
        </NuxtLink>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Item ({{ cartStore.itemCount }})
            </h3>
          </div>
          <div class="divide-y divide-gray-200">
            <div
              v-for="item in cartStore.items"
              :key="item.variantId"
              class="p-6 flex items-start space-x-4"
            >
              <div class="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  v-if="item.variant.product.imageUrl"
                  :src="item.variant.product.imageUrl"
                  :alt="item.productName"
                  class="w-full h-full object-cover"
                />
                <div v-else class="flex items-center justify-center h-full">
                  <Icon name="lucide:image" class="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900">{{ item.productName }}</h4>
                <p class="mt-1 text-sm text-gray-500">{{ item.variantName }}</p>
                <p class="mt-1 text-sm text-gray-500">SKU: {{ item.sku }}</p>
                <p class="mt-2 text-lg font-semibold text-primary-600">
                  {{ formatCurrency(item.pricePerUnit) }}
                </p>
              </div>
              <div class="flex-shrink-0 flex items-center space-x-4">
                <div class="flex items-center border border-gray-300 rounded-md">
                  <button
                    @click="updateQuantity(item.variantId, item.quantity - 1)"
                    class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    :value="item.quantity"
                    @input="updateQuantity(item.variantId, Number(($event.target as HTMLInputElement)?.value))"
                    type="number"
                    min="1"
                    :max="item.variant.stock"
                    class="w-16 px-2 py-1 text-center border-x border-gray-300 focus:outline-none"
                  />
                  <button
                    @click="updateQuantity(item.variantId, item.quantity + 1)"
                    :disabled="item.quantity >= item.variant.stock"
                    class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  @click="removeItem(item.variantId)"
                  class="text-red-600 hover:text-red-900"
                >
                  <Icon name="lucide:trash-2" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg overflow-hidden sticky top-8">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Ringkasan Pesanan
            </h3>
          </div>
          <div class="px-4 py-5 sm:p-6 space-y-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(cartStore.totalAmount) }}</span>
            </div>
            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between text-base font-semibold">
                <span class="text-gray-900">Total</span>
                <span class="text-primary-600">{{ formatCurrency(cartStore.totalAmount) }}</span>
              </div>
            </div>
            <button
              @click="handleCheckout"
              :disabled="processing"
              class="w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ processing ? 'Memproses...' : 'Checkout' }}
            </button>
            <NuxtLink
              to="/buyer/products"
              class="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Lanjut Belanja
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils/helpers'

definePageMeta({
  layout: 'buyer',
  middleware: ['role'],
})

const cartStore = useCartStore()
const ordersApi = useOrdersApi()
const router = useRouter()

const processing = ref(false)

const updateQuantity = (variantId: string, quantity: number) => {
  if (quantity < 1) return
  cartStore.updateQuantity(variantId, quantity)
}

const removeItem = (variantId: string) => {
  if (confirm('Hapus item dari keranjang?')) {
    cartStore.removeItem(variantId)
  }
}

const handleCheckout = async () => {
  if (processing.value || cartStore.isEmpty) return

  processing.value = true

  try {
    const order = await ordersApi.createOrder({
      items: cartStore.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    })

    if (order) {
      cartStore.clear()
      router.push(`/buyer/orders/${order.id}`)
    }
  } catch (error: any) {
    alert(error.message || 'Gagal membuat pesanan. Silakan coba lagi.')
  } finally {
    processing.value = false
  }
}
</script>
