import type { 
  LoginDto, 
  RegisterDto, 
  AuthResponse, 
  User 
} from '~/types'

export const useAuthApi = () => {
  const api = useApi()

  return {
    login: (credentials: LoginDto) =>
      api.post<AuthResponse>('/auth/login', credentials),

    register: (data: RegisterDto) =>
      api.post<User>('/auth/register', data),

    getProfile: () =>
      api.get<User>('/auth/me'),

    updateProfile: (data: Partial<User>) =>
      api.patch<User>('/auth/profile', data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      api.patch('/auth/change-password', data),
  }
}
