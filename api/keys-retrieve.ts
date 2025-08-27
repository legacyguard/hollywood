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

// Derive key from password
function deriveKeyFromPassword(password: string, salt: Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const combined = new Uint8Array(passwordBytes.length + salt.length);
  combined.set(passwordBytes);
  combined.set(salt, passwordBytes.length);

  return nacl.hash(combined).slice(0, nacl.secretbox.keyLength);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle GET for public key retrieval
  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.slice(7);
      const { userId } = await auth().verifyToken(token);

      if (!userId) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Get public key
      const { data, error } = await supabase
        .from('user_encryption_keys')
        .select('public_key, created_at, updated_at')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          error: 'Public key not found'
        });
      }

      return res.status(200).json({
        success: true,
        publicKey: data.public_key,
        metadata: {
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      });
    } catch (error) {
      console.error('Public key retrieval error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle POST for private key retrieval with password
  if (req.method === 'POST') {
    try {
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

      // Get encrypted keys from database
      const { data, error } = await supabase
        .from('user_encryption_keys')
        .select('public_key, encrypted_private_key, salt, nonce')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return res.status(401).json({
          error: 'Failed to retrieve keys. Please check your password.'
        });
      }

      try {
        // Decrypt private key
        const salt = decodeBase64(data.salt);
        const nonce = decodeBase64(data.nonce);
        const encryptedPrivateKey = decodeBase64(data.encrypted_private_key);
        const derivedKey = deriveKeyFromPassword(password, salt);

        const privateKey = nacl.secretbox.open(encryptedPrivateKey, nonce, derivedKey);

        if (!privateKey) {
          // Wrong password
          return res.status(401).json({
            error: 'Failed to retrieve keys. Please check your password.'
          });
        }

        // Log audit event
        await supabase
          .from('audit_logs')
          .insert({
            user_id: userId,
            event_type: 'KEYS_RETRIEVED',
            description: 'User retrieved encryption keys',
            severity: 'INFO',
            success: true,
            created_at: new Date().toISOString()
          });

        return res.status(200).json({
          success: true,
          privateKey: encodeBase64(privateKey),
          publicKey: data.public_key,
          message: 'Keys retrieved successfully'
        });

      } catch (decryptError) {
        // Decryption failed - likely wrong password
        return res.status(401).json({
          error: 'Failed to retrieve keys. Please check your password.'
        });
      }

    } catch (error) {
      console.error('Key retrieval error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
