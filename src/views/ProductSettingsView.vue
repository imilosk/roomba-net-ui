<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChildLockStore } from '../stores/childLock'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import { useStatusStore } from '../stores/status'

const router = useRouter()
const childLockStore = useChildLockStore()
const cleaningStore = useCleaningPreferencesStore()
const statusStore = useStatusStore()

onMounted(() => {
  childLockStore.initStream()
})

const robotNameDisplay = computed(() => statusStore.robotName ?? 'Unknown Robot')

const settingsItems = computed(() => [
  { id: 'about', title: `About ${robotNameDisplay.value}` },
  { id: 'locate', title: `Locate ${robotNameDisplay.value}`, route: '/settings/locate' },
  { id: 'clean-base', title: 'About Clean Base™' },
  { id: 'cleaning', title: 'Cleaning Preferences', route: '/settings/cleaning' },
  { id: 'lock', title: 'Child/Pet Lock', route: '/settings/child-lock' },
  { id: 'language', title: 'Robot Language', subtitle: 'English (United Kingdom)' },
  { id: 'reboot', title: `Reboot ${robotNameDisplay.value}`, route: '/settings/reboot' },
  { id: 'wifi-settings', title: 'Wi-Fi Settings', subtitle: 'Virus_Infected_Network_2G' },
  { id: 'wifi-reconnect', title: 'Reconnect or change Wi-Fi' }
])

const childLockSubtitle = computed(() => {
  const status = childLockStore.isEnabled
  if (status === null) return 'Syncing...'
  return status ? 'Enabled' : 'Disabled'
})

const passesLabel = computed(() => {
  if (cleaningStore.passes === null) {
    return 'Syncing...'
  }

  switch (cleaningStore.passes) {
    case 1:
      return 'One pass'
    case 2:
      return 'Two pass'
    case 3:
      return 'Room-size clean'
    default:
      return ''
  }
})

const binLabel = computed(() => {
  if (cleaningStore.binPause === null) {
    return 'Syncing...'
  }

  return cleaningStore.binPause ? 'Do not clean when full' : 'Keep cleaning when full'
})

const cleaningSubtitle = computed(() => {
  if (passesLabel.value === 'Syncing...' || binLabel.value === 'Syncing...') {
    return 'Syncing...'
  }

  return [passesLabel.value, binLabel.value].filter(Boolean).join(' · ')
})

function handleBack() {
  router.back()
}

function handleItemClick(route?: string) {
  if (route) {
    router.push(route)
  }
}
</script>

<template>
  <div class="settings-screen">
    <div class="settings-shell">
      <header class="settings-header">
        <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <p class="settings-title">Product Settings</p>
      </header>

      <main class="settings-body">
        <ul class="settings-list">
        <li v-for="item in settingsItems" :key="item.id">
          <button class="settings-row" type="button" @click="handleItemClick(item.route)">
            <div>
              <p class="row-title">{{ item.title }}</p>
              <p v-if="item.id === 'lock'" class="row-subtitle">{{ childLockSubtitle }}</p>
              <p v-else-if="item.id === 'cleaning' && false" class="row-subtitle">{{ cleaningSubtitle }}</p>
              <p v-else-if="item.subtitle" class="row-subtitle">{{ item.subtitle }}</p>
            </div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>

<style scoped>
.settings-screen {
  min-height: 100vh;
  background: #f3f6fb;
  display: flex;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.settings-shell {
  width: min(420px, 100%);
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.settings-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e6ef;
}

.back-button {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  color: #a3aab8;
  padding: 0.3rem;
}

.back-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.settings-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111622;
}

.settings-body {
  flex: 1;
}

.settings-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.settings-list li + li {
  border-top: 1px solid #edf0f6;
}

.settings-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  border: none;
  background: transparent;
  padding: 1rem 1.25rem;
}

.row-title {
  margin: 0;
  font-size: 0.95rem;
  color: #141922;
  font-weight: 600;
}

.row-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #7b8394;
}

.settings-row svg {
  width: 18px;
  height: 18px;
  stroke: #a3aab8;
  stroke-width: 1.8;
  fill: none;
}
</style>
