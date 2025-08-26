import type { VercelRequest, VercelResponse } from '@vercel/node';
import { auth } from '@clerk/backend';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
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

    // Check if user has encryption keys
    const { data, error } = await supabase
      .from('user_encryption_keys')
      .select('id, is_active, is_compromised, locked_until')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - user has no keys
        return res.status(200).json({ 
          hasKeys: false 
        });
      }
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Failed to check key status' 
      });
    }

    // Check if keys are locked
    const isLocked = data.locked_until && new Date(data.locked_until) > new Date();

    return res.status(200).json({
      hasKeys: true,
      isCompromised: data.is_compromised || false,
      isLocked: isLocked || false,
      lockedUntil: isLocked ? data.locked_until : null
    });

  } catch (error) {
    console.error('Error checking key status:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
