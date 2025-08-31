// src/services/OfflineVaultService.ts
import Realm from 'realm';
import * as Crypto from 'expo-crypto';

// Define schema for document in local database
const DocumentSchema: Realm.ObjectSchema = {
  name: 'OfflineDocument',
  properties: {
    _id: 'string', // Supabase ID
    fileName: 'string',
    documentType: 'string',
    // Important: We store encrypted content or path to encrypted file
    encryptedContent: 'string',
    uploadedAt: 'date',
    lastAccessedAt: 'date?',
    fileSize: 'int?',
    tags: 'string[]',
  },
  primaryKey: '_id',
};

interface OfflineDocument {
  id: string;
  fileName: string;
  documentType: string;
  content: string;
  uploadedAt?: Date;
  fileSize?: number;
  tags?: string[];
}

let realm: Realm | null = null;

export const OfflineVaultService = {
  /**
   * Open (and create if needed) encrypted database
   * @param encryptionKey - 64-byte encryption key
   */
  open: async (encryptionKey: Uint8Array): Promise<void> => {
    if (realm && !realm.isClosed) return; // Already open
    
    try {
      realm = await Realm.open({
        path: 'legacyguard.realm',
        schema: [DocumentSchema],
        schemaVersion: 1,
        encryptionKey, // 64-byte key for encryption
      });
      console.log('Secure offline vault opened successfully.');
    } catch (error) {
      console.error('Failed to open offline vault:', error);
      realm = null;
      throw new Error('Failed to open secure vault');
    }
  },

  /**
   * Add document to offline vault
   */
  addDocument: async (doc: OfflineDocument): Promise<void> => {
    if (!realm) throw new Error('Vault is not open.');
    
    try {
      // Encrypt content before storing
      // In production, use a proper encryption library
      const encryptedContent = await encryptContent(doc.content);
      
      realm.write(() => {
        realm!.create('OfflineDocument', {
          _id: doc.id,
          fileName: doc.fileName,
          documentType: doc.documentType,
          encryptedContent,
          uploadedAt: doc.uploadedAt || new Date(),
          fileSize: doc.fileSize,
          tags: doc.tags || [],
          lastAccessedAt: null,
        }, Realm.UpdateMode.Modified);
      });
      
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
    if (!realm) throw new Error('Vault is not open.');
    
    try {
      const documents = realm.objects('OfflineDocument');
      const decryptedDocs: OfflineDocument[] = [];
      
      for (const doc of documents) {
        // Update last accessed time
        realm.write(() => {
          (doc as any).lastAccessedAt = new Date();
        });
        
        // Decrypt content before returning
        const decryptedContent = await decryptContent((doc as any).encryptedContent);
        
        decryptedDocs.push({
          id: (doc as any)._id,
          fileName: (doc as any).fileName,
          documentType: (doc as any).documentType,
          content: decryptedContent,
          uploadedAt: (doc as any).uploadedAt,
          fileSize: (doc as any).fileSize,
          tags: Array.from((doc as any).tags || []),
        });
      }
      
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
    if (!realm) throw new Error('Vault is not open.');
    
    try {
      const doc = realm.objectForPrimaryKey('OfflineDocument', id);
      if (!doc) return null;
      
      // Update last accessed time
      realm.write(() => {
        (doc as any).lastAccessedAt = new Date();
      });
      
      // Decrypt content
      const decryptedContent = await decryptContent((doc as any).encryptedContent);
      
      return {
        id: (doc as any)._id,
        fileName: (doc as any).fileName,
        documentType: (doc as any).documentType,
        content: decryptedContent,
        uploadedAt: (doc as any).uploadedAt,
        fileSize: (doc as any).fileSize,
        tags: Array.from((doc as any).tags || []),
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
    if (!realm) throw new Error('Vault is not open.');
    
    try {
      const doc = realm.objectForPrimaryKey('OfflineDocument', id);
      if (!doc) return false;
      
      realm.write(() => {
        realm!.delete(doc);
      });
      
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
    if (!realm) throw new Error('Vault is not open.');
    
    try {
      realm.write(() => {
        realm!.deleteAll();
      });
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
    if (!realm) throw new Error('Vault is not open.');
    
    const documents = realm.objects('OfflineDocument');
    let totalSize = 0;
    
    for (const doc of documents) {
      totalSize += (doc as any).fileSize || 0;
    }
    
    return {
      documentCount: documents.length,
      totalSize,
      lastSync: undefined, // Can be implemented with sync functionality
    };
  },

  /**
   * Close the database
   */
  close: (): void => {
    if (realm && !realm.isClosed) {
      realm.close();
      console.log('Offline vault closed');
    }
    realm = null;
  },

  /**
   * Check if vault is open
   */
  isOpen: (): boolean => {
    return realm !== null && !realm.isClosed;
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
