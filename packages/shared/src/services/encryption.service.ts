/**
 * Encryption Service
 * Handles data encryption and decryption
 */

export interface EncryptedData {
  data: string;
  iv: string;
  salt: string;
  algorithm: string;
}

export class EncryptionService {
  private static instance: EncryptionService;
  private key: CryptoKey | null = null;

  private constructor() {}

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async generateKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    this.key = key;
    return key;
  }

  async encrypt(data: string): Promise<EncryptedData> {
    if (!this.key) {
      throw new Error('Encryption key not initialized');
    }

    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      encoder.encode(data)
    );

    return {
      data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv)),
      salt: btoa(String.fromCharCode(...salt)),
      algorithm: 'AES-GCM'
    };
  }

  async decrypt(encryptedData: EncryptedData): Promise<string> {
    if (!this.key) {
      throw new Error('Encryption key not initialized');
    }

    const encryptedBuffer = Uint8Array.from(atob(encryptedData.data), c => c.charCodeAt(0));
    const ivBuffer = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBuffer },
      this.key,
      encryptedBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  isInitialized(): boolean {
    return !!this.key;
  }

  clearKey(): void {
    this.key = null;
  }
}

export const encryptionService = EncryptionService.getInstance();
