import { API_BASE_URL } from './api'

export type ReportedState = Record<string, unknown>

type StatusEventPayload = {
    topic?: string
    payload?: unknown
    timestamp?: string
    ts?: number
} & Record<string, unknown>

type StatusListener = (reported: ReportedState, topic: string, timestamp: string) => void

const listeners = new Set<StatusListener>()
let eventSource: EventSource | null = null
let reconnectTimeout: number | null = null
let unloadListenerAdded = false

const STREAM_ENDPOINT = `${API_BASE_URL.replace(/\/$/, '')}/roomba/status/stream`
const DEFAULT_TOPIC = 'shadow'

function notify(reported: ReportedState, topic: string, timestamp: string) {
    listeners.forEach((listener) => {
        try {
            listener(reported, topic, timestamp)
        } catch (error) {
            console.error('Status listener error', error)
        }
    })
}

function parsePayload(raw: unknown): ReportedState | null {
    if (raw == null) {
        return null
    }

    if (typeof raw === 'string') {
        try {
            return parsePayload(JSON.parse(raw))
        } catch (error) {
            console.warn('Failed to parse status payload', error)
            return null
        }
    }

    if (typeof raw === 'object') {
        return raw as ReportedState
    }

    return null
}

function extractStatusPayload(data: unknown): { reported: ReportedState; topic: string; timestamp: string } | null {
    if (!data || typeof data !== 'object') {
        return null
    }

    const { topic, payload, timestamp, ts, ...rest } = data as StatusEventPayload

    const candidate = payload ?? rest
    const reported = parsePayload(candidate)

    if (!reported) {
        return null
    }

    const resolvedTopic = typeof topic === 'string' ? topic : DEFAULT_TOPIC
    const resolvedTimestamp =
        typeof timestamp === 'string'
            ? timestamp
            : typeof ts === 'number'
              ? new Date(ts * 1000).toISOString()
              : new Date().toISOString()

    return {
        reported,
        topic: resolvedTopic,
        timestamp: resolvedTimestamp
    }
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
