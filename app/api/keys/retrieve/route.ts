import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getKeyManagementService } from '@/lib/services/key-management.service';
import { withRateLimit, rateLimitPresets } from '@/lib/rate-limiter';
import { auditLogger, AuditEventType } from '@/lib/security/audit-logger';

export async function POST(req: NextRequest) {
  return withRateLimit(req, async (req) => {
    try {
      // Authenticate user
      const { userId } = getAuth(req);
      
      if (!userId) {
        await auditLogger.logSecurity(
          AuditEventType.INVALID_ACCESS_ATTEMPT,
          null,
          'Unauthorized key retrieval attempt',
          { endpoint: '/api/keys/retrieve' }
        );
        
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Parse request body
      const body = await req.json();
      const { password } = body;

      if (!password || typeof password !== 'string') {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        );
      }

      // Retrieve keys
      const keyService = getKeyManagementService();
      const result = await keyService.getUserPrivateKey(userId, password);
      
      if (!result.success) {
        // Don't reveal if it's a wrong password or keys don't exist
        return NextResponse.json(
          { error: 'Failed to retrieve keys. Please check your password.' },
          { status: 401 }
        );
      }

      // Never log private keys!
      await auditLogger.logSuccess(
        AuditEventType.DOCUMENT_ACCESS_DENIED,
        userId,
        'Encryption keys retrieved successfully'
      );

      return NextResponse.json(
        { 
          success: true,
          privateKey: result.privateKey,
          publicKey: result.publicKey,
          message: 'Keys retrieved successfully'
        },
        { status: 200 }
      );

    } catch (error) {
      console.error('Key retrieval error:', error);
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }, rateLimitPresets.auth);
}

// GET endpoint for retrieving public key only (no password required)
export async function GET(req: NextRequest) {
  return withRateLimit(req, async (req) => {
    try {
      // Authenticate user
      const { userId } = getAuth(req);
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Get public key
      const keyService = getKeyManagementService();
      const result = await keyService.getUserPublicKey(userId);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Public key not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: true,
          publicKey: result.publicKey,
          metadata: result.metadata
        },
        { status: 200 }
      );

    } catch (error) {
      console.error('Public key retrieval error:', error);
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }, rateLimitPresets.api);
}
