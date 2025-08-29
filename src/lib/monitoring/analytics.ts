/**
 * Privacy-Compliant Analytics System
 * Phase 5A: Production Operations & DevOps
 */

interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  respectDoNotTrack: boolean;
  cookieConsent: boolean;
  sessionTimeout: number;
  batchSize: number;
  flushInterval: number;
}

interface AnalyticsEvent {
  type: 'page_view' | 'user_action' | 'feature_usage' | 'performance' | 'error';
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  pathname: string;
  referrer?: string;
}

interface UserProperties {
  userId?: string;
  personalityMode?: string;
  isNewUser?: boolean;
  lastSeen?: number;
  sessionCount?: number;
}

interface AnalyticsSession {
  id: string;
  startTime: number;
  lastActivity: number;
  events: AnalyticsEvent[];
  userAgent: string;
  viewport: { width: number; height: number };
  language: string;
}

export class AnalyticsService {
  private config: AnalyticsConfig;
  private session: AnalyticsSession | null = null;
  private userProperties: UserProperties = {};
  private eventQueue: AnalyticsEvent[] = [];
  private consentGiven = false;
  private flushTimer?: number;

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  /**
   * Initialize analytics service
   */
  init(): void {
    if (!this.config.enabled) return;

    // Check for Do Not Track preference
    if (this.config.respectDoNotTrack && this.isDoNotTrackEnabled()) {
      console.info('📊 Analytics disabled due to Do Not Track preference');
      return;
    }

    // Check for stored consent
    this.consentGiven = this.getStoredConsent();

    if (this.consentGiven) {
      this.startSession();
      this.setupEventListeners();
      this.startPeriodicFlush();
    }

    console.info('📊 Analytics service initialized', {
      consentGiven: this.consentGiven,
      respectDoNotTrack: this.config.respectDoNotTrack
    });
  }

  /**
   * Request user consent for analytics
   */
  requestConsent(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.config.cookieConsent) {
        this.consentGiven = true;
        this.startSession();
        this.setupEventListeners();
        this.startPeriodicFlush();
        resolve(true);
        return;
      }

      // In a real implementation, this would show a consent dialog
      // For now, we'll assume consent is given
      setTimeout(() => {
        this.consentGiven = true;
        this.setStoredConsent(true);
        this.startSession();
        this.setupEventListeners();
        this.startPeriodicFlush();
        resolve(true);
      }, 100);
    });
  }

  /**
   * Revoke consent and clear data
   */
  revokeConsent(): void {
    this.consentGiven = false;
    this.setStoredConsent(false);
    this.clearStoredData();
    this.session = null;
    this.eventQueue = [];
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  /**
   * Set user properties
   */
  setUser(properties: UserProperties): void {
    if (!this.consentGiven) return;

    this.userProperties = { ...this.userProperties, ...properties };
    
    // Store user properties (without PII)
    const sanitizedProps = {
      personalityMode: properties.personalityMode,
      isNewUser: properties.isNewUser,
      sessionCount: properties.sessionCount
    };
    
    localStorage.setItem('legacyguard-user-props', JSON.stringify(sanitizedProps));
  }

  /**
   * Track page view
   */
  trackPageView(pathname?: string, title?: string): void {
    if (!this.consentGiven || !this.session) return;

    const event: AnalyticsEvent = {
      type: 'page_view',
      name: 'page_view',
      properties: {
        title: title || document.title,
        pathname: pathname || window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
      },
      timestamp: Date.now(),
      sessionId: this.session.id,
      userId: this.userProperties.userId,
      pathname: pathname || window.location.pathname,
      referrer: document.referrer
    };

    this.addEvent(event);
  }

  /**
   * Track user action
   */
  trackAction(action: string, properties?: Record<string, any>): void {
    if (!this.consentGiven || !this.session) return;

    const event: AnalyticsEvent = {
      type: 'user_action',
      name: action,
      properties: this.sanitizeProperties(properties),
      timestamp: Date.now(),
      sessionId: this.session.id,
      userId: this.userProperties.userId,
      pathname: window.location.pathname
    };

    this.addEvent(event);
  }

  /**
   * Track feature usage
   */
  trackFeature(feature: string, properties?: Record<string, any>): void {
    if (!this.consentGiven || !this.session) return;

    const event: AnalyticsEvent = {
      type: 'feature_usage',
      name: feature,
      properties: this.sanitizeProperties(properties),
      timestamp: Date.now(),
      sessionId: this.session.id,
      userId: this.userProperties.userId,
      pathname: window.location.pathname
    };

    this.addEvent(event);
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, properties?: Record<string, any>): void {
    if (!this.consentGiven || !this.session) return;

    const event: AnalyticsEvent = {
      type: 'performance',
      name: metric,
      properties: {
        ...this.sanitizeProperties(properties),
        value,
        metric
      },
      timestamp: Date.now(),
      sessionId: this.session.id,
      userId: this.userProperties.userId,
      pathname: window.location.pathname
    };

    this.addEvent(event);
  }

  /**
   * Track error events
   */
  trackError(error: string, properties?: Record<string, any>): void {
    if (!this.consentGiven || !this.session) return;

    const event: AnalyticsEvent = {
      type: 'error',
      name: 'error',
      properties: {
        ...this.sanitizeProperties(properties),
        error: error.substring(0, 1000) // Limit error message length
      },
      timestamp: Date.now(),
      sessionId: this.session.id,
      userId: this.userProperties.userId,
      pathname: window.location.pathname
    };

    this.addEvent(event);
  }

  /**
   * Get current session data
   */
  getSessionData(): AnalyticsSession | null {
    return this.session;
  }

  /**
   * Start a new analytics session
   */
  private startSession(): void {
    this.session = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      events: [],
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      language: navigator.language
    };

    // Load stored user properties
    const storedProps = localStorage.getItem('legacyguard-user-props');
    if (storedProps) {
      try {
        const parsed = JSON.parse(storedProps);
        this.userProperties = { ...this.userProperties, ...parsed };
      } catch (error) {
        console.warn('Failed to parse stored user properties:', error);
      }
    }

    // Update session count
    const sessionCount = (this.userProperties.sessionCount || 0) + 1;
    this.setUser({ 
      sessionCount,
      lastSeen: Date.now(),
      isNewUser: sessionCount === 1
    });
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.session) {
        this.flushEvents();
      }
    });

    // Track beforeunload
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const throttledActivity = this.throttle(() => {
      if (this.session) {
        this.session.lastActivity = Date.now();
      }
    }, 5000); // Throttle to every 5 seconds

    activityEvents.forEach(event => {
      document.addEventListener(event, throttledActivity);
    });

    // Track route changes (for SPAs)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      const result = originalPushState.apply(history, arguments);
      setTimeout(() => analyticsService.trackPageView(), 0);
      return result;
    };

    history.replaceState = function() {
      const result = originalReplaceState.apply(history, arguments);
      setTimeout(() => analyticsService.trackPageView(), 0);
      return result;
    };

    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView(), 0);
    });
  }

  /**
   * Add event to queue
   */
  private addEvent(event: AnalyticsEvent): void {
    if (!this.session) return;

    this.eventQueue.push(event);
    this.session.events.push(event);
    this.session.lastActivity = Date.now();

    if (this.config.debug) {
      console.info('📊 Analytics event:', event);
    }

    // Flush if queue is full
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flushEvents();
    }
  }

  /**
   * Flush events to storage/service
   */
  private flushEvents(): void {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    // In a real implementation, this would send to analytics service
    if (this.config.debug) {
      console.info('📊 Flushing analytics events:', events.length);
    }

    // Store events locally for now
    const storedEvents = JSON.parse(localStorage.getItem('legacyguard-analytics') || '[]');
    storedEvents.push(...events);

    // Keep only last 1000 events
    if (storedEvents.length > 1000) {
      storedEvents.splice(0, storedEvents.length - 1000);
    }

    localStorage.setItem('legacyguard-analytics', JSON.stringify(storedEvents));
  }

  /**
   * Start periodic event flushing
   */
  private startPeriodicFlush(): void {
    this.flushTimer = window.setInterval(() => {
      this.flushEvents();
    }, this.config.flushInterval);
  }

  /**
   * Check if Do Not Track is enabled
   */
  private isDoNotTrackEnabled(): boolean {
    return navigator.doNotTrack === '1' || 
           (window as any).doNotTrack === '1' ||
           (navigator as any).msDoNotTrack === '1';
  }

  /**
   * Get stored consent preference
   */
  private getStoredConsent(): boolean {
    const stored = localStorage.getItem('legacyguard-analytics-consent');
    return stored === 'true';
  }

  /**
   * Set stored consent preference
   */
  private setStoredConsent(consent: boolean): void {
    localStorage.setItem('legacyguard-analytics-consent', String(consent));
  }

  /**
   * Clear all stored analytics data
   */
  private clearStoredData(): void {
    localStorage.removeItem('legacyguard-analytics');
    localStorage.removeItem('legacyguard-user-props');
    localStorage.removeItem('legacyguard-analytics-consent');
  }

  /**
   * Sanitize properties to remove PII
   */
  private sanitizeProperties(properties?: Record<string, any>): Record<string, any> {
    if (!properties) return {};

    const sanitized: Record<string, any> = {};
    const piiKeys = ['email', 'phone', 'address', 'name', 'ssn', 'creditcard'];

    for (const [key, value] of Object.entries(properties)) {
      // Skip potential PII fields
      if (piiKeys.some(piiKey => key.toLowerCase().includes(piiKey))) {
        continue;
      }

      // Limit string length
      if (typeof value === 'string' && value.length > 1000) {
        sanitized[key] = value.substring(0, 1000);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Throttle function calls
   */
  private throttle(func: Function, wait: number): Function {
    let timeout: number | null = null;
    return (...args: any[]) => {
      if (timeout === null) {
        func(...args);
        timeout = window.setTimeout(() => {
          timeout = null;
        }, wait);
      }
    };
  }
}

// Create and export analytics service
export const analyticsService = new AnalyticsService({
  enabled: true,
  debug: import.meta.env.NODE_ENV === 'development',
  respectDoNotTrack: true,
  cookieConsent: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  batchSize: 20,
  flushInterval: 10000 // 10 seconds
});

// Initialize analytics
analyticsService.init();

// Export convenience functions
export const trackPageView = (pathname?: string, title?: string) => {
  analyticsService.trackPageView(pathname, title);
};

export const trackAction = (action: string, properties?: Record<string, any>) => {
  analyticsService.trackAction(action, properties);
};

export const trackFeature = (feature: string, properties?: Record<string, any>) => {
  analyticsService.trackFeature(feature, properties);
};

export const trackPerformance = (metric: string, value: number, properties?: Record<string, any>) => {
  analyticsService.trackPerformance(metric, value, properties);
};

export const trackError = (error: string, properties?: Record<string, any>) => {
  analyticsService.trackError(error, properties);
};

export const setAnalyticsUser = (properties: UserProperties) => {
  analyticsService.setUser(properties);
};

export const requestAnalyticsConsent = () => {
  return analyticsService.requestConsent();
};

export const revokeAnalyticsConsent = () => {
  analyticsService.revokeConsent();
};