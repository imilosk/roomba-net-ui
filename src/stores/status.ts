import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { subscribeToStatusStream, type ReportedState } from '../services/statusStream'

export const useStatusStore = defineStore('status', () => {
    const reportedState = ref<ReportedState | null>(null)
    const batteryPercent = ref<number | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    let unsubscribe: (() => void) | null = null

    const hasReported = computed(() => reportedState.value !== null)

    function handleReported(state: ReportedState) {
        reportedState.value = state
        if (typeof state.batPct === 'number') {
            batteryPercent.value = state.batPct
        }
        loading.value = false
        error.value = null
    }

    function init() {
        if (unsubscribe) return
        loading.value = true
        error.value = null
        unsubscribe = subscribeToStatusStream(handleReported)
    }

    function dispose() {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
    }

    return {
        reportedState,
        batteryPercent,
        loading,
        error,
        hasReported,
        init,
        dispose
    }
})
