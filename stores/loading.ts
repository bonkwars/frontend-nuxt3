// stores/loading.ts
import { defineStore } from 'pinia'

interface LoadingState {
  loadingStates: Map<string, boolean>
  loadingMessages: Map<string, string>
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    loadingStates: new Map(),
    loadingMessages: new Map()
  }),

  getters: {
    isLoading: (state): boolean => {
      return Array.from(state.loadingStates.values()).some(value => value === true)
    },

    currentMessage: (state): string | undefined => {
      // Get the most recent loading message
      const activeMessages = Array.from(state.loadingMessages.entries())
        .filter(([key]) => state.loadingStates.get(key))
      return activeMessages[activeMessages.length - 1]?.[1]
    }
  },

  actions: {
    startLoading(key: string, message?: string) {
      this.loadingStates.set(key, true)
      if (message) {
        this.loadingMessages.set(key, message)
      }
    },

    stopLoading(key: string) {
      this.loadingStates.delete(key)
      this.loadingMessages.delete(key)
    },

    clearAll() {
      this.loadingStates.clear()
      this.loadingMessages.clear()
    },

    // Utility method to wrap async functions with loading state
    async withLoading<T>(
      key: string, 
      fn: () => Promise<T>, 
      message?: string
    ): Promise<T> {
      try {
        this.startLoading(key, message)
        return await fn()
      } finally {
        this.stopLoading(key)
      }
    }
  }
})

// Composable for easier usage in components
export function useLoading() {
  const loadingStore = useLoadingStore()

  const withLoading = async <T>(
    key: string,
    fn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    return loadingStore.withLoading(key, fn, message)
  }

  return {
    isLoading: computed(() => loadingStore.isLoading),
    currentMessage: computed(() => loadingStore.currentMessage),
    startLoading: loadingStore.startLoading,
    stopLoading: loadingStore.stopLoading,
    clearAll: loadingStore.clearAll,
    withLoading
  }
}