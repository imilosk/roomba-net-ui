import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useStatusStore } from './stores/status'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const statusStore = useStatusStore(pinia)
statusStore.init()

app.mount('#app')
