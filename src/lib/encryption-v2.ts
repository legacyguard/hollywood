import nacl from 'tweetnacl';
import { 
  decodeUTF8, 
  encodeUTF8, 
  encodeBase64, 
  decodeBase64 
} from 'tweetnacl-util';

interface EncryptionKeys {
  publicKey: string;
  secretKey: string;
}

interface EncryptedFileData {
  encryptedData: Uint8Array;
  nonce: Uint8Array;
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    encryptedAt: string;
    nonce: string;
    ephemeralPublicKey: string;
  };
}

class EncryptionService {
  private keyCache: Map<string, EncryptionKeys> = new Map();

  // Generate new encryption key pair
  generateEncryptionKeys(): EncryptionKeys {
    const keyPair = nacl.box.keyPair();
    return {
      publicKey: encodeBase64(keyPair.publicKey),
      secretKey: encodeBase64(keyPair.secretKey)
    };
  }

  // Get or create encryption keys for the current user
  getUserEncryptionKeys(userId: string): EncryptionKeys {
    // Check cache first
    if (this.keyCache.has(userId)) {
      return this.keyCache.get(userId)!;
    }

    const storageKey = `encryption_keys_${userId}`;
    
    // Check if keys exist in localStorage
    const storedKeys = localStorage.getItem(storageKey);
    
    if (storedKeys) {
      const keys = JSON.parse(storedKeys);
      this.keyCache.set(userId, keys);
      return keys;
    }
    
    // Generate new keys if they don't exist
    const newKeys = this.generateEncryptionKeys();
    localStorage.setItem(storageKey, JSON.stringify(newKeys));
    this.keyCache.set(userId, newKeys);
    
    return newKeys;
  }

  // Convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

  // Convert ArrayBuffer to base64
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return encodeBase64(bytes);
  }

  // Encrypt file content
  async encryptFile(
    file: File, 
    publicKey: string, 
    secretKey: string
  ): Promise<EncryptedFileData> {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    
    // Generate nonce
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    
    // Create ephemeral key pair for this encryption
    const ephemeralKeyPair = nacl.box.keyPair();
    
    // Encrypt the file data
    const encryptedData = nacl.box(
      fileData,
      nonce,
      decodeBase64(publicKey),
      decodeBase64(secretKey)
    );
    
    // Store metadata for decryption
    const metadata = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      encryptedAt: new Date().toISOString(),
      nonce: encodeBase64(nonce),
      ephemeralPublicKey: encodeBase64(ephemeralKeyPair.publicKey)
    };
    
    return {
      encryptedData,
      nonce,
      metadata
    };
  }

  // Decrypt file content
  decryptFile(
    encryptedData: Uint8Array,
    nonce: Uint8Array,
    publicKey: string,
    secretKey: string
  ): Uint8Array | null {
    try {
      const decrypted = nacl.box.open(
        encryptedData,
        nonce,
        decodeBase64(publicKey),
        decodeBase64(secretKey)
      );
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Create encrypted blob for upload
  createEncryptedBlob(
    encryptedData: Uint8Array,
    nonce: Uint8Array
  ): Blob {
    // Combine nonce and encrypted data
    const combined = new Uint8Array(nonce.length + encryptedData.length);
    combined.set(nonce);
    combined.set(encryptedData, nonce.length);
    
    return new Blob([combined], { type: 'application/octet-stream' });
  }

  // Clear cached keys for a user
  clearUserKeys(userId: string): void {
    this.keyCache.delete(userId);
    const storageKey = `encryption_keys_${userId}`;
    localStorage.removeItem(storageKey);
  }

  // Check if user has existing keys
  hasUserKeys(userId: string): boolean {
    const storageKey = `encryption_keys_${userId}`;
    return localStorage.getItem(storageKey) !== null;
  }
}

// Export singleton instance
export const encryptionService = new EncryptionService();

// Also export the class for testing purposes
export { EncryptionService };
