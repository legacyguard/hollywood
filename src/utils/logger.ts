/**
 * Comprehensive Logging System for LegacyGuard
 * Provides structured logging with different levels and transports
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: Record<string, any>;
  error?: Error;
  userId?: string;
  requestId?: string;
  tags?: string[];
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  maxFileSize: number;
  maxFiles: number;
  redactSensitiveData: boolean;
}

export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private queue: LogEntry[] = [];
  private isProcessing = false;

  private constructor(config: LoggerConfig) {
    this.config = config;
  }

  public static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      const defaultConfig: LoggerConfig = {
        level: LogLevel.INFO,
        enableConsole: true,
        enableFile: false,
        enableRemote: false,
        maxFileSize: 10 * 1024 * 1024,
        maxFiles: 5,
        redactSensitiveData: true,
      };
      Logger.instance = new Logger({ ...defaultConfig, ...config });
    }
    return Logger.instance;
  }

  public debug(message: string, data?: Record<string, any>, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  public info(message: string, data?: Record<string, any>, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  public warn(message: string, data?: Record<string, any>, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  public error(message: string, error?: Error, data?: Record<string, any>, context?: string): void {
    this.log(LogLevel.ERROR, message, data, context, error);
  }

  public fatal(message: string, error?: Error, data?: Record<string, any>, context?: string): void {
    this.log(LogLevel.FATAL, message, data, context, error);
  }

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, any>,
    context?: string,
    error?: Error
  ): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      data: this.config.redactSensitiveData ? this.redactSensitiveData(data) : data,
      error,
    };

    this.queue.push(entry);
    this.processQueue();
  }

  private redactSensitiveData(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return data;

    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'ssn', 'creditCard',
      'bankAccount', 'routingNumber', 'pin', 'passphrase'
    ];

    const redacted = { ...data };
    
    for (const key in redacted) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        redacted[key] = '[REDACTED]';
      } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
        redacted[key] = this.redactSensitiveData(redacted[key] as Record<string, any>);
      }
    }

    return redacted;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const entry = this.queue.shift();
      if (entry) {
        await this.writeLog(entry);
      }
    }

    this.isProcessing = false;
  }

  private async writeLog(entry: LogEntry): Promise<void> {
    try {
      if (this.config.enableConsole) {
        this.writeToConsole(entry);
      }

      if (this.config.enableFile) {
        await this.writeToFile(entry);
      }

      if (this.config.enableRemote) {
        await this.writeToRemote(entry);
      }
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  private writeToConsole(entry: LogEntry): void {
    const logMethod = this.getConsoleMethod(entry.level);
    const logMessage = this.formatLogMessage(entry);

    if (entry.error) {
      logMethod(logMessage, entry.error);
    } else {
      logMethod(logMessage, entry.data || '');
    }
  }

  private getConsoleMethod(level: LogLevel): (message: string, ...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug.bind(console);
      case LogLevel.INFO:
        return console.info.bind(console);
      case LogLevel.WARN:
        return console.warn.bind(console);
      case LogLevel.ERROR:
        return console.error.bind(console);
      case LogLevel.FATAL:
        return console.error.bind(console);
      default:
        return console.log.bind(console);
    }
  }

  private formatLogMessage(entry: LogEntry): string {
    const level = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : '';
    return `[${entry.timestamp.toISOString()}] ${level} ${context} ${entry.message}`;
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    console.log('Writing to file:', this.formatLogMessage(entry));
  }

  private async writeToRemote(entry: LogEntry): Promise<void> {
    console.log('Writing to remote:', this.formatLogMessage(entry));
  }

  public createChildLogger(context: string): Logger {
    return new Proxy(this, {
      get(target, prop) {
        if (['debug', 'info', 'warn', 'error', 'fatal'].includes(prop as string)) {
          return (message: string, data?: Record<string, any>) => {
            return (target as any)[prop](message, data, context);
          };
        }
        return (target as any)[prop];
      },
    });
  }
}

// Convenience exports
export const logger = Logger.getInstance();

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks = new Map<string, number>();

  public static mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  public static measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    if (!start) {
      throw new Error(`Mark ${startMark} not found`);
    }

    const end = endMark ? this.marks.get(endMark) : performance.now();
    if (!end) {
      throw new Error(`Mark ${endMark} not found`);
    }

    const duration = end - start;
    logger.debug(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    return duration;
  }

  public static clearMarks(): void {
    this.marks.clear();
  }
}

// Request context for logging
export interface RequestContext {
  requestId: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
}

export class RequestLogger {
  private static contexts = new Map<string, RequestContext>();

  public static setContext(requestId: string, context: RequestContext): void {
    this.contexts.set(requestId, context);
  }

  public static getContext(requestId: string): RequestContext | undefined {
    return this.contexts.get(requestId);
  }

  public static clearContext(requestId: string): void {
    this.contexts.delete(requestId);
  }

  public static logWithContext(
    level: LogLevel,
    message: string,
    data?: Record<string, any>,
    requestId?: string
  ): void {
    const context = requestId ? this.getContext(requestId) : undefined;
    const enrichedData = {
      ...data,
      requestId,
      userId: context?.userId,
      ip: context?.ip,
    };

    if (level === LogLevel.DEBUG) {
      logger.debug(message, enrichedData, 'request');
    } else if (level === LogLevel.INFO) {
      logger.info(message, enrichedData, 'request');
    } else if (level === LogLevel.WARN) {
      logger.warn(message, enrichedData, 'request');
    } else if (level === LogLevel.ERROR) {
      logger.error(message, undefined, enrichedData, 'request');
    } else if (level === LogLevel.FATAL) {
      logger.fatal(message, undefined, enrichedData, 'request');
    }
  }
}

// Error boundary for React components
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export function logComponentError(
  error: Error,
  errorInfo: React.ErrorInfo,
  componentName?: string
): void {
  logger.error(
    `React Error Boundary: ${componentName || 'Unknown Component'}`,
    error,
    {
      componentName,
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
    }
  );
}