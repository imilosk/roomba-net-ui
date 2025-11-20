<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatusStore } from '../stores/status'

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
  router.back()
}
</script>

<template>
  <div class="health-screen">
    <div class="health-shell">
      <header class="health-header">
        <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <p class="health-title">Product Health</p>
        <button class="help-button" type="button" aria-label="Help">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9.5 9a2.5 2.5 0 115 0c0 1.45-1.02 1.93-1.72 2.54-.64.57-.53 1.46-.53 1.96"
            />
            <circle cx="12" cy="17.8" r="1.05" />
          </svg>
        </button>
      </header>

      <section class="health-content">
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
      </section>
    </div>
  </div>
</template>

<style scoped>
.health-screen {
  min-height: 100vh;
  background: #f0f4f9;
  display: flex;
  justify-content: center;
}

.health-shell {
  width: min(420px, 100%);
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(21, 31, 45, 0.07);
}

.health-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #e2e6ef;
}

.back-button,
.help-button {
  border: none;
  background: transparent;
  position: absolute;
  padding: 0.3rem;
}

.back-button {
  left: 1rem;
  color: #a3aab8;
}

.help-button {
  right: 1rem;
  color: #5f6a7d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #a3aab8;
  background: #ffffff;
}

.back-button svg,
.help-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.health-title {
  margin: 0;
  font-weight: 600;
  color: #111622;
  font-size: 1rem;
}

.health-content {
  flex: 1;
  padding: 1.25rem;
  background: #f5f7fb;
}

.device-label {
  font-size: 0.85rem;
  color: #969fb2;
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
  background: #ffffff;
  border-radius: 18px;
  padding: 1rem 1.25rem;
  box-shadow: 0 12px 24px rgba(23, 31, 43, 0.07);
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
  color: #1b1f24;
}

.link-button {
  border: none;
  background: transparent;
  color: #4c78f4;
  font-weight: 600;
  padding: 0;
}

.part-meter {
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: #eceff4;
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
  color: #9aa2b4;
}

.order-button {
  margin-top: 0.85rem;
  align-self: center;
  width: 110px;
  border: none;
  border-radius: 18px;
  padding: 0.45rem 0;
  background: #4c78f4;
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
}

.footnote {
  margin-top: 1.25rem;
  font-size: 0.75rem;
  color: #98a1b4;
  line-height: 1.4;
}
</style>
