import React, { type ReactNode, createContext, useContext } from 'react';
import { useEncryption } from '../useEncryption';

interface EncryptionContextValue {
  isInitialized: boolean;
  isLocked: boolean;
  hasKey: boolean;
  isUnlocked: boolean;
  isLoading: boolean;
  passwordPromptVisible: boolean;
  needsMigration: boolean;
  initializeEncryption: (password: string) => Promise<boolean>;
  initializeKeys: (password: string) => Promise<boolean>;
  lockEncryption: () => void;
  encryptData: (data: string | ArrayBuffer) => Promise<any>;
  decryptData: (encryptedData: string, iv: string, salt?: string) => Promise<ArrayBuffer | null>;
  encryptFile: (file: File) => Promise<any>;
  generateSecureToken: () => string;
  hashPassword: (password: string) => Promise<string>;
  checkEncryptionStatus: () => Promise<void>;
  showPasswordPrompt: () => Promise<boolean>;
  hidePasswordPrompt: () => void;
  unlockKeys: (password: string) => Promise<boolean>;
  migrateKeys: () => Promise<boolean>;
}

const EncryptionContext = createContext<EncryptionContextValue | undefined>(undefined);

export function EncryptionProvider({ children }: { children: ReactNode }) {
  const encryption = useEncryption();

  return (
    <EncryptionContext.Provider value={encryption}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryptionContext() {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryptionContext must be used within an EncryptionProvider');
  }
  return context;
}
