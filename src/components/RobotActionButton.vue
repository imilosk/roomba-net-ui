<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'accent' | 'tertiary'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'default',
    loading: false,
    disabled: false,
    type: 'button'
  }
)

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const isDisabled = computed(() => props.disabled || props.loading)

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    class="robot-action-button"
    :class="[`robot-action-button--${variant}`, { 'is-loading': loading }]"
    :disabled="isDisabled"
    :type="type"
    @click="handleClick"
  >
    <span class="robot-action-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.robot-action-button {
  width: 100%;
  border: none;
  border-radius: 16px;
  padding: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.robot-action-button--default {
  background: var(--card-muted-bg);
  color: var(--accent-strong);
}

.robot-action-button--accent {
  background: linear-gradient(135deg, var(--button-primary-bg), var(--accent-strong));
  color: var(--button-primary-color);
}

.robot-action-button--tertiary {
  background: var(--panel-bg);
  color: var(--text-primary);
  box-shadow: inset 0 0 0 1px var(--border-subtle);
}

.robot-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.robot-action-button.is-loading {
  opacity: 0.65;
  animation: btn-pulse 0.8s ease-in-out infinite alternate;
}

.robot-action-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
}

.robot-action-button__content :deep(svg) {
  width: 14px;
  height: 14px;
  fill: currentColor;
  flex-shrink: 0;
}

@keyframes btn-pulse {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-1px);
  }
}
</style>
