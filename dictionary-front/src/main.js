import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routers'

import './assets/style.css'

// Create the app instance once
const app = createApp(App)

// Register plugins
app.use(createPinia())
app.use(router)

// Mount the app once
app.mount('#app')