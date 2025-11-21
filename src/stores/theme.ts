import { defineStore } from 'pinia'
import { ref } from 'vue'

type ThemePreference = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'roomba_theme_preference'

export const useThemeStore = defineStore('theme', () => {
  const preference = ref<ThemePreference>('system')
  const current = ref<ResolvedTheme>('light')
  let mediaQuery: MediaQueryList | null = null
  let mediaListener: ((event: MediaQueryListEvent) => void) | null = null

  function detectSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function applyTheme(theme: ResolvedTheme) {
    current.value = theme
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme
      document.documentElement.style.colorScheme = theme
    }
  }

  function syncTheme() {
    const theme = preference.value === 'system' ? detectSystemTheme() : preference.value
    applyTheme(theme)
  }

  function setPreference(next: ThemePreference) {
    preference.value = next
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
    syncTheme()
  }

  function init() {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      preference.value = stored
    }

    if (!mediaQuery) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaListener = () => {
        if (preference.value === 'system') {
          syncTheme()
        }
      }
      mediaQuery.addEventListener('change', mediaListener)
    }

    syncTheme()
  }

  function dispose() {
    if (mediaQuery && mediaListener) {
      mediaQuery.removeEventListener('change', mediaListener)
      mediaListener = null
      mediaQuery = null
    }
  }

  return {
    preference,
    current,
    init,
    dispose,
    setPreference
  }
})
