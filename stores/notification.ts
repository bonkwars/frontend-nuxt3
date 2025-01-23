//stores/notification.ts
import { defineStore } from 'pinia'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
  timeout?: number
}

interface NotificationState {
  notifications: Notification[]
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: []
  }),

  actions: {
    add(notification: Omit<Notification, 'id'>) {
      const id = Math.random().toString(36).substring(2, 9)
      const newNotification = { ...notification, id }
      
      this.notifications.push(newNotification)

      // Auto remove notification after timeout
      if (notification.timeout !== 0) {
        setTimeout(() => {
          this.remove(id)
        }, notification.timeout || 5000)
      }

      return id
    },

    remove(id: string) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },

    clear() {
      this.notifications = []
    },

    // Helper methods for common notifications
    success(title: string, message?: string, timeout?: number) {
      return this.add({ type: 'success', title, message, timeout })
    },

    error(title: string, message?: string, timeout?: number) {
      return this.add({ type: 'error', title, message, timeout })
    },

    info(title: string, message?: string, timeout?: number) {
      return this.add({ type: 'info', title, message, timeout })
    }
  }
})

// Composable for easier usage in components
export function useNotifications() {
  const store = useNotificationStore()

  return {
    notifications: computed(() => store.notifications),
    success: store.success,
    error: store.error,
    info: store.info,
    remove: store.remove,
    clear: store.clear
  }
}