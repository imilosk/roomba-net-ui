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
  router.push('/settings')
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
              <p class="lock-card__title">Child and Pet Lock</p>
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

            <p class="lock-card__subtitle">
              Lock the robot’s physical button so kids and pets can’t turn it on or off by accident. Full control will
              still be available in the app.
            </p>
            <p v-if="loading && !isInitialized" class="lock-card__subtitle subtle">
              Fetching current status…
            </p>

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
  min-height: calc(100vh - max(0.75rem, env(safe-area-inset-bottom)));
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

.lock-shell {
  width: min(420px, 100%);
  background: var(--shell-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(21, 31, 45, 0.07);
}

.lock-header {
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

.lock-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
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
  background: var(--panel-bg);
  box-shadow: 0 12px 28px rgba(26, 35, 53, 0.08);
  padding: 1.5rem;
}

.lock-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lock-card__title {
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.lock-card__subtitle {
  margin: 0;
  color: var(--status-muted);
  line-height: 1.5;
  font-size: 0.95rem;
}

.lock-card__subtitle.subtle {
  margin-top: 0.5rem;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

.lock-note {
  margin: 1.25rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

.toggle {
  position: relative;
  width: 54px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: transparent;
  padding: 0;
  cursor: pointer;
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
  background: color-mix(in srgb, var(--card-muted-bg) 60%, var(--panel-bg));
  border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.toggle__thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transform: translateX(-10px);
  transition: transform 0.25s ease, background-color 0.25s ease;
}

.toggle--on .toggle__track {
  background: linear-gradient(135deg, var(--button-primary-bg), var(--accent-strong));
  border-color: transparent;
}

.toggle--on .toggle__thumb {
  transform: translateX(10px);
  background: #ffffff;
}

.error-message {
  margin-top: 1rem;
  color: var(--error-text);
  font-weight: 600;
}

.link-button {
  margin-top: auto;
  align-self: center;
  border: none;
  background: transparent;
  color: var(--accent-strong);
  font-weight: 600;
}
</style>
