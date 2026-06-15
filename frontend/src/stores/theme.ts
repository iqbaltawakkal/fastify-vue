import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = ref<boolean>(
    localStorage.getItem('theme') === 'dark' ||
      (localStorage.getItem('theme') === null && prefersDark),
  )

  function apply() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  watch(isDark, apply, { immediate: true })

  return { isDark, toggle }
})
