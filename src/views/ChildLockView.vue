<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useChildLockStore } from '../stores/childLock'

const router = useRouter()
const childLockStore = useChildLockStore()
const { isEnabled, loading, error, isInitialized } = storeToRefs(childLockStore)

const isSwitchOn = computed(() => Boolean(isEnabled.value))

onMounted(() => {
  childLockStore.initStream()
})

onUnmounted(() => {
  childLockStore.disposeStream()
})

function handleBack() {
  router.back()
}

async function handleToggle() {
  const targetValue = !isSwitchOn.value
  try {
    await childLockStore.setChildLock(targetValue)
  } catch (err) {
    // Error already tracked, but revert optimistic state
  }
}
</script>

<template>
  <div class="lock-screen">
    <div class="lock-shell">
      <header class="lock-header">
        <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <p class="lock-title">Child and Pet Lock</p>
        <span class="header-spacer" aria-hidden="true"></span>
      </header>

      <section class="lock-content">
        <div class="lock-card">
          <div class="lock-card__header">
            <div>
              <p class="lock-card__title">Child and Pet Lock</p>
              <p class="lock-card__subtitle">
                Lock the robot’s physical button so kids and pets can’t turn it on or off by accident. Full control will
                still be available in the app.
              </p>
              <p v-if="loading && !isInitialized" class="lock-card__subtitle subtle">
                Fetching current status…
              </p>
            </div>
            <button
              class="toggle"
              :class="{ 'toggle--on': isSwitchOn }"
              type="button"
              role="switch"
              :aria-checked="isSwitchOn"
              :disabled="loading || !isInitialized"
              @click="handleToggle"
            >
              <span class="toggle__track"></span>
              <span class="toggle__thumb"></span>
            </button>
          </div>
          <p class="lock-note">
            *This lock will be disabled if your robot has an error or if you pick it up to move it.
          </p>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>

        <button class="link-button" type="button">Learn more</button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.lock-screen {
  min-height: 100vh;
  background: #f3f6fb;
  display: flex;
  justify-content: center;
}

.lock-shell {
  width: min(420px, 100%);
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(21, 31, 45, 0.07);
}

.lock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #e2e6ef;
}

.back-button {
  border: none;
  background: transparent;
  padding: 0.3rem;
  color: #1b1f24;
}

.back-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.lock-title {
  margin: 0;
  font-weight: 600;
  color: #111622;
}

.header-spacer {
  width: 20px;
}

.lock-content {
  flex: 1;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lock-card {
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(26, 35, 53, 0.08);
  padding: 1.5rem;
}

.lock-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.lock-card__title {
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: #1b1f24;
}

.lock-card__subtitle {
  margin: 0;
  color: #5a616f;
  line-height: 1.5;
  font-size: 0.95rem;
}

.lock-card__subtitle.subtle {
  margin-top: 0.5rem;
  color: #8b94a6;
  font-size: 0.85rem;
}

.lock-note {
  margin: 1.25rem 0 0;
  color: #8b94a6;
  font-size: 0.85rem;
}

.toggle {
  position: relative;
  width: 54px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.toggle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle__track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #dfe3ec;
  box-shadow: inset 0 2px 6px rgba(15, 23, 40, 0.1);
  transition: background-color 0.25s ease;
}

.toggle__thumb {
  position: relative;
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.18);
  transform: translateX(-11px);
  transition: transform 0.25s ease;
}

.toggle--on .toggle__track {
  background: linear-gradient(135deg, #4e7cf5, #476ce7);
}

.toggle--on .toggle__thumb {
  transform: translateX(11px);
}

.error-message {
  margin-top: 1rem;
  color: #d84a4a;
  font-weight: 600;
}

.link-button {
  margin-top: auto;
  align-self: center;
  border: none;
  background: transparent;
  color: #4c78f4;
  font-weight: 600;
}
</style>
