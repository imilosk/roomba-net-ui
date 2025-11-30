<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'
import SettingsRow from '../components/SettingsRow.vue'

const router = useRouter()
const cleaningStore = useCleaningPreferencesStore()

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

function handleBack() {
  router.push('/settings')
}

function openPasses() {
  router.push('/settings/cleaning/passes')
}

function openBinBehaviour() {
  router.push('/settings/cleaning/bin')
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Cleaning Preferences" @back="handleBack" />

      <main>
        <SettingsRow title="Cleaning Passes" :subtitle="passesLabel" @click="openPasses" />
        <SettingsRow title="Bin Full Behaviour" :subtitle="binLabel" @click="openBinBehaviour" />
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
