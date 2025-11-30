<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import { useStatusStore } from '../stores/status'

const router = useRouter()
const store = useCleaningPreferencesStore()
const statusStore = useStatusStore()

const robotNameDisplay = computed(() => statusStore.robotName ?? 'Unknown Robot')

const options = computed(() => [
  {
    id: false,
    title: 'Keep cleaning when full',
    desc: `${robotNameDisplay.value} will start and complete cleaning jobs even when it detects that its bin is full.`
  },
  {
    id: true,
    title: 'Do not clean when full',
    desc: `${robotNameDisplay.value} will stop new jobs and pause existing ones if it detects that the bin is full.`
  }
])

function handleBack() {
  router.push('/settings/cleaning')
}

function selectOption(value: boolean) {
  if (store.loading || store.binPause === null || store.binPause === value) return
  store.setBinPause(value)
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
        <p>Bin Full Behaviour</p>
        <span class="header-spacer" aria-hidden="true"></span>
      </header>

      <main>
        <ul>
          <li v-for="option in options" :key="String(option.id)">
            <button type="button" :disabled="store.loading" @click="selectOption(option.id)">
              <div>
                <p class="title">{{ option.title }}</p>
                <p class="desc">{{ option.desc }}</p>
              </div>
              <span class="radio" :class="{ checked: store.binPause === option.id }"></span>
            </button>
          </li>
        </ul>
      </main>
      <p class="learn-more">Learn more</p>
    </div>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

.shell {
  width: min(420px, 100%);
  background: var(--shell-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-soft);
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0.9rem 1.25rem;
  padding-top: calc(0.9rem + constant(safe-area-inset-top));
  padding-top: calc(0.9rem + env(safe-area-inset-top));
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  background: var(--shell-bg);
}

.header p {
  flex: 1;
  margin: 0;
  text-align: center;
  font-weight: 600;
}

.header-spacer {
  width: 20px;
}

.back-button {
  margin-right: 0.75rem;
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

main {
  flex: 1;
  padding: 1.25rem 0.5rem;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li + li {
  border-top: 1px solid var(--border-subtle);
}

button {
  width: 100%;
  border: none;
  background: transparent;
  padding: 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
}

.title {
  margin: 0;
  font-weight: 600;
}

.desc {
  margin: 0.35rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.radio {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  position: relative;
  flex-shrink: 0;
}

.radio.checked {
  border-color: var(--accent-strong);
}

.radio.checked::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--accent-strong);
}

.learn-more {
  text-align: center;
  color: var(--accent-strong);
  font-weight: 600;
  margin: 0 0 1.5rem;
}
</style>
