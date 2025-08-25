import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
        // No rows found
        return NextResponse.json(
          { hasKeys: false },
          { status: 200 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to check key status' },
        { status: 500 }
      );
    }

    // Check if keys are locked
    const isLocked = data.locked_until && new Date(data.locked_until) > new Date();

    return NextResponse.json({
      hasKeys: true,
      isCompromised: data.is_compromised,
      isLocked,
      lockedUntil: isLocked ? data.locked_until : null
    });

  } catch (error) {
    console.error('Error checking key status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
