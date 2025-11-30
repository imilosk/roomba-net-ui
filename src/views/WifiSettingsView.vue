<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatusStore } from '../stores/status'

const router = useRouter()
const statusStore = useStatusStore()

const wifi = computed(() => statusStore.wifiDetails)

function formatValue(value?: string | number | boolean | null) {
  if (value === null || value === undefined || value === '') return 'Syncing...'
  if (typeof value === 'boolean') return value ? 'Enabled' : 'Disabled'
  return String(value)
}

function handleBack() {
  router.push('/settings')
}
</script>

<template>
  <div class="screen">
    <div class="shell">
      <header class="header">
        <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <p>Wi-Fi Settings</p>
        <span class="header-spacer" aria-hidden="true"></span>
      </header>

      <main>
        <section class="info-card">
          <h2>Connection</h2>
          <dl>
            <div>
              <dt>Network name</dt>
              <dd>{{ formatValue(wifi?.ssid) }}</dd>
            </div>
            <div>
              <dt>Security</dt>
              <dd>{{ formatValue(wifi?.security) }}</dd>
            </div>
            <div>
              <dt>Access point mode</dt>
              <dd>{{ formatValue(wifi?.accessPointMode) }}</dd>
            </div>
          </dl>
        </section>

        <section class="info-card">
          <h2>Network info</h2>
          <dl>
            <div>
              <dt>IPv4 address</dt>
              <dd>{{ formatValue(wifi?.address) }}</dd>
            </div>
            <div>
              <dt>Subnet mask</dt>
              <dd>{{ formatValue(wifi?.mask) }}</dd>
            </div>
            <div>
              <dt>Gateway</dt>
              <dd>{{ formatValue(wifi?.gateway) }}</dd>
            </div>
            <div>
              <dt>DNS servers</dt>
              <dd>{{ [wifi?.dns1, wifi?.dns2].filter(Boolean).join(', ') || 'Syncing...' }}</dd>
            </div>
            <div>
              <dt>DHCP</dt>
              <dd>{{ formatValue(wifi?.dhcp) }}</dd>
            </div>
            <div>
              <dt>BSSID</dt>
              <dd>{{ formatValue(wifi?.bssid) }}</dd>
            </div>
          </dl>
        </section>

        <section class="info-card">
          <h2>Signal</h2>
          <dl>
            <div>
              <dt>RSSI</dt>
              <dd>{{ wifi?.rssi !== null && wifi?.rssi !== undefined ? `${wifi?.rssi} dBm` : 'Syncing...' }}</dd>
            </div>
            <div>
              <dt>SNR</dt>
              <dd>{{ wifi?.snr !== null && wifi?.snr !== undefined ? `${wifi?.snr} dB` : 'Syncing...' }}</dd>
            </div>
            <div>
              <dt>Noise floor</dt>
              <dd>{{ wifi?.noise !== null && wifi?.noise !== undefined ? `${wifi?.noise} dBm` : 'Syncing...' }}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

.shell {
  width: min(420px, 100%);
  background: var(--shell-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-soft);
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0.9rem 1.25rem;
  padding-top: calc(0.9rem + constant(safe-area-inset-top));
  padding-top: calc(0.9rem + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--shell-bg);
}

.header p {
  flex: 1;
  margin: 0;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
}

.header-spacer {
  width: 20px;
}

.back-button {
  margin-right: 0.75rem;
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

main {
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

.info-card h2 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
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
