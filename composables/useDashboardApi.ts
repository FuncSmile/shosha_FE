import type { OperatorDashboard, AdminDashboard, BuyerDashboard } from '~/types'

export const useDashboardApi = () => {
  const api = useApi()

  return {
    // Operator dashboard
    getOperatorDashboard: () =>
      api.get<OperatorDashboard>('/dashboard/operator'),

    // Admin dashboard
    getAdminDashboard: () =>
      api.get<AdminDashboard>('/dashboard/admin'),

    // Buyer dashboard
    getBuyerDashboard: () =>
      api.get<BuyerDashboard>('/dashboard/buyer'),
  }
}
