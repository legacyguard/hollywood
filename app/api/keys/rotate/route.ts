import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getKeyManagementService } from '@/lib/services/key-management.service';
import { withRateLimit, rateLimitPresets } from '@/lib/rate-limiter';
import { auditLogger, AuditEventType, AuditSeverity } from '@/lib/security/audit-logger';

export async function POST(req: NextRequest) {
  return withRateLimit(req, async (req) => {
    try {
      // Authenticate user
      const { userId } = getAuth(req);

      if (!userId) {
        await auditLogger.logSecurity(
          AuditEventType.INVALID_ACCESS_ATTEMPT,
          null,
          'Unauthorized key rotation attempt',
          { endpoint: '/api/keys/rotate' }
        );

        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Parse request body
      const body = await req.json();
      const { currentPassword, newPassword } = body;

      if (!currentPassword || typeof currentPassword !== 'string') {
        return NextResponse.json(
          { error: 'Current password is required' },
          { status: 400 }
        );
      }

      // Validate new password if provided
      const keyService = getKeyManagementService();

      if (newPassword) {
        const passwordValidation = keyService.validatePasswordStrength(newPassword);

        if (!passwordValidation.isValid) {
          return NextResponse.json(
            {
              error: 'New password does not meet security requirements',
              details: passwordValidation.errors
            },
            { status: 400 }
          );
        }
      }

      // Rotate keys
      const result = await keyService.rotateUserKeys(
        userId,
        currentPassword,
        newPassword
      );

      if (!result.success) {
        await auditLogger.logFailure(
          AuditEventType.ENCRYPTION_KEY_ROTATED,
          userId,
          'Failed to rotate encryption keys',
          result.error || 'Unknown error'
        );

        return NextResponse.json(
          { error: result.error || 'Failed to rotate keys' },
          { status: 400 }
        );
      }

      // Log successful rotation
      await auditLogger.logSuccess(
        AuditEventType.ENCRYPTION_KEY_ROTATED,
        userId,
        'Encryption keys rotated successfully',
        {
          newPublicKey: result.newPublicKey,
          passwordChanged: !!newPassword
        }
      );

      return NextResponse.json(
        {
          success: true,
          newPublicKey: result.newPublicKey,
          message: 'Keys rotated successfully'
        },
        { status: 200 }
      );

    } catch (error) {
      console.error('Key rotation error:', error);

      await auditLogger.log({
        userId: null,
        eventType: AuditEventType.SYSTEM_ERROR,
        severity: AuditSeverity.ERROR,
        description: 'Key rotation API error',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }, rateLimitPresets.auth);
}

// GET endpoint to check if rotation is needed
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

      // Check if rotation is needed
      const keyService = getKeyManagementService();
      const rotationNeeded = await keyService.checkRotationNeeded(userId);

      return NextResponse.json(
        {
          success: true,
          rotationNeeded,
          message: rotationNeeded
            ? 'Key rotation is recommended'
            : 'Keys are up to date'
        },
        { status: 200 }
      );

    } catch (error) {
      console.error('Rotation check error:', error);

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }, rateLimitPresets.api);
}
