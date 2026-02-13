import { defineStore } from 'pinia'
import type { Order } from '~/types'

interface CartItem {
  id: string
  orderId: string
  variantId: string
  productName: string
  variantName: string
  sku: string
  pricePerUnit: number
  quantity: number
  subtotal: number
  createdAt: string
  updatedAt: string
  variant: {
    id: string
    name: string
    sku: string
    stock: number
    product: {
      name: string
      imageUrl: string | null
    }
  }
}

interface CartState {
  items: CartItem[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    totalAmount: (state) => state.items.reduce((sum, item) => sum + item.subtotal, 0),

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addItem(item: Omit<CartItem, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>) {
      const existingItem = this.items.find(i => i.variantId === item.variantId)

      if (existingItem) {
        existingItem.quantity += item.quantity
        existingItem.subtotal = existingItem.quantity * existingItem.pricePerUnit
      } else {
        this.items.push({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          orderId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      this.saveToStorage()
    },

    updateQuantity(variantId: string, quantity: number) {
      const item = this.items.find(i => i.variantId === variantId)
      
      if (item) {
        if (quantity <= 0) {
          this.removeItem(variantId)
        } else {
          item.quantity = quantity
          item.subtotal = item.quantity * item.pricePerUnit
          this.saveToStorage()
        }
      }
    },

    removeItem(variantId: string) {
      this.items = this.items.filter(i => i.variantId !== variantId)
      this.saveToStorage()
    },

    clear() {
      this.items = []
      this.saveToStorage()
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadFromStorage() {
      if (process.client) {
        const cartStr = localStorage.getItem('cart')
        if (cartStr) {
          try {
            this.items = JSON.parse(cartStr)
          } catch (error) {
            console.error('Failed to load cart from storage:', error)
            this.items = []
          }
        }
      }
    },
  },
})
