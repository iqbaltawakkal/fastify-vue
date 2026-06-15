<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const stats = [
  {
    label: 'Total Users',
    value: '2,847',
    change: '+12%',
    up: true,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    label: 'Revenue',
    value: '$48,295',
    change: '+8.2%',
    up: true,
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: 'Active Sessions',
    value: '341',
    change: '-3.1%',
    up: false,
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    label: 'Conversion',
    value: '3.6%',
    change: '+0.4%',
    up: true,
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
]

const recent = [
  { name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', joined: 'Jun 12, 2026', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=6366f1&color=fff' },
  { name: 'Bob Martinez', email: 'bob@example.com', status: 'Active', joined: 'Jun 11, 2026', avatar: 'https://ui-avatars.com/api/?name=Bob+Martinez&background=10b981&color=fff' },
  { name: 'Carol White', email: 'carol@example.com', status: 'Inactive', joined: 'Jun 9, 2026', avatar: 'https://ui-avatars.com/api/?name=Carol+White&background=f59e0b&color=fff' },
  { name: 'David Kim', email: 'david@example.com', status: 'Active', joined: 'Jun 7, 2026', avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=3b82f6&color=fff' },
  { name: 'Eva Chen', email: 'eva@example.com', status: 'Pending', joined: 'Jun 5, 2026', avatar: 'https://ui-avatars.com/api/?name=Eva+Chen&background=ec4899&color=fff' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back, {{ auth.user?.name }}</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">{{ stat.label }}</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
          <div class="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="stat.icon" />
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-1 text-xs">
          <span :class="stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'">
            {{ stat.change }}
          </span>
          <span class="text-gray-400 dark:text-gray-600">vs last month</span>
        </div>
      </div>
    </div>

    <!-- Recent users -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-white">Recent Users</h2>
        <RouterLink to="/dashboard/users" class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
          View all
        </RouterLink>
      </div>
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div v-for="user in recent" :key="user.email" class="flex items-center gap-4 px-6 py-4">
          <img :src="user.avatar" :alt="user.name" class="w-9 h-9 rounded-full shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
          </div>
          <span class="hidden sm:block text-xs text-gray-400 dark:text-gray-600">{{ user.joined }}</span>
          <span
            :class="[
              'text-xs px-2 py-1 rounded-full font-medium',
              user.status === 'Active'
                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : user.status === 'Inactive'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
            ]"
          >
            {{ user.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
