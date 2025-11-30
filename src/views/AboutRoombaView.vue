<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatusStore } from '../stores/status'

const router = useRouter()
const statusStore = useStatusStore()

const details = computed(() => statusStore.robotDetails)
const robotName = computed(() => statusStore.robotName ?? 'Syncing...')

const baseDetails = computed(() => details.value?.selfEmptyingBase ?? null)

const baseSectionVisible = computed(() => {
  const base = baseDetails.value
  if (!base) return false
  return Boolean(base.firmware || base.model || base.serial || base.status !== null || base.evacAllowed !== null)
})

const baseStatusLabel = computed(() => {
  const base = baseDetails.value
  if (!base) return 'Syncing...'
  if (base.status === true || base.evacAllowed === true) return 'Connected'
  if (base.status === false) return 'Not detected'
  if (base.evacAllowed === false) return 'Unavailable'
  return 'Syncing...'
})

function formatValue(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return 'Syncing...'
  return String(value)
}

function handleBack() {
  router.push('/settings')
}
</script>

<template>
  <div class="about-screen">
    <div class="about-shell">
      <header class="about-header">
        <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <p class="about-title">About {{ robotName }}</p>
      </header>

      <main class="about-content">
        <section class="info-card">
          <header>
            <p class="section-title">Product</p>
          </header>
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{{ formatValue(details?.name ?? robotName) }}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{{ formatValue(details?.sku) }}</dd>
            </div>
            <div>
              <dt>Serial</dt>
              <dd>{{ formatValue(details?.serial) }}</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd>{{ formatValue(details?.country) }}</dd>
            </div>
            <div>
              <dt>Timezone</dt>
              <dd>{{ formatValue(details?.timezone) }}</dd>
            </div>
          </dl>
        </section>

        <section class="info-card">
          <header>
            <p class="section-title">Software</p>
          </header>
          <dl>
            <div>
              <dt>Main Version</dt>
              <dd>{{ formatValue(details?.softwareVersion) }}</dd>
            </div>
            <div>
              <dt>Navigation</dt>
              <dd>{{ formatValue(details?.subSoftware?.nav ?? null) }}</dd>
            </div>
            <div>
              <dt>Mobility</dt>
              <dd>{{ formatValue(details?.subSoftware?.mob ?? null) }}</dd>
            </div>
            <div>
              <dt>Power</dt>
              <dd>{{ formatValue(details?.subSoftware?.pwr ?? null) }}</dd>
            </div>
          </dl>
        </section>

        <section class="info-card">
          <header>
            <p class="section-title">Battery</p>
          </header>
          <dl>
            <div>
              <dt>Type</dt>
              <dd>{{ formatValue(details?.batteryType) }}</dd>
            </div>
            <div>
              <dt>Manufacturer</dt>
              <dd>{{ formatValue(details?.batteryManufacturer) }}</dd>
            </div>
            <div>
              <dt>Manufactured</dt>
              <dd>{{ formatValue(details?.batteryManufactureDate) }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="baseSectionVisible" class="info-card">
          <header>
            <p class="section-title">Self-emptying base</p>
          </header>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{{ baseStatusLabel }}</dd>
            </div>
            <div>
              <dt>Firmware</dt>
              <dd>{{ formatValue(baseDetails?.firmware ?? null) }}</dd>
            </div>
            <div v-if="baseDetails?.model">
              <dt>Model</dt>
              <dd>{{ formatValue(baseDetails?.model ?? null) }}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.about-screen {
  min-height: 100vh;
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

.about-shell {
  width: min(420px, 100%);
  background: var(--panel-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.about-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
}

.about-title {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.back-button {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
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

.about-content {
  flex: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  background: var(--panel-bg);
  border-radius: 20px;
  padding: 1.1rem 1.2rem;
  box-shadow: var(--shadow-card);
}

.section-title {
  margin: 0 0 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

dt {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

dd {
  margin: 0.1rem 0 0;
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 600;
}

dl > div + div {
  border-top: 1px solid var(--border-subtle);
  padding-top: 0.65rem;
}
</style>
