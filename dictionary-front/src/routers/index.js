// src/routers/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LiteraryWordsPage from '../pages/LiteraryWords.vue'
import ApiDocumentationPage from '../pages/APIDocumentation.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        // No component needed for home route as App.vue will handle this
    },
    {
        path: '/words',
        name: 'literaryWords',
        component: LiteraryWordsPage
    },
    {
        path: '/api',
        name: 'apiDocs',
        component: ApiDocumentationPage
    },
    // Catch-all route for 404 errors
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        redirect: { name: 'home' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router