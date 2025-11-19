<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { findRoomba } from '../services/commandService'

const router = useRouter()
const isRequesting = ref(false)
const statusMessage = ref<string | null>(null)
const statusType = ref<'success' | 'error' | null>(null)
let messageTimer: ReturnType<typeof setTimeout> | null = null

async function handleLocate() {
  isRequesting.value = true
  statusMessage.value = null
  statusType.value = null
  try {
    await findRoomba()
    statusMessage.value = 'Playing locate tone on Roomba…'
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
  router.back()
}
</script>

<template>
  <div class="locate-screen">
    <div class="locate-shell">
      <header class="locate-header">
        <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <p class="locate-title">Locate Roomba</p>
        <span class="header-spacer" aria-hidden="true"></span>
      </header>

      <section class="locate-content">
        <div class="icon-zone">
          <div class="icon-ring">
            <div class="icon-inner">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 18V6l9 6-9 6z" />
              </svg>
            </div>
          </div>
        </div>

        <p class="desc">
          Locate Roomba i3 in your home by having it make a sound. It must have some battery charge and be connected to
          Wi-Fi.
        </p>

        <div class="status-container">
          <p v-if="statusMessage" :class="['status-hint', statusType]">
            {{ statusMessage }}
          </p>
        </div>
      </section>
      <footer class="locate-footer">
        <button class="locate-button" type="button" :disabled="isRequesting" @click="handleLocate">
          {{ isRequesting ? 'Playing…' : 'Locate Roomba i3' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.locate-screen {
  min-height: 100vh;
  background: #f3f6fb;
  display: flex;
  justify-content: center;
}

.locate-shell {
  width: min(420px, 100%);
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(21, 31, 45, 0.07);
  position: relative;
}

.locate-header {
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

.locate-title {
  margin: 0;
  font-weight: 600;
  color: #111622;
}

.header-spacer {
  width: 20px;
}

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
  background: #e9f1f6;
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
  background: #76e1ff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 12px 25px rgba(255, 255, 255, 0.4);
}

.icon-inner svg {
  width: 38px;
  height: 38px;
  stroke: #fff;
  stroke-width: 1.8;
  fill: none;
}

.desc {
  margin: 0;
  text-align: center;
  color: #525a6a;
  line-height: 1.4;
}

.status-container {
  min-height: 1.2rem;
}

.locate-footer {
  margin-top: auto;
  padding: 0 1.5rem 2rem;
}

.locate-button {
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 0.95rem 1.25rem;
  font-weight: 600;
  color: #ffffff;
  background: #566890;
  box-shadow: 0 15px 30px rgba(86, 104, 144, 0.3);
  cursor: pointer;
}

.locate-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-hint {
  font-size: 0.9rem;
}

.status-hint.success {
  color: #2f9d62;
}

.status-hint.error {
  color: #e55353;
}
</style>
.locate-shell {
  position: relative;
}
