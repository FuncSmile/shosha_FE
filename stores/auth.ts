import { defineStore } from 'pinia'
import type { User, LoginDto, AuthResponse } from '~/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    isOperator: (state) => state.user?.role === 'OPERATOR',
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isPembeli: (state) => state.user?.role === 'PEMBELI',
    userCode: (state) => state.user?.userCode || null,
  },

  actions: {
    async login(credentials: LoginDto) {
      try {
        const authApi = useAuthApi()
        const response = await authApi.login(credentials) as AuthResponse

        if (response) {
          this.user = response.user
          this.token = response.accessToken
          this.isAuthenticated = true

          // Save to localStorage
          if (process.client) {
            localStorage.setItem('token', response.accessToken)
            localStorage.setItem('user', JSON.stringify(response.user))
          }

          return response
        }
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    },

    async loadFromStorage() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          try {
            this.token = token
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true

            // Verify token is still valid
            const authApi = useAuthApi()
            const user = await authApi.getProfile() as User
            
            if (user) {
              this.user = user
              localStorage.setItem('user', JSON.stringify(user))
            }
          } catch (error) {
            console.error('Failed to load auth from storage:', error)
            this.logout()
          }
        }
      }
    },

    setAuth(auth: AuthResponse) {
      this.user = auth.user
      this.token = auth.accessToken
      this.isAuthenticated = true

      if (process.client) {
        localStorage.setItem('token', auth.accessToken)
        localStorage.setItem('user', JSON.stringify(auth.user))
      }
    },
  },
})
