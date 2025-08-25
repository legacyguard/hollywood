/**
 * Encryption Service v2 - Secure implementation using Web Crypto API
 * 
 * Security improvements:
 * - Non-extractable CryptoKey objects stored in IndexedDB
 * - AES-GCM encryption for file content
 * - Key rotation and expiration support
 * - No plaintext keys in localStorage
 * - Defense-in-depth controls
 */

import { secureCryptoStore } from './security/secure-crypto-store';

interface EncryptedFileData {
  encryptedData: ArrayBuffer;
  iv: Uint8Array;
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    encryptedAt: string;
    algorithm: string;
    keyVersion: string;
  };
}

interface EncryptionKeyInfo {
  key: CryptoKey;
  version: string;
  createdAt: Date;
  expiresAt?: Date;
}

class EncryptionServiceV2 {
  private keyCache: Map<string, EncryptionKeyInfo> = new Map();
  private readonly KEY_EXPIRY_DAYS = 90; // Rotate keys every 90 days
  private readonly ALGORITHM = 'AES-GCM';
  private readonly KEY_LENGTH = 256;

  /**
   * Generate a new non-extractable AES-GCM encryption key
   */
  private async generateEncryptionKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      false, // extractable: false - prevents key extraction
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Get or create encryption key for a user
   * Uses secure storage and implements key rotation
   */
  async getUserEncryptionKey(userId: string): Promise<CryptoKey> {
    const storageKey = `encryption_key_${userId}`;
    
    // Check cache first
    if (this.keyCache.has(userId)) {
      const cached = this.keyCache.get(userId)!;
      
      // Check if key has expired
      if (cached.expiresAt && cached.expiresAt < new Date()) {
        // Key expired, remove from cache and generate new one
        this.keyCache.delete(userId);
        await secureCryptoStore.removeKey(storageKey);
      } else {
        return cached.key;
      }
    }

    // Try to retrieve existing key from secure storage
    const existingKey = await secureCryptoStore.getKey(storageKey);
    if (existingKey) {
      const metadata = await secureCryptoStore.getKeyMetadata(storageKey);
      if (metadata) {
        const keyInfo: EncryptionKeyInfo = {
          key: existingKey,
          version: metadata.id,
          createdAt: new Date(metadata.createdAt),
          expiresAt: metadata.expiresAt ? new Date(metadata.expiresAt) : undefined
        };
        
        this.keyCache.set(userId, keyInfo);
        return existingKey;
      }
    }

    // Generate new key if none exists or current one is invalid
    const newKey = await this.generateEncryptionKey();
    const keyVersion = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.KEY_EXPIRY_DAYS);

    // Store in secure storage
    await secureCryptoStore.saveKey(storageKey, newKey, userId, expiresAt);

    // Cache the key info
    const keyInfo: EncryptionKeyInfo = {
      key: newKey,
      version: keyVersion,
      createdAt: new Date(),
      expiresAt
    };
    this.keyCache.set(userId, keyInfo);

    return newKey;
  }

  /**
   * Convert file to ArrayBuffer for encryption
   */
  private async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return await file.arrayBuffer();
  }

  /**
   * Encrypt file content using AES-GCM
   */
  async encryptFile(file: File, userId: string): Promise<EncryptedFileData> {
    const key = await this.getUserEncryptionKey(userId);
    const fileData = await this.fileToArrayBuffer(file);
    
    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the file data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv: iv
      },
      key,
      fileData
    );

    // Get key metadata for version tracking
    const storageKey = `encryption_key_${userId}`;
    const metadata = await secureCryptoStore.getKeyMetadata(storageKey);
    
    const fileMetadata = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      encryptedAt: new Date().toISOString(),
      algorithm: this.ALGORITHM,
      keyVersion: metadata?.id || 'unknown'
    };

    return {
      encryptedData,
      iv,
      metadata: fileMetadata
    };
  }

  /**
   * Decrypt file content using AES-GCM
   */
async decryptFile(
  encryptedData: ArrayBuffer,
  iv: Uint8Array,
  userId: string
): Promise<ArrayBuffer | null> {
  try {
    // Validate IV length for AES-GCM
    if (iv.length !== 12) {
      console.error('Invalid IV length. Expected 12 bytes for AES-GCM');
      return null;
    }

    const key = await this.getUserEncryptionKey(userId);
    
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv: iv
      },
      key,
      encryptedData
    );

    return decryptedData;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

  /**
   * Create encrypted blob for upload
   */
  createEncryptedBlob(encryptedData: ArrayBuffer, iv: Uint8Array): Blob {
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    return new Blob([combined], { type: 'application/octet-stream' });
  }

  /**
   * Extract IV and encrypted data from blob
   */
  async extractFromBlob(blob: Blob): Promise<{ iv: Uint8Array; encryptedData: ArrayBuffer } | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // First 12 bytes are the IV
          const iv = uint8Array.slice(0, 12);
          const encryptedData = uint8Array.slice(12);
          
          resolve({ iv, encryptedData: encryptedData.buffer });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    });
  }

  /**
   * Rotate encryption key for a user
   * This creates a new key and marks the old one for expiration
   */
  async rotateUserKey(userId: string): Promise<void> {
    const storageKey = `encryption_key_${userId}`;
    
    // Remove old key from cache and storage
    this.keyCache.delete(userId);
    await secureCryptoStore.removeKey(storageKey);
    
    // Generate new key (this will happen automatically on next use)
    await this.getUserEncryptionKey(userId);
  }

  /**
   * Clear cached keys for a user
   */
  async clearUserKeys(userId: string): Promise<void> {
    this.keyCache.delete(userId);
    const storageKey = `encryption_key_${userId}`;
    await secureCryptoStore.removeUserKeys(userId);
  }

  /**
   * Check if user has existing keys
   */
  async hasUserKeys(userId: string): Promise<boolean> {
    const storageKey = `encryption_key_${userId}`;
    return await secureCryptoStore.hasKey(storageKey);
  }

  /**
   * Get key metadata for a user
   */
  async getUserKeyInfo(userId: string): Promise<{
    version: string;
    createdAt: Date;
    expiresAt?: Date;
    algorithm: string;
  } | null> {
    const storageKey = `encryption_key_${userId}`;
    const metadata = await secureCryptoStore.getKeyMetadata(storageKey);
    
    if (!metadata) return null;
    
    return {
      version: metadata.id,
      createdAt: new Date(metadata.createdAt),
      expiresAt: metadata.expiresAt ? new Date(metadata.expiresAt) : undefined,
      algorithm: metadata.algorithm
    };
  }

  /**
   * Clean up expired keys
   */
  async cleanupExpiredKeys(): Promise<void> {
    await secureCryptoStore.clearExpiredKeys();
    
    // Also clean up expired keys from cache
    const now = new Date();
    for (const [userId, keyInfo] of this.keyCache.entries()) {
      if (keyInfo.expiresAt && keyInfo.expiresAt < now) {
        this.keyCache.delete(userId);
      }
    }
  }

  /**
   * Export encrypted data with metadata for backup/transfer
   */
  async exportEncryptedData(
    encryptedData: ArrayBuffer,
    iv: Uint8Array,
    metadata: EncryptedFileData['metadata']
  ): Promise<string> {
    const exportData = {
      encryptedData: this.arrayBufferToBase64(encryptedData),
      iv: this.uint8ArrayToBase64(iv),
      metadata
    };
    
    return JSON.stringify(exportData);
  }

  /**
   * Import encrypted data from backup/transfer
   */
  async importEncryptedData(exportString: string): Promise<{
    encryptedData: ArrayBuffer;
    iv: Uint8Array;
    metadata: EncryptedFileData['metadata'];
  } | null> {
    try {
      const exportData = JSON.parse(exportString);
      
      return {
        encryptedData: this.base64ToArrayBuffer(exportData.encryptedData),
        iv: this.base64ToUint8Array(exportData.iv),
        metadata: exportData.metadata
      };
    } catch (error) {
      console.error('Import failed:', error);
      return null;
    }
  }

  // Utility methods for base64 conversion
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private uint8ArrayToBase64(array: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < array.length; i++) {
      binary += String.fromCharCode(array[i]);
    }
    return btoa(binary);
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

// Export singleton instance
export const encryptionServiceV2 = new EncryptionServiceV2();

// Also export the class for testing purposes
export { EncryptionServiceV2 };

// Export types for external use
export type { EncryptedFileData, EncryptionKeyInfo };
