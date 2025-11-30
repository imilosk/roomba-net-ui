<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChildLockStore } from '../stores/childLock'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import { useStatusStore } from '../stores/status'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
const childLockStore = useChildLockStore()
const cleaningStore = useCleaningPreferencesStore()
const statusStore = useStatusStore()
const themeStore = useThemeStore()

onMounted(() => {
  childLockStore.initStream()
})

const robotNameDisplay = computed(() => statusStore.robotName ?? 'Unknown Robot')
const themeSubtitle = computed(() => {
  switch (themeStore.preference) {
    case 'dark':
      return 'Dark'
    case 'light':
      return 'Light'
    default:
      return 'System default'
  }
})

const settingsItems = computed<SettingsItem[]>(() => [
  { id: 'appearance', title: 'Appearance', subtitle: themeSubtitle.value, route: '/settings/appearance' },
  { id: 'about', title: `About ${robotNameDisplay.value}`, route: '/settings/about' },
  { id: 'locate', title: `Locate ${robotNameDisplay.value}`, route: '/settings/locate' },
  { id: 'cleaning', title: 'Cleaning Preferences', route: '/settings/cleaning' },
  { id: 'lock', title: 'Child/Pet Lock', route: '/settings/child-lock' },
  { id: 'language', title: 'Robot Language', subtitle: 'English (United Kingdom)' },
  { id: 'reboot', title: `Reboot ${robotNameDisplay.value}`, route: '/settings/reboot' },
  {
    id: 'wifi-settings',
    title: 'Wi-Fi Settings',
    subtitle: statusStore.wifiSsid ?? 'Syncing...',
    route: '/settings/wifi'
  },
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
  router.push({ path: '/' })
}

type SettingsItem = {
  id: string
  title: string
  subtitle?: string
  route?: string
  action?: () => void
}

function handleRowClick(item: SettingsItem) {
  if (item.action) {
    item.action()
    return
  }
  if (item.route) {
    router.push(item.route)
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
        <span class="header-spacer" aria-hidden="true"></span>
      </header>

      <main class="settings-body">
        <ul class="settings-list">
        <li v-for="item in settingsItems" :key="item.id">
          <button class="settings-row" type="button" @click="handleRowClick(item)">
            <div>
              <p class="row-title">{{ item.title }}</p>
              <p v-if="item.id === 'lock'" class="row-subtitle">{{ childLockSubtitle }}</p>
              <p v-else-if="item.id === 'cleaning'" class="row-subtitle">{{ cleaningSubtitle }}</p>
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
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

.settings-shell {
  width: min(420px, 100%);
  background: var(--shell-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-soft);
}

.settings-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 0.9rem 1.25rem;
  padding-top: calc(0.9rem + constant(safe-area-inset-top));
  padding-top: calc(0.9rem + env(safe-area-inset-top));
  background: var(--shell-bg);
  border-bottom: 1px solid var(--border-subtle);
}

.back-button {
  margin-right: 0.75rem;
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  color: var(--icon-muted);
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
  flex: 1;
  margin: 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-spacer {
  width: 20px;
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
  border-top: 1px solid var(--border-subtle);
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
  color: var(--text-primary);
}

.row-title {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 600;
}

.row-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.settings-row svg {
  width: 18px;
  height: 18px;
  stroke: var(--icon-muted);
  stroke-width: 1.8;
  fill: none;
}
</style>
