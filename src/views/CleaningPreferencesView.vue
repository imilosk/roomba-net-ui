<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import ShellHeader from '../components/ShellHeader.vue'

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
  <div class="screen">
    <div class="shell">
      <ShellHeader title="Cleaning Preferences" @back="handleBack" />

      <main>
        <button class="row" type="button" @click="openPasses">
          <div class="row-text">
            <p class="title">Cleaning Passes</p>
            <p class="subtitle">{{ passesLabel }}</p>
          </div>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button class="row" type="button" @click="openBinBehaviour">
          <div class="row-text">
            <p class="title">Bin Full Behaviour</p>
            <p class="subtitle">{{ binLabel }}</p>
          </div>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </main>
    </div>
  </div>
</template>

<style scoped>
.screen {
  min-height: calc(100vh - max(0.75rem, env(safe-area-inset-bottom)));
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

.shell {
  width: min(420px, 100%);
  min-height: 100vh;
  background: var(--shell-bg);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 1rem 0;
}

.row {
  width: 100%;
  border: none;
  background: transparent;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.row-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.row svg {
  width: 20px;
  height: 20px;
  stroke: var(--icon-muted);
  stroke-width: 1.6;
  fill: none;
}

.title {
  margin: 0;
  font-weight: 600;
}

.subtitle {
  margin: 0.1rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.row+.row {
  border-top: 1px solid var(--border-subtle);
}
</style>
