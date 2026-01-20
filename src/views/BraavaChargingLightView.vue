<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBraavaSettingsStore } from '../stores/braavaSettings'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

const router = useRouter()
const store = useBraavaSettingsStore()

const options = [
  { id: 0, title: 'Docking & charging', desc: 'Full status lights while charging.' },
  { id: 1, title: 'Docking only', desc: 'Lights during docking, off while charging.' },
  { id: 2, title: 'No status lights', desc: 'Keep the dock lights off.' }
]

function handleBack() {
  router.push('/settings')
}

function selectOption(value: number) {
  if (store.loading || store.chargingLightPattern === value) return
  store.setChargingLightPattern(value as 0 | 1 | 2)
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Charging Light Pattern" @back="handleBack" />

      <main>
        <ul>
          <li v-for="option in options" :key="option.id">
            <button type="button" :disabled="store.loading" @click="selectOption(option.id)">
              <div>
                <p class="title">{{ option.title }}</p>
                <p class="desc">{{ option.desc }}</p>
              </div>
              <span class="radio" :class="{ checked: store.chargingLightPattern === option.id }"></span>
            </button>
          </li>
        </ul>
        <p v-if="store.error" class="error">{{ store.error }}</p>
      </main>
    </ShellContainer>
  </ShellScreen>
</template>

<style scoped>
main {
  flex: 1;
  padding: 1.25rem 0.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.error {
  text-align: center;
  margin: 0;
  color: var(--error-text);
  font-weight: 600;
}
</style>
