import { secureStorage } from '../security/secure-storage';
import { SecureEncryptionService } from '../encryption-v2';

class MasterKeyMigration {
  private static instance: MasterKeyMigration;
  private readonly LEGACY_KEY = 'masterKey_v1';
  private readonly NEW_KEY = 'master_key_store';
  private encryption: SecureEncryptionService;

  private constructor() {
    this.encryption = SecureEncryptionService.getInstance();
  }

  public static getInstance(): MasterKeyMigration {
    if (!MasterKeyMigration.instance) {
      MasterKeyMigration.instance = new MasterKeyMigration();
    }
    return MasterKeyMigration.instance;
  }

  /**
   * Check if migration is needed
   */
  public async isMigrationNeeded(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check if legacy key exists
    const legacyKey = localStorage.getItem(this.LEGACY_KEY);
    if (!legacyKey) return false;

    // Check if new key exists
    const newKey = await secureStorage.getSecureLocal(this.NEW_KEY);
    return !newKey;
  }

  /**
   * Perform migration
   */
  public async migrate(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;

      // Get legacy key
      const legacyKey = localStorage.getItem(this.LEGACY_KEY);
      if (!legacyKey) return false;

      // Encrypt the master key
      const encrypted = await this.encryption.encryptText(legacyKey);
      if (!encrypted) {
        throw new Error('Failed to encrypt master key');
      }

      // Store in secure storage
      await secureStorage.setSecureLocal(
        this.NEW_KEY,
        {
          key: encrypted,
          version: 1,
          migratedAt: new Date().toISOString(),
        },
        365 // Keep for 1 year
      );

      // Log migration event
      await this.logMigration('success');

      return true;
    } catch (error) {
      console.error('Master key migration failed:', error);
      await this.logMigration('failed', error.message);
      return false;
    }
  }

  /**
   * Clean up legacy key
   */
  public async cleanup(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Verify new key exists before cleanup
    const newKey = await secureStorage.getSecureLocal(this.NEW_KEY);
    if (!newKey) {
      throw new Error('Cannot cleanup - new key not found');
    }

    // Remove legacy key
    localStorage.removeItem(this.LEGACY_KEY);
    await this.logMigration('cleanup');
  }

  /**
   * Verify migration
   */
  public async verifyMigration(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      // Get both keys
      const legacyKey = localStorage.getItem(this.LEGACY_KEY);
      const newKeyData = await secureStorage.getSecureLocal<{
        key: string;
        version: number;
      }>(this.NEW_KEY);

      if (!legacyKey || !newKeyData) return false;

      // Decrypt new key
      const decrypted = await this.encryption.decryptText(newKeyData.key);
      if (!decrypted) return false;

      // Compare values
      return decrypted === legacyKey;
    } catch (error) {
      console.error('Migration verification failed:', error);
      return false;
    }
  }

  /**
   * Log migration event
   */
  private async logMigration(
    status: 'success' | 'failed' | 'cleanup',
    error?: string
  ): Promise<void> {
    const event = {
      timestamp: new Date().toISOString(),
      type: 'master_key_migration',
      status,
      error,
    };

    await secureStorage.setSecureLocal(
      'migration_log',
      event,
      365 // Keep for 1 year
    );
  }
}

export const masterKeyMigration = MasterKeyMigration.getInstance();
