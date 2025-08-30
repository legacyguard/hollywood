import { useContext, useEffect } from 'react';

interface EncryptionContextType {
  isUnlocked: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  needsMigration: boolean;
  initializeKeys: (password: string) => Promise<boolean>;
  unlockKeys: (password: string) => Promise<boolean>;
  lockKeys: () => Promise<void>;
  checkKeyStatus: () => Promise<void>;
  migrateKeys: (password: string) => Promise<boolean>;
  rotateKeys: (
    currentPassword: string,
    newPassword?: string
  ) => Promise<boolean>;
  encryptFile: (file: File) => Promise<{
    encryptedData: Uint8Array;
    nonce: Uint8Array;
    metadata: unknown;
  } | null>;
  decryptFile: (
    encryptedData: Uint8Array,
    nonce: Uint8Array
  ) => Promise<Uint8Array | null>;
  showPasswordPrompt: () => void;
  hidePasswordPrompt: () => void;
  passwordPromptVisible: boolean;
}

// This context is defined in useEncryption.tsx
declare const EncryptionContext: React.Context<EncryptionContextType | undefined>;

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
}

// Hook for automatic encryption unlock on certain pages
export function useAutoUnlock() {
  const { isUnlocked, unlockKeys } = useEncryption();

  useEffect(() => {
    // Auto-unlock logic can be implemented here
    // For now, just a placeholder
  }, [isUnlocked, unlockKeys]);

  return { isUnlocked, unlockKeys };
}

// Hook for checking if encryption is ready
export function useEncryptionReady() {
  const { isInitialized, isLoading } = useEncryption();
  return { 
    isReady: isInitialized && !isLoading, 
    needsSetup: !isInitialized && !isLoading,
    isLoading 
  };
}
