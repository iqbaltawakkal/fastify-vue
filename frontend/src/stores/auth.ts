import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  avatar: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string): Promise<void> {
    return axios
      .post('/login', { email, password })
      .then((response) => {
        const { token: jwtToken } = response.data

        const loggedInUser: User = {
          id: 1,
          name: email
            .split('@')[0]
            .replace(/[._]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          role: 'admin',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=6366f1&color=fff`,
        }

        user.value = loggedInUser
        token.value = jwtToken

        localStorage.setItem('auth_token', jwtToken)
      })
  }

  async function register(name: string, email: string, _password: string): Promise<{ data: any }> {
    return axios
      .post('/register', { email, password: _password }).catch((error) => {
        throw new Error(error.response?.data?.message || 'Registration failed')
      })
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  function restoreSession() {
    if (token.value && !user.value) {
      user.value = {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff',
      }
    }
  }

  return { user, token, isAuthenticated, login, register, logout, restoreSession }
})
