/**
 * PWA Service for Mobile & Progressive Web App Capabilities
 * Phase 7: Mobile & PWA Capabilities
 * 
 * Handles service worker registration, push notifications,
 * offline functionality, and PWA installation prompts.
 */

import { captureError } from '@/lib/monitoring/sentry';

export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PWACapabilities {
  isSupported: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  hasServiceWorker: boolean;
  hasNotifications: boolean;
  hasCamera: boolean;
  hasGeolocation: boolean;
  isOnline: boolean;
  isSecureContext: boolean;
}

export class PWAService {
  private static instance: PWAService;
  private installPrompt: PWAInstallPrompt | null = null;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private pushSubscription: globalThis.PushSubscription | null = null;
  private notificationPermission: NotificationPermission = 'default' as any;
  private onlineListeners: Array<(online: boolean) => void> = [];
  private installListeners: Array<(canInstall: boolean) => void> = [];

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  /**
   * Initialize PWA service and register service worker
   */
  async initialize(): Promise<void> {
    try {
      // Register service worker
      await this.registerServiceWorker();
      
      // Setup install prompt listener
      this.setupInstallPromptListener();
      
      // Setup online/offline listeners
      this.setupNetworkListeners();
      
      // Check notification permission
      this.checkNotificationPermission();
      
      // Setup push notifications if supported
      if (this.serviceWorkerRegistration) {
        await this.setupPushNotifications();
      }
      
      console.log('PWA Service initialized successfully');
    } catch (error) {
      console.error('PWA Service initialization failed:', error);
      captureError(error instanceof Error ? error : new Error(String(error)), {
        tags: { source: 'pwa_service_init' }
      });
    }
  }

  /**
   * Register service worker
   */
  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully');

      // Handle updates
      this.serviceWorkerRegistration.addEventListener('updatefound', () => {
        const newWorker = this.serviceWorkerRegistration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateAvailableNotification();
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Setup install prompt listener
   */
  private setupInstallPromptListener(): void {
    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      this.installPrompt = event;
      this.notifyInstallListeners(true);
      console.log('PWA install prompt available');
    });

    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.notifyInstallListeners(false);
      console.log('PWA installed successfully');
    });
  }

  /**
   * Setup network status listeners
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.notifyOnlineListeners(true);
      console.log('Application back online');
    });

    window.addEventListener('offline', () => {
      this.notifyOnlineListeners(false);
      console.log('Application offline');
    });
  }

  /**
   * Check current notification permission
   */
  private checkNotificationPermission(): void {
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission as any;
    }
  }

  /**
   * Setup push notifications
   */
  private async setupPushNotifications(): Promise<void> {
    if (!this.serviceWorkerRegistration || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    try {
      // Check for existing subscription
      this.pushSubscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
      
      if (this.pushSubscription) {
        console.log('Existing push subscription found');
        // Send subscription to server
        await this.sendSubscriptionToServer(this.pushSubscription);
      }
    } catch (error) {
      console.error('Push notification setup failed:', error);
    }
  }

  /**
   * Handle messages from service worker
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated:', data);
        break;
      case 'OFFLINE_USAGE':
        console.log('Offline feature used:', data);
        break;
      case 'SYNC_COMPLETED':
        console.log('Background sync completed:', data);
        break;
      default:
        console.log('Unknown service worker message:', type, data);
    }
  }

  /**
   * Show update available notification
   */
  private showUpdateAvailableNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Update Available', {
        body: 'A new version of LegacyGuard is available. Refresh to update.',
        icon: '/shield-icon.svg',
        tag: 'app-update',
        actions: [
          { action: 'update', title: 'Update Now' },
          { action: 'dismiss', title: 'Later' }
        ]
      });
    }
  }

  /**
   * Get PWA capabilities
   */
  getCapabilities(): PWACapabilities {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

    return {
      isSupported: 'serviceWorker' in navigator,
      isInstalled: isStandalone,
      isStandalone,
      canInstall: !!this.installPrompt,
      hasServiceWorker: !!this.serviceWorkerRegistration,
      hasNotifications: 'Notification' in window,
      hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      hasGeolocation: 'geolocation' in navigator,
      isOnline: navigator.onLine,
      isSecureContext: window.isSecureContext
    };
  }

  /**
   * Trigger PWA installation prompt
   */
  async installPWA(): Promise<boolean> {
    if (!this.installPrompt) {
      throw new Error('PWA installation not available');
    }

    try {
      await this.installPrompt.prompt();
      const { outcome } = await this.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.installPrompt = null;
        this.notifyInstallListeners(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA installation failed:', error);
      throw error;
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission as any;
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission request failed:', error);
      throw error;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPushNotifications(): Promise<PushSubscription> {
    if (!this.serviceWorkerRegistration) {
      throw new Error('Service Worker not available');
    }

    if (this.notificationPermission !== 'granted') {
      const granted = await this.requestNotificationPermission();
      if (!granted) {
        throw new Error('Notification permission denied');
      }
    }

    try {
      // Generate VAPID keys (in production, these should be from your server)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI46fkfLx-tGSoHJNFG4K2wSh6GK8rSkZn1JzJFkEO1Y5bN5VGpLPAJlMc';
      
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      this.pushSubscription = subscription;
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };
    } catch (error) {
      console.error('Push subscription failed:', error);
      throw error;
    }
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: globalThis.PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
            auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      console.log('Push subscription sent to server');
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPushNotifications(): Promise<void> {
    if (!this.pushSubscription) {
      return;
    }

    try {
      await this.pushSubscription.unsubscribe();
      this.pushSubscription = null;
      
      // Notify server about unsubscription
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Unsubscribed from push notifications');
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      throw error;
    }
  }

  /**
   * Show local notification
   */
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    if (this.notificationPermission !== 'granted') {
      const granted = await this.requestNotificationPermission();
      if (!granted) {
        throw new Error('Notification permission denied');
      }
    }

    const notification = new Notification(title, {
      icon: '/shield-icon.svg',
      badge: '/shield-icon.svg',
      ...options
    });

    return new Promise((resolve) => {
      notification.onshow = () => resolve();
      notification.onerror = () => resolve();
    });
  }

  /**
   * Clear application cache
   */
  async clearCache(): Promise<void> {
    if (!this.serviceWorkerRegistration) {
      throw new Error('Service Worker not available');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve();
        } else {
          reject(new Error('Cache clear failed'));
        }
      };

      this.serviceWorkerRegistration!.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Force service worker update
   */
  async updateServiceWorker(): Promise<void> {
    if (!this.serviceWorkerRegistration) {
      throw new Error('Service Worker not available');
    }

    await this.serviceWorkerRegistration.update();
    
    if (this.serviceWorkerRegistration.waiting) {
      this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  /**
   * Add online status listener
   */
  addOnlineListener(callback: (online: boolean) => void): void {
    this.onlineListeners.push(callback);
  }

  /**
   * Remove online status listener
   */
  removeOnlineListener(callback: (online: boolean) => void): void {
    const index = this.onlineListeners.indexOf(callback);
    if (index > -1) {
      this.onlineListeners.splice(index, 1);
    }
  }

  /**
   * Add install availability listener
   */
  addInstallListener(callback: (canInstall: boolean) => void): void {
    this.installListeners.push(callback);
  }

  /**
   * Remove install availability listener
   */
  removeInstallListener(callback: (canInstall: boolean) => void): void {
    const index = this.installListeners.indexOf(callback);
    if (index > -1) {
      this.installListeners.splice(index, 1);
    }
  }

  /**
   * Notify online listeners
   */
  private notifyOnlineListeners(online: boolean): void {
    this.onlineListeners.forEach(callback => {
      try {
        callback(online);
      } catch (error) {
        console.error('Online listener error:', error);
      }
    });
  }

  /**
   * Notify install listeners
   */
  private notifyInstallListeners(canInstall: boolean): void {
    this.installListeners.forEach(callback => {
      try {
        callback(canInstall);
      } catch (error) {
        console.error('Install listener error:', error);
      }
    });
  }

  // Utility methods

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Check if running in standalone mode
   */
  isRunningStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Get network information
   */
  getNetworkInfo(): { type?: string; effectiveType?: string; downlink?: number; rtt?: number } {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (!connection) {
      return {};
    }

    return {
      type: connection.type,
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    };
  }

  /**
   * Request persistent storage
   */
  async requestPersistentStorage(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const isPersistent = await navigator.storage.persist();
        console.log('Persistent storage:', isPersistent ? 'granted' : 'denied');
        return isPersistent;
      } catch (error) {
        console.error('Persistent storage request failed:', error);
        return false;
      }
    }
    return false;
  }
}

export const pwaService = PWAService.getInstance();