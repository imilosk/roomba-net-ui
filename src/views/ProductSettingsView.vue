<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChildLockStore } from '../stores/childLock'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import { useStatusStore } from '../stores/status'
import { useThemeStore } from '../stores/theme'

import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'
import SettingsRow from '../components/SettingsRow.vue'

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

function getItemSubtitle(item: SettingsItem): string | null {
  if (item.id === 'lock') return childLockSubtitle.value
  if (item.id === 'cleaning') return cleaningSubtitle.value
  return item.subtitle ?? null
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Product Settings" @back="handleBack" />

      <main class="settings-body">
        <ul class="settings-list">
          <li v-for="item in settingsItems" :key="item.id">
            <SettingsRow
              :title="item.title"
              :subtitle="getItemSubtitle(item)"
              @click="handleRowClick(item)"
            />
          </li>
        </ul>
      </main>
    </ShellContainer>
  </ShellScreen>
</template>

<style scoped>

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
</style>
