<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCleaningPreferencesStore } from '../stores/cleaningPreferences'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

const router = useRouter()
const store = useCleaningPreferencesStore()

const options = [
  { id: 1, title: 'One pass' },
  { id: 2, title: 'Two pass' },
  {
    id: 3,
    title: 'Room-size clean',
    desc: 'Use this to balance cleaning time with room size. Roomba covers larger rooms once and small-to-medium rooms 2–3 times.'
  }
]

const selected = computed(() => store.passes)

function handleBack() {
  router.push('/settings/cleaning')
}

function selectPass(value: number) {
  if (store.loading || selected.value === value) return
  store.setPasses(value as 1 | 2 | 3)
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Cleaning Passes" @back="handleBack" />

      <main>
        <ul>
          <li v-for="option in options" :key="option.id">
            <button type="button" :disabled="store.loading" @click="selectPass(option.id)">
              <div>
                <p class="title">{{ option.title }}</p>
                <p v-if="option.desc" class="desc">{{ option.desc }}</p>
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
