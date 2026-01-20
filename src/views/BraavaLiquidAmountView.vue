<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBraavaSettingsStore } from '../stores/braavaSettings'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

const router = useRouter()
const store = useBraavaSettingsStore()

const options = [
  { id: 1, title: 'Eco', desc: 'Light moisture for quick refresh.' },
  { id: 2, title: 'Standard', desc: 'Balanced moisture for everyday cleaning.' },
  { id: 3, title: 'Ultra', desc: 'Deep clean with maximum liquid.' }
]

function handleBack() {
  router.push('/settings')
}

function selectOption(value: number) {
  if (store.loading || store.liquidAmount === value) return
  store.setLiquidAmount(value as 1 | 2 | 3)
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Liquid Amount" @back="handleBack" />

      <main>
        <ul>
          <li v-for="option in options" :key="option.id">
            <button type="button" :disabled="store.loading" @click="selectOption(option.id)">
              <div>
                <p class="title">{{ option.title }}</p>
                <p class="desc">{{ option.desc }}</p>
              </div>
              <span class="radio" :class="{ checked: store.liquidAmount === option.id }"></span>
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
