import { UserRole, OrderStatus } from '~/types'

/**
 * Format currency to IDR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: string | Date, includeTime = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (includeTime) {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(dateObj)
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
  }).format(dateObj)
}

/**
 * Get user role label
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.OPERATOR]: 'Operator',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.PEMBELI]: 'Pembeli',
  }
  return labels[role] || role
}

/**
 * Get order status label
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Menunggu Persetujuan',
    [OrderStatus.APPROVED_BY_ADMIN]: 'Disetujui Admin',
    [OrderStatus.DISETUJUI]: 'Disetujui',
    [OrderStatus.DIKEMAS]: 'Sedang Dikemas',
    [OrderStatus.SEGERA_DIKIRIM]: 'Segera Dikirim',
    [OrderStatus.SELESAI]: 'Selesai',
    [OrderStatus.DITOLAK]: 'Ditolak',
  }
  return labels[status] || status
}

/**
 * Get order status color
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.APPROVED_BY_ADMIN]: 'bg-blue-100 text-blue-800',
    [OrderStatus.DISETUJUI]: 'bg-green-100 text-green-800',
    [OrderStatus.DIKEMAS]: 'bg-purple-100 text-purple-800',
    [OrderStatus.SEGERA_DIKIRIM]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.SELESAI]: 'bg-gray-100 text-gray-800',
    [OrderStatus.DITOLAK]: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD${year}${month}${day}${random}`
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    const context = this
    
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
