<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatusStore } from '../stores/status'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

const router = useRouter()
const statusStore = useStatusStore()
const robotNameDisplay = computed(() => statusStore.robotName ?? 'Unknown Robot')

const parts = [
  {
    id: 'filter',
    name: 'High-Efficiency Filter',
    usagePercent: 15,
    status: 'good',
    canOrder: true,
    canReset: true
  },
  {
    id: 'brushes',
    name: 'Dual Multi-Surface Brushes',
    usagePercent: 20,
    status: 'warning',
    canOrder: true,
    canReset: true
  },
  {
    id: 'edge-brush',
    name: 'Edge-Sweeping Brush',
    usagePercent: 70,
    status: 'good',
    hoursLeft: '~ 119 HRS LEFT',
    canReset: true
  },
  {
    id: 'bag',
    name: 'Dirt Disposal Bag',
    usagePercent: 85,
    status: 'critical',
    hoursLeft: '~ 25 HRS LEFT',
    canReset: true
  }
]

const usageWidth = (percent: number) => `${Math.min(100, Math.max(0, percent))}%`
const meterColor = (part: (typeof parts)[number]) => {
  if (part.usagePercent < 70) return '#3ccf6c'
  if (part.usagePercent < 80) return '#f5c04a'
  return '#ff6b57'
}

function handleBack() {
  router.push('/settings')
}
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader title="Product Health" show-help @back="handleBack" />

      <main class="health-content">
        <p class="device-label">{{ robotNameDisplay }}</p>
        <ul class="parts-list">
          <li v-for="part in parts" :key="part.id">
            <article class="part-card">
              <header class="part-header">
                <p class="part-name">{{ part.name }}</p>
                <button v-if="part.canReset" class="link-button" type="button">Reset</button>
              </header>
              <div class="part-meter">
                <div
                  class="part-meter-fill"
                  :style="{ width: usageWidth(part.usagePercent), backgroundColor: meterColor(part) }"
                ></div>
              </div>
              <p v-if="part.hoursLeft" class="part-meta">{{ part.hoursLeft }}</p>
              <button v-if="part.usagePercent >= 80" class="order-button" type="button">
                Order part
              </button>
            </article>
          </li>
        </ul>
        <p class="footnote">
          Note: Statuses are based on cleaning time and replacement recommendations for each part.
        </p>
      </main>
    </ShellContainer>
  </ShellScreen>
</template>

<style scoped>
.health-content {
  flex: 1;
  padding: 1.25rem 1.25rem 1.5rem;
  background: var(--shell-bg);
}

.device-label {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  letter-spacing: 0.1em;
  margin: 0 0 1rem;
}

.parts-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.part-card {
  background: var(--panel-bg);
  border-radius: 18px;
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
}

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.part-name {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.link-button {
  border: none;
  background: transparent;
  color: var(--accent-strong);
  font-weight: 600;
  padding: 0;
}

.part-meter {
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: var(--card-muted-bg);
  overflow: hidden;
}

.part-meter-fill {
  height: 100%;
  border-radius: inherit;
}

.part-meta {
  margin: 0.6rem 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-tertiary);
}

.order-button {
  margin-top: 0.85rem;
  align-self: center;
  width: 110px;
  border: none;
  border-radius: 18px;
  padding: 0.45rem 0;
  background: var(--button-primary-bg);
  color: var(--button-primary-color);
  font-weight: 600;
  font-size: 0.85rem;
}

.footnote {
  margin-top: 1.25rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  line-height: 1.4;
}
</style>
