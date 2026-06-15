<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'Active' | 'Inactive' | 'Pending'
  joined: string
  avatar: string
}

const users = ref<User[]>([
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: 'Jun 12, 2026', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=6366f1&color=fff' },
  { id: 2, name: 'Bob Martinez', email: 'bob@example.com', role: 'Editor', status: 'Active', joined: 'Jun 11, 2026', avatar: 'https://ui-avatars.com/api/?name=Bob+Martinez&background=10b981&color=fff' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', joined: 'Jun 9, 2026', avatar: 'https://ui-avatars.com/api/?name=Carol+White&background=f59e0b&color=fff' },
  { id: 4, name: 'David Kim', email: 'david@example.com', role: 'Editor', status: 'Active', joined: 'Jun 7, 2026', avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=3b82f6&color=fff' },
  { id: 5, name: 'Eva Chen', email: 'eva@example.com', role: 'Viewer', status: 'Pending', joined: 'Jun 5, 2026', avatar: 'https://ui-avatars.com/api/?name=Eva+Chen&background=ec4899&color=fff' },
  { id: 6, name: 'Frank Liu', email: 'frank@example.com', role: 'Editor', status: 'Active', joined: 'Jun 3, 2026', avatar: 'https://ui-avatars.com/api/?name=Frank+Liu&background=8b5cf6&color=fff' },
  { id: 7, name: 'Grace Park', email: 'grace@example.com', role: 'Admin', status: 'Active', joined: 'May 30, 2026', avatar: 'https://ui-avatars.com/api/?name=Grace+Park&background=06b6d4&color=fff' },
  { id: 8, name: 'Henry Brown', email: 'henry@example.com', role: 'Viewer', status: 'Inactive', joined: 'May 28, 2026', avatar: 'https://ui-avatars.com/api/?name=Henry+Brown&background=64748b&color=fff' },
])

const search = ref('')
const filterStatus = ref<string>('All')

const filtered = computed(() => {
  return users.value.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = filterStatus.value === 'All' || u.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

const statusOptions = ['All', 'Active', 'Inactive', 'Pending']

const roleColors: Record<string, string> = {
  Admin: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  Editor: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Viewer: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
}

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
  Pending: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and view all team members</p>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add user
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search users…"
          class="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      </div>
      <div class="flex gap-2">
        <button
          v-for="s in statusOptions"
          :key="s"
          :class="[
            'px-3 py-2 text-xs font-medium rounded-lg border transition-colors',
            filterStatus === s
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-700',
          ]"
          @click="filterStatus = s"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">User</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3 hidden sm:table-cell">Role</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3 hidden md:table-cell">Joined</th>
              <th class="px-6 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
                No users found
              </td>
            </tr>
            <tr
              v-for="user in filtered"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="user.avatar" :alt="user.name" class="w-9 h-9 rounded-full shrink-0" />
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 hidden sm:table-cell">
                <span :class="['text-xs px-2 py-1 rounded-full font-medium', roleColors[user.role]]">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="['text-xs px-2 py-1 rounded-full font-medium', statusColors[user.status]]">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-500 hidden md:table-cell">
                {{ user.joined }}
              </td>
              <td class="px-6 py-4">
                <button class="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <p class="text-xs text-gray-400 dark:text-gray-600">{{ filtered.length }} of {{ users.length }} users</p>
      </div>
    </div>
  </div>
</template>
