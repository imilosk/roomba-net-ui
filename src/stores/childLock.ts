import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { updateChildLock } from '../services/childLockService'
import { subscribeToStatusStream, type ReportedState } from '../services/statusStream'

export const useChildLockStore = defineStore('childLock', () => {
    const isEnabled = ref<boolean | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const fetchedOnce = ref(false)
    let unsubscribe: (() => void) | null = null

    const isInitialized = computed(() => fetchedOnce.value)

    function handleReportedState(reported: ReportedState) {
        if (Object.prototype.hasOwnProperty.call(reported, 'childLock')) {
            isEnabled.value = Boolean(reported.childLock)
            fetchedOnce.value = true
            loading.value = false
            error.value = null
        }
    }

    function initStream() {
        if (unsubscribe || typeof window === 'undefined') {
            return
        }
        loading.value = true
        error.value = null
        unsubscribe = subscribeToStatusStream(handleReportedState)
    }

    function disposeStream() {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
    }

    async function setChildLock(enable: boolean) {
        loading.value = true
        error.value = null
        try {
            await updateChildLock(enable)
            isEnabled.value = enable
            fetchedOnce.value = true
        } catch (err) {
            error.value = 'Unable to update child lock'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        isEnabled,
        loading,
        error,
        isInitialized,
        initStream,
        setChildLock,
        disposeStream
    }
})
