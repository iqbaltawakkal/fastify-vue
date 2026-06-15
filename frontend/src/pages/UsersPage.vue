<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'

interface Person {
  id: number
  name: string
  email: string
  address: string | null
  gender: string | null
  status: string
}

// ── Data ──────────────────────────────────────────────────────────────────────

const people = ref<Person[]>([])
const loading = ref(false)

async function fetchPeople() {
  loading.value = true
  try {
    const res = await axios.get('/peoples')
    people.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchPeople)

// ── Filters ───────────────────────────────────────────────────────────────────

const search = ref('')
const filterStatus = ref('All')
const statusOptions = ['All', 'Active', 'Inactive', 'Pending']

const filtered = computed(() =>
  people.value.filter((p) => {
    const q = search.value.toLowerCase()
    const matchSearch =
      p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)
    const matchStatus = filterStatus.value === 'All' || p.status === filterStatus.value
    return matchSearch && matchStatus
  }),
)

// ── Modal ─────────────────────────────────────────────────────────────────────

const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const modalError = ref('')

const emptyForm = () => ({ name: '', email: '', address: '', gender: '', status: 'Active' })
const form = reactive(emptyForm())

function openAdd() {
  editingId.value = null
  Object.assign(form, emptyForm())
  modalError.value = ''
  modalOpen.value = true
}

function openEdit(person: Person) {
  editingId.value = person.id
  Object.assign(form, {
    name: person.name ?? '',
    email: person.email ?? '',
    address: person.address ?? '',
    gender: person.gender ?? '',
    status: person.status ?? 'Active',
  })
  modalError.value = ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function submit() {
  saving.value = true
  modalError.value = ''
  try {
    if (editingId.value === null) {
      const res = await axios.post('/peoples', { ...form })
      people.value.push(res.data)
    } else {
      const res = await axios.put(`/peoples/${editingId.value}`, { ...form })
      const idx = people.value.findIndex((p) => p.id === editingId.value)
      if (idx !== -1) people.value[idx] = res.data
    }
    closeModal()
  } catch (e: any) {
    modalError.value = e?.response?.data?.message ?? 'Something went wrong.'
  } finally {
    saving.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=6366f1&color=fff`
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">People</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all people records</p>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        @click="openAdd"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add person
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search name or email…"
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
              : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
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
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Person</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3 hidden sm:table-cell">Gender</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3 hidden md:table-cell">Address</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
              <th class="px-6 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="5" class="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
                Loading…
              </td>
            </tr>
            <!-- Empty -->
            <tr v-else-if="filtered.length === 0">
              <td colspan="5" class="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
                No people found
              </td>
            </tr>
            <!-- Rows -->
            <tr
              v-for="person in filtered"
              :key="person.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="avatarUrl(person.name)" :alt="person.name" class="w-9 h-9 rounded-full shrink-0" />
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ person.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ person.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                {{ person.gender || '—' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell max-w-xs truncate">
                {{ person.address || '—' }}
              </td>
              <td class="px-6 py-4">
                <span :class="['text-xs px-2 py-1 rounded-full font-medium', statusColors[person.status] ?? statusColors.Inactive]">
                  {{ person.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  class="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Edit"
                  @click="openEdit(person)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-800">
        <p class="text-xs text-gray-400 dark:text-gray-600">{{ filtered.length }} of {{ people.length }} people</p>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="transition duration-150"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modalOpen"
            class="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800"
          >
            <!-- Modal header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 class="text-base font-semibold text-gray-900 dark:text-white">
                {{ editingId === null ? 'Add person' : 'Edit person' }}
              </h2>
              <button
                class="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                @click="closeModal"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal form -->
            <form class="px-6 py-5 space-y-4" @submit.prevent="submit">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                <textarea
                  v-model="form.address"
                  rows="2"
                  placeholder="123 Main St, City"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <div class="flex gap-4">
                  <label v-for="g in ['Male', 'Female', 'Other']" :key="g" class="flex items-center gap-2 cursor-pointer">
                    <input v-model="form.gender" type="radio" :value="g" class="accent-indigo-600" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ g }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option v-for="s in ['Active', 'Inactive', 'Pending']" :key="s">{{ s }}</option>
                </select>
              </div>

              <p v-if="modalError" class="text-sm text-red-600 dark:text-red-400">{{ modalError }}</p>

              <!-- Modal actions -->
              <div class="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {{ saving ? 'Saving…' : editingId === null ? 'Add' : 'Save changes' }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
