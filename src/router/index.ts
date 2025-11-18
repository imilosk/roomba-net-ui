import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductSettingsView from '../views/ProductSettingsView.vue'
import ProductHealthView from '../views/ProductHealthView.vue'
import ChildLockView from '../views/ChildLockView.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/settings',
        name: 'settings',
        component: ProductSettingsView
    },
    {
        path: '/settings/child-lock',
        name: 'child-lock',
        component: ChildLockView
    },
    {
        path: '/health',
        name: 'health',
        component: ProductHealthView
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
