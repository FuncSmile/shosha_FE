export interface SalesReportParams {
  startDate?: string
  endDate?: string
  userCode?: string
}

export interface SalesReport {
  totalOrders: number
  totalRevenue: number
  ordersByStatus: Record<string, number>
  revenueByUserCode: Array<{
    userCode: string
    revenue: number
    orders: number
  }>
}

export interface TopProduct {
  productId: string
  productName: string
  variantId: string
  variantName: string
  totalQuantity: number
  totalRevenue: number
}

export const useReportsApi = () => {
  const api = useApi()

  return {
    // Get sales report
    getSalesReport: (params?: SalesReportParams) => {
      const queryParams = new URLSearchParams()
      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)
      if (params?.userCode) queryParams.append('userCode', params.userCode)
      const query = queryParams.toString() ? `?${queryParams.toString()}` : ''
      return api.get<SalesReport>(`/reports/sales${query}`)
    },

    // Get sales report PDF
    getSalesReportPdf: (params?: SalesReportParams) => {
      const queryParams = new URLSearchParams()
      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)
      if (params?.userCode) queryParams.append('userCode', params.userCode)
      const query = queryParams.toString() ? `?${queryParams.toString()}` : ''
      return api.get(`/reports/sales/pdf${query}`, { 
        responseType: 'blob' as any
      })
    },

    // Get top products
    getTopProducts: (params?: { limit?: number; startDate?: string; endDate?: string }) => {
      const queryParams = new URLSearchParams()
      if (params?.limit) queryParams.append('limit', String(params.limit))
      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)
      const query = queryParams.toString() ? `?${queryParams.toString()}` : ''
      return api.get<TopProduct[]>(`/reports/top-products${query}`)
    },
  }
}
