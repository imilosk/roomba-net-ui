<template>
  <div class="shell-container">
    <slot />
  </div>
</template>

<style scoped>
.shell-container {
  width: min(420px, 100%);
  background: var(--shell-bg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-soft);
  position: relative;
}
</style>
