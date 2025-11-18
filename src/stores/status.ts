import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { subscribeToStatusStream, type ReportedState } from '../services/statusStream'

const SNAPSHOT_KEY = 'roomba_status_snapshot'

type StatusSnapshot = {
    reportedState: ReportedState | null
    batteryPercent: number | null
}

export const useStatusStore = defineStore('status', () => {
    const reportedState = ref<ReportedState | null>(null)
    const batteryPercent = ref<number | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const hasLiveUpdate = ref(false)
    let unsubscribe: (() => void) | null = null

    const isConnected = computed(() => hasLiveUpdate.value)

    function persistSnapshot() {
        if (typeof window === 'undefined') return
        const snapshot: StatusSnapshot = {
            reportedState: reportedState.value,
            batteryPercent: batteryPercent.value
        }
        try {
            window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot))
        } catch (storageError) {
            console.warn('Failed to persist status snapshot', storageError)
        }
    }

    function hydrateSnapshot() {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem(SNAPSHOT_KEY)
        if (!stored) return
        try {
            const snapshot = JSON.parse(stored) as StatusSnapshot
            if (snapshot) {
                reportedState.value = snapshot.reportedState
                batteryPercent.value = snapshot.batteryPercent ?? null
            }
        } catch (storageError) {
            console.warn('Failed to parse status snapshot', storageError)
        }
    }

    function handleReported(state: ReportedState, topic: string) {
        if (topic === 'wifistat') {
            persistSnapshot()
            return
        }

        reportedState.value = state
        if (typeof state.batPct === 'number') {
            batteryPercent.value = state.batPct
        }
        loading.value = false
        error.value = null
        hasLiveUpdate.value = true
        persistSnapshot()
    }

    function init() {
        if (unsubscribe) return
        if (!reportedState.value) {
            hydrateSnapshot()
        }
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
        isConnected,
        hasLiveUpdate,
        init,
        dispose
    }
})
