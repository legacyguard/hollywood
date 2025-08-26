/**
 * Encryption Service V2 - LegacyGuard
 * Provides secure encryption/decryption functionality for the application
 */

import nacl from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util';

// Import from the actual encryption service
import {
  generateEncryptionKeys,
  getUserEncryptionKeys,
  encryptFile,
  decryptFile,
  createEncryptedBlob,
  fileToBase64,
  arrayBufferToBase64
} from './encryption';

// Create the encryption service v2 wrapper
export const encryptionServiceV2 = {
  // Key management
  generateKeys: generateEncryptionKeys,
  getUserKeys: getUserEncryptionKeys,

  // File operations
  encryptFile,
  decryptFile,
  createEncryptedBlob,
  fileToBase64,
  arrayBufferToBase64,

  // Storage operations
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const userId = 'current-user';
      const keys = getUserEncryptionKeys(userId);
      const message = decodeUTF8(value);
      const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
      const keyBytes = decodeBase64(keys.secretKey).slice(0, 32);
      const encrypted = nacl.secretbox(message, nonce, keyBytes);
      const combined = new Uint8Array(nonce.length + encrypted.length);
      combined.set(nonce);
      combined.set(encrypted, nonce.length);
      localStorage.setItem(key, encodeBase64(combined));
    } catch (error) {
      console.error('Error setting encrypted item:', error);
      throw error;
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      const userId = 'current-user';
      const keys = getUserEncryptionKeys(userId);
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      const combined = decodeBase64(stored);
      const nonce = combined.slice(0, nacl.secretbox.nonceLength);
      const encrypted = combined.slice(nacl.secretbox.nonceLength);
      const keyBytes = decodeBase64(keys.secretKey).slice(0, 32);
      const decrypted = nacl.secretbox.open(encrypted, nonce, keyBytes);
      if (!decrypted) return null;
      return encodeUTF8(decrypted);
    } catch (error) {
      console.error('Error getting encrypted item:', error);
      return null;
    }
  }
};

// Legacy compatibility exports
export const SecureEncryptionService = encryptionServiceV2;
export const SecureStorage = {
  getSecureLocal: encryptionServiceV2.getItem,
  setSecureLocal: encryptionServiceV2.setItem
};
