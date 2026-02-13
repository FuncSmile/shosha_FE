import type { UseFetchOptions } from 'nuxt/app'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = async <T = any>(
    endpoint: string,
    options: any = {}
  ) => {
    const token = authStore.token

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    try {
      const response = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers,
      })

      return response
    } catch (err: any) {
      console.error('API Error:', err)
      throw err
    }
  }

  return {
    get: <T = any>(endpoint: string, options?: any) =>
      apiFetch<T>(endpoint, { ...options, method: 'GET' }),

    post: <T = any>(endpoint: string, body?: any, options?: any) =>
      apiFetch<T>(endpoint, { ...options, method: 'POST', body }),

    put: <T = any>(endpoint: string, body?: any, options?: any) =>
      apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),

    patch: <T = any>(endpoint: string, body?: any, options?: any) =>
      apiFetch<T>(endpoint, { ...options, method: 'PATCH', body }),

    delete: <T = any>(endpoint: string, options?: any) =>
      apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
  }
}
