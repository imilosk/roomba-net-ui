import { computed, ref, watch } from 'vue'
import { useStatusStore } from '../stores/status'
import { useRobotsStore } from '../stores/robots'
import { dockRoomba, evacuateRoomba, pauseRoomba, resumeRoomba, startRoomba } from '../services/commandService'

type MissionStatus = {
  cycle?: string
  phase?: string
}

type CommandType = 'start' | 'pause' | 'resume' | 'dock' | 'evac'

export function useRobotCommands() {
    const statusStore = useStatusStore()
    const robotsStore = useRobotsStore()
    const actionState = ref<CommandType | null>(null)
    const isStarting = ref(false)

  const missionStatus = computed(() =>
    (statusStore.reportedState as Record<string, any> | null)?.cleanMissionStatus as MissionStatus | undefined
  )

  const isCleaning = computed(() => {
    if (!statusStore.isConnected || missionStatus.value?.cycle !== 'clean') return false
    const phase = missionStatus.value?.phase
    return phase === 'run' || phase === 'clean'
  })

  const isPaused = computed(() => {
    if (!statusStore.isConnected) return false
    const phase = missionStatus.value?.phase
    return missionStatus.value?.cycle === 'clean' && (phase === 'pause' || phase === 'stop')
  })

  const isReturning = computed(() => {
    const mission = missionStatus.value
    if (!mission) return false
    if (mission.cycle === 'dock') return true
    return mission.phase === 'hmUsrDock' || mission.phase === 'dock'
  })

  async function withAction(
    type: CommandType,
    executor: (robotId: string) => Promise<unknown>,
    { trackStart } = { trackStart: false }
  ) {
    if (!robotsStore.selectedRobotId) {
      console.warn('No robot selected for command')
      return
    }
    if (actionState.value || (trackStart && isStarting.value)) {
      return
    }
    actionState.value = type
    if (trackStart) {
      isStarting.value = true
    }
    try {
      await executor(robotsStore.selectedRobotId)
    } catch (error) {
      console.error(`Failed to execute ${type} command`, error)
      actionState.value = null
      if (trackStart) {
        isStarting.value = false
      }
    }
  }

  function handlePause() {
    return withAction('pause', pauseRoomba)
  }

  function handleResume() {
    return withAction('resume', resumeRoomba)
  }

  function handleEvacuate() {
    return withAction('evac', evacuateRoomba)
  }

  function handleDock() {
    return withAction('dock', dockRoomba)
  }

  function handleStart() {
    return withAction('start', startRoomba, { trackStart: true })
  }

  watch(
    () => ({
      paused: isPaused.value,
      cleaning: isCleaning.value,
      cycle: missionStatus.value?.cycle ?? null
    }),
    ({ paused, cleaning, cycle }) => {
      if (actionState.value === 'pause' && paused) {
        actionState.value = null
      }
      if (actionState.value === 'resume' && !paused && cleaning) {
        actionState.value = null
      }
      if (actionState.value === 'dock' && (cycle === 'dock' || (!cleaning && !paused && cycle === 'none'))) {
        actionState.value = null
      }
      if (actionState.value === 'start' && cleaning) {
        actionState.value = null
        isStarting.value = false
      }
      if (actionState.value === 'evac' && !cleaning && !paused && cycle === 'none') {
        actionState.value = null
      }
    }
  )

  return {
    actionState,
    isStarting,
    missionStatus,
    isCleaning,
    isPaused,
    isReturning,
    handlePause,
    handleResume,
    handleEvacuate,
    handleDock,
    handleStart
  }
}
