<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const quickLinks = [
  { id: 'health', label: 'Product Health', icon: 'pulse', hasIndicator: true },
  { id: 'settings', label: 'Product Settings', icon: 'gear', route: '/settings' },
  { id: 'guide', label: "Owner's Guide", icon: 'book' },
  { id: 'help', label: 'Help', icon: 'lifebuoy' }
]

const tabItems = [
  { id: 'products', label: 'My Products', icon: 'star', active: true },
  { id: 'messages', label: 'Messages', icon: 'chat' }
]

const historyEntry = {
  date: '7 Nov 2025',
  time: '15:34 - 16:03'
}

const batteryPercent = 93
const batteryFillWidth = Math.min(100, Math.max(0, batteryPercent))

function handleQuickLinkClick(route?: string) {
  if (route) {
    router.push(route)
  }
}
</script>

<template>
  <div class="screen">
    <div class="screen-inner">
      <header class="app-header">
        <button class="title-button" aria-label="Select product">
          <span>Roomba i3</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <button class="icon-button" aria-label="Open menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </header>

      <section class="device-card">
        <div class="device-illustration" aria-hidden="true">
          <div class="roomba-shadow"></div>
          <div class="roomba-shell">
            <div class="ring ring--outer"></div>
            <div class="ring ring--middle"></div>
            <div class="ring ring--inner"></div>
            <div class="ring-dot"></div>
          </div>
        </div>
        <div class="map-row">
          <button class="map-chip" type="button">
            <span>Map</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3a6 6 0 00-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 00-6-6zm0 8.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z"
              />
            </svg>
          </button>
        </div>
        <div class="device-meta">
          <div>
            <p class="label">Roomba i3</p>
            <p class="status status--ready">Ready to vacuum</p>
          </div>
          <div class="battery-indicator" :aria-label="`Battery level ${batteryPercent}%`">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13 5l-2 6h3l-2 8" />
            </svg>
            <div class="battery-shell">
              <span class="battery-fill" :style="{ width: batteryFillWidth + '%' }"></span>
            </div>
          </div>
        </div>
        <button class="secondary-action" type="button">Empty bin</button>
      </section>

      <section class="info-card alert-card">
        <div class="alert-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h3l2-5 4 10 2-5h3" />
          </svg>
        </div>
        <div>
          <p class="title">Product Health</p>
          <p class="body">It’s time to replace some of Roomba i3’s parts.</p>
        </div>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span>Favourites</span>
          </div>
          <button class="chevron-button" aria-label="Open favourites">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </header>
        <div class="favourites-grid">
          <article class="favourite-card">
            <button class="play-button" type="button" aria-label="Start Vacuum Everywhere">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 6.75l8.25 5.25-8.25 5.25z" />
              </svg>
            </button>
            <p>Vacuum Everywhere</p>
          </article>
          <article class="favourite-card favourite-card--ghost">
            <span class="plus-icon" aria-hidden="true"></span>
            <p>New job</p>
          </article>
        </div>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Schedule</span>
          </div>
          <button class="chevron-button" aria-label="Open schedule">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </header>
        <p class="panel-body">
          Maintain a clean home throughout the week by setting Roomba i3 to run automatically.
        </p>
        <button class="link-button" type="button">+ Create a schedule</button>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 13h3v7H4zm6-6h3v13h-3zm6-4h3v17h-3z" />
            </svg>
            <span>History</span>
          </div>
          <button class="chevron-button" aria-label="Open history">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </header>
        <article class="history-card">
          <div class="history-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="date">{{ historyEntry.date }}</p>
            <p class="time">{{ historyEntry.time }}</p>
          </div>
        </article>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 22s-4-4-7-4V9a7 7 0 1114 0v9c-3 0-7 4-7 4zM12 4a5 5 0 00-5 5v3h10V9a5 5 0 00-5-5z"
              />
            </svg>
            <span>Messages</span>
          </div>
          <button class="chevron-button" aria-label="Open messages">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </header>
        <div class="messages-card">You are up to date!</div>
      </section>

      <section class="panel quick-links">
        <ul>
          <li v-for="link in quickLinks" :key="link.id">
            <button class="link-row" type="button" @click="handleQuickLinkClick(link.route)">
            <div class="panel-title">
              <svg viewBox="0 0 24 24" aria-hidden="true" :class="`icon-${link.icon}`">
                <path v-if="link.icon === 'pulse'" d="M4 12h3l2-5 4 10 2-5h3" />
                <path
                  v-else-if="link.icon === 'gear'"
                  d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm7.5-3.5l1.5 1-1.5 3-1.8-.3a6 6 0 01-1.3 1.3l.3 1.8-3 1.5-1-1.5a6 6 0 01-1.9 0l-1 1.5-3-1.5.3-1.8a6 6 0 01-1.3-1.3l-1.8.3-1.5-3 1.5-1a6 6 0 010-1.9l-1.5-1 1.5-3 1.8.3a6 6 0 011.3-1.3l-.3-1.8 3-1.5 1 1.5a6 6 0 011.9 0l1-1.5 3 1.5-.3 1.8a6 6 0 011.3 1.3l1.8-.3 1.5 3-1.5 1a6 6 0 010 1.9z"
                />
                <path
                  v-else-if="link.icon === 'book'"
                  d="M5 5h6a3 3 0 013 3v11a2 2 0 00-2-2H5a2 2 0 00-2 2V7a2 2 0 012-2zm8 0h6a2 2 0 012 2v12a2 2 0 00-2-2h-6z"
                />
                <path
                  v-else-if="link.icon === 'lifebuoy'"
                  d="M12 4a8 8 0 108 8 8.009 8.009 0 00-8-8zm0 4a4 4 0 11-4 4 4 4 0 014-4zm0-4v4m0 8v4m4-8h4M4 12h4m8-5.657l2.828-2.828M5.172 18.828l2.828-2.828m8 0l2.828 2.828M5.172 5.172L8 8"
                />
              </svg>
              <span>{{ link.label }}</span>
            </div>
            <div class="link-meta">
              <span v-if="link.hasIndicator" class="status-dot" aria-hidden="true"></span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
            </button>
          </li>
        </ul>
      </section>

      <button class="floating-new-job" type="button">+ New job</button>
    </div>

    <nav class="tab-bar">
      <button
        v-for="item in tabItems"
        :key="item.id"
        :class="['tab-item', { active: item.active }]"
        type="button"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            v-if="item.icon === 'star'"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
          <path
            v-else-if="item.icon === 'chat'"
            d="M4 5h16a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4V7a2 2 0 012-2z"
          />
        </svg>
        <span>{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #e9edf3;
}

.screen-inner {
  width: min(420px, 100%);
  margin: 0 auto;
  padding: 1.25rem 1.25rem 7rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.title-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1b1f24;
  padding: 0;
}

.title-button svg,
.icon-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.icon-button {
  border: none;
  background: transparent;
  padding: 0.35rem;
  border-radius: 999px;
  color: #3c424d;
}

.device-card {
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 45px rgba(15, 26, 46, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.device-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.device-meta .label {
  font-size: 0.95rem;
  color: #606776;
  margin: 0;
}

.device-meta .status {
  margin: 0.1rem 0 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1b1f24;
}

.status--ready {
  font-size: 1.2rem;
}

.battery-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
  color: #1b1f24;
}

.battery-indicator svg {
  width: 18px;
  height: 18px;
  stroke: #2ca35c;
  stroke-width: 1.8;
  fill: none;
}

.battery-shell {
  width: 64px;
  height: 18px;
  border-radius: 999px;
  background: #dfeee1;
  overflow: hidden;
  position: relative;
}

.battery-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #3ccf6c, #2ca35c);
}

.secondary-action {
  border: none;
  background: #f4f6fc;
  color: #1e63ff;
  font-weight: 600;
  border-radius: 16px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  width: 100%;
}

.device-illustration {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.roomba-shell {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #70757f, #3b3f46);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 10px 25px rgba(0, 0, 0, 0.35);
}

.ring {
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  position: absolute;
}

.ring--outer {
  width: 160px;
  height: 160px;
  border-color: rgba(255, 255, 255, 0.15);
}

.ring--middle {
  width: 110px;
  height: 110px;
  border-color: rgba(255, 255, 255, 0.35);
}

.ring--inner {
  width: 60px;
  height: 60px;
  border-color: rgba(255, 255, 255, 0.6);
}

.ring-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #dfe1e5;
  position: absolute;
}

.roomba-shadow {
  position: absolute;
  bottom: 25px;
  width: 150px;
  height: 40px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.3), transparent 70%);
  filter: blur(12px);
  z-index: 0;
}

.map-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.map-chip {
  border: none;
  background: #ffffff;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1b1f24;
  box-shadow: 0 10px 25px rgba(43, 54, 68, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.map-chip svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #1f5af6;
  stroke-width: 1.4;
}

.info-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 1rem 1.25rem;
  display: flex;
  gap: 0.75rem;
  box-shadow: 0 15px 30px rgba(25, 33, 45, 0.07);
}

.alert-card {
  align-items: center;
}

.alert-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #ffeef0;
  color: #f3594b;
  display: grid;
  place-items: center;
}

.alert-icon svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.info-card .title {
  margin: 0;
  font-weight: 600;
  color: #1b1f24;
}

.info-card .body {
  margin: 0.25rem 0 0;
  color: #5a616f;
  font-size: 0.95rem;
}

.panel {
  background: #ffffff;
  border-radius: 22px;
  padding: 1.15rem 1.25rem;
  box-shadow: 0 12px 24px rgba(24, 34, 49, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
}

.panel-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1b1f24;
}

.panel-title svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  stroke-width: 1.6;
  fill: none;
}

.panel-title svg.icon-gear {
  stroke-width: 1.2;
}

.panel-title svg.icon-book,
.panel-title svg.icon-lifebuoy {
  stroke-width: 1.3;
}

.chevron-button {
  border: none;
  background: transparent;
  padding: 0.2rem;
  border-radius: 50%;
  color: #a3aab8;
}

.chevron-button svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.8;
}

.favourites-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.95rem;
}

.favourite-card {
  background: #f7f8fb;
  border-radius: 18px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 120px;
}

.favourite-card--ghost {
  background: #eef1f6;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #5a616f;
  font-weight: 600;
}

.favourite-card p {
  margin: 0;
  font-weight: 600;
  color: #1b1f24;
}

.play-button {
  border: none;
  background: #1e63ff;
  color: #fff;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
}

.play-button svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.plus-icon {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  border: 1.5px dashed #b2b9c6;
  position: relative;
}

.plus-icon::before,
.plus-icon::after {
  content: '';
  position: absolute;
  background: #8290a8;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.plus-icon::before {
  width: 2px;
  height: 18px;
}

.plus-icon::after {
  width: 18px;
  height: 2px;
}

.panel-body {
  margin: 0 0 0.75rem;
  color: #5a616f;
  line-height: 1.45;
}

.link-button {
  border: none;
  background: transparent;
  color: #1e63ff;
  font-weight: 600;
  padding: 0;
}

.history-card {
  border-radius: 18px;
  background: #f7f8fb;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.history-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #e2ebff;
  color: #1e63ff;
  display: grid;
  place-items: center;
}

.history-icon svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.history-card .date {
  margin: 0;
  font-weight: 600;
  color: #1b1f24;
}

.history-card .time {
  margin: 0.15rem 0 0;
  color: #5a616f;
  font-size: 0.95rem;
}

.messages-card {
  border: 1.5px dashed #c0c8d8;
  border-radius: 18px;
  padding: 1.25rem;
  text-align: center;
  color: #8a93a6;
  font-weight: 600;
}

.quick-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.link-row {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  cursor: pointer;
}

.link-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.link-meta svg {
  width: 18px;
  height: 18px;
  stroke: #a3aab8;
  stroke-width: 1.8;
  fill: none;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2d8bff;
}

.floating-new-job {
  align-self: flex-end;
  position: sticky;
  bottom: 5rem;
  margin-top: -0.5rem;
  border: none;
  border-radius: 18px;
  background: #4e6ef3;
  color: #fff;
  font-weight: 600;
  padding: 0.9rem 1.35rem;
  box-shadow: 0 15px 35px rgba(73, 107, 238, 0.45);
}

.tab-bar {
  width: min(420px, 100%);
  margin: 0 auto;
  background: #fbfbfd;
  border-top: 1px solid #dae0eb;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.35rem 0.5rem env(safe-area-inset-bottom, 0.5rem);
  position: sticky;
  bottom: 0;
}

.tab-item {
  border: none;
  background: transparent;
  border-radius: 16px;
  padding: 0.45rem 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  color: #7e8698;
  font-size: 0.8rem;
}

.tab-item svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

.tab-item.active {
  color: #1e63ff;
  font-weight: 600;
}

@media (min-width: 768px) {
  .screen {
    padding-bottom: 1rem;
  }

  .screen-inner {
    padding-top: 2.5rem;
    padding-bottom: 8rem;
  }
}
</style>
