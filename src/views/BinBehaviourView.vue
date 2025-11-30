<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import { useStatusStore } from '../stores/status'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

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
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Bin Full Behaviour" @back="handleBack" />

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
    </ShellContainer>
  </ShellScreen>
</template>

<style scoped>

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
