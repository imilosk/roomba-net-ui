<script setup lang="ts">
defineProps<{
  title: string
  showHelp?: boolean
}>()

const emit = defineEmits<{
  back: []
  help: []
}>()
</script>

<template>
  <header class="shell-header">
    <button class="shell-header__back" type="button" aria-label="Go back" @click="emit('back')">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </button>

    <p class="shell-header__title">
      {{ title }}
    </p>

    <button
      v-if="showHelp"
      class="shell-header__help"
      type="button"
      aria-label="Help"
      @click="emit('help')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.5 9a2.5 2.5 0 115 0c0 1.45-1.02 1.93-1.72 2.54-.64.57-.53 1.46-.53 1.96" />
        <circle cx="12" cy="17.8" r="1.05" />
      </svg>
    </button>
    <button
      v-else
      class="shell-header__back shell-header__back--spacer"
      type="button"
      aria-hidden="true"
      tabindex="-1"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </button>
  </header>
</template>

<style scoped>
.shell-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  padding-top: calc(0.9rem + constant(safe-area-inset-top));
  padding-top: calc(0.9rem + env(safe-area-inset-top));
  border-bottom: 1px solid var(--border-subtle);
  background: var(--shell-bg);
}

.shell-header__back {
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  color: var(--icon-muted);
  padding: 0.3rem;
}

.shell-header__back svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.shell-header__back--spacer {
  visibility: hidden;
}

.shell-header__title {
  flex: 1;
  margin: 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.shell-header__help {
  margin-left: 0.75rem;
  border: none;
  background: transparent;
  padding: 0.3rem;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--border-subtle);
  background: var(--shell-bg);
}

.shell-header__help svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
</style>
