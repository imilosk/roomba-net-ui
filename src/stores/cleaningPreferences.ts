import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import apiClient from '../services/api'
import { useStatusStore } from './status'

type CleaningPassesValue = 1 | 2 | 3

function derivePassesFromState(state: Record<string, unknown>): CleaningPassesValue | null {
    if (typeof state.twoPass === 'boolean') {
        return state.twoPass ? 2 : 1
    }

    if (typeof state.noAutoPasses === 'boolean') {
        return state.noAutoPasses ? 1 : 3
    }

    return null
}

export const useCleaningPreferencesStore = defineStore('cleaning-preferences', () => {
    const passes = ref<CleaningPassesValue>(2)
    const binPause = ref<boolean>(false)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const statusStore = useStatusStore()
    statusStore.init()

    watch(
        () => statusStore.reportedState,
        (state) => {
            if (!state) return
            if (typeof state.binPause === 'boolean') {
                binPause.value = state.binPause
            }
            const derivedPasses = derivePassesFromState(state)
            if (derivedPasses) {
                passes.value = derivedPasses
            }
        },
        { immediate: true }
    )

    async function setPasses(value: CleaningPassesValue) {
        loading.value = true
        error.value = null
        try {
            await apiClient.post('/roomba/settings/cleaning-passes', { passes: value })
            passes.value = value
        } catch (err) {
            error.value = 'Unable to update cleaning passes'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function setBinPause(enabled: boolean) {
        loading.value = true
        error.value = null
        try {
            await apiClient.post('/roomba/settings/bin-pause', { enable: enabled })
            binPause.value = enabled
        } catch (err) {
            error.value = 'Unable to update bin behaviour'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        passes,
        binPause,
        loading,
        error,
        setPasses,
        setBinPause
    }
})
