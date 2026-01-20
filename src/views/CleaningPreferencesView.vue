<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import { useBraavaSettingsStore } from '../stores/braavaSettings'
import { useSettingsAvailabilityStore } from '../stores/settingsAvailability'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'
import SettingsRow from '../components/SettingsRow.vue'

const router = useRouter()
const cleaningStore = useCleaningPreferencesStore()
const braavaStore = useBraavaSettingsStore()
const availabilityStore = useSettingsAvailabilityStore()

const passesLabel = computed(() => {
  switch (cleaningStore.passes) {
    case 1:
      return 'One pass'
    case 2:
      return 'Two pass'
    case 3:
      return 'Room-size clean'
    default:
      return 'Syncing...'
  }
})

const binLabel = computed(() => {
  if (cleaningStore.binPause === null) {
    return 'Syncing...'
  }

  return cleaningStore.binPause ? 'Do not clean when full' : 'Keep cleaning when full'
})

const overlapLabel = computed(() => {
  if (braavaStore.rankOverlap === null) return 'Syncing...'
  return `${braavaStore.rankOverlap}%`
})

const liquidLabel = computed(() => {
  switch (braavaStore.liquidAmount) {
    case 1:
      return 'Eco'
    case 2:
      return 'Standard'
    case 3:
      return 'Ultra'
    default:
      return 'Syncing...'
  }
})

const showCleaningPasses = computed(() => {
  if (!availabilityStore.hasLoaded) return true
  return availabilityStore.hasSetting('cleaningPasses')
})

const showBinPause = computed(() => {
  if (!availabilityStore.hasLoaded) return true
  return availabilityStore.hasSetting('binPause')
})

const showOverlap = computed(() => {
  if (!availabilityStore.hasLoaded) return true
  return availabilityStore.hasSetting('rankOverlap')
})

const showLiquid = computed(() => {
  if (!availabilityStore.hasLoaded) return true
  return availabilityStore.hasSetting('padWetness')
})

function handleBack() {
  router.push('/settings')
}

function openPasses() {
  router.push('/settings/cleaning/passes')
}

function openBinBehaviour() {
  router.push('/settings/cleaning/bin')
}

function openOverlap() {
  router.push('/settings/braava/overlap')
}

function openLiquid() {
  router.push('/settings/braava/liquid')
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Cleaning Preferences" @back="handleBack" />

      <main>
        <SettingsRow
          v-if="showCleaningPasses"
          title="Cleaning Passes"
          :subtitle="passesLabel"
          @click="openPasses"
        />
        <SettingsRow
          v-if="showBinPause"
          title="Bin Full Behaviour"
          :subtitle="binLabel"
          @click="openBinBehaviour"
        />
        <SettingsRow
          v-if="showOverlap"
          title="Web Mopping Overlap"
          :subtitle="overlapLabel"
          @click="openOverlap"
        />
        <SettingsRow
          v-if="showLiquid"
          title="Liquid Amount"
          :subtitle="liquidLabel"
          @click="openLiquid"
        />
      </main>
    </ShellContainer>
  </ShellScreen>
</template>

<style scoped>

main {
  flex: 1;
  padding: 1rem 0;
}
</style>
