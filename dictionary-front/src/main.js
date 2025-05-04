// main.js
import { createApp } from 'vue';
import App from './App.vue';
import '../src/assets/style.css'; // You may need to create this file for global styles

// Create Vue application
const app = createApp(App);

// Mount application
app.mount('#app');