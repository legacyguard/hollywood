/**
 * Health Check API Endpoint
 * Phase 5A: Production Operations & DevOps
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, HealthCheckResult>;
  uptime: number;
  version: string;
  timestamp: number;
  environment: string;
}

const startTime = Date.now();

/**
 * Health check API endpoint
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<SystemHealth | { error: string }>) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const checks: Record<string, HealthCheckResult> = {};

    // Database health check
    checks.database = await checkDatabase();

    // Environment variables check
    checks.environment = await checkEnvironment();

    // Server memory check
    checks.memory = await checkMemory();

    // External services check (if any)
    checks.external_services = await checkExternalServices();

    // Calculate overall health
    const overall = calculateOverallHealth(Object.values(checks));

    const systemHealth: SystemHealth = {
      overall,
      checks,
      uptime: Date.now() - startTime,
      version: process.env.npm_package_version || '1.0.0',
      timestamp: Date.now(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Set appropriate status code based on health
    const statusCode = overall === 'healthy' ? 200 : 
                      overall === 'degraded' ? 200 : 503;

    // Set cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(statusCode).json(systemHealth);

  } catch (error) {
    console.error('Health check failed:', error);
    
    res.status(503).json({
      error: 'Health check failed',
    });
  }
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Simple connectivity test
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is OK
      throw error;
    }

    const duration = Date.now() - startTime;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    let message: string;

    if (duration < 1000) {
      status = 'healthy';
      message = `Database connection successful (${duration}ms)`;
    } else if (duration < 3000) {
      status = 'degraded';
      message = `Database connection slow (${duration}ms)`;
    } else {
      status = 'unhealthy';
      message = `Database connection very slow (${duration}ms)`;
    }

    return {
      status,
      message,
      duration,
      timestamp: Date.now()
    };

  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: Date.now() - startTime,
      timestamp: Date.now()
    };
  }
}

/**
 * Check environment configuration
 */
async function checkEnvironment(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const requiredEnvVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_CLERK_PUBLISHABLE_KEY'
    ];

    const missing: string[] = [];
    const present: string[] = [];

    requiredEnvVars.forEach(varName => {
      const value = process.env[varName] || process.env[varName.replace('VITE_', 'NEXT_PUBLIC_')];
      if (!value) {
        missing.push(varName);
      } else {
        present.push(varName);
      }
    });

    const duration = Date.now() - startTime;

    if (missing.length === 0) {
      return {
        status: 'healthy',
        message: 'All required environment variables are present',
        duration,
        timestamp: Date.now(),
        metadata: {
          present: present.length,
          total: requiredEnvVars.length
        }
      };
    } else if (missing.length <= requiredEnvVars.length / 2) {
      return {
        status: 'degraded',
        message: `Some environment variables are missing: ${missing.join(', ')}`,
        duration,
        timestamp: Date.now(),
        metadata: {
          missing,
          present: present.length,
          total: requiredEnvVars.length
        }
      };
    } else {
      return {
        status: 'unhealthy',
        message: `Critical environment variables are missing: ${missing.join(', ')}`,
        duration,
        timestamp: Date.now(),
        metadata: {
          missing,
          present: present.length,
          total: requiredEnvVars.length
        }
      };
    }

  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Environment check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: Date.now() - startTime,
      timestamp: Date.now()
    };
  }
}

/**
 * Check server memory usage
 */
async function checkMemory(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const memoryUsage = process.memoryUsage();
    const totalMemoryMB = memoryUsage.heapTotal / 1024 / 1024;
    const usedMemoryMB = memoryUsage.heapUsed / 1024 / 1024;
    const externalMemoryMB = memoryUsage.external / 1024 / 1024;
    
    const usagePercent = (usedMemoryMB / totalMemoryMB) * 100;
    const duration = Date.now() - startTime;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    let message: string;

    if (usagePercent < 70) {
      status = 'healthy';
      message = `Memory usage is normal (${usagePercent.toFixed(1)}%)`;
    } else if (usagePercent < 85) {
      status = 'degraded';
      message = `Memory usage is elevated (${usagePercent.toFixed(1)}%)`;
    } else {
      status = 'unhealthy';
      message = `Memory usage is critical (${usagePercent.toFixed(1)}%)`;
    }

    return {
      status,
      message,
      duration,
      timestamp: Date.now(),
      metadata: {
        totalMB: Math.round(totalMemoryMB),
        usedMB: Math.round(usedMemoryMB),
        externalMB: Math.round(externalMemoryMB),
        usagePercent: Math.round(usagePercent),
        rss: Math.round(memoryUsage.rss / 1024 / 1024)
      }
    };

  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Memory check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: Date.now() - startTime,
      timestamp: Date.now()
    };
  }
}

/**
 * Check external services
 */
async function checkExternalServices(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Check if we can reach external dependencies
    const checks = [];

    // Check Clerk (if configured)
    if (process.env.VITE_CLERK_PUBLISHABLE_KEY) {
      checks.push(
        fetch('https://api.clerk.dev/v1/jwks', { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        })
        .then(response => ({ service: 'clerk', ok: response.ok, status: response.status }))
        .catch(error => ({ service: 'clerk', ok: false, error: error.message }))
      );
    }

    const results = await Promise.allSettled(checks);
    const duration = Date.now() - startTime;

    const failedServices = results
      .filter(result => result.status === 'fulfilled' && !result.value.ok)
      .map(result => result.status === 'fulfilled' ? result.value.service : 'unknown');

    if (failedServices.length === 0) {
      return {
        status: 'healthy',
        message: 'All external services are reachable',
        duration,
        timestamp: Date.now(),
        metadata: {
          services: results.length,
          failed: 0
        }
      };
    } else if (failedServices.length <= results.length / 2) {
      return {
        status: 'degraded',
        message: `Some external services are unreachable: ${failedServices.join(', ')}`,
        duration,
        timestamp: Date.now(),
        metadata: {
          services: results.length,
          failed: failedServices.length,
          failedServices
        }
      };
    } else {
      return {
        status: 'unhealthy',
        message: `Multiple external services are unreachable: ${failedServices.join(', ')}`,
        duration,
        timestamp: Date.now(),
        metadata: {
          services: results.length,
          failed: failedServices.length,
          failedServices
        }
      };
    }

  } catch (error) {
    return {
      status: 'unhealthy',
      message: `External services check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: Date.now() - startTime,
      timestamp: Date.now()
    };
  }
}

/**
 * Calculate overall system health
 */
function calculateOverallHealth(results: HealthCheckResult[]): 'healthy' | 'degraded' | 'unhealthy' {
  if (results.length === 0) return 'unhealthy';

  const unhealthyCount = results.filter(r => r.status === 'unhealthy').length;
  const degradedCount = results.filter(r => r.status === 'degraded').length;

  // If any critical check is unhealthy, system is unhealthy
  if (unhealthyCount > 0) return 'unhealthy';
  
  // If any check is degraded, system is degraded
  if (degradedCount > 0) return 'degraded';
  
  // All checks are healthy
  return 'healthy';
}