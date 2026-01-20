import apiClient from './api'

export interface CommandResponse {
    success: boolean
    message: string
    timestamp: string
    executionId: string
    error?: string | null
    details?: string | null
}

export async function findRoomba(robotId: string) {
    const { data } = await apiClient.post<CommandResponse>('/roomba/find', null, {
        params: { robotId }
    })
    return data
}

export async function resetRoomba(robotId: string) {
    const { data } = await apiClient.post<CommandResponse>('/roomba/reset', null, {
        params: { robotId }
    })
    return data
}

export async function pauseRoomba(robotId: string) {
    const { data } = await apiClient.post<CommandResponse>('/roomba/pause', null, {
        params: { robotId }
    })
    return data
}

export async function resumeRoomba(robotId: string) {
    const { data } = await apiClient.post<CommandResponse>('/roomba/resume', null, {
        params: { robotId }
    })
    return data
}

export async function evacuateRoomba(robotId: string) {
    const { data } = await apiClient.post<CommandResponse>('/roomba/evac', null, {
        params: { robotId }
    })
    return data
}

export async function dockRoomba(robotId: string) {
    const { data } = await apiClient.post<CommandResponse>('/roomba/dock', null, {
        params: { robotId }
    })
    return data
}

export async function startRoomba(robotId: string) {
    const { data } = await apiClient.post<CommandResponse>('/roomba/start', null, {
        params: { robotId }
    })
    return data
}
