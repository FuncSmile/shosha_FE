import type {
  Pricing,
  SetPricingDto,
  BulkPricingDto,
  PricingWithProduct,
} from '~/types'

export const usePricingApi = () => {
  const api = useApi()

  return {
    setPricing: (data: SetPricingDto) =>
      api.post<Pricing>('/pricing', data),

    bulkSetPricing: (data: BulkPricingDto) =>
      api.post<{ count: number }>('/pricing/bulk', data),

    getPricingForVariant: (variantId: string) =>
      api.get<Pricing[]>(`/pricing/variant/${variantId}`),

    getPricingForUser: (variantId: string, userCode: string) =>
      api.get<Pricing>(`/pricing/variant/${variantId}/user/${userCode}`),

    getAllPricingsByUserCode: (userCode: string) =>
      api.get<PricingWithProduct[]>(`/pricing/user/${userCode}`),

    getMyPricing: () =>
      api.get<PricingWithProduct[]>('/pricing/my-pricing'),

    deletePricing: (variantId: string, userCode: string) =>
      api.delete(`/pricing/variant/${variantId}/user/${userCode}`),
  }
}
