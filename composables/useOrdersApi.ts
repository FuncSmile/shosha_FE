import type {
  Order,
  CreateOrderDto,
  UpdateOrderStatusDto,
  EditOrderDto,
  OrderStatus,
  AuditLog,
} from '~/types'

export const useOrdersApi = () => {
  const api = useApi()

  return {
    createOrder: (data: CreateOrderDto) =>
      api.post<Order>('/orders', data),

    getAllOrders: async () => {
      const response = await api.get<Order[] | { data: Order[], meta: any }>('/orders')
      // Handle both direct array and paginated response
      if (response && typeof response === 'object' && 'data' in response) {
        return response.data
      }
      return response as Order[]
    },

    getOrdersByStatus: (status: OrderStatus) =>
      api.get<Order[]>(`/orders/status/${status}`),

    getOrder: (id: string) =>
      api.get<Order>(`/orders/${id}`),

    updateOrderStatus: (id: string, data: UpdateOrderStatusDto) =>
      api.patch<Order>(`/orders/${id}/status`, data),

    editOrder: (id: string, data: EditOrderDto) =>
      api.put<Order>(`/orders/${id}/edit`, data),

    getAuditLogs: (id: string) =>
      api.get<AuditLog[]>(`/orders/${id}/audit-logs`),

    printInvoice: (id: string) =>
      api.post(`/orders/${id}/print-invoice`),

    downloadInvoice: (id: string) =>
      api.get(`/orders/${id}/download-invoice`, {
        responseType: 'blob' as any,
      }),
  }
}
