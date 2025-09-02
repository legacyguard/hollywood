/**
 * API Versioning Strategy
 * Implements semantic versioning with backward compatibility
 */

export interface ApiVersion {
  major: number;
  minor: number;
  patch: number;
}

/**
 * API Version Configuration
 */
export const API_VERSIONS = {
  v1: { major: 1, minor: 0, patch: 0 },
  v2: { major: 2, minor: 0, patch: 0 },
  current: { major: 2, minor: 1, patch: 0 },
  minimum: { major: 1, minor: 0, patch: 0 }
} as const;

/**
 * Parse version string to ApiVersion object
 */
export function parseVersion(versionString: string): ApiVersion {
  const match = versionString.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${versionString}`);
  }
  
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  };
}

/**
 * Format ApiVersion to string
 */
export function formatVersion(version: ApiVersion): string {
  return `${version.major}.${version.minor}.${version.patch}`;
}

/**
 * Compare two versions
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareVersions(a: ApiVersion, b: ApiVersion): number {
  if (a.major !== b.major) {
    return a.major < b.major ? -1 : 1;
  }
  if (a.minor !== b.minor) {
    return a.minor < b.minor ? -1 : 1;
  }
  if (a.patch !== b.patch) {
    return a.patch < b.patch ? -1 : 1;
  }
  return 0;
}

/**
 * Check if a version is compatible with requirements
 */
export function isVersionCompatible(
  version: ApiVersion,
  minimum: ApiVersion = API_VERSIONS.minimum,
  maximum?: ApiVersion
): boolean {
  const minCompare = compareVersions(version, minimum);
  if (minCompare < 0) {
    return false;
  }
  
  if (maximum) {
    const maxCompare = compareVersions(version, maximum);
    if (maxCompare > 0) {
      return false;
    }
  }
  
  return true;
}

/**
 * Version-aware API client wrapper
 */
export class VersionedApiClient {
  private version: ApiVersion;
  private acceptVersion: string;
  
  constructor(version: ApiVersion = API_VERSIONS.current) {
    this.version = version;
    this.acceptVersion = `application/vnd.legacyguard.v${version.major}+json`;
  }
  
  /**
   * Get versioned headers for API requests
   */
  getVersionHeaders(): Record<string, string> {
    return {
      'API-Version': formatVersion(this.version),
      'Accept': this.acceptVersion,
      'X-API-Version': formatVersion(this.version),
      'X-Min-Version': formatVersion(API_VERSIONS.minimum)
    };
  }
  
  /**
   * Check if server version is compatible
   */
  checkServerVersion(serverVersionHeader: string | null): boolean {
    if (!serverVersionHeader) {
      console.warn('No server version header found, assuming compatibility');
      return true;
    }
    
    try {
      const serverVersion = parseVersion(serverVersionHeader);
      return isVersionCompatible(serverVersion, API_VERSIONS.minimum);
    } catch (error) {
      console.error('Failed to parse server version:', error);
      return false;
    }
  }
  
  /**
   * Handle version mismatch
   */
  handleVersionMismatch(
    clientVersion: ApiVersion,
    serverVersion: string,
    response: Response
  ): void {
    const serverVer = parseVersion(serverVersion);
    
    if (compareVersions(clientVersion, serverVer) < 0) {
      console.warn(
        `Client version (${formatVersion(clientVersion)}) is older than server version (${serverVersion}). ` +
        'Consider updating the client.'
      );
    } else {
      console.warn(
        `Client version (${formatVersion(clientVersion)}) is newer than server version (${serverVersion}). ` +
        'Some features may not be available.'
      );
    }
    
    // Check if we need to downgrade the request
    if (response.status === 406) { // Not Acceptable
      throw new Error(
        `API version mismatch: Client ${formatVersion(clientVersion)} is not compatible with server ${serverVersion}`
      );
    }
  }
}

/**
 * Version negotiation middleware
 */
export class VersionNegotiator {
  private supportedVersions: ApiVersion[];
  
  constructor(supportedVersions: ApiVersion[] = [API_VERSIONS.v1, API_VERSIONS.v2, API_VERSIONS.current]) {
    this.supportedVersions = supportedVersions;
  }
  
  /**
   * Negotiate best version based on client request
   */
  negotiate(requestedVersion: string | null): ApiVersion {
    if (!requestedVersion) {
      return API_VERSIONS.current;
    }
    
    try {
      const requested = parseVersion(requestedVersion);
      
      // Find exact match
      const exactMatch = this.supportedVersions.find(
        v => compareVersions(v, requested) === 0
      );
      if (exactMatch) {
        return exactMatch;
      }
      
      // Find best compatible version (same major, highest minor/patch)
      const compatible = this.supportedVersions
        .filter(v => v.major === requested.major)
        .sort((a, b) => compareVersions(b, a))[0];
      
      if (compatible) {
        return compatible;
      }
      
      // No compatible version found
      throw new Error(`No compatible version found for ${requestedVersion}`);
    } catch (error) {
      console.error('Version negotiation failed:', error);
      return API_VERSIONS.current;
    }
  }
  
  /**
   * Get all supported version strings
   */
  getSupportedVersionStrings(): string[] {
    return this.supportedVersions.map(formatVersion);
  }
  
  /**
   * Check if a version is supported
   */
  isSupported(version: string): boolean {
    try {
      const ver = parseVersion(version);
      return this.supportedVersions.some(
        v => compareVersions(v, ver) === 0
      );
    } catch {
      return false;
    }
  }
}

/**
 * Deprecation warning system
 */
export class DeprecationManager {
  private deprecations: Map<string, {
    version: ApiVersion;
    message: string;
    alternative?: string;
  }>;
  
  constructor() {
    this.deprecations = new Map();
  }
  
  /**
   * Mark an API endpoint or feature as deprecated
   */
  deprecate(
    feature: string,
    deprecatedInVersion: ApiVersion,
    message: string,
    alternative?: string
  ): void {
    this.deprecations.set(feature, {
      version: deprecatedInVersion,
      message,
      alternative
    });
  }
  
  /**
   * Check if a feature is deprecated
   */
  isDeprecated(feature: string, currentVersion: ApiVersion): boolean {
    const deprecation = this.deprecations.get(feature);
    if (!deprecation) {
      return false;
    }
    
    return compareVersions(currentVersion, deprecation.version) >= 0;
  }
  
  /**
   * Get deprecation warning for a feature
   */
  getWarning(feature: string): string | null {
    const deprecation = this.deprecations.get(feature);
    if (!deprecation) {
      return null;
    }
    
    let warning = `[DEPRECATED] ${feature}: ${deprecation.message}`;
    if (deprecation.alternative) {
      warning += ` Use ${deprecation.alternative} instead.`;
    }
    warning += ` (Deprecated since v${formatVersion(deprecation.version)})`;
    
    return warning;
  }
  
  /**
   * Log deprecation warning
   */
  warn(feature: string): void {
    const warning = this.getWarning(feature);
    if (warning) {
      console.warn(warning);
    }
  }
}

/**
 * Response transformer for version compatibility
 */
export class VersionedResponseTransformer {
  /**
   * Transform response based on client version
   */
  static transform<T>(
    data: T,
    clientVersion: ApiVersion,
    serverVersion: ApiVersion
  ): T {
    // If client is older, we might need to transform the response
    if (compareVersions(clientVersion, serverVersion) < 0) {
      return this.backwardTransform(data, clientVersion, serverVersion);
    }
    
    // If client is newer, response should be compatible
    return data;
  }
  
  /**
   * Transform response for backward compatibility
   */
  private static backwardTransform<T>(
    data: T,
    clientVersion: ApiVersion,
    serverVersion: ApiVersion
  ): T {
    // Version-specific transformations
    if (clientVersion.major === 1 && serverVersion.major === 2) {
      // Transform v2 response to v1 format
      return this.transformV2ToV1(data);
    }
    
    return data;
  }
  
  /**
   * Transform v2 response to v1 format
   */
  private static transformV2ToV1<T>(data: T): T {
    // Example transformations
    const transformed = { ...data } as any;
    
    // Rename fields that changed between versions
    if ('userId' in transformed && !('user_id' in transformed)) {
      transformed.user_id = transformed.userId;
      delete transformed.userId;
    }
    
    // Remove fields that don't exist in v1
    if ('newFeature' in transformed) {
      delete transformed.newFeature;
    }
    
    // Transform nested objects recursively
    if (typeof transformed === 'object' && transformed !== null) {
      Object.keys(transformed).forEach(key => {
        if (typeof transformed[key] === 'object' && transformed[key] !== null) {
          transformed[key] = this.transformV2ToV1(transformed[key]);
        }
      });
    }
    
    return transformed as T;
  }
}

/**
 * Create a versioned API client instance
 */
export function createVersionedClient(
  baseClient: any,
  version: ApiVersion = API_VERSIONS.current
): any {
  const versionClient = new VersionedApiClient(version);
  const deprecationManager = new DeprecationManager();
  
  // Set up common deprecations
  deprecationManager.deprecate(
    '/api/v1/documents',
    API_VERSIONS.v2,
    'This endpoint is deprecated',
    '/api/v2/documents'
  );
  
  // Wrap the base client methods
  const wrappedClient = {
    ...baseClient,
    
    async get(endpoint: string, options?: any) {
      // Check for deprecations
      deprecationManager.warn(endpoint);
      
      // Add version headers
      const headers = {
        ...options?.headers,
        ...versionClient.getVersionHeaders()
      };
      
      const response = await baseClient.get(endpoint, { ...options, headers });
      
      // Check server version
      const serverVersion = response.headers?.['x-api-version'];
      if (serverVersion && !versionClient.checkServerVersion(serverVersion)) {
        versionClient.handleVersionMismatch(version, serverVersion, response);
      }
      
      return response;
    },
    
    async post(endpoint: string, data?: any, options?: any) {
      deprecationManager.warn(endpoint);
      
      const headers = {
        ...options?.headers,
        ...versionClient.getVersionHeaders()
      };
      
      return baseClient.post(endpoint, data, { ...options, headers });
    },
    
    async put(endpoint: string, data?: any, options?: any) {
      deprecationManager.warn(endpoint);
      
      const headers = {
        ...options?.headers,
        ...versionClient.getVersionHeaders()
      };
      
      return baseClient.put(endpoint, data, { ...options, headers });
    },
    
    async delete(endpoint: string, options?: any) {
      deprecationManager.warn(endpoint);
      
      const headers = {
        ...options?.headers,
        ...versionClient.getVersionHeaders()
      };
      
      return baseClient.delete(endpoint, { ...options, headers });
    }
  };
  
  return wrappedClient;
}

// Export all utilities
export {
  VersionedApiClient,
  VersionNegotiator,
  DeprecationManager,
  VersionedResponseTransformer
};
