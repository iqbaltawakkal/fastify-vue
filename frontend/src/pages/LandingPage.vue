<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle.vue'

const auth = useAuthStore()

const features = [
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Blazing Fast',
    desc: 'Built on Vite for instant HMR and lightning-fast builds.',
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Secure Auth',
    desc: 'Pinia-powered auth store with protected route guards.',
  },
  {
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    title: 'Tailwind UI',
    desc: 'Beautiful UI with Tailwind CSS v4, dark & light mode included.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
    <!-- Nav -->
    <nav class="border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="font-semibold text-lg">VueDash</span>
        </div>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <template v-if="auth.isAuthenticated">
            <RouterLink
              to="/dashboard"
              class="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Dashboard
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 transition-colors"
            >
              Sign in
            </RouterLink>
            <RouterLink
              to="/register"
              class="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Get started
            </RouterLink>
          </template>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm mb-6"
      >
        <span class="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
        Vue 3 + TypeScript + Pinia
      </div>
      <h1 class="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
        Your modern<br />
        <span class="text-indigo-600 dark:text-indigo-400">admin dashboard</span>
      </h1>
      <p class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
        A production-ready Vue 3 dashboard starter with authentication, routing, and a clean UI
        built with Tailwind CSS.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          to="/register"
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
        >
          Get started free
        </RouterLink>
        <RouterLink
          to="/login"
          class="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg transition-colors"
        >
          Sign in
        </RouterLink>
      </div>
    </section>

    <!-- Features -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      <div class="grid sm:grid-cols-3 gap-6">
        <div
          v-for="f in features"
          :key="f.title"
          class="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          <div
            class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 flex items-center justify-center mb-4"
          >
            <svg
              class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="f.icon" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">{{ f.title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
      Built with Vue 3, Vite, Pinia &amp; Tailwind CSS
    </footer>
  </div>
</template>
