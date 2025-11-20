import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { updateChildLock } from '../services/childLockService'
import { useStatusStore } from './status'

export const useChildLockStore = defineStore('childLock', () => {
    const isEnabled = ref<boolean | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const fetchedOnce = ref(false)
    const hasInitialized = ref(false)

    const isInitialized = computed(() => fetchedOnce.value)

    const statusStore = useStatusStore()

    watch(
        () => statusStore.reportedState,
        (state) => {
            if (!state || !Object.prototype.hasOwnProperty.call(state, 'childLock')) {
                return
            }
            isEnabled.value = Boolean(state.childLock)
            fetchedOnce.value = true
            loading.value = false
            error.value = null
        },
        { immediate: true }
    )

    function initStream() {
        if (hasInitialized.value) {
            return
        }
        loading.value = true
        error.value = null
        statusStore.init()
        hasInitialized.value = true
    }

    function disposeStream() {
        // Child lock now shares the global status stream, so there's nothing to dispose here.
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
