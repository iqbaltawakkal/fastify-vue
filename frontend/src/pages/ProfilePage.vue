<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const form = reactive({
  name: auth.user?.name ?? '',
  email: auth.user?.email ?? '',
  address: auth.user?.address ?? '',
  gender: auth.user?.gender ?? '',
})

watch(
  () => auth.user,
  (u) => {
    if (u) {
      form.name = u.name ?? ''
      form.email = u.email ?? ''
      form.address = u.address ?? ''
      form.gender = u.gender ?? ''
    }
  },
)

const saving = ref(false)
const success = ref(false)
const error = ref('')

async function save() {
  saving.value = true
  success.value = false
  error.value = ''
  try {
    await auth.updateProfile({
      name: form.name,
      email: form.email,
      address: form.address,
      gender: form.gender,
    })
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Failed to save changes.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mr-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">View and edit your account information.</p>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <!-- Avatar section -->
      <div class="flex items-center gap-4 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <img
          :src="auth.user?.avatar"
          :alt="auth.user?.name"
          class="w-16 h-16 rounded-full ring-2 ring-indigo-500/30"
        />
        <div>
          <p class="font-semibold text-gray-900 dark:text-white">{{ auth.user?.name || '—' }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ auth.user?.email }}</p>
        </div>
      </div>

      <!-- Form -->
      <form class="px-6 py-5 space-y-5" @submit.prevent="save">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full name
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Your name"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email address
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
          />
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Address
          </label>
          <textarea
            v-model="form.address"
            rows="3"
            placeholder="Your address"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition resize-none"
          />
        </div>

        <!-- Gender -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gender
          </label>
          <div class="flex gap-4">
            <label
              v-for="option in ['Male', 'Female', 'Other']"
              :key="option"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                v-model="form.gender"
                type="radio"
                :value="option"
                class="accent-indigo-600"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ option }}</span>
            </label>
          </div>
        </div>

        <!-- Feedback -->
        <div
          v-if="success"
          class="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Profile saved successfully.
        </div>
        <div
          v-if="error"
          class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2"
        >
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-1">
          <button
            type="submit"
            :disabled="saving"
            class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition"
          >
            <svg
              v-if="saving"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {{ saving ? 'Saving…' : 'Save changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
