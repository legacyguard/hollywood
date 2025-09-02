/**
 * i18n Configuration for LegacyGuard
 * Unified configuration supporting the locales structure
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Platform detection
export const detectPlatform = (): 'web' | 'mobile' => {
  // Check if we're in a React Native environment
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'mobile';
  }
  // Check for Expo
  if (typeof window !== 'undefined' && (window as { expo?: unknown }).expo) {
    return 'mobile';
  }
  return 'web';
};

// Supported jurisdictions
export const SUPPORTED_JURISDICTIONS = {
  SK: 'Slovakia',
  CZ: 'Czech Republic'
} as const;

export type SupportedJurisdictionCode = keyof typeof SUPPORTED_JURISDICTIONS;

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    rtl: false
  },
  sk: {
    code: 'sk',
    name: 'Slovak',
    nativeName: 'Slovenčina',
    flag: '🇸🇰',
    dateFormat: 'DD.MM.YYYY',
    currency: 'EUR',
    rtl: false
  },
  cs: {
    code: 'cs',
    name: 'Czech',
    nativeName: 'Čeština',
    flag: '🇨🇿',
    dateFormat: 'DD.MM.YYYY',
    currency: 'CZK',
    rtl: false
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dateFormat: 'DD.MM.YYYY',
    currency: 'EUR',
    rtl: false
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    dateFormat: 'DD.MM.YYYY',
    currency: 'PLN',
    rtl: false
  }
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// New namespace configuration matching the new locales structure
export const NAMESPACES = {
  // UI namespace (default, always loaded)
  UI: 'ui',
  
  // Content namespaces (loaded on demand)
  CONTENT: {
    wills: 'wills',
    familyShield: 'family-shield'
  }
} as const;

// Helper function to get content namespace with jurisdiction
export const getContentNamespace = (content: keyof typeof NAMESPACES.CONTENT, language: SupportedLanguageCode, jurisdiction: SupportedJurisdictionCode) => {
  return `${content}_${language}_${jurisdiction}`;
};

// Configuration object
export const i18nConfig = {
  // Default settings
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',

  // Resource loading - UI namespace is default
  ns: [NAMESPACES.UI],
  defaultNS: NAMESPACES.UI,

  // Language settings
  supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  load: 'languageOnly' as const, // Ignore region codes

  // Detection options
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
    checkForSupportedLanguage: true
  },

  // Backend options for loading translations
  backend: {
    // Load path function for the new structure
    loadPath: (lngs: string[], namespaces: string[]) => {
      const lng = lngs[0];
      const namespace = namespaces[0];

      // Handle UI namespace
      if (namespace === NAMESPACES.UI) {
        return `/locales/ui/${lng}.json`;
      }

      // Handle content namespaces with jurisdiction
      // Format: wills_sk_SK, family-shield_en_CZ, etc.
      if (namespace.includes('_')) {
        const [contentType, language, jurisdiction] = namespace.split('_');
        return `/locales/content/${contentType}/${language}_${jurisdiction}.json`;
      }

      // Default fallback
      return `/locales/ui/${lng}.json`;
    },

    // Parse the loaded data
    parse: (data: string) => {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Failed to parse translation data:', error);
        return {};
      }
    }
  },

  // Interpolation options
  interpolation: {
    escapeValue: false, // React already escapes values
    format: (value: unknown, format?: string, lng?: string): string => {
      if (typeof value === 'string') {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize') {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
      }
      
      if (format === 'currency' && typeof value === 'number' && lng) {
        const language = SUPPORTED_LANGUAGES[lng as SupportedLanguageCode];
        return new Intl.NumberFormat(lng, {
          style: 'currency',
          currency: language?.currency || 'EUR'
        }).format(value);
      }
      
      if (format === 'date' && value instanceof Date) {
        return new Intl.DateTimeFormat(lng).format(value);
      }
      
      return String(value);
    }
  },

  // React specific options
  react: {
    useSuspense: false, // Disable suspense for better control
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
  },

  // Missing key handling
  saveMissing: process.env.NODE_ENV === 'development',
  missingKeyHandler: (lng: string[], ns: string, key: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation: ${lng.join(', ')} - ${ns}:${key}`);
    }
  },

  // Pluralization
  pluralSeparator: '_',
  contextSeparator: '_',

  // Performance
  maxParallelReads: 10,
  initImmediate: true
};

// Namespace loader utility for the new architecture
export class NamespaceLoader {
  private static loadedNamespaces = new Set<string>();

  /**
   * Load content namespace for specific language and jurisdiction
   */
  static async loadContent(
    contentType: keyof typeof NAMESPACES.CONTENT, 
    language: SupportedLanguageCode, 
    jurisdiction: SupportedJurisdictionCode
  ) {
    const namespace = getContentNamespace(contentType, language, jurisdiction);
    
    if (!this.loadedNamespaces.has(namespace)) {
      try {
        await i18n.loadNamespaces([namespace]);
        this.loadedNamespaces.add(namespace);
      } catch (error) {
        console.warn(`Failed to load namespace ${namespace}:`, error);
        // Try fallback to English if available
        if (language !== 'en') {
          const fallbackNamespace = getContentNamespace(contentType, 'en', jurisdiction);
          try {
            await i18n.loadNamespaces([fallbackNamespace]);
            this.loadedNamespaces.add(fallbackNamespace);
          } catch (fallbackError) {
            console.error(`Failed to load fallback namespace ${fallbackNamespace}:`, fallbackError);
          }
        }
      }
    }
  }

  /**
   * Load wills content for specific jurisdiction
   */
  static async loadWills(language: SupportedLanguageCode, jurisdiction: SupportedJurisdictionCode) {
    await this.loadContent('wills', language, jurisdiction);
  }

  /**
   * Load family shield content for specific jurisdiction
   */
  static async loadFamilyShield(language: SupportedLanguageCode, jurisdiction: SupportedJurisdictionCode) {
    await this.loadContent('familyShield', language, jurisdiction);
  }

  static isLoaded(namespace: string): boolean {
    return this.loadedNamespaces.has(namespace);
  }

  static getLoadedNamespaces(): string[] {
    return Array.from(this.loadedNamespaces);
  }

  static reset() {
    this.loadedNamespaces.clear();
  }
}

// Route-based namespace mapping (simplified for new structure)
export const getNamespacesForRoute = (pathname: string): string[] => {
  // Always load UI namespace
  const namespaces: string[] = [NAMESPACES.UI];

  // Content namespaces are loaded on-demand based on user's jurisdiction and language
  // This function now returns just the UI namespace, content is loaded when needed
  return namespaces;
};

// Initialize i18n
export const initI18n = async () => {
  await i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(i18nConfig);

  return i18n;
};

// Auto-initialize for immediate use
if (!i18n.isInitialized) {
  initI18n().catch(error => {
    console.error('Failed to initialize i18n:', error);
  });
}

export default i18n;