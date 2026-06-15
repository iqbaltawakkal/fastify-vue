import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useThemeStore } from './stores/theme'
import  './config'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)

// Apply theme before first render
useThemeStore()

app.mount('#app')
