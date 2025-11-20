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
    const robotName = computed(() => {
        const state = reportedState.value as Record<string, unknown> | null
        if (state && typeof state['name'] === 'string') {
            return state['name'] as string
        }
        return null
    })
    const robotDetails = computed(() => {
        const state = reportedState.value as Record<string, any> | null
        if (!state) {
            return null
        }

        const baseInfo = state.base && typeof state.base === 'object' ? (state.base as Record<string, any>) : null

        return {
            name: typeof state.name === 'string' ? state.name : null,
            sku: typeof state.sku === 'string' ? state.sku : null,
            serial: state.hwPartsRev?.mobBlid ?? null,
            softwareVersion: typeof state.softwareVer === 'string' ? state.softwareVer : null,
            subSoftware: {
                nav: state.subModSwVer?.nav ?? null,
                mob: state.subModSwVer?.mob ?? null,
                pwr: state.subModSwVer?.pwr ?? null
            },
            dockFirmware: state.dock?.fwVer ?? baseInfo?.fwVer ?? null,
            batteryType: typeof state.batteryType === 'string' ? state.batteryType : null,
            batteryManufactureDate: state.batInfo?.mDate ?? null,
            batteryManufacturer: state.batInfo?.mName ?? null,
            country: typeof state.country === 'string' ? state.country : null,
            timezone: typeof state.timezone === 'string' ? state.timezone : null,
            selfEmptyingBase: {
                status: typeof baseInfo?.present === 'boolean' ? baseInfo.present : null,
                firmware: baseInfo?.fwVer ?? state.dock?.fwVer ?? null,
                model: baseInfo?.pn ?? baseInfo?.model ?? null,
                serial: baseInfo?.serial ?? baseInfo?.id ?? null,
                evacAllowed: typeof state.evacAllowed === 'boolean' ? state.evacAllowed : null
            }
        }
    })

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

    function handleReported(state: ReportedState, topic: string, timestamp: string) {
        if (topic === 'error') {
            hasLiveUpdate.value = false
            loading.value = true
            error.value = 'Disconnected'
            return
        }

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
        robotDetails,
        robotName,
        init,
        dispose
    }
})
