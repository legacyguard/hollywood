/**
 * i18n Configuration
 * Centralized configuration for internationalization
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

// Namespace configuration
export const NAMESPACES = {
  // Core namespaces (always loaded)
  CORE: [
    'common.ui',
    'common.navigation',
    'common.validation',
    'auth.login',
    'errors.client'
  ],

  // Feature namespaces (lazy loaded)
  FEATURES: {
    vault: [
      'features.vault.categories',
      'features.vault.actions',
      'features.vault.sharing'
    ],
    garden: [
      'features.garden.tree',
      'features.garden.milestones',
      'features.garden.prompts'
    ],
    family: [
      'features.family.guardians',
      'features.family.emergency'
    ],
    sofia: [
      'features.sofia.personality',
      'features.sofia.guidance'
    ]
  },

  // Platform-specific namespaces
  PLATFORM: {
    web: [
      'web.landing.hero',
      'web.landing.features',
      'web.onboarding.wizard',
      'web.seo.metadata'
    ],
    mobile: [
      'mobile.native.permissions',
      'mobile.native.offline',
      'mobile.compact.summaries'
    ]
  },

  // Legal namespaces (loaded on demand)
  LEGAL: {
    terms: ['legal.terms.service', 'legal.terms.privacy'],
    templates: (country: string, type: string) =>
      `legal.templates.wills.${country}.${type}`
  }
} as const;

// Configuration object
export const i18nConfig = {
  // Default settings
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  debug: process.env.NODE_ENV === 'development',

  // Detection options
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
    checkWhitelist: true
  },

  // Backend options for loading translations
  backend: {
    // Properly map namespace to file structure
    loadPath: (lngs: string[], namespaces: string[]) => {
      const lng = lngs[0];
      const namespace = namespaces[0];

      // Map namespace to actual file path
      const parts = namespace.split('.');
      let basePath = '/locales';

      // Determine the base path based on namespace prefix
      if (parts[0] === 'common' || parts[0] === 'auth' || parts[0] === 'features' || parts[0] === 'errors' || parts[0] === 'notifications') {
        basePath = `/locales/_shared/${lng}`;
      } else if (parts[0] === 'legal') {
        basePath = `/locales/legal/${lng}`;
      } else if (parts[0] === 'web') {
        basePath = `/locales/web/${lng}`;
      } else if (parts[0] === 'mobile') {
        basePath = `/locales/mobile/${lng}`;
      }

      // Construct the file path
      const filePath = parts.slice(1).join('/');
      return `${basePath}/${parts[0]}/${filePath}.json`;
    },

    // Parse the loaded data
    parse: (data: string) => {
      return JSON.parse(data);
    }
  },

  // Interpolation options
  interpolation: {
    escapeValue: false, // React already escapes values
    format: (value: unknown, format?: string, lng?: string) => {
      if (format === 'uppercase') return value.toUpperCase();
      if (format === 'lowercase') return value.toLowerCase();
      if (format === 'capitalize') {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
      if (format === 'currency' && lng) {
        const language = SUPPORTED_LANGUAGES[lng as SupportedLanguageCode];
        return new Intl.NumberFormat(lng, {
          style: 'currency',
          currency: language.currency
        }).format(value);
      }
      if (format === 'date' && value instanceof Date) {
        return new Intl.DateTimeFormat(lng).format(value);
      }
      return value;
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

  // Resource loading
  ns: NAMESPACES.CORE,
  defaultNS: 'common.ui',

  // Language settings
  supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  load: 'languageOnly', // Ignore region codes

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

// Namespace loader utility
export class NamespaceLoader {
  private static loadedNamespaces = new Set<string>();

  static async loadFeature(feature: keyof typeof NAMESPACES.FEATURES) {
    const namespaces = NAMESPACES.FEATURES[feature];
    const toLoad = namespaces.filter(ns => !this.loadedNamespaces.has(ns));

    if (toLoad.length > 0) {
      await i18n.loadNamespaces(toLoad);
      toLoad.forEach(ns => this.loadedNamespaces.add(ns));
    }
  }

  static async loadLegalTemplate(country: string, type: 'holographic' | 'allographic') {
    const namespace = NAMESPACES.LEGAL.templates(country, type);

    if (!this.loadedNamespaces.has(namespace)) {
      await i18n.loadNamespaces([namespace]);
      this.loadedNamespaces.add(namespace);
    }
  }

  static async loadPlatformSpecific() {
    const platform = detectPlatform();
    const namespaces = NAMESPACES.PLATFORM[platform];
    const toLoad = namespaces.filter(ns => !this.loadedNamespaces.has(ns));

    if (toLoad.length > 0) {
      await i18n.loadNamespaces(toLoad);
      toLoad.forEach(ns => this.loadedNamespaces.add(ns));
    }
  }

  static isLoaded(namespace: string): boolean {
    return this.loadedNamespaces.has(namespace);
  }

  static getLoadedNamespaces(): string[] {
    return Array.from(this.loadedNamespaces);
  }
}

// Route-based namespace mapping
export const getNamespacesForRoute = (pathname: string): string[] => {
  const namespaces: string[] = [...NAMESPACES.CORE];

  // Add feature-specific namespaces based on route
  if (pathname.includes('/vault')) {
    namespaces.push(...NAMESPACES.FEATURES.vault);
  }
  if (pathname.includes('/garden') || pathname.includes('/legacy')) {
    namespaces.push(...NAMESPACES.FEATURES.garden);
  }
  if (pathname.includes('/family') || pathname.includes('/guardians')) {
    namespaces.push(...NAMESPACES.FEATURES.family);
  }
  if (pathname.includes('/sofia') || pathname.includes('/assistant')) {
    namespaces.push(...NAMESPACES.FEATURES.sofia);
  }

  // Add platform-specific namespaces
  const platform = detectPlatform();
  if (pathname === '/' && platform === 'web') {
    namespaces.push(...NAMESPACES.PLATFORM.web);
  }

  return namespaces;
};

// Initialize i18n
export const initI18n = async () => {
  await i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(i18nConfig);

  // Load platform-specific namespaces
  await NamespaceLoader.loadPlatformSpecific();

  return i18n;
};

export default i18n;
