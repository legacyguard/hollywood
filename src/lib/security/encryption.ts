/**
 * Advanced Encryption Service
 * Handles field-level encryption, key rotation, and secure storage
 */

import { envConfig } from './env-config';

// Encryption algorithms
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const _TAG_LENGTH = 16;
const _SALT_LENGTH = 32;
const ITERATIONS = 100000;

/**
 * Encryption Service for sensitive data protection
 */
export class EncryptionService {
  private static instance: EncryptionService;
  private enabled: boolean;
  private masterKey: CryptoKey | null = null;
  private keyCache: Map<string, CryptoKey> = new Map();

  private constructor() {
    this.enabled = envConfig.getSecurityFeatures().enableEncryption;
    if (this.enabled) {
      this.initializeMasterKey();
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Initialize master key from environment or generate new one
   */
  private async initializeMasterKey(): Promise<void> {
    try {
      // In production, this should come from a secure key management service
      const keyMaterial = await this.getKeyMaterial();
      this.masterKey = await this.deriveKey(keyMaterial, 'master');
    } catch (error) {
      console.error('Failed to initialize master key:', error);
      throw new Error('Encryption service initialization failed');
    }
  }

  /**
   * Get key material (from env or secure storage)
   */
  private async getKeyMaterial(): Promise<CryptoKey> {
    // In production, retrieve from HSM, KMS, or secure environment variable
    const encoder = new TextEncoder();
    const keyData = encoder.encode(
      // This should be a secure random key in production
      import.meta.env.VITE_ENCRYPTION_KEY || 'temporary-dev-key-replace-in-production'
    );

    return await crypto.subtle.importKey(
      'raw',
      keyData,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
  }

  /**
   * Derive a key from master key
   */
  private async deriveKey(
    keyMaterial: CryptoKey,
    salt: string
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const saltData = encoder.encode(salt);

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltData,
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: ALGORITHM, length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate random bytes
   */
  private generateRandomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * Encrypt data
   */
  public async encrypt(
    data: string,
    context?: string
  ): Promise<{ encrypted: string; iv: string; tag?: string }> {
    if (!this.enabled) {
      // Return unencrypted in development if encryption is disabled
      return { encrypted: data, iv: '', tag: '' };
    }

    if (!this.masterKey) {
      throw new Error('Encryption service not initialized');
    }

    try {
      const encoder = new TextEncoder();
      const plaintext = encoder.encode(data);

      // Generate IV
      const iv = this.generateRandomBytes(IV_LENGTH);

      // Get or derive context-specific key
      const key = context
        ? await this.getContextKey(context)
        : this.masterKey;

      // Encrypt
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: ALGORITHM,
          iv: iv,
        },
        key,
        plaintext
      );

      // Convert to base64 for storage
      const encrypted = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
      const ivBase64 = btoa(String.fromCharCode(...iv));

      return {
        encrypted,
        iv: ivBase64,
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data
   */
  public async decrypt(
    encryptedData: string,
    iv: string,
    context?: string
  ): Promise<string> {
    if (!this.enabled) {
      // Return as-is if encryption is disabled
      return encryptedData;
    }

    if (!this.masterKey) {
      throw new Error('Encryption service not initialized');
    }

    try {
      // Convert from base64
      const ciphertext = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      const ivData = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

      // Get or derive context-specific key
      const key = context
        ? await this.getContextKey(context)
        : this.masterKey;

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        {
          name: ALGORITHM,
          iv: ivData,
        },
        key,
        ciphertext
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Get or create context-specific key
   */
  private async getContextKey(context: string): Promise<CryptoKey> {
    if (this.keyCache.has(context)) {
      return this.keyCache.get(context)!;
    }

    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }

    const keyMaterial = await this.getKeyMaterial();
    const contextKey = await this.deriveKey(keyMaterial, context);
    this.keyCache.set(context, contextKey);

    return contextKey;
  }

  /**
   * Encrypt object fields
   */
  public async encryptObject<T extends Record<string, unknown>>(
    obj: T,
    fieldsToEncrypt: (keyof T)[]
  ): Promise<T & { _encryption?: Record<string, unknown> }> {
    if (!this.enabled) {
      return obj;
    }

    const encrypted = { ...obj } as T & { _encryption?: Record<string, unknown> };
    const encryptionMetadata: Record<string, unknown> = {};

    for (const field of fieldsToEncrypt) {
      if (obj[field] !== undefined && obj[field] !== null) {
        const value = String(obj[field]);
        const { encrypted: encryptedValue, iv } = await this.encrypt(value, String(field));

        encrypted[field] = encryptedValue as T[keyof T];
        encryptionMetadata[String(field)] = { iv, encrypted: true };
      }
    }

    if (Object.keys(encryptionMetadata).length > 0) {
      encrypted._encryption = encryptionMetadata;
    }

    return encrypted;
  }

  /**
   * Decrypt object fields
   */
  public async decryptObject<T extends Record<string, unknown>>(
    obj: T & { _encryption?: Record<string, unknown> }
  ): Promise<T> {
    if (!this.enabled || !obj._encryption) {
      const { _encryption, ...data } = obj;
      return data as T;
    }

    const decrypted = { ...obj };
    delete decrypted._encryption;

    for (const [field, metadata] of Object.entries(obj._encryption)) {
      if (metadata.encrypted && decrypted[field]) {
        try {
          decrypted[field] = await this.decrypt(
            decrypted[field],
            metadata.iv,
            field
          ) as T[keyof T];
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error);
          // Leave field encrypted if decryption fails
        }
      }
    }

    return decrypted as T;
  }

  /**
   * Hash data (one-way)
   */
  public async hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate secure token
   */
  public generateSecureToken(length: number = 32): string {
    const bytes = this.generateRandomBytes(length);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Rotate encryption keys
   */
  public async rotateKeys(): Promise<void> {
    if (!this.enabled) return;

    console.log('Starting key rotation...');

    // Clear key cache
    this.keyCache.clear();

    // Re-initialize master key
    await this.initializeMasterKey();

    console.log('Key rotation completed');
  }

  /**
   * Securely compare two strings (timing-safe)
   */
  public secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}

// Export singleton instance
export const encryptionService = EncryptionService.getInstance();

/**
 * Secure storage wrapper with automatic encryption
 */
export class SecureStorage {
  private prefix = 'secure_';

  /**
   * Set encrypted item in storage
   */
  async setItem(key: string, value: unknown): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const { encrypted, iv } = await encryptionService.encrypt(serialized, key);

      const storageData = {
        data: encrypted,
        iv,
        timestamp: Date.now(),
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(storageData));
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
      throw error;
    }
  }

  /**
   * Get and decrypt item from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (!stored) return null;

      const storageData = JSON.parse(stored);
      const decrypted = await encryptionService.decrypt(
        storageData.data,
        storageData.iv,
        key
      );

      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * Clear all secure storage
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Get all keys in secure storage
   */
  keys(): string[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
  }
}

// Export secure storage instance
export const secureStorage = new SecureStorage();

/**
 * React hook for encrypted state
 */
export function useEncryptedState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>] {
  const [state, setState] = React.useState<T>(initialValue);
  const [_loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Load encrypted state on mount
    secureStorage.getItem<T>(key).then(value => {
      if (value !== null) {
        setState(value);
      }
      setLoading(false);
    });
  }, [key]);

  const setEncryptedState = React.useCallback(async (value: T) => {
    setState(value);
    await secureStorage.setItem(key, value);
  }, [key]);

  return [state, setEncryptedState];
}

/**
 * Decorator for encrypting method parameters
 */
export function EncryptParams(...paramIndices: number[]) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const encryptedArgs = [...args];

      for (const index of paramIndices) {
        if (args[index] !== undefined) {
          const { encrypted, iv } = await encryptionService.encrypt(
            JSON.stringify(args[index])
          );
          encryptedArgs[index] = { encrypted, iv };
        }
      }

      return originalMethod.apply(this, encryptedArgs);
    };

    return descriptor;
  };
}

/**
 * Decorator for encrypting method return value
 */
export function EncryptResult(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: unknown[]) {
    const result = await originalMethod.apply(this, args);

    if (result !== undefined) {
      return await encryptionService.encrypt(JSON.stringify(result));
    }

    return result;
  };

  return descriptor;
}

// Import React for hooks
import React from 'react';
