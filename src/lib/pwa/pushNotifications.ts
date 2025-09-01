/**
 * Push Notifications Service
 * Phase 7: Mobile & PWA Capabilities
 *
 * Handles push notification subscriptions, local notifications,
 * and notification interactions with proper permission management.
 */

import { pwaService } from './pwaService';
import { captureError } from '@/lib/monitoring/sentry';

export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  preferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  enabled: boolean;
  documentUpdates: boolean;
  securityAlerts: boolean;
  familyUpdates: boolean;
  systemMaintenance: boolean;
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
  };
}

export type NotificationType =
  | 'document_uploaded'
  | 'document_expired'
  | 'security_alert'
  | 'family_access_requested'
  | 'system_update'
  | 'backup_completed'
  | 'share_received'
  | 'maintenance_scheduled';

export class PushNotificationService {
  private static instance: PushNotificationService;
  private subscription: globalThis.PushSubscription | null = null;
  private preferences: NotificationPreferences = {
    enabled: true,
    documentUpdates: true,
    securityAlerts: true,
    familyUpdates: true,
    systemMaintenance: true,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    }
  };

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialize push notification service
   */
  async initialize(): Promise<void> {
    try {
      // Load preferences from storage
      await this.loadPreferences();

      // Check existing subscription
      await this.checkExistingSubscription();

      console.log('Push notification service initialized');
    } catch (error) {
      console.error('Push notification initialization failed:', error);
      captureError(error instanceof Error ? error : new Error(String(error)), {
        tags: { source: 'push_notifications_init' }
      });
    }
  }

  /**
   * Request notification permission and subscribe
   */
  async requestPermissionAndSubscribe(): Promise<boolean> {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        throw new Error('Notifications not supported in this browser');
      }

      // Request permission
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      // Subscribe to push notifications
      const subscriptionData = await pwaService.subscribeToPushNotifications();

      // Store subscription details
      await this.storeSubscription(subscriptionData);

      // Update preferences to enabled
      this.preferences.enabled = true;
      await this.savePreferences();

      console.log('Successfully subscribed to push notifications');
      return true;

    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      captureError(error instanceof Error ? error : new Error(String(error)), {
        tags: { source: 'push_notification_subscribe' }
      });
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      await pwaService.unsubscribeFromPushNotifications();

      this.subscription = null;
      this.preferences.enabled = false;
      await this.savePreferences();

      console.log('Successfully unsubscribed from push notifications');
      return true;

    } catch (error) {
      console.error('Failed to unsubscribe from notifications:', error);
      return false;
    }
  }

  /**
   * Show local notification
   */
  async showLocalNotification(config: NotificationConfig): Promise<Notification | null> {
    try {
      // Check permission
      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }

      // Check if notifications are enabled
      if (!this.preferences.enabled) {
        console.log('Notifications disabled by user');
        return null;
      }

      // Check quiet hours
      if (this.isInQuietHours()) {
        console.log('Notification blocked by quiet hours');
        return null;
      }

      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/shield-icon.svg',
        badge: config.badge || '/shield-icon.svg',
        image: config.image,
        tag: config.tag || 'legacyguard',
        data: config.data || {},
        actions: config.actions || [],
        requireInteraction: config.requireInteraction || false,
        silent: config.silent || false,
        timestamp: config.timestamp || Date.now(),
        vibrate: config.vibrate || [200, 100, 200]
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        this.handleNotificationClick(notification);
      };

      // Auto-close after 5 seconds if not requiring interaction
      if (!config.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;

    } catch (error) {
      console.error('Failed to show local notification:', error);
      return null;
    }
  }

  /**
   * Send targeted notification based on type
   */
  async sendNotification(type: NotificationType, data: Record<string, unknown> = {}): Promise<boolean> {
    const configs = this.getNotificationConfigs();
    const config = configs[type];

    if (!config) {
      console.error('Unknown notification type:', type);
      return false;
    }

    // Check type-specific preferences
    if (!this.isNotificationTypeEnabled(type)) {
      console.log('Notification type disabled:', type);
      return false;
    }

    // Customize config with data
    const finalConfig = this.customizeNotificationConfig(config, data);

    // Show local notification
    const notification = await this.showLocalNotification(finalConfig);

    return notification !== null;
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    await this.savePreferences();
    console.log('Notification preferences updated');
  }

  /**
   * Get current notification preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Check if notification type is enabled
   */
  private isNotificationTypeEnabled(type: NotificationType): boolean {
    switch (type) {
      case 'document_uploaded':
      case 'document_expired':
      case 'backup_completed':
        return this.preferences.documentUpdates;

      case 'security_alert':
        return this.preferences.securityAlerts;

      case 'family_access_requested':
      case 'share_received':
        return this.preferences.familyUpdates;

      case 'system_update':
      case 'maintenance_scheduled':
        return this.preferences.systemMaintenance;

      default:
        return true;
    }
  }

  /**
   * Check if current time is in quiet hours
   */
  private isInQuietHours(): boolean {
    if (!this.preferences.quietHours?.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { startTime, endTime } = this.preferences.quietHours;

    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }

    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * Handle notification click events
   */
  private async handleNotificationClick(notification: Notification): Promise<void> {
    notification.close();

    // Focus or open app window
    try {
      const clients = await self.clients?.matchAll({ type: 'window', includeUncontrolled: true }) || [];

      if (clients.length > 0) {
        // Focus existing window
        const client = clients[0];
        if (client.focus) {
          await client.focus();
        }

        // Navigate if needed
        if (notification.data?.url && client.navigate) {
          await client.navigate(notification.data.url);
        }
      } else {
        // Open new window
        if (self.clients?.openWindow) {
          await self.clients.openWindow(notification.data?.url || '/dashboard');
        }
      }
    } catch (error) {
      console.error('Failed to handle notification click:', error);
    }
  }

  /**
   * Get predefined notification configurations
   */
  private getNotificationConfigs(): Record<NotificationType, NotificationConfig> {
    return {
      document_uploaded: {
        title: 'Document Uploaded',
        body: 'Your document has been successfully uploaded and encrypted.',
        tag: 'document-upload',
        actions: [
          { action: 'view', title: 'View Document' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      },

      document_expired: {
        title: 'Document Expiring Soon',
        body: 'One of your important documents is expiring within 30 days.',
        tag: 'document-expiry',
        requireInteraction: true,
        actions: [
          { action: 'review', title: 'Review' },
          { action: 'extend', title: 'Extend' }
        ]
      },

      security_alert: {
        title: 'Security Alert',
        body: 'Unusual activity detected on your account.',
        tag: 'security-alert',
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300],
        actions: [
          { action: 'review', title: 'Review Activity' },
          { action: 'secure', title: 'Secure Account' }
        ]
      },

      family_access_requested: {
        title: 'Family Access Request',
        body: 'A family member has requested access to your emergency documents.',
        tag: 'family-access',
        requireInteraction: true,
        actions: [
          { action: 'approve', title: 'Approve' },
          { action: 'deny', title: 'Deny' }
        ]
      },

      system_update: {
        title: 'System Update Available',
        body: 'A new version of LegacyGuard is available with security improvements.',
        tag: 'system-update',
        actions: [
          { action: 'update', title: 'Update Now' },
          { action: 'later', title: 'Later' }
        ]
      },

      backup_completed: {
        title: 'Backup Completed',
        body: 'Your documents have been successfully backed up.',
        tag: 'backup-complete'
      },

      share_received: {
        title: 'Document Shared',
        body: 'A family member has shared a document with you.',
        tag: 'share-received',
        actions: [
          { action: 'view', title: 'View Document' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      },

      maintenance_scheduled: {
        title: 'Scheduled Maintenance',
        body: 'LegacyGuard will be undergoing maintenance tonight at 2 AM UTC.',
        tag: 'maintenance',
        timestamp: Date.now() + 24 * 60 * 60 * 1000 // Tomorrow
      }
    };
  }

  /**
   * Customize notification config with dynamic data
   */
  private customizeNotificationConfig(config: NotificationConfig, data: Record<string, unknown>): NotificationConfig {
    const customized = { ...config };

    // Replace placeholders in title and body
    if (data.documentName) {
      customized.body = customized.body.replace('document', `"${data.documentName}"`);
    }

    if (data.familyMember) {
      customized.body = customized.body.replace('family member', data.familyMember);
    }

    if (data.count) {
      customized.body = customized.body.replace('One of your', `${data.count} of your`);
    }

    // Add custom data
    customized.data = { ...customized.data, ...data };

    return customized;
  }

  /**
   * Check existing subscription
   */
  private async checkExistingSubscription(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker?.ready;
      if (registration?.pushManager) {
        this.subscription = await registration.pushManager.getSubscription();
        if (this.subscription) {
          console.log('Found existing push subscription');
        }
      }
    } catch (error) {
      console.error('Failed to check existing subscription:', error);
    }
  }

  /**
   * Store subscription details
   */
  private async storeSubscription(subscriptionData: any): Promise<void> {
    try {
      localStorage.setItem('pwa-push-subscription', JSON.stringify(subscriptionData));
    } catch (error) {
      console.error('Failed to store subscription:', error);
    }
  }

  /**
   * Load preferences from storage
   */
  private async loadPreferences(): Promise<void> {
    try {
      const stored = localStorage.getItem('notification-preferences');
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }

  /**
   * Save preferences to storage
   */
  private async savePreferences(): Promise<void> {
    try {
      localStorage.setItem('notification-preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  }

  /**
   * Get notification permission status
   */
  getPermissionStatus(): 'granted' | 'denied' | 'default' {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Test notification (for debugging)
   */
  async testNotification(): Promise<void> {
    await this.showLocalNotification({
      title: 'Test Notification',
      body: 'This is a test notification from LegacyGuard',
      tag: 'test',
      data: { test: true }
    });
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
