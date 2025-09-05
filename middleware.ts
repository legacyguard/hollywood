// @ts-nocheck
/**
 * Security Middleware for API Protection
 * Comprehensive security layer for all API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/security/rate-limiter';
import { threatDetection } from '@/lib/security/threat-detection';
import { sessionSecurity } from '@/lib/security/session-security';
import { sanitizeObject } from '@/lib/security/sanitization';
import { securityHeaders } from '@/lib/security/csp-config';

interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent: string;
  origin: string;
  referer: string;
}

export class SecurityMiddleware {
  /**
   * Apply all security checks
   */
  public static async applySecurityChecks(
    request: NextRequest
  ): Promise<NextResponse | null> {
    try {
      const context = this.extractSecurityContext(request);

      // 1. Apply security headers
      const response = this.createSecureResponse();

      // 2. Check rate limiting
      const rateLimitResult = await this.checkRateLimit(request, context);
      if (!rateLimitResult.allowed) {
        return this.createRateLimitResponse(rateLimitResult);
      }

      // 3. Validate session
      if (context.sessionId) {
        const sessionResult = await this.validateSession(context);
        if (!sessionResult.valid) {
          return this.createUnauthorizedResponse('Invalid session');
        }
      }

      // 4. Detect threats
      const threats = await this.detectThreats(request, context);
      if (threats.length > 0) {
        const criticalThreats = threats.filter(t => t.severity === 'critical');
        if (criticalThreats.length > 0) {
          return this.createSecurityBlockResponse(criticalThreats);
        }
      }

      // 5. Sanitize input
      await this.sanitizeRequest(request);

      // 6. Log security events
      await this.logSecurityEvent(request, context, threats);

      return null; // Continue to next middleware
    } catch (error) {
      console.error('Security middleware error:', error);
      return this.createErrorResponse();
    }
  }

  /**
   * Extract security context from request
   */
  private static extractSecurityContext(request: NextRequest): SecurityContext {
    const headers = request.headers;

    return {
      userId: headers.get('x-user-id') || undefined,
      sessionId: request.cookies.get('session')?.value,
      ipAddress: this.getClientIp(request),
      userAgent: headers.get('user-agent') || 'unknown',
      origin: headers.get('origin') || '',
      referer: headers.get('referer') || '',
    };
  }

  /**
   * Get client IP address
   */
  private static getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      return realIp;
    }

    return request.ip || '0.0.0.0';
  }

  /**
   * Check rate limiting
   */
  private static async checkRateLimit(
    request: NextRequest,
    context: SecurityContext
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const endpoint = new URL(request.url).pathname;
    const identifier = context.userId || context.ipAddress;

    // Determine rate limit preset based on endpoint
    let preset = 'api';
    if (endpoint.includes('/auth')) preset = 'auth';
    if (endpoint.includes('/upload')) preset = 'upload';
    if (endpoint.includes('/ai') || endpoint.includes('/sofia')) preset = 'ai';
    if (endpoint.includes('/generate-will')) preset = 'critical';

    const config =
      rateLimiter.RATE_LIMIT_PRESETS[
        preset as keyof typeof rateLimiter.RATE_LIMIT_PRESETS
      ];

    return await rateLimiter.checkLimit(identifier, endpoint, config);
  }

  /**
   * Validate session
   */
  private static async validateSession(
    context: SecurityContext
  ): Promise<{ valid: boolean; anomalies?: any[] }> {
    if (!context.sessionId) {
      return { valid: false };
    }

    return await sessionSecurity.validateSession(
      context.sessionId,
      context.ipAddress
    );
  }

  /**
   * Detect threats
   */
  private static async detectThreats(
    request: NextRequest,
    context: SecurityContext
  ): Promise<any[]> {
    const url = new URL(request.url);
    const body = await this.getRequestBody(request);

    return await threatDetection.analyzeRequest({
      userId: context.userId,
      ip: context.ipAddress,
      endpoint: url.pathname,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body,
      query: Object.fromEntries(url.searchParams.entries()),
    });
  }

  /**
   * Get request body safely
   */
  private static async getRequestBody(request: NextRequest): Promise<any> {
    try {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const text = await request.text();
        return JSON.parse(text);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Sanitize request data
   */
  private static async sanitizeRequest(request: NextRequest): Promise<void> {
    const url = new URL(request.url);

    // Sanitize query parameters
    for (const [key, value] of url.searchParams.entries()) {
      const sanitized = sanitizeObject({ [key]: value });
      if (sanitized && sanitized[key] !== value) {
        url.searchParams.set(key, sanitized[key] as string);
      }
    }

    // Note: Body sanitization happens in API handlers
  }

  /**
   * Log security events
   */
  private static async logSecurityEvent(
    request: NextRequest,
    context: SecurityContext,
    threats: any[]
  ): Promise<void> {
    const event = {
      timestamp: new Date().toISOString(),
      userId: context.userId,
      sessionId: context.sessionId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      threats: threats.length,
      threatTypes: threats.map(t => t.type),
    };

    // In production, send to logging service
    if (threats.length > 0) {
      console.warn('Security event:', event);
    }
  }

  /**
   * Create secure response with headers
   */
  private static createSecureResponse(): NextResponse {
    const response = NextResponse.next();

    // Apply security headers
    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value);
    }

    return response;
  }

  /**
   * Create rate limit response
   */
  private static createRateLimitResponse(rateLimitResult: {
    remaining: number;
    resetTime: number;
  }): NextResponse {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Please slow down and try again later',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      { status: 429 }
    );

    response.headers.set(
      'X-RateLimit-Remaining',
      rateLimitResult.remaining.toString()
    );
    response.headers.set(
      'X-RateLimit-Reset',
      new Date(rateLimitResult.resetTime).toISOString()
    );
    response.headers.set(
      'Retry-After',
      Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
    );

    return response;
  }

  /**
   * Create unauthorized response
   */
  private static createUnauthorizedResponse(message: string): NextResponse {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message,
      },
      { status: 401 }
    );
  }

  /**
   * Create security block response
   */
  private static createSecurityBlockResponse(threats: any[]): NextResponse {
    return NextResponse.json(
      {
        error: 'Security violation',
        message: 'Your request has been blocked for security reasons',
        code: 'SECURITY_BLOCK',
      },
      { status: 403 }
    );
  }

  /**
   * Create error response
   */
  private static createErrorResponse(): NextResponse {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An error occurred processing your request',
      },
      { status: 500 }
    );
  }
}

/**
 * Middleware function for Next.js
 */
export async function middleware(request: NextRequest) {
  // Skip security for static assets
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // File extensions
  ) {
    return NextResponse.next();
  }

  // Apply security checks
  const securityResponse =
    await SecurityMiddleware.applySecurityChecks(request);
  if (securityResponse) {
    return securityResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/auth/:path*',
    '/dashboard/:path*',
    '/vault/:path*',
    '/will-generator/:path*',
  ],
};
