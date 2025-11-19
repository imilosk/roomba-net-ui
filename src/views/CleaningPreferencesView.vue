<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'

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
      return ''
  }
})

const binLabel = computed(() => (cleaningStore.binPause ? 'Do not clean when full' : 'Keep cleaning when full'))

function handleBack() {
  router.back()
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
      <header class="header">
        <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <p>Cleaning Preferences</p>
      </header>

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
  min-height: 100vh;
  background: #f7f8fb;
  display: flex;
  justify-content: center;
}

.shell {
  width: min(420px, 100%);
  min-height: 100vh;
  background: #fff;
  box-shadow: 0 20px 45px rgba(21, 31, 45, 0.07);
  display: flex;
  flex-direction: column;
}

.header {
  position: relative;
  padding: 0.9rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e2e6ef;
}

.header p {
  margin: 0;
  font-weight: 600;
}

.back-button {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
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
  stroke: #a3aab8;
  stroke-width: 1.6;
  fill: none;
}

.title {
  margin: 0;
  font-weight: 600;
}

.subtitle {
  margin: 0.1rem 0 0;
  color: #6b7284;
  font-size: 0.9rem;
}

.row + .row {
  border-top: 1px solid #e7ebf3;
}
</style>
