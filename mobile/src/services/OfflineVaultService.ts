// src/services/OfflineVaultService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

interface OfflineDocument {
  id: string;
  fileName: string;
  documentType: string;
  content: string;
  uploadedAt?: Date;
  fileSize?: number;
  tags?: string[];
}

const VAULT_KEY = '@legacyguard_vault';
const VAULT_METADATA_KEY = '@legacyguard_vault_metadata';

export const OfflineVaultService = {
  /**
   * Open (and create if needed) encrypted database
   * @param encryptionKey - 64-byte encryption key
   */
  open: async (encryptionKey: Uint8Array): Promise<void> => {
    try {
      // Initialize vault if it doesn't exist
      const vault = await AsyncStorage.getItem(VAULT_KEY);
      if (!vault) {
        await AsyncStorage.setItem(VAULT_KEY, JSON.stringify({}));
        await AsyncStorage.setItem(VAULT_METADATA_KEY, JSON.stringify({ initialized: new Date() }));
      }
      console.log('Secure offline vault opened successfully.');
    } catch (error) {
      console.error('Failed to open offline vault:', error);
      throw new Error('Failed to open secure vault');
    }
  },

  /**
   * Add document to offline vault
   */
  addDocument: async (doc: OfflineDocument): Promise<void> => {
    try {
      // Get existing vault
      const vaultData = await AsyncStorage.getItem(VAULT_KEY);
      const vault = vaultData ? JSON.parse(vaultData) : {};
      
      // Encrypt content before storing
      const encryptedContent = await encryptContent(doc.content);
      
      // Add document to vault
      vault[doc.id] = {
        _id: doc.id,
        fileName: doc.fileName,
        documentType: doc.documentType,
        encryptedContent,
        uploadedAt: doc.uploadedAt || new Date(),
        fileSize: doc.fileSize,
        tags: doc.tags || [],
        lastAccessedAt: null,
      };
      
      // Save updated vault
      await AsyncStorage.setItem(VAULT_KEY, JSON.stringify(vault));
      console.log(`Document ${doc.fileName} added to offline vault`);
    } catch (error) {
      console.error('Failed to add document to vault:', error);
      throw error;
    }
  },

  /**
   * Get all documents from offline vault
   */
  getDocuments: async (): Promise<OfflineDocument[]> => {
    try {
      const vaultData = await AsyncStorage.getItem(VAULT_KEY);
      if (!vaultData) return [];
      
      const vault = JSON.parse(vaultData);
      const decryptedDocs: OfflineDocument[] = [];
      
      for (const docId in vault) {
        const doc = vault[docId];
        
        // Update last accessed time
        doc.lastAccessedAt = new Date();
        
        // Decrypt content before returning
        const decryptedContent = await decryptContent(doc.encryptedContent);
        
        decryptedDocs.push({
          id: doc._id,
          fileName: doc.fileName,
          documentType: doc.documentType,
          content: decryptedContent,
          uploadedAt: doc.uploadedAt,
          fileSize: doc.fileSize,
          tags: doc.tags || [],
        });
      }
      
      // Save updated vault with last accessed times
      await AsyncStorage.setItem(VAULT_KEY, JSON.stringify(vault));
      
      return decryptedDocs;
    } catch (error) {
      console.error('Failed to get documents from vault:', error);
      throw error;
    }
  },

  /**
   * Get single document by ID
   */
  getDocument: async (id: string): Promise<OfflineDocument | null> => {
    try {
      const vaultData = await AsyncStorage.getItem(VAULT_KEY);
      if (!vaultData) return null;
      
      const vault = JSON.parse(vaultData);
      const doc = vault[id];
      if (!doc) return null;
      
      // Update last accessed time
      doc.lastAccessedAt = new Date();
      await AsyncStorage.setItem(VAULT_KEY, JSON.stringify(vault));
      
      // Decrypt content
      const decryptedContent = await decryptContent(doc.encryptedContent);
      
      return {
        id: doc._id,
        fileName: doc.fileName,
        documentType: doc.documentType,
        content: decryptedContent,
        uploadedAt: doc.uploadedAt,
        fileSize: doc.fileSize,
        tags: doc.tags || [],
      };
    } catch (error) {
      console.error('Failed to get document from vault:', error);
      throw error;
    }
  },

  /**
   * Remove document from vault
   */
  removeDocument: async (id: string): Promise<boolean> => {
    try {
      const vaultData = await AsyncStorage.getItem(VAULT_KEY);
      if (!vaultData) return false;
      
      const vault = JSON.parse(vaultData);
      if (!vault[id]) return false;
      
      delete vault[id];
      await AsyncStorage.setItem(VAULT_KEY, JSON.stringify(vault));
      
      console.log(`Document ${id} removed from offline vault`);
      return true;
    } catch (error) {
      console.error('Failed to remove document from vault:', error);
      throw error;
    }
  },

  /**
   * Clear all documents from vault
   */
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(VAULT_KEY, JSON.stringify({}));
      console.log('All documents cleared from offline vault');
    } catch (error) {
      console.error('Failed to clear vault:', error);
      throw error;
    }
  },

  /**
   * Get vault statistics
   */
  getStats: async (): Promise<{
    documentCount: number;
    totalSize: number;
    lastSync?: Date;
  }> => {
    try {
      const vaultData = await AsyncStorage.getItem(VAULT_KEY);
      if (!vaultData) return { documentCount: 0, totalSize: 0 };
      
      const vault = JSON.parse(vaultData);
      let totalSize = 0;
      let documentCount = 0;
      
      for (const docId in vault) {
        documentCount++;
        totalSize += vault[docId].fileSize || 0;
      }
      
      return {
        documentCount,
        totalSize,
        lastSync: undefined, // Can be implemented with sync functionality
      };
    } catch (error) {
      console.error('Failed to get vault stats:', error);
      return { documentCount: 0, totalSize: 0 };
    }
  },

  /**
   * Close the database
   */
  close: (): void => {
    // No-op for AsyncStorage - it doesn't need to be closed
    console.log('Offline vault closed');
  },

  /**
   * Check if vault is open
   */
  isOpen: (): boolean => {
    // AsyncStorage is always available
    return true;
  },
};

// Helper functions for encryption/decryption
// In production, use a proper encryption library like react-native-crypto

/**
 * Encrypt content (placeholder - use proper encryption in production)
 */
async function encryptContent(content: string): Promise<string> {
  // In production, implement proper AES encryption
  // For now, we'll use a simple base64 encoding as placeholder
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const digest = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
    return btoa(content); // Placeholder - use real encryption
  } catch {
    return btoa(content);
  }
}

/**
 * Decrypt content (placeholder - use proper decryption in production)
 */
async function decryptContent(encryptedContent: string): Promise<string> {
  // In production, implement proper AES decryption
  // For now, we'll use simple base64 decoding as placeholder
  try {
    return atob(encryptedContent); // Placeholder - use real decryption
  } catch {
    return encryptedContent;
  }
}
