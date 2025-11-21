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

export async function resetRoomba() {
    const { data } = await apiClient.post<CommandResponse>('/roomba/reset')
    return data
}

export async function pauseRoomba() {
    const { data } = await apiClient.post<CommandResponse>('/roomba/pause')
    return data
}

export async function resumeRoomba() {
    const { data } = await apiClient.post<CommandResponse>('/roomba/resume')
    return data
}

export async function evacuateRoomba() {
    const { data } = await apiClient.post<CommandResponse>('/roomba/evac')
    return data
}

export async function dockRoomba() {
    const { data } = await apiClient.post<CommandResponse>('/roomba/dock')
    return data
}

export async function startRoomba() {
    const { data } = await apiClient.post<CommandResponse>('/roomba/start')
    return data
}
