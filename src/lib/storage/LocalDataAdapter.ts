import { secureStorage } from '../security/secure-storage';
import { SecureEncryptionService } from '../encryption-v2';

export interface StorageItem {
  id: string;
  category: string;
  data: any;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    isEncrypted: boolean;
    syncStatus?: 'local' | 'synced' | 'pending';
  };
}

export interface StorageQuery {
  category: string;
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export type SyncMode = 'local-only' | 'hybrid' | 'full-sync';

class LocalDataAdapter {
  private static instance: LocalDataAdapter;
  private encryption: SecureEncryptionService;
  private readonly DB_NAME = 'LegacyGuardLocal';
  private readonly STORE_NAME = 'encrypted_data';
  private readonly AUDIT_STORE = 'audit_log';
  private db: IDBDatabase | null = null;
  private syncMode: SyncMode = 'local-only';
  private lastActivity: number = Date.now();
  private lockTimer: NodeJS.Timeout | null = null;
  private syncTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.encryption = SecureEncryptionService.getInstance();
    this.initializeDB().catch(console.error);
    this.setupActivityMonitoring();
  }

  public static getInstance(): LocalDataAdapter {
    if (!LocalDataAdapter.instance) {
      LocalDataAdapter.instance = new LocalDataAdapter();
    }
    return LocalDataAdapter.instance;
  }

  /**
   * Initialize IndexedDB database
   */
  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Main data store
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('syncStatus', 'metadata.syncStatus', { unique: false });
        }

        // Audit log store
        if (!db.objectStoreNames.contains(this.AUDIT_STORE)) {
          const auditStore = db.createObjectStore(this.AUDIT_STORE, { keyPath: 'id', autoIncrement: true });
          auditStore.createIndex('timestamp', 'timestamp', { unique: false });
          auditStore.createIndex('category', 'category', { unique: false });
        }
      };
    });
  }

  /**
   * Set sync mode
   */
  public async setSyncMode(mode: SyncMode): Promise<void> {
    this.syncMode = mode;
    await this.logAuditEvent('system', 'set_sync_mode', { mode });

    // Start or stop sync based on mode
    if (mode !== 'local-only') {
      this.startPeriodicSync();
    } else {
      this.stopPeriodicSync();
    }
  }

  /**
   * Store item
   */
  public async store(category: string, data: any): Promise<StorageItem> {
    if (!this.db) await this.initializeDB();

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    let encryptedData = data;
    let isEncrypted = false;

    // Encrypt data if keys are available
    if (await this.encryption.areKeysUnlocked()) {
      const encrypted = await this.encryption.encryptText(JSON.stringify(data));
      if (encrypted) {
        encryptedData = encrypted;
        isEncrypted = true;
      }
    }

    const item: StorageItem = {
      id,
      category,
      data: encryptedData,
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: 1,
        isEncrypted,
        syncStatus: this.syncMode === 'local-only' ? 'local' : 'pending'
      }
    };

    const tx = this.db!.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);
    await store.put(item);

    // Log the event
    await this.logAuditEvent(category, 'create', { id });

    // Trigger sync if needed
    if (this.syncMode !== 'local-only') {
      this.triggerSync();
    }

    return item;
  }

  /**
   * Retrieve item
   */
  public async retrieve(id: string): Promise<StorageItem | null> {
    if (!this.db) await this.initializeDB();

    const tx = this.db!.transaction(this.STORE_NAME, 'readonly');
    const store = tx.objectStore(this.STORE_NAME);
    const item = await store.get(id);

    if (!item) return null;

    // Decrypt if encrypted and keys available
    if (item.metadata.isEncrypted && await this.encryption.areKeysUnlocked()) {
      const decrypted = await this.encryption.decryptText(item.data);
      if (decrypted) {
        item.data = JSON.parse(decrypted);
      }
    }

    return item;
  }

  /**
   * Query items
   */
  public async query(params: StorageQuery): Promise<StorageItem[]> {
    if (!this.db) await this.initializeDB();

    const tx = this.db!.transaction(this.STORE_NAME, 'readonly');
    const store = tx.objectStore(this.STORE_NAME);
    const categoryIndex = store.index('category');

    const items = await categoryIndex.getAll(params.category);

    // Apply filters if any
    let filtered = items;
    if (params.filter) {
      filtered = items.filter(item => {
        for (const [key, value] of Object.entries(params.filter!)) {
          if (item.data[key] !== value) return false;
        }
        return true;
      });
    }

    // Apply pagination
    if (params.offset != null || params.limit != null) {
      const start = params.offset || 0;
      const end = params.limit ? start + params.limit : undefined;
      filtered = filtered.slice(start, end);
    }

    // Decrypt items if possible
    const keysUnlocked = await this.encryption.areKeysUnlocked();
    const decrypted = await Promise.all(
      filtered.map(async item => {
        if (item.metadata.isEncrypted && keysUnlocked) {
          const decrypted = await this.encryption.decryptText(item.data);
          if (decrypted) {
            return {
              ...item,
              data: JSON.parse(decrypted)
            };
          }
        }
        return item;
      })
    );

    return decrypted;
  }

  /**
   * Update item
   */
  public async update(id: string, data: any): Promise<StorageItem | null> {
    if (!this.db) await this.initializeDB();

    // Get existing item
    const existing = await this.retrieve(id);
    if (!existing) return null;

    let encryptedData = data;
    let isEncrypted = false;

    // Encrypt data if keys are available
    if (await this.encryption.areKeysUnlocked()) {
      const encrypted = await this.encryption.encryptText(JSON.stringify(data));
      if (encrypted) {
        encryptedData = encrypted;
        isEncrypted = true;
      }
    }

    const updated: StorageItem = {
      ...existing,
      data: encryptedData,
      metadata: {
        ...existing.metadata,
        updatedAt: new Date().toISOString(),
        version: existing.metadata.version + 1,
        isEncrypted,
        syncStatus: this.syncMode === 'local-only' ? 'local' : 'pending'
      }
    };

    const tx = this.db!.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);
    await store.put(updated);

    // Log the event
    await this.logAuditEvent(existing.category, 'update', { id });

    // Trigger sync if needed
    if (this.syncMode !== 'local-only') {
      this.triggerSync();
    }

    return updated;
  }

  /**
   * Delete item
   */
  public async delete(id: string): Promise<void> {
    if (!this.db) await this.initializeDB();

    const existing = await this.retrieve(id);
    if (!existing) return;

    const tx = this.db!.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);
    await store.delete(id);

    // Log the event
    await this.logAuditEvent(existing.category, 'delete', { id });

    // Trigger sync if needed
    if (this.syncMode !== 'local-only') {
      this.triggerSync();
    }
  }

  /**
   * Export all data (requires unlocked session)
   */
  public async exportData(): Promise<string | null> {
    if (!this.db) await this.initializeDB();

    // Verify session is unlocked
    if (!await this.encryption.areKeysUnlocked()) {
      throw new Error('Session must be unlocked to export data');
    }

    const tx = this.db!.transaction(this.STORE_NAME, 'readonly');
    const store = tx.objectStore(this.STORE_NAME);
    const items = await store.getAll();

    // Decrypt all items
    const decrypted = await Promise.all(
      items.map(async item => {
        if (item.metadata.isEncrypted) {
          const decryptedData = await this.encryption.decryptText(item.data);
          return {
            ...item,
            data: decryptedData ? JSON.parse(decryptedData) : item.data
          };
        }
        return item;
      })
    );

    return JSON.stringify(decrypted, null, 2);
  }

  /**
   * Log audit event
   */
  private async logAuditEvent(
    category: string,
    action: string,
    details: Record<string, any>
  ): Promise<void> {
    if (!this.db) await this.initializeDB();

    const event = {
      timestamp: new Date().toISOString(),
      category,
      action,
      details,
      syncMode: this.syncMode
    };

    const tx = this.db!.transaction(this.AUDIT_STORE, 'readwrite');
    const store = tx.objectStore(this.AUDIT_STORE);
    await store.add(event);
  }

  /**
   * Setup activity monitoring
   */
  private setupActivityMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Update last activity timestamp
    const updateActivity = () => {
      this.lastActivity = Date.now();
    };

    // Monitor user activity
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    // Check for inactivity every minute
    setInterval(() => {
      const inactiveTime = Date.now() - this.lastActivity;
      const lockTimeout = 15 * 60 * 1000; // 15 minutes

      if (inactiveTime >= lockTimeout) {
        this.lock();
      }
    }, 60000);
  }

  /**
   * Lock the session
   */
  private async lock(): Promise<void> {
    // Clear encryption keys
    await this.encryption.lockKeys();

    // Stop sync
    this.stopPeriodicSync();

    // Log event
    await this.logAuditEvent('system', 'lock', {
      reason: 'inactivity',
      inactiveTime: Date.now() - this.lastActivity
    });
  }

  /**
   * Start periodic sync
   */
  private startPeriodicSync(): void {
    if (this.syncTimer) return;

    this.syncTimer = setInterval(() => {
      this.triggerSync();
    }, 10 * 60 * 1000); // 10 minutes
  }

  /**
   * Stop periodic sync
   */
  private stopPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Trigger sync process
   */
  private async triggerSync(): Promise<void> {
    // This will be implemented in CloudSyncAdapter
    // For now, just log the event
    await this.logAuditEvent('system', 'sync_triggered', {
      mode: this.syncMode
    });
  }
}

export const localDataAdapter = LocalDataAdapter.getInstance();
