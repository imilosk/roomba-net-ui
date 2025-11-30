<template>
  <div class="shell-screen">
    <slot />
  </div>
</template>

<style scoped>
.shell-screen {
  min-height: calc(100vh - max(0.75rem, env(safe-area-inset-bottom)));
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
</style>

