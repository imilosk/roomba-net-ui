<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from './stores/theme'

const router = useRouter()
const transitionName = ref('slide-left')
let lastDepth = 0
const themeStore = useThemeStore()

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    const depth = router.currentRoute.value.matched.length
    transitionName.value = depth < lastDepth ? 'slide-right' : 'slide-left'
    lastDepth = depth
  },
  { immediate: true }
)

onMounted(() => {
  themeStore.init()
})

onUnmounted(() => {
  themeStore.dispose()
})
</script>

<template>
  <div id="app">
    <RouterView v-slot="{ Component }">
      <Transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
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
  transition: transform 0.2s ease, opacity 0.15s ease;
  display: block;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
