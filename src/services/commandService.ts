import apiClient from './api'

export interface CommandResponse {
    success: boolean
    message: string
    timestamp: string
    executionId: string
    error?: string | null
    details?: string | null
}

export async function findRoomba() {
    const { data } = await apiClient.post<CommandResponse>('/roomba/find')
    return data
}
