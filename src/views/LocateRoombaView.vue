<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { findRoomba } from '../services/commandService'
import { useStatusStore } from '../stores/status'
import { useRobotsStore } from '../stores/robots'
import ShellHeader from '../components/ShellHeader.vue'
import ShellScreen from '../components/ShellScreen.vue'
import ShellContainer from '../components/ShellContainer.vue'

const router = useRouter()
const isRequesting = ref(false)
const statusMessage = ref<string | null>(null)
const statusType = ref<'success' | 'error' | null>(null)
let messageTimer: ReturnType<typeof setTimeout> | null = null
const statusStore = useStatusStore()
const robotsStore = useRobotsStore()

const robotNameDisplay = computed(() => statusStore.robotName)

async function handleLocate() {
  isRequesting.value = true
  statusMessage.value = null
  statusType.value = null
  try {
    if (!robotsStore.selectedRobotId) {
      throw new Error('No robot selected')
    }
    await findRoomba(robotsStore.selectedRobotId)
    statusMessage.value = `Playing locate tone on ${robotNameDisplay.value}…`
    statusType.value = 'success'
    if (messageTimer) {
      clearTimeout(messageTimer)
    }
    messageTimer = setTimeout(() => {
      statusMessage.value = null
      statusType.value = null
    }, 10000)
  } catch (error) {
    statusMessage.value = 'Unable to trigger locate tone. Please try again.'
    statusType.value = 'error'
  } finally {
    isRequesting.value = false
  }
}

function handleBack() {
  router.push('/settings')
}

onUnmounted(() => {
  if (messageTimer) {
    clearTimeout(messageTimer)
    messageTimer = null
  }
})
</script>

<template>
  <ShellScreen>
    <ShellContainer>
      <ShellHeader :title="`Locate ${robotNameDisplay}`" @back="handleBack" />

      <section class="locate-content">
        <div class="icon-zone">
          <div class="icon-ring animate">
            <div class="icon-inner animate">
              <svg class="icon-note" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 6.75v9.5a2.25 2.25 0 11-1.5-2.125V5.25l9-1.5v9.625a2.25 2.25 0 11-1.5-2.125V6.75l-6 1z"
                />
              </svg>
            </div>
          </div>
        </div>

        <p class="desc">
          Locate {{ robotNameDisplay }} in your home by having it make a sound. It must have some battery charge and be
          connected to Wi-Fi.
        </p>

        <div class="status-container">
          <p v-if="statusMessage" :class="['status-hint', statusType]">
            {{ statusMessage }}
          </p>
        </div>
      </section>
      <footer class="locate-footer">
        <button class="locate-button" type="button" :disabled="isRequesting" @click="handleLocate">
          {{ isRequesting ? 'Playing…' : `Locate ${robotNameDisplay}` }}
        </button>
      </footer>
    </ShellContainer>
  </ShellScreen>
</template>

<style scoped>

.locate-content {
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
  background: linear-gradient(145deg, #4bd0f7, #4cbdf4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 30px rgba(54, 161, 215, 0.35);
}

.icon-inner {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
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
  width: 38px;
  height: 38px;
  stroke: #fff;
  stroke-width: 1.8;
  fill: none;
}

.icon-note {
  animation: swayNote 1.4s ease-in-out infinite;
  transform-origin: bottom left;
}

.desc {
  margin: 0;
  text-align: center;
  color: var(--status-muted);
  line-height: 1.4;
}

.status-container {
  min-height: 1.2rem;
}

.locate-footer {
  margin-top: auto;
  padding: 0 1.5rem calc(2rem + env(safe-area-inset-bottom));
}

.locate-button {
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

.locate-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-hint {
  font-size: 0.9rem;
}

.status-hint.success {
  color: var(--success-text);
}

.status-hint.error {
  color: var(--error-text);
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

@keyframes swayNote {
  0% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(4deg);
  }
  100% {
    transform: rotate(-2deg);
  }
}
</style>
