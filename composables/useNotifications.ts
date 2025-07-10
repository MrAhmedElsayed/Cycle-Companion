import { PushNotifications } from '@capacitor/push-notifications'
import type { Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications'
import { ref } from 'vue'

export function useNotifications() {
  const permission = ref<'granted' | 'denied' | 'prompt'>('prompt')
  const token = ref<string | null>(null)
  const lastNotification = ref<PushNotificationSchema | null>(null)

  async function requestPermission() {
    const result = await PushNotifications.requestPermissions()
    permission.value = result.receive === 'granted' ? 'granted' : 'denied'
    return permission.value
  }

  async function register() {
    await PushNotifications.register()
    PushNotifications.addListener('registration', (t: Token) => {
      token.value = t.value
    })
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      lastNotification.value = notification
    })
    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      // handle action
    })
  }

  async function testLocalNotification() {
    // For now, just log that we would send a notification
    console.log('Would send local notification: Cycle Companion - This is a test notification!')
  }

  return {
    permission,
    token,
    lastNotification,
    requestPermission,
    register,
    testLocalNotification
  }
} 