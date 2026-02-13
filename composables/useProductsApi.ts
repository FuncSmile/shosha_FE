import type {
  Product,
  ProductVariant,
  CreateProductDto,
  UpdateProductDto,
  CreateVariantDto,
  UpdateVariantDto,
} from '~/types'

export const useProductsApi = () => {
  const api = useApi()

  return {
    // Products
    getAllProducts: async (isActive?: boolean): Promise<Product[]> => {
      const query = isActive !== undefined ? `?isActive=${isActive}` : ''
      const response = await api.get<{ data: Product[] } | Product[]>(`/products${query}`)
      // Handle both paginated response {data: [...]} and direct array [...]
      if (response && 'data' in response) {
        return response.data
      }
      return (response as Product[]) || []
    },

    getProduct: (id: string) =>
      api.get<Product>(`/products/${id}`),

    createProduct: (data: CreateProductDto) =>
      api.post<Product>('/products', data),

    updateProduct: (id: string, data: UpdateProductDto) =>
      api.patch<Product>(`/products/${id}`, data),

    deleteProduct: (id: string) =>
      api.delete<Product>(`/products/${id}`),

    // Variants
    getAllVariants: (productId?: string) => {
      const query = productId ? `?productId=${productId}` : ''
      return api.get<ProductVariant[]>(`/products/variants/all${query}`)
    },

    getVariant: (id: string) =>
      api.get<ProductVariant>(`/products/variants/${id}`),

    createVariant: (data: CreateVariantDto) =>
      api.post<ProductVariant>('/products/variants', data),

    updateVariant: (id: string, data: UpdateVariantDto) =>
      api.patch<ProductVariant>(`/products/variants/${id}`, data),

    deleteVariant: (id: string) =>
      api.delete<ProductVariant>(`/products/variants/${id}`),
  }
}
