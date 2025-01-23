<!-- app.vue -->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global Loading Indicator -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-degen-primary"></div>
        <span class="text-white">Loading...</span>
      </div>
    </div>

    <!-- Global Notifications -->
    <div 
      class="fixed bottom-4 right-4 z-50 flex flex-col space-y-2"
      aria-live="polite"
    >
      <TransitionGroup 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'max-w-sm w-full bg-gray-800 rounded-lg shadow-lg p-4',
            'border-l-4',
            notification.type === 'success' ? 'border-green-500' : 
            notification.type === 'error' ? 'border-red-500' : 
            'border-blue-500'
          ]"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <Icon
                :name="notification.type === 'success' ? 'lucide:check-circle' : 
                      notification.type === 'error' ? 'lucide:x-circle' : 
                      'lucide:info'"
                class="w-5 h-5"
                :class="notification.type === 'success' ? 'text-green-500' :
                       notification.type === 'error' ? 'text-red-500' :
                       'text-blue-500'"
              />
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-sm font-medium text-white">
                {{ notification.title }}
              </p>
              <p 
                v-if="notification.message" 
                class="mt-1 text-sm text-gray-300"
              >
                {{ notification.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="inline-flex text-gray-400 hover:text-gray-300"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import { useNotificationStore } from '@/stores/notification'

// Global loading state
const { isLoading } = storeToRefs(useLoadingStore())

// Global notifications
const { notifications, removeNotification } = useNotificationStore()

// Initialize web3 connection if autoConnect is enabled
const { connect } = useWeb3()
// Auto-connect if enabled in runtime config
const config = useRuntimeConfig()
onMounted(async () => {
  if (config.public.autoConnect) {
    try {
      await connect()
    } catch (error) {
      console.error('Auto-connect failed:', error)
    }
  }
})
</script>

<style>
/* Add any global styles here */
html {
  @apply antialiased;
  -webkit-tap-highlight-color: transparent;
}

body {
  @apply bg-degen-dark text-white min-h-screen;
}

/* Custom scrollbar for Webkit browsers */
::-webkit-scrollbar {
  @apply w-2;
}

::-webkit-scrollbar-track {
  @apply bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}

/* Remove arrows from number inputs */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>