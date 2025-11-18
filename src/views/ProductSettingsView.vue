<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const settingsItems = [
  { id: 'about', title: 'About Roomba i3' },
  { id: 'locate', title: 'Locate Roomba i3' },
  { id: 'clean-base', title: 'About Clean Base™' },
  { id: 'cleaning', title: 'Cleaning Preferences' },
  { id: 'lock', title: 'Child/Pet Lock', subtitle: 'Disabled' },
  { id: 'language', title: 'Robot Language', subtitle: 'English (United Kingdom)' },
  { id: 'reboot', title: 'Reboot Roomba i3' },
  { id: 'wifi-settings', title: 'Wi-Fi Settings', subtitle: 'Virus_Infected_Network_2G' },
  { id: 'wifi-reconnect', title: 'Reconnect or change Wi-Fi' }
]

function handleBack() {
  router.back()
}
</script>

<template>
  <div class="settings-screen">
    <header class="settings-header">
      <button class="back-button" type="button" aria-label="Go back" @click="handleBack">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        <span>Back</span>
      </button>
      <p class="settings-title">Product Settings</p>
      <span class="header-spacer" aria-hidden="true"></span>
    </header>

    <main class="settings-body">
      <ul class="settings-list">
        <li v-for="item in settingsItems" :key="item.id">
          <button class="settings-row" type="button">
            <div>
              <p class="row-title">{{ item.title }}</p>
              <p v-if="item.subtitle" class="row-subtitle">{{ item.subtitle }}</p>
            </div>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.settings-screen {
  min-height: 100vh;
  background: #f3f6fb;
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #fdfdfd;
  border-bottom: 1px solid #e2e6ef;
  box-shadow: 0 4px 15px rgba(19, 27, 40, 0.05);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  background: transparent;
  color: #1e63ff;
  font-weight: 600;
  padding: 0.3rem 0.4rem;
}

.back-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.settings-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111622;
}

.header-spacer {
  width: 60px;
}

.settings-body {
  flex: 1;
  padding-bottom: env(safe-area-inset-bottom);
}

.settings-list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #ffffff;
}

.settings-list li + li {
  border-top: 1px solid #edf0f6;
}

.settings-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  border: none;
  background: transparent;
  padding: 1rem 1.25rem;
}

.row-title {
  margin: 0;
  font-size: 0.95rem;
  color: #141922;
  font-weight: 600;
}

.row-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #7b8394;
}

.settings-row svg {
  width: 18px;
  height: 18px;
  stroke: #a3aab8;
  stroke-width: 1.8;
  fill: none;
}

@media (min-width: 640px) {
  .settings-screen {
    align-items: center;
  }

  .settings-body {
    width: min(420px, 100%);
    margin-top: 0.5rem;
    align-self: center;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 20px 45px rgba(21, 31, 45, 0.07);
  }

  .settings-list {
    border-radius: 22px;
    overflow: hidden;
  }
}
</style>
