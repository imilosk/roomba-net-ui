import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import apiClient from '../services/api'

const STORAGE_KEY = 'roomba_selected_robot'

export type RobotRecord = {
    blid: string
    ip: string
    port: number
    hasPassword: boolean
}

export const useRobotsStore = defineStore('robots', () => {
    const robots = ref<RobotRecord[]>([])
    const selectedRobotId = ref<string | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const hasLoaded = ref(false)

    const selectedRobot = computed(() => {
        if (!selectedRobotId.value) {
            return null
        }
        return robots.value.find((robot) => robot.blid === selectedRobotId.value) ?? null
    })

    function hydrateSelection() {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored) {
            selectedRobotId.value = stored
        }
    }

    function persistSelection() {
        if (typeof window === 'undefined') return
        if (selectedRobotId.value) {
            window.localStorage.setItem(STORAGE_KEY, selectedRobotId.value)
        } else {
            window.localStorage.removeItem(STORAGE_KEY)
        }
    }

    function selectRobot(blid: string | null) {
        selectedRobotId.value = blid
        persistSelection()
    }

    function ensureSelection() {
        if (!selectedRobotId.value && robots.value.length > 0) {
            const firstRobot = robots.value[0]
            if (firstRobot) {
                selectRobot(firstRobot.blid)
            }
        }
    }

    async function loadRobots() {
        loading.value = true
        error.value = null
        try {
            const { data } = await apiClient.get<RobotRecord[]>('/roomba/robots')
            robots.value = data ?? []
            hasLoaded.value = true
            ensureSelection()
        } catch (err) {
            error.value = 'Unable to load robots'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function refresh() {
        await loadRobots()
    }

    return {
        robots,
        selectedRobotId,
        selectedRobot,
        loading,
        error,
        hasLoaded,
        hydrateSelection,
        loadRobots,
        refresh,
        selectRobot
    }
})
