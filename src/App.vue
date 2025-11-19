<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const transitionName = ref('slide-left')
let lastDepth = 0

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    const depth = router.currentRoute.value.matched.length
    transitionName.value = depth < lastDepth ? 'slide-right' : 'slide-left'
    lastDepth = depth
  },
  { immediate: true }
)
</script>

<template>
  <div id="app">
    <Transition :name="transitionName" mode="out-in">
      <RouterView />
    </Transition>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s ease, opacity 0.4s ease;
  display: block;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
