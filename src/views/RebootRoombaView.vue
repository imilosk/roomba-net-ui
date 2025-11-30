<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { resetRoomba } from '../services/commandService'
import { useStatusStore } from '../stores/status'

const router = useRouter()
const statusStore = useStatusStore()

const robotNameDisplay = computed(() => statusStore.robotName ?? 'Roomba i3')
const isRebooting = ref(false)
const statusMessage = ref<string | null>(null)
const statusType = ref<'success' | 'error' | null>(null)

async function handleReboot() {
  if (isRebooting.value) return
  isRebooting.value = true
  statusMessage.value = null
  statusType.value = null
  try {
    await resetRoomba()
    statusMessage.value = `${robotNameDisplay.value} is rebooting. This may take a few minutes.`
    statusType.value = 'success'
  } catch (error) {
    statusMessage.value = 'Unable to reboot right now. Please try again.'
    statusType.value = 'error'
  } finally {
    isRebooting.value = false
  }
}

function handleBack() {
  router.push('/settings')
}
</script>

<template>
  <div class="reboot-screen">
    <div class="reboot-shell">
      <header class="reboot-header">
        <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <p class="reboot-title">Reboot {{ robotNameDisplay }}</p>
        <span class="header-spacer" aria-hidden="true"></span>
      </header>

      <section class="reboot-content">
        <div class="icon-zone">
          <div class="icon-ring animate">
            <div class="icon-inner animate">
              <svg class="icon-power" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v6" />
                <path d="M16 5.5a7 7 0 012.5 9.56A7 7 0 019.5 19.5 7 7 0 015.5 9.94 7 7 0 018 5.5" />
              </svg>
            </div>
          </div>
        </div>

        <p class="desc">
          This process may take a few minutes. All settings will be saved and available once the robot's power is back
          on.
        </p>

        <div class="status-container" aria-live="polite">
          <p v-if="statusMessage" :class="['status-hint', statusType]">
            {{ statusMessage }}
          </p>
        </div>
      </section>

      <footer class="reboot-footer">
        <button class="reboot-button" type="button" :disabled="isRebooting" @click="handleReboot">
          {{ isRebooting ? 'Rebooting…' : `Reboot ${robotNameDisplay}` }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.reboot-screen {
  min-height: calc(100vh - max(0.75rem, env(safe-area-inset-bottom)));
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

.reboot-shell {
  width: min(420px, 100%);
  background: var(--shell-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(21, 31, 45, 0.07);
  position: relative;
}

.reboot-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 0.9rem 1.25rem;
  padding-top: calc(0.9rem + constant(safe-area-inset-top));
  padding-top: calc(0.9rem + env(safe-area-inset-top));
  border-bottom: 1px solid var(--border-subtle);
  background: var(--shell-bg);
}

.back-button {
  margin-right: 0.75rem;
  border: none;
  background: transparent;
  padding: 0.3rem;
  color: var(--icon-muted);
}

.back-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.reboot-title {
  flex: 1;
  margin: 0;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
}

.header-spacer {
  width: 20px;
}

.reboot-content {
  flex: 1;
  padding: 1.75rem 1.5rem 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.icon-zone {
  width: 100%;
  border-radius: 26px;
  background: var(--info-chip-bg);
  padding: 3rem 0;
  display: flex;
  justify-content: center;
}

.icon-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--button-primary-bg), var(--accent-strong));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 30px rgba(72, 97, 255, 0.35);
}

.icon-inner {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 12px 25px rgba(255, 255, 255, 0.4);
}

.icon-ring.animate {
  animation: pulseRing 1.4s ease-in-out infinite;
}

.icon-inner.animate {
  animation: pulseInner 1.4s ease-in-out infinite;
}

.icon-inner svg {
  width: 40px;
  height: 40px;
  stroke: #fff;
  stroke-width: 1.8;
  fill: none;
}

.icon-power {
  animation: pulsePower 1.6s ease-in-out infinite;
}

.desc {
  margin: 0;
  text-align: center;
  color: var(--text-primary);
  line-height: 1.5;
  font-size: 1rem;
}

.note {
  margin: 0;
  text-align: center;
  color: var(--text-secondary);
  line-height: 1.4;
  font-size: 0.95rem;
}

.status-container {
  min-height: 1.2rem;
}

.status-hint {
  font-size: 0.9rem;
  margin: 0;
}

.status-hint.success {
  color: var(--success-text);
}

.status-hint.error {
  color: var(--error-text);
}

.reboot-footer {
  margin-top: auto;
  padding: 0 1.5rem calc(2rem + env(safe-area-inset-bottom));
}

.reboot-button {
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 0.95rem 1.25rem;
  font-weight: 600;
  color: var(--button-primary-color);
  background: var(--button-primary-bg);
  box-shadow: var(--button-primary-shadow);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.reboot-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes pulseRing {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.04);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulseInner {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.07);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulsePower {
  0% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.85;
  }
}
</style>
