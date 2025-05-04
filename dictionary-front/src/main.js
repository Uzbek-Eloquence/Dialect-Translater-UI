import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'


import './assets/style.css'

createApp(App).mount('#app')
const app = createApp(App)
app.use(createPinia())
app.mount('#app')
