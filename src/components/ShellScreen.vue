<template>
  <div class="shell-screen">
    <slot />
  </div>
</template>

<style scoped>
.shell-screen {
  min-height: 100vh;
  background: var(--app-bg);
  display: flex;
  justify-content: center;
  padding-top: 0;
}
</style>
