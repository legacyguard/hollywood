// src/hooks/useOfflineVault.ts
import { useEffect, useState, useCallback } from 'react';
import { OfflineVaultService } from '@/services/OfflineVaultService';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const ENCRYPTION_KEY_NAME = 'offline_vault_key';

interface VaultDocument {
  id: string;
  fileName: string;
  documentType: string;
  content: string;
  uploadedAt?: Date;
  fileSize?: number;
  tags?: string[];
}

interface UseOfflineVaultReturn {
  isVaultOpen: boolean;
  isLoading: boolean;
  error: string | null;
  documents: VaultDocument[];
  documentCount: number;
  totalSize: number;
  loadDocuments: () => Promise<void>;
  addDocument: (doc: VaultDocument) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  getDocument: (id: string) => Promise<VaultDocument | null>;
  clearVault: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

export const useOfflineVault = (): UseOfflineVaultReturn => {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ documentCount: 0, totalSize: 0 });

  /**
   * Generate or retrieve encryption key
   */
  const getOrCreateEncryptionKey = useCallback(async (): Promise<Uint8Array> => {
    try {
      let keyHex = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);

      if (!keyHex) {
        // Generate a new 64-byte key
        const randomBytes = await Crypto.getRandomBytesAsync(64);
        keyHex = Array.from(randomBytes)
          .map((b: number) => b.toString(16).padStart(2, '0'))
          .join('');

        await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, keyHex);
        console.log('New encryption key generated and stored');
      }

      // Convert hex string to Uint8Array
      const keyBytes = new Uint8Array(64);
      for (let i = 0; i < 64; i++) {
        keyBytes[i] = parseInt(keyHex.substr(i * 2, 2), 16);
      }

      return keyBytes;
    } catch (error) {
      console.error('Failed to get/create encryption key:', error);
      throw new Error('Failed to initialize encryption');
    }
  }, []);

  /**
   * Initialize vault on hook mount
   */
  useEffect(() => {
    const initializeVault = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const encryptionKey = await getOrCreateEncryptionKey();
        await OfflineVaultService.open(encryptionKey);
        setIsVaultOpen(true);

        // Load initial documents
        await loadDocuments();
      } catch (error) {
        console.error('Failed to initialize vault:', error);
        setError(error instanceof Error ? error.message : 'Failed to open vault');
        setIsVaultOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeVault();

    // Cleanup on unmount
    return () => {
      OfflineVaultService.close();
    };
  }, []);

  /**
   * Load all documents from vault
   */
  const loadDocuments = useCallback(async () => {
    if (!isVaultOpen && !OfflineVaultService.isOpen()) {
      console.warn('Vault is not open');
      return;
    }

    try {
      const docs = await OfflineVaultService.getDocuments();
      setDocuments(docs);

      const vaultStats = await OfflineVaultService.getStats();
      setStats({
        documentCount: vaultStats.documentCount,
        totalSize: vaultStats.totalSize,
      });
    } catch (error) {
      console.error('Failed to load documents:', error);
      setError('Failed to load documents');
    }
  }, [isVaultOpen]);

  /**
   * Add document to vault
   */
  const addDocument = useCallback(async (doc: VaultDocument) => {
    if (!isVaultOpen) {
      throw new Error('Vault is not open');
    }

    try {
      await OfflineVaultService.addDocument(doc);
      await loadDocuments(); // Reload to update list
      console.log(`Document ${doc.fileName} added successfully`);
    } catch (error) {
      console.error('Failed to add document:', error);
      throw error;
    }
  }, [isVaultOpen, loadDocuments]);

  /**
   * Remove document from vault
   */
  const removeDocument = useCallback(async (id: string) => {
    if (!isVaultOpen) {
      throw new Error('Vault is not open');
    }

    try {
      const success = await OfflineVaultService.removeDocument(id);
      if (success) {
        await loadDocuments(); // Reload to update list
        console.log(`Document ${id} removed successfully`);
      }
    } catch (error) {
      console.error('Failed to remove document:', error);
      throw error;
    }
  }, [isVaultOpen, loadDocuments]);

  /**
   * Get single document by ID
   */
  const getDocument = useCallback(async (id: string): Promise<VaultDocument | null> => {
    if (!isVaultOpen) {
      throw new Error('Vault is not open');
    }

    try {
      return await OfflineVaultService.getDocument(id);
    } catch (error) {
      console.error('Failed to get document:', error);
      throw error;
    }
  }, [isVaultOpen]);

  /**
   * Clear all documents from vault
   */
  const clearVault = useCallback(async () => {
    if (!isVaultOpen) {
      throw new Error('Vault is not open');
    }

    try {
      await OfflineVaultService.clearAll();
      await loadDocuments(); // Reload to update list
      console.log('Vault cleared successfully');
    } catch (error) {
      console.error('Failed to clear vault:', error);
      throw error;
    }
  }, [isVaultOpen, loadDocuments]);

  /**
   * Sync documents with cloud (placeholder)
   */
  const syncWithCloud = useCallback(async () => {
    if (!isVaultOpen) {
      throw new Error('Vault is not open');
    }

    try {
      // TODO: Implement cloud sync
      // 1. Get list of documents from API
      // 2. Compare with local documents
      // 3. Download new/updated documents
      // 4. Upload local-only documents
      console.log('Cloud sync not yet implemented');
    } catch (error) {
      console.error('Failed to sync with cloud:', error);
      throw error;
    }
  }, [isVaultOpen]);

  return {
    isVaultOpen,
    isLoading,
    error,
    documents,
    documentCount: stats.documentCount,
    totalSize: stats.totalSize,
    loadDocuments,
    addDocument,
    removeDocument,
    getDocument,
    clearVault,
    syncWithCloud,
  };
};
