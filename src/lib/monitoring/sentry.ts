/**
 * Sentry Error Tracking Configuration
 * Phase 5A: Production Operations & DevOps
 */

interface ErrorTrackingConfig {
  dsn?: string;
  environment: string;
  sampleRate: number;
  tracesSampleRate: number;
  enabled: boolean;
}

interface UserContext {
  id: string;
  email?: string;
  username?: string;
  personality_mode?: string;
}

interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: 'error' | 'warning' | 'info' | 'debug';
  fingerprint?: string[];
}

export class ErrorTracker {
  private config: ErrorTrackingConfig;
  private isInitialized = false;

  constructor(config: ErrorTrackingConfig) {
    this.config = config;
  }

  /**
   * Initialize error tracking
   */
  init(): void {
    if (this.isInitialized || !this.config.enabled) return;

    // In a real implementation, this would initialize Sentry
    // For now, we'll create a compatible interface
    console.info('📊 Error tracking initialized', {
      environment: this.config.environment,
      sampleRate: this.config.sampleRate
    });

    // Set up global error handlers
    this.setupGlobalHandlers();
    this.isInitialized = true;
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason, {
        tags: { source: 'unhandled_rejection' }
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.captureException(event.error, {
        tags: {
          source: 'global_error',
          filename: event.filename,
          lineno: String(event.lineno),
          colno: String(event.colno)
        }
      });
    });
  }

  /**
   * Capture an exception with context
   */
  captureException(error: Error | string, context?: ErrorContext): void {
    if (!this.config.enabled) return;

    const errorData = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : { message: String(error) },
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log to console in development
    if (this.config.environment === 'development') {
      console.error('🚨 Error captured:', errorData);
    }

    // In production, this would send to Sentry
    this.sendToMonitoring(errorData, 'error');
  }

  /**
   * Capture a message with context
   */
  captureMessage(message: string, context?: ErrorContext): void {
    if (!this.config.enabled) return;

    const messageData = {
      timestamp: new Date().toISOString(),
      message,
      context,
      url: window.location.href,
      level: context?.level || 'info'
    };

    // Log to console in development
    if (this.config.environment === 'development') {
      console.info('📝 Message captured:', messageData);
    }

    this.sendToMonitoring(messageData, 'message');
  }

  /**
   * Set user context
   */
  setUserContext(user: UserContext): void {
    if (!this.config.enabled) return;

    // Store user context for future error reports
    sessionStorage.setItem('error-tracking-user', JSON.stringify(user));
  }

  /**
   * Set custom tags
   */
  setTags(tags: Record<string, string>): void {
    if (!this.config.enabled) return;

    const existingTags = JSON.parse(sessionStorage.getItem('error-tracking-tags') || '{}');
    const updatedTags = { ...existingTags, ...tags };
    sessionStorage.setItem('error-tracking-tags', JSON.stringify(updatedTags));
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, category?: string, data?: Record<string, any>): void {
    if (!this.config.enabled) return;

    const breadcrumb = {
      timestamp: new Date().toISOString(),
      message,
      category: category || 'default',
      data
    };

    const breadcrumbs = JSON.parse(sessionStorage.getItem('error-tracking-breadcrumbs') || '[]');
    breadcrumbs.push(breadcrumb);

    // Keep only last 50 breadcrumbs
    if (breadcrumbs.length > 50) {
      breadcrumbs.shift();
    }

    sessionStorage.setItem('error-tracking-breadcrumbs', JSON.stringify(breadcrumbs));
  }

  /**
   * Send data to monitoring service
   */
  private sendToMonitoring(data: any, type: 'error' | 'message'): void {
    // Get stored user context and tags
    const user = JSON.parse(sessionStorage.getItem('error-tracking-user') || '{}');
    const tags = JSON.parse(sessionStorage.getItem('error-tracking-tags') || '{}');
    const breadcrumbs = JSON.parse(sessionStorage.getItem('error-tracking-breadcrumbs') || '[]');

    const payload = {
      ...data,
      user,
      tags,
      breadcrumbs,
      type,
      environment: this.config.environment
    };

    // In a real implementation, this would send to Sentry API
    if (this.config.environment === 'production') {
      // Store in localStorage as fallback for now
      const errors = JSON.parse(localStorage.getItem('legacyguard-errors') || '[]');
      errors.push(payload);

      // Keep only last 100 errors
      if (errors.length > 100) {
        errors.shift();
      }

      localStorage.setItem('legacyguard-errors', JSON.stringify(errors));
    }
  }
}

// Create and export error tracker instance
export const errorTracker = new ErrorTracker({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.NODE_ENV || 'development',
  sampleRate: 1.0,
  tracesSampleRate: import.meta.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: true
});

// Initialize error tracking
errorTracker.init();

// Export convenience functions
export const captureError = (error: Error | string, context?: ErrorContext) => {
  errorTracker.captureException(error, context);
};

export const captureMessage = (message: string, context?: ErrorContext) => {
  errorTracker.captureMessage(message, context);
};

export const setUserContext = (user: UserContext) => {
  errorTracker.setUserContext(user);
};

export const addBreadcrumb = (message: string, category?: string, data?: Record<string, any>) => {
  errorTracker.addBreadcrumb(message, category, data);
};

export const setErrorTags = (tags: Record<string, string>) => {
  errorTracker.setTags(tags);
};
