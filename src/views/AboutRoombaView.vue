<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatusStore } from '../stores/status'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

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
  <ShellScreen>
    <ShellContainer>
      <ShellHeader :title="`About ${robotName}`" @back="handleBack" />

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
    </ShellContainer>
  </ShellScreen>
</template>

<style scoped>

.header-spacer {
  width: 20px;
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
