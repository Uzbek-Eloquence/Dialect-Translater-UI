// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

// Import pages (create these files in your 'views' or 'pages' directory)
// These are just placeholders - you'll need to create these components
const Dictionary = () => import('../components/Dictionary.vue');

const routes = [
    {
        path: '/',
        name: 'Home',
        component: App
    },
    {
        path: '/dictionary',
        name: 'Dictionary',
        component: Dictionary
    },
    {
        path: '/map',
        name: 'Map',
        component: Map
    },
    {
        path: '/history',
        name: 'History',
        component: History
    },
    {
        path: '/saved',
        name: 'Saved',
        component: Saved
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;