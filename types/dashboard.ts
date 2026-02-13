// Dashboard Types
import type { OrderStatus } from './index'

export interface ProductStockSummary {
  totalProducts: number
  activeProducts: number
  lowStockVariants: number
  outOfStockVariants: number
}

export interface OrderSummary {
  totalOrders: number
  pendingOrders: number
  approvedByAdminOrders: number
  approvedOrders: number
  processingOrders: number
  completedOrders: number
  rejectedOrders: number
}

export interface SalesSummary {
  todaySales: number
  weekSales: number
  monthSales: number
  totalRevenue: number
}

export interface RecentOrder {
  id: string
  buyerName: string
  userCode: string
  status: OrderStatus
  totalAmount: number
  itemCount: number
  createdAt: string
}

export interface TopProduct {
  productName: string
  variantName: string
  totalOrdered: number
  revenue: number
}

export interface OperatorDashboard {
  productStats: ProductStockSummary
  orderStats: OrderSummary
  salesStats: SalesSummary
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
  totalUsers: number
  activeUsers: number
}

export interface AdminOrderStats {
  pendingApproval: number
  approved: number
  rejected: number
  totalOrders: number
}

export interface AdminRecentOrder {
  id: string
  buyerName: string
  status: OrderStatus
  totalAmount: number
  itemCount: number
  createdAt: string
  needsApproval: boolean
}

export interface MonthlyOrderTrend {
  month: string
  orderCount: number
  totalAmount: number
}

export interface AdminDashboard {
  orderStats: AdminOrderStats
  recentOrders: AdminRecentOrder[]
  monthlyTrend: MonthlyOrderTrend[]
  userCode: string
  totalBuyers: number
}

export interface BuyerOrderStats {
  totalOrders: number
  pendingOrders: number
  approvedOrders: number
  completedOrders: number
  rejectedOrders: number
}

export interface BuyerRecentOrder {
  id: string
  status: OrderStatus
  totalAmount: number
  itemCount: number
  createdAt: string
}

export interface BuyerSpendingSummary {
  thisMonth: number
  lastMonth: number
  total: number
}

export interface BuyerDashboard {
  orderStats: BuyerOrderStats
  recentOrders: BuyerRecentOrder[]
  spending: BuyerSpendingSummary
  availableProducts: number
  userCode: string
}
