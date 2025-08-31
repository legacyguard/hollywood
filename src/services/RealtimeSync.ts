/**
 * Real-time Synchronization Service for Web Application
 * Manages real-time data sync between web and mobile applications
 */

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

export interface Document {
  id: string;
  user_id: string;
  title: string;
  category: string;
  content?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  sync_status: 'synced' | 'pending' | 'offline';
}

export interface SyncEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  document: Document;
  timestamp: string;
}

export class RealtimeSync {
  private supabase: SupabaseClient;
  private channel: RealtimeChannel | null = null;
  private userId: string | null = null;
  private syncQueue: SyncEvent[] = [];
  private isOnline: boolean = true;
  private listeners: Map<string, (event: SyncEvent) => void> = new Map();

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

    this.initializeNetworkListener();
    this.initializeGardenEventListener();
  }

  /**
   * Initialize network state listener
   */
  private initializeNetworkListener() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  /**
   * Initialize garden update event listener
   */
  private initializeGardenEventListener() {
    // Listen for garden update events from mobile app
    window.addEventListener('garden-update', (event: any) => {
      this.handleGardenUpdate(event.detail);
    });
  }

  /**
   * Handle garden updates from mobile app
   */
  private handleGardenUpdate(detail: any) {
    // Trigger visual update in the Legacy Garden visualization
    const gardenElement = document.querySelector('.legacy-garden-container');
    if (gardenElement) {
      // Add new leaf animation
      gardenElement.dispatchEvent(new CustomEvent('add-leaf', {
        detail: {
          category: detail.category,
          documentId: detail.documentId,
          animate: true,
        }
      }));
    }

    // Update dashboard statistics
    this.updateDashboardStats();
  }

  /**
   * Handle online state
   */
  private async handleOnline() {
    this.isOnline = true;
    console.log('RealtimeSync: Network online, processing sync queue');
    await this.processSyncQueue();
  }

  /**
   * Handle offline state
   */
  private handleOffline() {
    this.isOnline = false;
    console.log('RealtimeSync: Network offline, queueing changes');
  }

  /**
   * Setup real-time document synchronization
   */
  async setupDocumentSync(userId: string): Promise<void> {
    this.userId = userId;

    // Clean up existing subscription
    if (this.channel) {
      await this.channel.unsubscribe();
    }

    // Create new channel for user-specific documents
    this.channel = this.supabase
      .channel(`documents:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          this.handleRealtimeChange(payload);
        }
      )
      .subscribe((status) => {
        console.log(`RealtimeSync: Subscription status - ${status}`);
      });
  }

  /**
   * Handle real-time database changes
   */
  private handleRealtimeChange(payload: any) {
    const event: SyncEvent = {
      type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
      document: payload.new || payload.old,
      timestamp: new Date().toISOString(),
    };

    // Notify all listeners
    this.listeners.forEach((listener) => {
      listener(event);
    });

    // Update local cache
    this.updateLocalCache(event);

    // Trigger UI updates
    this.triggerUIUpdate(event);
  }

  /**
   * Trigger UI updates based on sync events
   */
  private triggerUIUpdate(event: SyncEvent) {
    // Update Sofia personality messages
    if (event.type === 'INSERT') {
      this.showSofiaNotification(
        `New document "${event.document.title}" has been added from your mobile device!`,
        'success'
      );
    }

    // Update dashboard cards
    this.updateDashboardStats();

    // Trigger garden animation
    if (event.type === 'INSERT' || event.type === 'UPDATE') {
      this.animateGardenGrowth(event.document);
    }
  }

  /**
   * Show Sofia personality notification
   */
  private showSofiaNotification(message: string, type: 'success' | 'info' | 'warning' = 'info') {
    const sofiaEvent = new CustomEvent('sofia-message', {
      detail: {
        message,
        type,
        personality: 'adaptive', // Can be changed based on user preference
      }
    });
    window.dispatchEvent(sofiaEvent);
  }

  /**
   * Animate garden growth
   */
  private animateGardenGrowth(document: Document) {
    const gardenEvent = new CustomEvent('garden-growth', {
      detail: {
        documentId: document.id,
        category: document.category,
        growth: 'new-leaf',
      }
    });
    window.dispatchEvent(gardenEvent);
  }

  /**
   * Update dashboard statistics
   */
  private updateDashboardStats() {
    const statsEvent = new CustomEvent('dashboard-update', {
      detail: {
        source: 'realtime-sync',
        timestamp: new Date().toISOString(),
      }
    });
    window.dispatchEvent(statsEvent);
  }

  /**
   * Update local cache
   */
  private async updateLocalCache(event: SyncEvent) {
    const cacheKey = `documents_${this.userId}`;
    const cachedData = localStorage.getItem(cacheKey);
    let documents: Document[] = cachedData ? JSON.parse(cachedData) : [];

    switch (event.type) {
      case 'INSERT':
        documents.push(event.document);
        break;
      case 'UPDATE':
        documents = documents.map((doc) =>
          doc.id === event.document.id ? event.document : doc
        );
        break;
      case 'DELETE':
        documents = documents.filter((doc) => doc.id !== event.document.id);
        break;
    }

    localStorage.setItem(cacheKey, JSON.stringify(documents));
  }

  /**
   * Upload document with sync support
   */
  async uploadDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document | null> {
    if (!this.isOnline) {
      // Queue for later sync
      const queuedDoc: Document = {
        ...document,
        id: `temp_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
      };

      this.syncQueue.push({
        type: 'INSERT',
        document: queuedDoc,
        timestamp: new Date().toISOString(),
      });

      await this.saveQueueToStorage();
      return queuedDoc;
    }

    // Online upload
    const { data, error } = await this.supabase
      .from('documents')
      .insert([document])
      .select()
      .single();

    if (error) {
      console.error('RealtimeSync: Upload error', error);
      return null;
    }

    // Notify mobile app
    this.notifyMobileApp('document-uploaded', data);

    return data;
  }

  /**
   * Notify mobile app of changes
   */
  private notifyMobileApp(event: string, data: any) {
    // This will be picked up by the mobile app's realtime subscription
    console.log(`RealtimeSync: Notifying mobile app - ${event}`, data);
  }

  /**
   * Process sync queue when online
   */
  private async processSyncQueue() {
    if (this.syncQueue.length === 0) return;

    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const event of queue) {
      try {
        switch (event.type) {
          case 'INSERT':
            await this.supabase.from('documents').insert([event.document]);
            break;
          case 'UPDATE':
            await this.supabase
              .from('documents')
              .update(event.document)
              .eq('id', event.document.id);
            break;
          case 'DELETE':
            await this.supabase
              .from('documents')
              .delete()
              .eq('id', event.document.id);
            break;
        }
      } catch (error) {
        console.error('RealtimeSync: Sync error', error);
        // Re-queue failed items
        this.syncQueue.push(event);
      }
    }

    if (this.syncQueue.length > 0) {
      await this.saveQueueToStorage();
    } else {
      localStorage.removeItem('sync_queue');
    }
  }

  /**
   * Save sync queue to storage
   */
  private async saveQueueToStorage() {
    localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
  }

  /**
   * Load sync queue from storage
   */
  async loadQueueFromStorage() {
    const queue = localStorage.getItem('sync_queue');
    if (queue) {
      this.syncQueue = JSON.parse(queue);
    }
  }

  /**
   * Subscribe to sync events
   */
  subscribe(id: string, callback: (event: SyncEvent) => void) {
    this.listeners.set(id, callback);
  }

  /**
   * Unsubscribe from sync events
   */
  unsubscribe(id: string) {
    this.listeners.delete(id);
  }

  /**
   * Clean up subscriptions
   */
  async cleanup() {
    if (this.channel) {
      await this.channel.unsubscribe();
    }
    this.listeners.clear();
  }

  /**
   * Get sync status
   */
  getSyncStatus(): { isOnline: boolean; queueLength: number } {
    return {
      isOnline: this.isOnline,
      queueLength: this.syncQueue.length,
    };
  }

  /**
   * Get all synced documents
   */
  async getSyncedDocuments(): Promise<Document[]> {
    if (!this.userId) return [];

    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('RealtimeSync: Error fetching documents', error);
      return [];
    }

    return data || [];
  }

  /**
   * Monitor sync activity
   */
  getSyncActivity(): { lastSync: string | null; pendingChanges: number } {
    const lastSync = localStorage.getItem('last_sync_time');
    return {
      lastSync,
      pendingChanges: this.syncQueue.length,
    };
  }

  /**
   * Force sync all pending changes
   */
  async forceSyncAll(): Promise<void> {
    if (this.isOnline) {
      await this.processSyncQueue();
      localStorage.setItem('last_sync_time', new Date().toISOString());
    }
  }
}
