<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBraavaSettingsStore } from '../stores/braavaSettings'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

const router = useRouter()
const store = useBraavaSettingsStore()

const overlapValue = computed(() => store.rankOverlap ?? 50)
const overlapLabel = computed(() => (store.rankOverlap === null ? 'Syncing...' : `${store.rankOverlap}%`))

function handleBack() {
  router.push('/settings')
}

function updateOverlap(event: Event) {
  const target = event.target as HTMLInputElement
  store.setRankOverlap(Number(target.value))
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Web Mopping Overlap" @back="handleBack" />

      <main>
        <section class="panel">
          <header>
            <h2>Overlap</h2>
            <span class="value">{{ overlapLabel }}</span>
          </header>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            :value="overlapValue"
            :disabled="store.loading"
            @change="updateOverlap"
          />
          <p class="hint">
            Set how much the robot overlaps its previous path across your floor. Higher overlap cleans more thoroughly
            but takes longer.
          </p>
        </section>
        <p v-if="store.error" class="error">{{ store.error }}</p>
      </main>
    </ShellContainer>
  </ShellScreen>
</template>

<style scoped>
main {
  flex: 1;
  padding: 1.25rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel {
  background: var(--panel-bg);
  border-radius: 18px;
  padding: 1.1rem 1.25rem;
  box-shadow: var(--shadow-card);
}

.panel header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.panel h2 {
  margin: 0;
  font-size: 1rem;
}

.value {
  font-weight: 600;
  color: var(--accent-strong);
}

input[type='range'] {
  width: 100%;
  margin: 0.75rem 0 0.35rem;
  accent-color: var(--accent-strong);
}

.hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.error {
  text-align: center;
  margin: 0;
  color: var(--error-text);
  font-weight: 600;
}
</style>
