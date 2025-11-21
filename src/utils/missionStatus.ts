import type { ReportedState } from '../services/statusStream'

type CleanMissionStatus = {
    cycle?: string | null
    phase?: string | null
    initiator?: string | null
    flags?: Record<string, unknown> | null
    mssnNavState?: number | null
    lastCommand?: { command: string } | null
    [key: string]: unknown
}

export type MissionState =
    | 'ready'
    | 'discovering'
    | 'cleaning'
    | 'paused'
    | 'returning'
    | 'charging'
    | 'charging-to-resume'
    | 'emptying'
    | 'mapping'
    | 'saving-map'
    | 'stuck'
    | 'unknown'

export type MissionDescriptor = {
    state: MissionState
    label: string
}

const RETURN_PHASES = new Set(['hmUsrDock', 'dock', 'hmPostMsn'])
const PAUSED_PHASES = new Set(['pause', 'stop'])
const CHARGING_PHASES = new Set(['charge', 'recharge'])
const SAVING_PHASES = new Set(['upload'])
const STUCK_PHASES = new Set(['stuck', 'evacStuck', 'error'])

function asMission(state: ReportedState | null): CleanMissionStatus | null {
    if (!state || typeof state !== 'object') return null
    const mission = (state as Record<string, unknown>).cleanMissionStatus
    if (!mission || typeof mission !== 'object') return null
    return mission as CleanMissionStatus
}

function hasFlag(flags: Record<string, unknown> | null | undefined, key: string) {
    if (!flags || typeof flags !== 'object') return false
    const value = flags[key]
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value > 0
    return Boolean(value)
}

export function mapMissionStatus(state: ReportedState | null): MissionDescriptor {
    const mission = asMission(state)
    if (!mission) {
        return { state: 'ready', label: 'Ready to vacuum' }
    }

    const cycle = (mission.cycle ?? 'none').toLowerCase()
    const phase = (mission.phase ?? 'none').toLowerCase()
    const flags = mission.flags as Record<string, unknown> | null | undefined
    const batteryPercent =
        state && typeof state === 'object' && typeof (state as Record<string, unknown>).batPct === 'number'
            ? ((state as Record<string, unknown>).batPct as number)
            : null

    if (SAVING_PHASES.has(phase) || hasFlag(flags, 'mapUpload')) {
        return { state: 'saving-map', label: 'Saving Smart Map' }
    }

    if (STUCK_PHASES.has(phase) || hasFlag(flags, 'stuck')) {
        return { state: 'stuck', label: 'Stuck' }
    }

    if (cycle === 'train') {
        if (PAUSED_PHASES.has(phase)) {
            return { state: 'paused', label: 'Training run paused' }
        }
        if (RETURN_PHASES.has(phase)) {
            return { state: 'returning', label: 'Returning to dock' }
        }
        if (CHARGING_PHASES.has(phase)) {
            return { state: 'charging-to-resume', label: 'Charging to resume mapping' }
        }
        return { state: 'mapping', label: 'Mapping run' }
    }

    if (cycle === 'evac' || phase === 'evac') {
        if (PAUSED_PHASES.has(phase)) {
            return { state: 'paused', label: 'Emptying paused' }
        }
        return { state: 'emptying', label: 'Emptying bin' }
    }

    if (cycle === 'dock') {
        return { state: 'returning', label: 'Returning home' }
    }

    if (cycle === 'charge') {
        return { state: 'charging', label: 'Charging' }
    }

    if (cycle === 'recharge') {
        if (CHARGING_PHASES.has(phase)) {
            return { state: 'charging-to-resume', label: 'Charging to resume' }
        }
        if (RETURN_PHASES.has(phase)) {
            return { state: 'returning', label: 'Returning to dock' }
        }
        return { state: 'cleaning', label: 'Resuming cleaning' }
    }

    if (cycle === 'clean') {
        if (phase === 'run') {
            return { state: 'discovering', label: 'Discovering & vacuuming' }
        }
        if (phase === 'clean') {
            return { state: 'cleaning', label: 'Cleaning' }
        }
        if (PAUSED_PHASES.has(phase)) {
            return { state: 'paused', label: 'Paused' }
        }
        if (RETURN_PHASES.has(phase)) {
            return { state: 'returning', label: 'Returning home' }
        }
        if (CHARGING_PHASES.has(phase)) {
            return { state: 'charging-to-resume', label: 'Charging to resume' }
        }
        return { state: 'cleaning', label: 'Cleaning' }
    }

    if (cycle === 'none') {
        if (batteryPercent !== null && batteryPercent >= 100) {
            return { state: 'ready', label: 'Ready to vacuum' }
        }
        if (phase === 'charge') {
            return { state: 'charging', label: 'Charging' }
        }
        return { state: 'ready', label: 'Ready to vacuum' }
    }

    return { state: 'unknown', label: 'Status updating…' }
}
