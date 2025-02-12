import { createWebHistory, createRouter } from 'vue-router'

const routes = [
    {
        name: 'name',
        path: '/',
        component: () => import('@/views/home/index.vue')
    },
    {
        name: 'capture',
        path: '/capture',
        component: () => import('@/views/capture/index.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router