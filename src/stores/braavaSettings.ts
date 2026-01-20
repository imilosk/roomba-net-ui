import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import apiClient from '../services/api'
import { useStatusStore } from './status'
import { useRobotsStore } from './robots'

type LiquidAmount = 1 | 2 | 3
type ChargingLightPattern = 0 | 1 | 2

export const useBraavaSettingsStore = defineStore('braava-settings', () => {
    const rankOverlap = ref<number | null>(null)
    const liquidAmount = ref<LiquidAmount | null>(null)
    const chargingLightPattern = ref<ChargingLightPattern | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const statusStore = useStatusStore()
    const robotsStore = useRobotsStore()

    watch(
        () => statusStore.reportedState,
        (state) => {
            if (!state) return
            const snapshot = state as Record<string, any>
            if (typeof snapshot.rankOverlap === 'number') {
                rankOverlap.value = snapshot.rankOverlap
            }
            const padWetness = snapshot.padWetness
            if (padWetness && typeof padWetness === 'object') {
                const reusable = (padWetness as { reusable?: unknown }).reusable
                const disposable = (padWetness as { disposable?: unknown }).disposable
                const disposableValue =
                    typeof disposable === 'number' ? disposable : Number.isFinite(Number(disposable)) ? Number(disposable) : null
                const reusableValue =
                    typeof reusable === 'number' ? reusable : Number.isFinite(Number(reusable)) ? Number(reusable) : null
                if (disposableValue !== null && !Number.isNaN(disposableValue)) {
                    liquidAmount.value = disposableValue as LiquidAmount
                } else if (reusableValue !== null && !Number.isNaN(reusableValue)) {
                    liquidAmount.value = reusableValue as LiquidAmount
                }
            } else if (typeof padWetness === 'number') {
                liquidAmount.value = padWetness as LiquidAmount
            }
            if (typeof snapshot.chrgLrPtrn === 'number') {
                chargingLightPattern.value = snapshot.chrgLrPtrn as ChargingLightPattern
            }
        },
        { immediate: true }
    )

    async function setRankOverlap(value: number) {
        if (!robotsStore.selectedRobotId) {
            error.value = 'Select a robot to update overlap'
            return
        }
        loading.value = true
        error.value = null
        const clamped = Math.min(100, Math.max(0, Math.round(value)))
        try {
            await apiClient.post(
                '/roomba/settings/rank-overlap',
                { value: clamped },
                { params: { robotId: robotsStore.selectedRobotId } }
            )
            rankOverlap.value = clamped
        } catch (err) {
            error.value = 'Unable to update overlap'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function setLiquidAmount(value: LiquidAmount) {
        if (!robotsStore.selectedRobotId) {
            error.value = 'Select a robot to update liquid amount'
            return
        }
        loading.value = true
        error.value = null
        try {
            await apiClient.post(
                '/roomba/settings/liquid-amount',
                { value },
                { params: { robotId: robotsStore.selectedRobotId } }
            )
            liquidAmount.value = value
        } catch (err) {
            error.value = 'Unable to update liquid amount'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function setChargingLightPattern(value: ChargingLightPattern) {
        if (!robotsStore.selectedRobotId) {
            error.value = 'Select a robot to update charging light'
            return
        }
        loading.value = true
        error.value = null
        try {
            await apiClient.post(
                '/roomba/settings/charging-light-pattern',
                { value },
                { params: { robotId: robotsStore.selectedRobotId } }
            )
            chargingLightPattern.value = value
        } catch (err) {
            error.value = 'Unable to update charging light'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        rankOverlap,
        liquidAmount,
        chargingLightPattern,
        loading,
        error,
        setRankOverlap,
        setLiquidAmount,
        setChargingLightPattern
    }
})
