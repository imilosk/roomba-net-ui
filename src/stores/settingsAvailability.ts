import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import apiClient from '../services/api'
import { useRobotsStore } from './robots'

type AvailableSettingsResponse = {
    robotId: string
    settings: string[]
}

export const useSettingsAvailabilityStore = defineStore('settings-availability', () => {
    const settings = ref<string[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const hasLoaded = ref(false)
    const hasInitialized = ref(false)

    const robotsStore = useRobotsStore()

    const settingsSet = computed(() => new Set(settings.value))

    function hasSetting(setting: string) {
        return settingsSet.value.has(setting)
    }

    async function fetchAvailable(robotId: string) {
        loading.value = true
        error.value = null
        try {
            const { data } = await apiClient.get<AvailableSettingsResponse>('/roomba/settings/available', {
                params: { robotId }
            })
            settings.value = data?.settings ?? []
            hasLoaded.value = true
        } catch (err) {
            error.value = 'Unable to load available settings'
            hasLoaded.value = false
        } finally {
            loading.value = false
        }
    }

    function init() {
        if (hasInitialized.value) {
            return
        }
        hasInitialized.value = true
        robotsStore.hydrateSelection()
        watch(
            () => robotsStore.selectedRobotId,
            (robotId) => {
                if (!robotId) {
                    settings.value = []
                    hasLoaded.value = false
                    return
                }
                void fetchAvailable(robotId)
            },
            { immediate: true }
        )
    }

    return {
        settings,
        loading,
        error,
        hasLoaded,
        hasSetting,
        init
    }
})
