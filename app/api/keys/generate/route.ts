import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getKeyManagementService } from '@/lib/services/key-management.service';
import { withRateLimit, rateLimitPresets } from '@/lib/rate-limiter';
import { Security } from '@/lib/security/sanitization';
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
          'Unauthorized key generation attempt',
          { endpoint: '/api/keys/generate' }
        );
        
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Parse and validate request body
      const body = await req.json();
      const { password } = body;

      if (!password || typeof password !== 'string') {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        );
      }

      // Validate password strength
      const keyService = getKeyManagementService();
      const passwordValidation = keyService.validatePasswordStrength(password);
      
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { 
            error: 'Password does not meet security requirements',
            details: passwordValidation.errors
          },
          { status: 400 }
        );
      }

      // Generate and store keys
      const result = await keyService.createUserKeys(userId, password);
      
      if (!result.success) {
        await auditLogger.logFailure(
          AuditEventType.SYSTEM_ERROR,
          userId,
          'Failed to generate encryption keys',
          result.error || 'Unknown error'
        );
        
        return NextResponse.json(
          { error: result.error || 'Failed to generate keys' },
          { status: 500 }
        );
      }

      // Log successful key generation
      await auditLogger.logSuccess(
        AuditEventType.ENCRYPTION_KEY_ROTATED,
        userId,
        'Encryption keys generated successfully',
        { publicKey: result.publicKey }
      );

      return NextResponse.json(
        { 
          success: true,
          publicKey: result.publicKey,
          message: 'Encryption keys generated successfully'
        },
        { status: 200 }
      );

    } catch (error) {
      console.error('Key generation error:', error);
      
      await auditLogger.log({
        userId: null,
        eventType: AuditEventType.SYSTEM_ERROR,
        severity: AuditSeverity.ERROR,
        description: 'Key generation API error',
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
