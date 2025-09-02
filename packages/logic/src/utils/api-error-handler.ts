import { ApiError } from '../types/api';

/**
 * Custom error class for API operations
 */
export class LegacyGuardApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'LegacyGuardApiError';
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): ApiError {
    return {
      status: this.status,
      message: this.message,
      details: this.details
    };
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(): boolean {
    return this.status === 0 || this.status >= 500;
  }

  /**
   * Check if error is a client error
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /**
   * Check if error indicates a temporary issue that might be retryable
   */
  isRetryable(): boolean {
    return this.isNetworkError() || this.status === 429 || this.status === 503;
  }
}

/**
 * Handle API responses and convert errors to LegacyGuardApiError
 */
export function handleApiResponse<T>(
  response: any,
  operation: string,
  originalError?: Error
): T {
  // If response has an error field
  if (response && typeof response === 'object' && response.error) {
    throw new LegacyGuardApiError(
      response.status || 500,
      response.error,
      response,
      originalError
    );
  }

  // If response is successful, return the data
  return response;
}

/**
 * Wrap API operations with consistent error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`[API Error] ${operationName}:`, error);

    // If it's already a LegacyGuardApiError, re-throw it
    if (error instanceof LegacyGuardApiError) {
      throw error;
    }

    // If it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new LegacyGuardApiError(
        0,
        'Network error - please check your connection',
        { operation: operationName },
        error as Error
      );
    }

    // If it's a timeout error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new LegacyGuardApiError(
        408,
        'Request timeout - please try again',
        { operation: operationName },
        error
      );
    }

    // Generic error handling
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new LegacyGuardApiError(
      500,
      `${operationName} failed: ${message}`,
      { operation: operationName },
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Validate required parameters for API calls
 */
export function validateRequired(
  params: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => {
    const value = params[field];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    throw new LegacyGuardApiError(
      400,
      `Missing required fields: ${missingFields.join(', ')}`,
      { missingFields, provided: Object.keys(params) }
    );
  }
}

/**
 * Validate data types for API parameters
 */
export function validateTypes(
  data: any,
  validations: Record<string, (value: any) => boolean>
): void {
  const errors: string[] = [];

  Object.entries(validations).forEach(([field, validator]) => {
    if (data[field] !== undefined && !validator(data[field])) {
      errors.push(field);
    }
  });

  if (errors.length > 0) {
    throw new LegacyGuardApiError(
      400,
      `Invalid data types for fields: ${errors.join(', ')}`,
      { invalidFields: errors }
    );
  }
}

/**
 * Common validation functions
 */
export const validators = {
  isString: (value: any): boolean => typeof value === 'string',
  isNumber: (value: any): boolean => typeof value === 'number' && !isNaN(value),
  isBoolean: (value: any): boolean => typeof value === 'boolean',
  isArray: (value: any): boolean => Array.isArray(value),
  isObject: (value: any): boolean => typeof value === 'object' && value !== null && !Array.isArray(value),
  isEmail: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  isUuid: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },
  isUrl: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  isDateString: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
};

/**
 * Transform response data with error handling
 */
export function transformResponse<T, R>(
  data: T,
  transformer: (data: T) => R,
  operationName: string
): R {
  try {
    return transformer(data);
  } catch (error) {
    throw new LegacyGuardApiError(
      500,
      `Data transformation failed for ${operationName}`,
      { originalData: data },
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Retry logic for failed API calls
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  operationName: string = 'API operation'
): Promise<T> {
  let lastError: LegacyGuardApiError | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const apiError = error instanceof LegacyGuardApiError 
        ? error 
        : new LegacyGuardApiError(500, `${operationName} failed`, {}, error instanceof Error ? error : undefined);

      lastError = apiError;

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (!apiError.isRetryable()) {
        throw apiError;
      }

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw apiError;
      }

      // Wait before retrying (exponential backoff)
      const delay = delayMs * Math.pow(2, attempt - 1);
      console.warn(`[API Retry] ${operationName} attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but just in case
  throw lastError || new LegacyGuardApiError(500, `${operationName} failed after ${maxRetries} attempts`);
}
