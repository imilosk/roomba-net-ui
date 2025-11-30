<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

const router = useRouter()
const themeStore = useThemeStore()

const options = [
  { id: 'light', title: 'Light' },
  { id: 'dark', title: 'Dark' },
  { id: 'system', title: 'Match system' }
] as const

const selected = computed(() => themeStore.preference)

function handleBack() {
  router.push('/settings')
}

function selectTheme(value: 'light' | 'dark' | 'system') {
  if (selected.value === value) return
  themeStore.setPreference(value)
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Appearance" @back="handleBack" />

      <main>
        <ul>
          <li v-for="option in options" :key="option.id">
            <button type="button" :disabled="selected === option.id" @click="selectTheme(option.id)">
              <div>
                <p class="title">{{ option.title }}</p>
                <p v-if="option.id === 'system'" class="desc">Automatically matches your device theme.</p>
              </div>
              <span class="radio" :class="{ checked: selected === option.id }"></span>
            </button>
          </li>
        </ul>
      </main>
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
  text-align: left;
  gap: 1rem;
  color: var(--text-primary);
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
  flex-shrink: 0;
  position: relative;
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
</style>
