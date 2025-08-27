import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

// Initialize Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Derive key from password
async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  // Use PBKDF2 with sufficient iterations
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000, // Minimum recommended
      hash: 'SHA-256'
    },
    keyMaterial,
    nacl.secretbox.keyLength * 8
  );

  return new Uint8Array(derivedBits);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Handle GET for public key retrieval
    if (req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.slice(7);
      let userId: string | undefined;
      
      try {
        // Dynamically import Clerk server SDK to avoid exposing secrets and for type safety
        const { verifyToken } = await import('@clerk/backend');
        const audience = process.env.CLERK_JWT_AUDIENCE;
        const authorizedParty = process.env.CLERK_FRONTEND_API;

        if (!audience || !authorizedParty) {
          throw new Error('Missing Clerk JWT audience or frontend API environment variables');
        }

        const verificationResult = await verifyToken(token, {
          audience,
          authorizedParties: [authorizedParty]
        });
        userId = verificationResult.sub;
      } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid token' });
      }

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
    }

    // Handle POST for private key retrieval with password
    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.slice(7);
      let userId: string | undefined;

      try {
        // Import verifyToken dynamically to ensure it is available
        const { verifyToken } = await import('@clerk/backend');

        const audience = process.env.CLERK_JWT_AUDIENCE;
        const authorizedParty = process.env.CLERK_FRONTEND_API;

        if (!audience || !authorizedParty) {
          throw new Error('Missing Clerk JWT audience or frontend API environment variables');
        }

        const verificationResult = await verifyToken(token, {
          audience,
          authorizedParties: [authorizedParty]
        });
        userId = verificationResult.sub;
      } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid token' });
      }

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
        const derivedKey = await deriveKeyFromPassword(password, salt);

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

      } catch (_decryptError) {
        // Decryption failed - likely wrong password
        return res.status(401).json({
          error: 'Failed to retrieve keys. Please check your password.'
        });
      }
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Key retrieval error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
