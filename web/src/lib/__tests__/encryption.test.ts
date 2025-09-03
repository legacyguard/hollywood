import { describe, it, expect, beforeEach, vi } from 'vitest';
import { encryptionService } from '../encryption-v2';

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;
  const testMasterKey = 'test-master-key-12345678901234567890123456789012';
  const testData = 'This is sensitive data';

  beforeEach(() => {
    // Clear localStorage before each test
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };

    encryptionService = new EncryptionService();
  });

  describe('Master Key Management', () => {
    it('should initialize master key', async () => {
      const result = await encryptionService.initializeMasterKey(testMasterKey);
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should validate master key format', async () => {
      const shortKey = 'short';
      const result = await encryptionService.initializeMasterKey(shortKey);
      expect(result).toBe(false);
    });

    it('should check if master key exists', () => {
      (localStorage.getItem as any).mockReturnValue('encrypted-key');
      const exists = encryptionService.hasMasterKey();
      expect(exists).toBe(true);
    });

    it('should derive key from master key', async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
      const derivedKey = await encryptionService['deriveKey'](testMasterKey, 'salt123');
      expect(derivedKey).toBeDefined();
      expect(typeof derivedKey).toBe('string');
    });

    it('should handle master key rotation', async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
      const newKey = 'new-master-key-12345678901234567890123456789012';
      const result = await encryptionService.rotateMasterKey(testMasterKey, newKey);
      expect(result).toBe(true);
    });
  });

  describe('Encryption Operations', () => {
    beforeEach(async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
    });

    it('should encrypt data successfully', async () => {
      const encrypted = await encryptionService.encrypt(testData);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testData);
      expect(encrypted.includes(':')).toBe(true); // Should contain IV separator
    });

    it('should decrypt data successfully', async () => {
      const encrypted = await encryptionService.encrypt(testData);
      const decrypted = await encryptionService.decrypt(encrypted);
      expect(decrypted).toBe(testData);
    });

    it('should handle empty data encryption', async () => {
      const encrypted = await encryptionService.encrypt('');
      expect(encrypted).toBeDefined();
      const decrypted = await encryptionService.decrypt(encrypted);
      expect(decrypted).toBe('');
    });

    it('should handle special characters', async () => {
      const specialData = '!@#$%^&*()_+{}[]|\\:";\'<>?,./~`';
      const encrypted = await encryptionService.encrypt(specialData);
      const decrypted = await encryptionService.decrypt(encrypted);
      expect(decrypted).toBe(specialData);
    });

    it('should handle unicode characters', async () => {
      const unicodeData = '🔒 Encrypted 中文 العربية हिन्दी';
      const encrypted = await encryptionService.encrypt(unicodeData);
      const decrypted = await encryptionService.decrypt(encrypted);
      expect(decrypted).toBe(unicodeData);
    });

    it('should generate different ciphertext for same plaintext', async () => {
      const encrypted1 = await encryptionService.encrypt(testData);
      const encrypted2 = await encryptionService.encrypt(testData);
      expect(encrypted1).not.toBe(encrypted2); // Different IVs
    });

    it('should fail decryption with wrong key', async () => {
      const encrypted = await encryptionService.encrypt(testData);

      // Reinitialize with different key
      const wrongKey = 'wrong-master-key-12345678901234567890123456789012';
      encryptionService = new EncryptionService();
      await encryptionService.initializeMasterKey(wrongKey);

      await expect(encryptionService.decrypt(encrypted)).rejects.toThrow();
    });
  });

  describe('Field-Level Encryption', () => {
    beforeEach(async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
    });

    it('should encrypt object fields', async () => {
      const data = {
        name: 'John Doe',
        ssn: '123-45-6789',
        email: 'john@example.com'
      };

      const fieldsToEncrypt = ['ssn', 'email'];
      const encrypted = await encryptionService.encryptFields(data, fieldsToEncrypt);

      expect(encrypted.name).toBe('John Doe');
      expect(encrypted.ssn).not.toBe('123-45-6789');
      expect(encrypted.email).not.toBe('john@example.com');
    });

    it('should decrypt object fields', async () => {
      const data = {
        name: 'John Doe',
        ssn: '123-45-6789',
        email: 'john@example.com'
      };

      const fieldsToEncrypt = ['ssn', 'email'];
      const encrypted = await encryptionService.encryptFields(data, fieldsToEncrypt);
      const decrypted = await encryptionService.decryptFields(encrypted, fieldsToEncrypt);

      expect(decrypted).toEqual(data);
    });

    it('should handle nested object encryption', async () => {
      const data = {
        user: {
          name: 'John',
          sensitive: {
            ssn: '123-45-6789',
            pin: '1234'
          }
        }
      };

      const encrypted = await encryptionService.encryptNestedField(data, 'user.sensitive.ssn');
      expect(encrypted.user.name).toBe('John');
      expect(encrypted.user.sensitive.ssn).not.toBe('123-45-6789');
      expect(encrypted.user.sensitive.pin).toBe('1234');
    });

    it('should handle missing fields gracefully', async () => {
      const data = { name: 'John' };
      const fieldsToEncrypt = ['ssn', 'email'];

      const encrypted = await encryptionService.encryptFields(data, fieldsToEncrypt);
      expect(encrypted.name).toBe('John');
      expect(encrypted.ssn).toBeUndefined();
    });
  });

  describe('Batch Operations', () => {
    beforeEach(async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
    });

    it('should encrypt batch of items', async () => {
      const items = [
        { id: 1, data: 'secret1' },
        { id: 2, data: 'secret2' },
        { id: 3, data: 'secret3' }
      ];

      const encrypted = await encryptionService.encryptBatch(items, 'data');

      encrypted.forEach((item, index) => {
        expect(item.id).toBe(items[index].id);
        expect(item.data).not.toBe(items[index].data);
      });
    });

    it('should decrypt batch of items', async () => {
      const items = [
        { id: 1, data: 'secret1' },
        { id: 2, data: 'secret2' },
        { id: 3, data: 'secret3' }
      ];

      const encrypted = await encryptionService.encryptBatch(items, 'data');
      const decrypted = await encryptionService.decryptBatch(encrypted, 'data');

      expect(decrypted).toEqual(items);
    });

    it('should handle large batch operations', async () => {
      const largeItems = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        data: `secret-${i}`
      }));

      const encrypted = await encryptionService.encryptBatch(largeItems, 'data');
      const decrypted = await encryptionService.decryptBatch(encrypted, 'data');

      expect(decrypted).toEqual(largeItems);
    });
  });

  describe('Security Features', () => {
    beforeEach(async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
    });

    it('should validate encryption integrity', async () => {
      const encrypted = await encryptionService.encrypt(testData);

      // Tamper with encrypted data
      const tampered = encrypted.substring(0, encrypted.length - 5) + 'XXXXX';

      await expect(encryptionService.decrypt(tampered)).rejects.toThrow();
    });

    it('should handle key stretching', async () => {
      const weakPassword = 'password123';
      const salt = 'random-salt';

      const key1 = await encryptionService['deriveKey'](weakPassword, salt);
      const key2 = await encryptionService['deriveKey'](weakPassword, salt);

      expect(key1).toBe(key2); // Same input produces same output
      expect(key1.length).toBeGreaterThan(weakPassword.length);
    });

    it('should generate secure random values', () => {
      const random1 = encryptionService['generateSecureRandom'](32);
      const random2 = encryptionService['generateSecureRandom'](32);

      expect(random1).not.toBe(random2);
      expect(random1.length).toBe(64); // Hex encoding doubles length
    });

    it('should clear sensitive data from memory', async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
      encryptionService.clearSensitiveData();

      expect(() => encryptionService.encrypt(testData)).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle encryption without master key', async () => {
      await expect(encryptionService.encrypt(testData)).rejects.toThrow();
    });

    it('should handle decryption without master key', async () => {
      await expect(encryptionService.decrypt('encrypted-data')).rejects.toThrow();
    });

    it('should handle invalid encrypted data format', async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
      await expect(encryptionService.decrypt('invalid-format')).rejects.toThrow();
    });

    it('should handle null and undefined inputs', async () => {
      await encryptionService.initializeMasterKey(testMasterKey);

      await expect(encryptionService.encrypt(null as any)).rejects.toThrow();
      await expect(encryptionService.encrypt(undefined as any)).rejects.toThrow();
    });

    it('should provide meaningful error messages', async () => {
      try {
        await encryptionService.encrypt(testData);
      } catch (error: any) {
        expect(error.message).toContain('master key');
      }
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await encryptionService.initializeMasterKey(testMasterKey);
    });

    it('should encrypt large data efficiently', async () => {
      const largeData = 'x'.repeat(1000000); // 1MB of data
      const startTime = Date.now();

      const encrypted = await encryptionService.encrypt(largeData);
      const encryptTime = Date.now() - startTime;

      expect(encryptTime).toBeLessThan(1000); // Should complete within 1 second
      expect(encrypted).toBeDefined();
    });

    it('should handle concurrent operations', async () => {
      const operations = Array.from({ length: 100 }, (_, i) =>
        encryptionService.encrypt(`data-${i}`)
      );

      const results = await Promise.all(operations);
      expect(results).toHaveLength(100);
      expect(new Set(results).size).toBe(100); // All unique
    });
  });
});
