import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  function login(email: string, _password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && _password.length >= 4) {
          const mockUser: User = {
            id: 1,
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            role: 'admin',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=6366f1&color=fff`,
          }
          user.value = mockUser
          token.value = 'mock-jwt-token-' + Date.now()
          localStorage.setItem('auth_token', token.value)
          resolve()
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 800)
    })
  }

  function register(name: string, email: string, _password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && _password.length >= 4) {
          const mockUser: User = {
            id: Date.now(),
            name,
            email,
            role: 'user',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
          }
          user.value = mockUser
          token.value = 'mock-jwt-token-' + Date.now()
          localStorage.setItem('auth_token', token.value)
          resolve()
        } else {
          reject(new Error('Please fill all fields'))
        }
      }, 800)
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
