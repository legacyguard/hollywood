import { useContext } from 'react';

interface EncryptionContextValue {
  isInitialized: boolean;
  isLocked: boolean;
  hasKey: boolean;
  initializeEncryption: (password: string) => Promise<boolean>;
  lockEncryption: () => void;
  encryptData: (data: string | ArrayBuffer) => Promise<unknown>;
  decryptData: (encryptedData: string, iv: string, salt?: string) => Promise<ArrayBuffer | null>;
  encryptFile: (file: File) => Promise<unknown>;
  generateSecureToken: () => string;
  hashPassword: (password: string) => Promise<string>;
  checkEncryptionStatus: () => Promise<void>;
}

// This context is defined in EncryptionProvider.tsx
declare const EncryptionContext: React.Context<EncryptionContextValue | undefined>;

export function useEncryptionContext() {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryptionContext must be used within an EncryptionProvider');
  }
  return context;
}
