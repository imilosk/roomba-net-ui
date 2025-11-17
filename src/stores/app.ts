import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    function setLoading(loading: boolean) {
        isLoading.value = loading
    }

    function setError(errorMessage: string | null) {
        error.value = errorMessage
    }

    function clearError() {
        error.value = null
    }

    return {
        isLoading,
        error,
        setLoading,
        setError,
        clearError
    }
})
