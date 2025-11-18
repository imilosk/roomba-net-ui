import apiClient from './api'

export interface SettingsResponse {
    success: boolean
    setting: string
    message: string
    timestamp: string
    executionId: string
    error?: string | null
    details?: string | null
}

const MUTATION_ENDPOINT = '/roomba/settings/child-lock'

export async function updateChildLock(enable: boolean) {
    const { data } = await apiClient.post<SettingsResponse>(MUTATION_ENDPOINT, { enable })
    return data
}
