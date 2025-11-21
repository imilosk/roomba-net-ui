<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStatusStore } from '../stores/status'
import { dockRoomba, evacuateRoomba, pauseRoomba, resumeRoomba, startRoomba } from '../services/commandService'

const router = useRouter()
const statusStore = useStatusStore()

const robotNameLabel = computed(() => statusStore.robotName ?? 'Unknown Robot')
const robotNameDisplay = computed(() => statusStore.robotName ?? 'Unknown Robot')

const quickLinks = [
  { id: 'health', label: 'Product Health', icon: 'pulse', hasIndicator: true, route: '/health' },
  { id: 'settings', label: 'Product Settings', icon: 'gear', route: '/settings' },
  { id: 'guide', label: "Owner's Guide", icon: 'book' },
  { id: 'help', label: 'Help', icon: 'lifebuoy' }
]

const tabItems = [
  { id: 'products', label: 'My Products', icon: 'star', active: true },
  { id: 'messages', label: 'Messages', icon: 'chat' }
]

const historyEntry = {
  date: '7 Nov 2025',
  time: '15:34 - 16:03'
}

const batteryPercent = computed(() => (statusStore.isConnected ? statusStore.batteryPercent ?? 0 : 0))
const batteryFillWidth = computed(() => Math.min(100, Math.max(0, batteryPercent.value)))

function batteryFillColor(percent: number) {
  if (percent <= 20) return 'linear-gradient(90deg, #f85944, #d93131)'
  if (percent <= 50) return 'linear-gradient(90deg, #f5c04a, #f0a500)'
  return 'linear-gradient(90deg, #3ccf6c, #2ca35c)'
}

const batteryFillStyle = computed(() => ({
  width: `${batteryFillWidth.value}%`,
  background: batteryFillColor(batteryPercent.value)
}))

const isStarting = ref(false)
const actionState = ref<string | null>(null)

type MissionStatus = {
  cycle?: string
  phase?: string
}

function describeMission(mission?: MissionStatus | null) {
  if (!mission) return 'Ready to vacuum'

  const { cycle, phase } = mission

  if (phase === 'charge' || cycle === 'charge') {
    return 'Charging'
  }

  if (cycle === 'clean') {
    if (phase === 'run') return 'Discovering & cleaning'
    if (phase === 'clean') return 'Cleaning'
    if (phase === 'pause') return 'Paused'
    if (phase === 'stop') return 'Paused'
    if (phase === 'hmUsrDock' || phase === 'dock') return 'Returning home'
    return 'Cleaning in progress'
  }

  if (cycle === 'dock') {
    return 'Returning home'
  }

  if (cycle === 'evac') {
    return 'Emptying bin'
  }

  if (cycle === 'recharge') {
    return 'Charging'
  }

  if (cycle === 'train') {
    return 'Training run'
  }

  if (cycle === 'none') {
    return 'Ready to vacuum'
  }

  return 'Status updating...'
}

const missionStatus = computed(
  () => (statusStore.reportedState as Record<string, any> | null)?.cleanMissionStatus as MissionStatus | undefined
)

const deviceStatusText = computed(() => {
  if (!statusStore.isConnected) {
    return 'Connecting...'
  }

  const mission = missionStatus.value
  if ((statusStore.batteryPercent ?? 0) >= 100 && mission?.cycle !== 'clean') {
    return 'Ready to vacuum'
  }

  return describeMission(missionStatus.value)
})

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

async function handlePause() {
  if (actionState.value) return
  actionState.value = 'pause'
  try {
    await pauseRoomba()
  } catch (err) {
    console.error('Failed to pause cleaning', err)
    actionState.value = null
  }
}

async function handleResume() {
  if (actionState.value) return
  actionState.value = 'resume'
  try {
    await resumeRoomba()
  } catch (err) {
    console.error('Failed to resume cleaning', err)
    actionState.value = null
  }
}

async function handleEvacuate() {
  if (actionState.value) return
  actionState.value = 'evac'
  try {
    await evacuateRoomba()
  } catch (err) {
    console.error('Failed to empty bin', err)
    actionState.value = null
  } finally {
    if (actionState.value === 'evac') {
      actionState.value = null
    }
  }
}

async function handleDock() {
  if (actionState.value) return
  actionState.value = 'dock'
  try {
    await dockRoomba()
  } catch (err) {
    console.error('Failed to send home', err)
    actionState.value = null
  }
}

async function handleStart() {
  if (isStarting.value || actionState.value) return
  isStarting.value = true
  actionState.value = 'start'
  try {
    await startRoomba()
  } catch (err) {
    console.error('Failed to start vacuum', err)
    actionState.value = null
    isStarting.value = false
  }
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
  }
)

function handleQuickLinkClick(route?: string) {
  if (route) {
    router.push(route)
  }
}

function openProductHealth() {
  router.push('/health')
}

onMounted(() => {
  statusStore.init()
})

onUnmounted(() => {
  statusStore.dispose()
})
</script>

<template>
  <div class="screen">
    <div class="screen-inner">
      <header class="app-header">
        <button class="title-button" aria-label="Select product">
          <span>{{ robotNameLabel }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <button class="icon-button" aria-label="Open menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </header>

      <section class="device-card">
        <div class="device-illustration" :class="{ 'show-grid': isCleaning || isReturning }" aria-hidden="true">
          <div class="grid-overlay" aria-hidden="true"></div>
          <div class="roomba-shadow"></div>
          <div class="roomba-shell">
            <div class="ring ring--outer"></div>
            <div class="ring ring--middle"></div>
            <div class="ring ring--inner"></div>
            <div class="ring-dot"></div>
          </div>
        </div>
        <div class="map-row">
          <button class="map-chip" type="button">
            <span>Map</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3a6 6 0 00-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 00-6-6zm0 8.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z" />
            </svg>
          </button>
        </div>
        <div class="device-meta">
          <div>
            <p class="label">{{ robotNameLabel }}</p>
            <p class="status status--ready">{{ deviceStatusText }}</p>
          </div>
          <div class="battery-indicator" :aria-label="`Battery level ${batteryPercent}%`">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13 5l-2 6h3l-2 8" />
            </svg>
            <div class="battery-shell">
              <span class="battery-fill" :style="batteryFillStyle"></span>
            </div>
          </div>
        </div>
        <button v-if="(isCleaning || isReturning) && !isPaused" class="secondary-action pause"
          :class="{ loading: actionState === 'pause' }" type="button" aria-label="Pause cleaning"
          :disabled="actionState === 'pause'" @click="handlePause">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5h2.5v14H9zm5.5 0H17v14h-2.5z" />
          </svg>
          <span>Pause</span>
        </button>
        <div v-else-if="isPaused" class="resume-stack">
          <button class="secondary-action pause" :class="{ loading: actionState === 'resume' }" type="button"
            aria-label="Resume cleaning" :disabled="actionState === 'resume'" @click="handleResume">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l10-7z" />
            </svg>
            <span>Resume</span>
          </button>
          <button class="secondary-action tertiary" :class="{ loading: actionState === 'dock' }" type="button"
            :disabled="actionState === 'dock'" @click="handleDock">
            Send home
          </button>
        </div>
        <button v-else class="secondary-action" type="button" :class="{ loading: actionState === 'evac' }"
          :disabled="actionState === 'evac'" @click="handleEvacuate">
          Empty bin
        </button>
      </section>

      <button class="info-card alert-card" type="button" @click="openProductHealth">
        <div class="alert-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h3l2-5 4 10 2-5h3" />
          </svg>
        </div>
        <div>
          <p class="title">Product Health</p>
          <p class="body">It’s time to replace some of {{ robotNameDisplay }}’s parts.</p>
        </div>
      </button>

      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span>Favourites</span>
          </div>
          <button class="chevron-button" aria-label="Open favourites">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </header>
        <div class="favourites-grid">
          <article class="favourite-card">
            <button class="play-button" :class="{ active: isStarting, loading: actionState === 'start' }" type="button"
              aria-label="Start Vacuum Everywhere" :disabled="actionState === 'start'" @click="handleStart">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 6.75l8.25 5.25-8.25 5.25z" />
              </svg>
            </button>
            <p>Vacuum Everywhere</p>
          </article>
          <article class="favourite-card favourite-card--ghost">
            <span class="plus-icon" aria-hidden="true"></span>
            <p>New job</p>
          </article>
        </div>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Schedule</span>
          </div>
          <button class="chevron-button" aria-label="Open schedule">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </header>
        <p class="panel-body">
          Maintain a clean home throughout the week by setting {{ robotNameDisplay }} to run automatically.
        </p>
        <button class="link-button" type="button">+ Create a schedule</button>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 13h3v7H4zm6-6h3v13h-3zm6-4h3v17h-3z" />
            </svg>
            <span>History</span>
          </div>
          <button class="chevron-button" aria-label="Open history">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </header>
        <article class="history-card">
          <div class="history-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="date">{{ historyEntry.date }}</p>
            <p class="time">{{ historyEntry.time }}</p>
          </div>
        </article>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22s-4-4-7-4V9a7 7 0 1114 0v9c-3 0-7 4-7 4zM12 4a5 5 0 00-5 5v3h10V9a5 5 0 00-5-5z" />
            </svg>
            <span>Messages</span>
          </div>
          <button class="chevron-button" aria-label="Open messages">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </header>
        <div class="messages-card">You are up to date!</div>
      </section>

      <section class="panel quick-links">
        <ul>
          <li v-for="link in quickLinks" :key="link.id">
            <button class="link-row" type="button" @click="handleQuickLinkClick(link.route)">
              <div class="panel-title">
                <svg viewBox="0 0 24 24" aria-hidden="true" :class="`icon-${link.icon}`">
                  <path v-if="link.icon === 'pulse'" d="M4 12h3l2-5 4 10 2-5h3" />
                  <path v-else-if="link.icon === 'gear'"
                    d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm7.5-3.5l1.5 1-1.5 3-1.8-.3a6 6 0 01-1.3 1.3l.3 1.8-3 1.5-1-1.5a6 6 0 01-1.9 0l-1 1.5-3-1.5.3-1.8a6 6 0 01-1.3-1.3l-1.8.3-1.5-3 1.5-1a6 6 0 010-1.9l-1.5-1 1.5-3 1.8.3a6 6 0 011.3-1.3l-.3-1.8 3-1.5 1 1.5a6 6 0 011.9 0l1-1.5 3 1.5-.3 1.8a6 6 0 011.3 1.3l1.8-.3 1.5 3-1.5 1a6 6 0 010 1.9z" />
                  <path v-else-if="link.icon === 'book'"
                    d="M5 5h6a3 3 0 013 3v11a2 2 0 00-2-2H5a2 2 0 00-2 2V7a2 2 0 012-2zm8 0h6a2 2 0 012 2v12a2 2 0 00-2-2h-6z" />
                  <path v-else-if="link.icon === 'lifebuoy'"
                    d="M12 4a8 8 0 108 8 8.009 8.009 0 00-8-8zm0 4a4 4 0 11-4 4 4 4 0 014-4zm0-4v4m0 8v4m4-8h4M4 12h4m8-5.657l2.828-2.828M5.172 18.828l2.828-2.828m8 0l2.828 2.828M5.172 5.172L8 8" />
                </svg>
                <span>{{ link.label }}</span>
              </div>
              <div class="link-meta">
                <span v-if="link.hasIndicator" class="status-dot" aria-hidden="true"></span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </li>
        </ul>
      </section>

      <button class="floating-new-job" type="button">+ New job</button>
    </div>

    <nav class="tab-bar">
      <button v-for="item in tabItems" :key="item.id" :class="['tab-item', { active: item.active }]" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path v-if="item.icon === 'star'"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          <path v-else-if="item.icon === 'chat'" d="M4 5h16a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4V7a2 2 0 012-2z" />
        </svg>
        <span>{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--app-bg);
}

.screen-inner {
  width: min(420px, 100%);
  margin: 0 auto;
  padding: 1.25rem 1.25rem 7rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.title-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  padding: 0;
}

.title-button svg,
.icon-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.icon-button {
  border: none;
  background: transparent;
  padding: 0.35rem;
  border-radius: 999px;
  color: var(--text-primary);
}

.device-card {
  padding: 1.5rem;
  background: var(--panel-bg);
  border-radius: 24px;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.device-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.device-meta .label {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
}

.device-meta .status {
  margin: 0.1rem 0 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.status--ready {
  font-size: 1.2rem;
}

.battery-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
  color: var(--text-primary);
}

.battery-indicator svg {
  width: 18px;
  height: 18px;
  stroke: var(--battery-stroke);
  stroke-width: 1.8;
  fill: none;
}

.battery-shell {
  width: 64px;
  height: 18px;
  border-radius: 999px;
  background: var(--battery-shell-bg);
  overflow: hidden;
  position: relative;
}

.battery-fill {
  display: block;
  height: 100%;
  background: var(--battery-fill-gradient);
}

.secondary-action {
  border: none;
  background: var(--card-muted-bg);
  color: var(--accent-strong);
  font-weight: 600;
  border-radius: 16px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  width: 100%;
}

.secondary-action.pause {
  background: linear-gradient(135deg, var(--button-primary-bg), var(--accent-strong));
  color: var(--button-primary-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.secondary-action.pause svg {
  width: 18px;
  height: 18px;
  stroke: none;
  fill: currentColor;
}

.secondary-action.loading {
  opacity: 0.65;
  cursor: not-allowed;
  animation: buttonPulse 0.8s ease-in-out infinite alternate;
}

.secondary-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-action.tertiary {
  background: var(--panel-bg);
  color: var(--text-primary);
  box-shadow: inset 0 0 0 1px var(--border-subtle);
}

.secondary-action.tertiary.returning {
  opacity: 0.6;
  cursor: not-allowed;
}

.resume-stack {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.device-illustration {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background-image: linear-gradient(rgba(79, 102, 140, 0.18) 1.5px, transparent 1.5px),
    linear-gradient(90deg, rgba(79, 102, 140, 0.18) 1.5px, transparent 1.5px);
  background-size: 180px 180px;
  background-position: -90px -90px;
  opacity: 0;
  z-index: 0;
  pointer-events: none;
}

.device-illustration.show-grid .grid-overlay {
  animation: gridFlow 4s linear infinite;
  opacity: 1;
}

.roomba-shell {
  width: 142.5px;
  height: 142.5px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #70757f, #3b3f46);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 10px 25px rgba(0, 0, 0, 0.35);
}

.ring {
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  position: absolute;
}

.ring--outer {
  width: 120px;
  height: 120px;
  border-color: rgba(255, 255, 255, 0.15);
}

.ring--middle {
  width: 86.25px;
  height: 86.25px;
  border-color: rgba(255, 255, 255, 0.35);
}

.ring--inner {
  width: 45px;
  height: 45px;
  border-color: rgba(255, 255, 255, 0.6);
}

.ring-dot {
  width: 10.5px;
  height: 10.5px;
  border-radius: 50%;
  background: var(--chip-border);
  position: absolute;
}

.roomba-shadow {
  position: absolute;
  bottom: 25px;
  width: 112.5px;
  height: 30px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.3), transparent 70%);
  filter: blur(10px);
  z-index: 0;
}

.map-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.map-chip {
  border: none;
  background: var(--panel-bg);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  box-shadow: var(--shadow-card);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.map-chip svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--accent-strong);
  stroke-width: 1.4;
}

.info-card {
  background: var(--panel-bg);
  border-radius: 20px;
  padding: 1rem 1.25rem;
  display: flex;
  gap: 0.75rem;
  box-shadow: var(--shadow-card);
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.alert-card {
  align-items: center;
}

.alert-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--alert-bg);
  color: var(--alert-text);
  display: grid;
  place-items: center;
}

.alert-icon svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.info-card .title {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.info-card .body {
  margin: 0.25rem 0 0;
  color: var(--status-muted);
  font-size: 0.95rem;
}

.panel {
  background: var(--panel-bg);
  border-radius: 22px;
  padding: 1.15rem 1.25rem;
  box-shadow: 0 12px 24px rgba(24, 34, 49, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
}

.panel-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.panel-title svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  stroke-width: 1.6;
  fill: none;
}

.panel-title svg.icon-gear {
  stroke-width: 1.2;
}

.panel-title svg.icon-book,
.panel-title svg.icon-lifebuoy {
  stroke-width: 1.3;
}

.chevron-button {
  border: none;
  background: transparent;
  padding: 0;
  color: var(--icon--primary);
  transition: color 0.2s ease;
}

.chevron-button svg {
  width: 16px;
  height: 16px;
  stroke-width: 1.8;
  stroke: currentColor;
  fill: none;
}

.favourites-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.95rem;
}

.favourite-card {
  background: var(--card-muted-bg);
  border-radius: 18px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 120px;
}

.favourite-card--ghost {
  background: var(--card-muted-bg);
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--status-muted);
  font-weight: 600;
}

.favourite-card p {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.play-button {
  border: none;
  background: var(--accent-strong);
  color: #fff;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.play-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.play-button svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.play-button.active {
  transform: scale(1.06);
  box-shadow: 0 0 0 0 rgba(30, 99, 255, 0.4);
  animation: pulse 0.6s ease;
}

.play-button.loading,
.play-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(30, 99, 255, 0.4);
  }

  70% {
    box-shadow: 0 0 0 12px rgba(30, 99, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(30, 99, 255, 0);
  }
}

@keyframes buttonPulse {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-1px);
  }
}

.plus-icon {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  border: 1.5px dashed var(--card-dashed-border);
  position: relative;
}

.plus-icon::before,
.plus-icon::after {
  content: '';
  position: absolute;
  background: var(--accent-soft);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.plus-icon::before {
  width: 2px;
  height: 18px;
}

.plus-icon::after {
  width: 18px;
  height: 2px;
}

.panel-body {
  margin: 0 0 0.75rem;
  color: var(--status-muted);
  line-height: 1.45;
}

.link-button {
  border: none;
  background: transparent;
  color: var(--accent-strong);
  font-weight: 600;
  padding: 0;
}

.history-card {
  border-radius: 18px;
  background: var(--card-muted-bg);
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.history-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--tag-bg);
  color: var(--accent-strong);
  display: grid;
  place-items: center;
}

.history-icon svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.history-card .date {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.history-card .time {
  margin: 0.15rem 0 0;
  color: var(--status-muted);
  font-size: 0.95rem;
}

.messages-card {
  border: 1.5px dashed var(--card-dashed-border);
  border-radius: 18px;
  padding: 1.25rem;
  text-align: center;
  color: var(--text-tertiary);
  font-weight: 600;
}

.quick-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.link-row {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  cursor: pointer;
  color: var(--text-primary);
}

.link-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.link-meta svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
  transition: stroke 0.2s ease;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-strong);
}

.floating-new-job {
  align-self: flex-end;
  position: sticky;
  bottom: 5rem;
  margin-top: -0.5rem;
  border: none;
  border-radius: 18px;
  background: var(--button-primary-bg);
  color: var(--button-primary-color);
  font-weight: 600;
  padding: 0.9rem 1.35rem;
  box-shadow: var(--button-primary-shadow);
}

.tab-bar {
  width: min(420px, 100%);
  margin: 0 auto;
  background: var(--shell-bg);
  border-top: 1px solid var(--border-subtle);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.35rem 0.5rem env(safe-area-inset-bottom, 0.5rem);
  position: sticky;
  bottom: 0;
}

.tab-item {
  border: none;
  background: transparent;
  border-radius: 16px;
  padding: 0.45rem 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  color: var(--status-tertiary);
  font-size: 0.8rem;
}

.tab-item svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

.tab-item.active {
  color: var(--accent-strong);
  font-weight: 600;
}

@media (min-width: 768px) {
  .screen {
    padding-bottom: 1rem;
  }

  .screen-inner {
    padding-top: 2.5rem;
    padding-bottom: 8rem;
  }
}

@keyframes gridFlow {
  0% {
    background-position: -100px -90px, -100px -90px;
  }

  100% {
    background-position: -100px 90px, -100px 90px;
  }
}
</style>
