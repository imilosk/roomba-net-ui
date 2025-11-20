import { API_BASE_URL } from './api'

export type ReportedState = Record<string, unknown>

type StatusEventPayload = {
    Topic: string
    Payload: string
    Timestamp: string
}

type StatusListener = (reported: ReportedState, topic: string, timestamp: string) => void

const listeners = new Set<StatusListener>()
let eventSource: EventSource | null = null
let reconnectTimeout: number | null = null

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

function handleStatusEvent(event: MessageEvent) {
    try {
        const payload: StatusEventPayload = JSON.parse(event.data)
        if (!payload?.Payload || !payload.Topic) return

        const topic = payload.Topic
        const isCloudShadow = CLOUD_TOPIC_REGEX.test(topic)
        const isWifiStatus = topic === WIFI_TOPIC

        if (!isCloudShadow && !isWifiStatus) {
            return
        }

        const reported = parsePayload(payload.Payload)
        if (reported) {
            notify(reported, topic, payload.Timestamp)
        }
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

    eventSource = new EventSource(STREAM_ENDPOINT)
    eventSource.addEventListener('status', handleStatusEvent as EventListener)
    eventSource.onerror = () => {
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
