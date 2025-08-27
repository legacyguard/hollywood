import type { VercelRequest, VercelResponse } from '@vercel/node';
import { auth } from '@clerk/backend';
import { createClient } from '@supabase/supabase-js';
import * as nacl from 'tweetnacl';
import { encode as encodeBase64, decode as decodeBase64 } from 'tweetnacl-util';

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Password validation
function validatePasswordStrength(password: string): { isValid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (password.length < 12) errors.push('Password must be at least 12 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters');
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters');
  if (!/[0-9]/.test(password)) errors.push('Password must contain numbers');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must contain special characters');

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

// Derive key from password
function deriveKeyFromPassword(password: string, salt: Uint8Array): Uint8Array {
  // In production, use a proper KDF like scrypt or argon2
  // This is simplified for demonstration
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const combined = new Uint8Array(passwordBytes.length + salt.length);
  combined.set(passwordBytes);
  combined.set(salt, passwordBytes.length);

  return nacl.hash(combined).slice(0, nacl.secretbox.keyLength);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get auth token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.slice(7);
    const { userId } = await auth().verifyToken(token);

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Validate password strength
    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Password does not meet security requirements',
        details: validation.errors
      });
    }

    // Check if user already has keys
    const { data: existingKeys } = await supabase
      .from('user_encryption_keys')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (existingKeys) {
      return res.status(400).json({
        error: 'Keys already exist. Use key rotation endpoint to update.'
      });
    }

    // Generate new key pair
    const keyPair = nacl.box.keyPair();
    const salt = nacl.randomBytes(16);
    const derivedKey = deriveKeyFromPassword(password, salt);

    // Encrypt private key with derived key
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const encryptedPrivateKey = nacl.secretbox(keyPair.secretKey, nonce, derivedKey);

    // Store encrypted keys in database
    const { error: dbError } = await supabase
      .from('user_encryption_keys')
      .insert({
        user_id: userId,
        public_key: encodeBase64(keyPair.publicKey),
        encrypted_private_key: encodeBase64(encryptedPrivateKey),
        salt: encodeBase64(salt),
        nonce: encodeBase64(nonce),
        is_active: true,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to store keys' });
    }

    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        event_type: 'ENCRYPTION_KEY_GENERATED',
        description: 'User generated new encryption keys',
        severity: 'INFO',
        success: true,
        created_at: new Date().toISOString()
      });

    return res.status(200).json({
      success: true,
      publicKey: encodeBase64(keyPair.publicKey),
      message: 'Encryption keys generated successfully'
    });

  } catch (error) {
    console.error('Key generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
