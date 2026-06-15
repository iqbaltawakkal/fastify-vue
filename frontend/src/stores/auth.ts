import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
  address: string | null
  gender: string | null
  role: 'admin' | 'user'
  avatar: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!token.value)

  function avatarUrl(name: string) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
  }

  async function login(email: string, password: string): Promise<void> {
    const response = await axios.post('/login', { email, password })
    const { token: jwtToken } = response.data

    token.value = jwtToken
    localStorage.setItem('auth_token', jwtToken)

    await fetchMe()
  }

  async function fetchMe(): Promise<void> {
    const response = await axios.get('/me')
    const data = response.data
    user.value = {
      id: data.userId,
      name: data.name ?? '',
      email: data.email,
      address: data.address ?? null,
      gender: data.gender ?? null,
      role: 'admin',
      avatar: avatarUrl(data.name ?? data.email),
    }
  }

  async function updateProfile(payload: {
    name: string
    email: string
    address: string
    gender: string
  }): Promise<void> {
    const response = await axios.put('/me', payload)
    const data = response.data
    if (user.value) {
      user.value = {
        ...user.value,
        name: data.name ?? '',
        email: data.email,
        address: data.address ?? null,
        gender: data.gender ?? null,
        avatar: avatarUrl(data.name ?? data.email),
      }
    }
  }

  async function register(name: string, email: string, _password: string): Promise<{ data: any }> {
    return axios.post('/register', { email, password: _password }).catch((error) => {
      throw new Error(error.response?.data?.message || 'Registration failed')
    })
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  async function restoreSession() {
    if (token.value && !user.value) {
      await fetchMe().catch(() => logout())
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    restoreSession,
    updateProfile,
  }
})
