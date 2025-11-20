import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { subscribeToStatusStream, type ReportedState } from '../services/statusStream'

const SNAPSHOT_KEY = 'roomba_status_snapshot'

type StatusSnapshot = {
    reportedState: ReportedState | null
    batteryPercent: number | null
    timestamp: string | null
}

export const useStatusStore = defineStore('status', () => {
    const reportedState = ref<ReportedState | null>(null)
    const batteryPercent = ref<number | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const hasLiveUpdate = ref(false)
    const lastTimestamp = ref<string | null>(null)
    let unsubscribe: (() => void) | null = null

    const isConnected = computed(() => hasLiveUpdate.value)

    function persistSnapshot() {
        if (typeof window === 'undefined') return
        const snapshot: StatusSnapshot = {
            reportedState: reportedState.value,
            batteryPercent: batteryPercent.value,
            timestamp: lastTimestamp.value
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
                lastTimestamp.value = snapshot.timestamp ?? null
            }
        } catch (storageError) {
            console.warn('Failed to parse status snapshot', storageError)
        }
    }

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
    Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
                target[key] = {}
            }
            deepMerge(target[key] as Record<string, unknown>, value as Record<string, unknown>)
        } else {
            target[key] = value
        }
    })
}

function handleReported(state: ReportedState, topic: string, timestamp: string) {
    if (topic === 'error') {
        reportedState.value = null
        batteryPercent.value = null
        hasLiveUpdate.value = false
        loading.value = false
        error.value = 'Disconnected'
        persistSnapshot()
        return
    }

    if (topic === 'wifistat') {
        persistSnapshot()
        return
    }

    if (!reportedState.value) {
        reportedState.value = {}
    }

    const current = JSON.parse(JSON.stringify(reportedState.value))
    deepMerge(current as Record<string, unknown>, state as Record<string, unknown>)
    reportedState.value = current
        if (typeof state.batPct === 'number') {
            batteryPercent.value = state.batPct
        }
        loading.value = false
        error.value = null
        hasLiveUpdate.value = true
        lastTimestamp.value = timestamp
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
