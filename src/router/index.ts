import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductSettingsView from '../views/ProductSettingsView.vue'
import ProductHealthView from '../views/ProductHealthView.vue'
import ChildLockView from '../views/ChildLockView.vue'
import LocateRoombaView from '../views/LocateRoombaView.vue'
import RebootRoombaView from '../views/RebootRoombaView.vue'
import CleaningPreferencesView from '../views/CleaningPreferencesView.vue'
import CleaningPassesView from '../views/CleaningPassesView.vue'
import BinBehaviourView from '../views/BinBehaviourView.vue'
import AboutRoombaView from '../views/AboutRoombaView.vue'
import AppearanceSettingsView from '../views/AppearanceSettingsView.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/settings/appearance',
        name: 'appearance',
        component: AppearanceSettingsView
    },
    {
        path: '/settings',
        name: 'settings',
        component: ProductSettingsView
    },
    {
        path: '/settings/about',
        name: 'about',
        component: AboutRoombaView
    },
    {
        path: '/settings/child-lock',
        name: 'child-lock',
        component: ChildLockView
    },
    {
        path: '/settings/locate',
        name: 'locate',
        component: LocateRoombaView
    },
    {
        path: '/settings/reboot',
        name: 'reboot',
        component: RebootRoombaView
    },
    {
        path: '/settings/cleaning',
        name: 'cleaning-preferences',
        component: CleaningPreferencesView
    },
    {
        path: '/settings/cleaning/passes',
        name: 'cleaning-passes',
        component: CleaningPassesView
    },
    {
        path: '/settings/cleaning/bin',
        name: 'bin-behaviour',
        component: BinBehaviourView
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
