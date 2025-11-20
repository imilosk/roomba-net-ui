import { API_BASE_URL } from './api'

export type ReportedState = Record<string, unknown>

type LegacyStatusEventPayload = {
    Topic: string
    Payload: string | Record<string, unknown>
    Timestamp?: string
}

type DirectStatusEventPayload = {
    state?: {
        reported?: ReportedState
    }
    timestamp?: string
    ts?: number
}

type StatusListener = (reported: ReportedState, topic: string, timestamp: string) => void

const listeners = new Set<StatusListener>()
let eventSource: EventSource | null = null
let reconnectTimeout: number | null = null
let unloadListenerAdded = false

const STREAM_ENDPOINT = `${API_BASE_URL.replace(/\/$/, '')}/roomba/status/stream`
const CLOUD_TOPIC_REGEX = /^\$aws\/things\/.+\/shadow\/update$/
const WIFI_TOPIC = 'wifistat'

function notify(reported: ReportedState, topic: string, timestamp: string) {
    listeners.forEach((listener) => {
        try {
            listener(reported, topic, timestamp)
        } catch (error) {
            console.error('Status listener error', error)
        }
    })
}

function parsePayload(raw: string | Record<string, unknown>): ReportedState | null {
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
        if (parsed?.state?.reported && typeof parsed.state.reported === 'object') {
            return parsed.state.reported as ReportedState
        }
    } catch (error) {
        console.warn('Failed to parse status payload', error)
    }
    return null
}

function isLegacyPayload(payload: unknown): payload is LegacyStatusEventPayload {
    if (!payload || typeof payload !== 'object') {
        return false
    }
    return 'Topic' in payload && 'Payload' in payload
}

function isDirectPayload(payload: unknown): payload is DirectStatusEventPayload {
    if (!payload || typeof payload !== 'object') {
        return false
    }
    if (!('state' in payload)) {
        return false
    }
    const state = (payload as DirectStatusEventPayload).state
    return !!(state && typeof state === 'object' && state.reported && typeof state.reported === 'object')
}

function extractStatusPayload(data: unknown): { reported: ReportedState; topic: string; timestamp: string } | null {
    if (isLegacyPayload(data)) {
        const topic = data.Topic
        const isCloudShadow = CLOUD_TOPIC_REGEX.test(topic)
        const isWifiStatus = topic === WIFI_TOPIC
        if (!isCloudShadow && !isWifiStatus) {
            return null
        }
        const reported = parsePayload(data.Payload)
        if (reported) {
            return {
                reported,
                topic,
                timestamp: data.Timestamp ?? new Date().toISOString()
            }
        }
        return null
    }

    if (isDirectPayload(data)) {
        const reported = parsePayload(data)
        if (reported) {
            const direct = data as DirectStatusEventPayload
            const timestamp =
                typeof direct.timestamp === 'string'
                    ? direct.timestamp
                    : typeof direct.ts === 'number'
                      ? new Date(direct.ts * 1000).toISOString()
                      : new Date().toISOString()
            return {
                reported,
                topic: 'shadow',
                timestamp
            }
        }
    }

    return null
}

function handleStatusEvent(event: MessageEvent) {
    try {
        const parsed = JSON.parse(event.data)
        const payload = extractStatusPayload(parsed)
        if (!payload) {
            return
        }
        notify(payload.reported, payload.topic, payload.timestamp)
    } catch (error) {
        console.warn('Failed to process status event', error)
    }
}

function cleanupSource() {
    if (eventSource) {
        eventSource.removeEventListener('status', handleStatusEvent as EventListener)
        eventSource.close()
        eventSource = null
    }
}

function scheduleReconnect() {
    if (reconnectTimeout !== null) return
    reconnectTimeout = window.setTimeout(() => {
        reconnectTimeout = null
        ensureConnection()
    }, 2000)
}

function ensureConnection() {
    if (typeof window === 'undefined' || listeners.size === 0) {
        return
    }

    if (eventSource) {
        return
    }

    if (!unloadListenerAdded) {
        window.addEventListener('beforeunload', cleanupSource)
        unloadListenerAdded = true
    }

    eventSource = new EventSource(STREAM_ENDPOINT)
    eventSource.addEventListener('status', handleStatusEvent as EventListener)
    eventSource.onerror = () => {
        listeners.forEach((listener) => {
            try {
                listener({}, 'error', new Date().toISOString())
            } catch (error) {
                console.error('Status listener error', error)
            }
        })
        cleanupSource()
        scheduleReconnect()
    }
}

export function subscribeToStatusStream(listener: StatusListener) {
    listeners.add(listener)
    ensureConnection()

    return () => {
        listeners.delete(listener)
        if (listeners.size === 0) {
            cleanupSource()
        }
    }
}
