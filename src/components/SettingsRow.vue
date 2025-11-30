<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string | null
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button class="settings-row" type="button" @click="emit('click')">
    <div class="settings-row__text">
      <p class="settings-row__title">{{ title }}</p>
      <p v-if="subtitle" class="settings-row__subtitle">{{ subtitle }}</p>
    </div>
    <svg class="settings-row__chevron" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  </button>
</template>

<style scoped>
.settings-row {
  width: 100%;
  border: none;
  background: transparent;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  color: var(--text-primary);
}

.settings-row__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.settings-row__title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.settings-row__subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.settings-row__chevron {
  width: 18px;
  height: 18px;
  stroke: var(--icon-muted);
  stroke-width: 1.8;
  fill: none;
}
</style>
