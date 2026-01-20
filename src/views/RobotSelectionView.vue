<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRobotsStore } from '../stores/robots'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

const router = useRouter()
const robotsStore = useRobotsStore()

const selectedId = computed(() => robotsStore.selectedRobotId)
const hasRobots = computed(() => robotsStore.robots.length > 0)

function truncateLabel(value: string, maxLength = 10) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

onMounted(() => {
  robotsStore.hydrateSelection()
  robotsStore.loadRobots().catch(() => undefined)
})

function handleBack() {
  router.back()
}

function selectRobot(blid: string) {
  robotsStore.selectRobot(blid)
  router.back()
}

function refreshList() {
  if (!robotsStore.loading) {
    robotsStore.refresh().catch(() => undefined)
  }
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Select Robot" @back="handleBack" />

      <main>
        <section class="info-card">
          <h2>Registered robots</h2>
          <p class="hint">
            Add robots via the API at <span class="mono">/api/roomba/robots</span> if this list is empty.
          </p>
          <button class="refresh-button" type="button" :disabled="robotsStore.loading" @click="refreshList">
            {{ robotsStore.loading ? 'Refreshing…' : 'Refresh list' }}
          </button>
        </section>

        <section class="robot-list">
          <ul v-if="hasRobots">
            <li v-for="robot in robotsStore.robots" :key="robot.blid">
              <button type="button" :disabled="robotsStore.loading" @click="selectRobot(robot.blid)">
                <div>
                  <p class="title">{{ truncateLabel(robot.blid) }}</p>
                  <p class="desc">IP {{ robot.ip }} · Port {{ robot.port }}</p>
                </div>
                <span class="radio" :class="{ checked: selectedId === robot.blid }"></span>
              </button>
            </li>
          </ul>
          <p v-else class="empty-state">No robots found yet.</p>
        </section>

        <p v-if="robotsStore.error" class="error">{{ robotsStore.error }}</p>
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
  gap: 1.5rem;
}

.info-card {
  background: var(--panel-bg);
  border-radius: 18px;
  padding: 1.1rem 1.25rem;
  box-shadow: var(--shadow-card);
}

.info-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.hint {
  margin: 0 0 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.mono {
  font-family: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
}

.refresh-button {
  border: none;
  border-radius: 12px;
  padding: 0.6rem 0.9rem;
  font-weight: 600;
  color: var(--button-primary-color);
  background: var(--button-primary-bg);
  box-shadow: var(--button-primary-shadow);
}

.robot-list ul {
  margin: 0;
  padding: 0;
  list-style: none;
  background: var(--panel-bg);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
}

.robot-list li + li {
  border-top: 1px solid var(--border-subtle);
}

.robot-list button {
  width: 100%;
  border: none;
  background: transparent;
  padding: 1rem 1.1rem;
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
  margin: 0.3rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
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

.empty-state {
  margin: 0;
  text-align: center;
  color: var(--text-secondary);
}

.error {
  margin: 0;
  text-align: center;
  color: var(--error-text);
  font-weight: 600;
}
</style>
