/**
 * i18n Configuration for LegacyGuard
 * Supports 34+ languages and 40 jurisdictions
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { JURISDICTION_CONFIG } from './jurisdictions';
import { LANGUAGE_CONFIG } from './languages';

// Get current domain/jurisdiction
export const getCurrentJurisdiction = () => {
  const hostname = window.location.hostname;
  const domain = hostname.split('.').slice(-2).join('.');

  // Map domain to jurisdiction code
  const jurisdictionMap: Record<string, string> = {
    'legacyguard.de': 'DE',
    'legacyguard.fr': 'FR',
    'legacyguard.es': 'ES',
    'legacyguard.it': 'IT',
    'legacyguard.nl': 'NL',
    'legacyguard.be': 'BE',
    'legacyguard.lu': 'LU',
    'legacyguard.ch': 'CH',
    'legacyguard.li': 'LI',
    'legacyguard.at': 'AT',
    'legacyguard.uk': 'UK',
    'legacyguard.dk': 'DK',
    'legacyguard.se': 'SE',
    'legacyguard.fi': 'FI',
    'legacyguard.cz': 'CZ',
    'legacyguard.sk': 'SK',
    'legacyguard.pl': 'PL',
    'legacyguard.hu': 'HU',
    'legacyguard.si': 'SI',
    'legacyguard.ee': 'EE',
    'legacyguard.lv': 'LV',
    'legacyguard.lt': 'LT',
    'legacyguard.pt': 'PT',
    'legacyguard.gr': 'GR',
    'legacyguard.mt': 'MT',
    'legacyguard.cy': 'CY',
    'legacyguard.ie': 'IE',
    'legacyguard.no': 'NO',
    'legacyguard.is': 'IS',
    // Tier 2 markets
    'legacyguard.ro': 'RO',
    'legacyguard.bg': 'BG',
    'legacyguard.hr': 'HR',
    'legacyguard.rs': 'RS',
    'legacyguard.al': 'AL',
    'legacyguard.mk': 'MK',
    'legacyguard.me': 'ME',
    'legacyguard.md': 'MD',
    'legacyguard.ua': 'UA',
    'legacyguard.ba': 'BA',
  };

  // Default to Czech for development
  return jurisdictionMap[domain] || process.env.VITE_DEFAULT_JURISDICTION || 'CZ';
};

// Get supported languages for current jurisdiction
export const getSupportedLanguages = (jurisdiction?: string) => {
  const currentJurisdiction = jurisdiction || getCurrentJurisdiction();
  return JURISDICTION_CONFIG[currentJurisdiction]?.supportedLanguages || ['en'];
};

// Get default language for current jurisdiction
export const getDefaultLanguage = (jurisdiction?: string) => {
  const currentJurisdiction = jurisdiction || getCurrentJurisdiction();
  return JURISDICTION_CONFIG[currentJurisdiction]?.defaultLanguage || 'en';
};

// Namespaces for modular translation organization
export const NAMESPACES = {
  common: 'common',
  auth: 'auth',
  dashboard: 'dashboard',
  documents: 'documents',
  legal: 'legal',
  will: 'will',
  guardians: 'guardians',
  family: 'family',
  vault: 'vault',
  notifications: 'notifications',
  settings: 'settings',
  errors: 'errors',
  onboarding: 'onboarding',
  legacy: 'legacy',
  emergency: 'emergency',
  ai: 'ai',
  // Legal terminology namespaces
  legalTerms: 'legalTerms',
  legalDocuments: 'legalDocuments',
  legalProcedures: 'legalProcedures',
  taxTerms: 'taxTerms',
  notaryTerms: 'notaryTerms',
} as const;

export type Namespace = keyof typeof NAMESPACES;

// i18n configuration
const i18nConfig = {
  // Fallback language
  fallbackLng: 'en',

  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',

  // Namespaces
  ns: Object.values(NAMESPACES),
  defaultNS: NAMESPACES.common,

  // Interpolation settings
  interpolation: {
    escapeValue: false, // React already escapes values
    format: (value: any, format?: string, lng?: string) => {
      // Date formatting
      if (format === 'date' && value instanceof Date) {
        return new Intl.DateTimeFormat(lng).format(value);
      }

      // Currency formatting based on jurisdiction
      if (format === 'currency' && typeof value === 'number') {
        const jurisdiction = getCurrentJurisdiction();
        const currency = JURISDICTION_CONFIG[jurisdiction]?.currency || 'EUR';
        return new Intl.NumberFormat(lng, {
          style: 'currency',
          currency,
        }).format(value);
      }

      // Legal date formatting (jurisdiction-specific)
      if (format === 'legalDate' && value instanceof Date) {
        const jurisdiction = getCurrentJurisdiction();
        const locale = JURISDICTION_CONFIG[jurisdiction]?.dateLocale || lng;
        return new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(value);
      }

      return value;
    },
  },

  // Detection settings
  detection: {
    // Order of detection methods
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],

    // Keys to look for
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',

    // Cache user language
    caches: ['localStorage', 'cookie'],

    // Check if language is whitelisted for current jurisdiction
    checkWhitelist: true,
  },

  // Backend settings for lazy loading
  backend: {
    // Path to translation files
    loadPath: '/locales/{{lng}}/{{ns}}.json',

    // Add jurisdiction-specific overrides
    addPath: '/locales/{{lng}}/{{ns}}.missing.json',

    // Allow cross-domain loading for different jurisdictions
    crossDomain: true,

    // Custom loader for jurisdiction-specific translations
    request: async (options: any, url: string, payload: any, callback: any) => {
      try {
        const jurisdiction = getCurrentJurisdiction();

        // Try to load jurisdiction-specific translation first
        const jurisdictionUrl = url.replace('/locales/', `/locales/${jurisdiction}/`);

        const response = await fetch(jurisdictionUrl);
        if (response.ok) {
          const data = await response.json();
          callback(null, { status: 200, data });
          return;
        }

        // Fallback to general translation
        const generalResponse = await fetch(url);
        if (generalResponse.ok) {
          const data = await generalResponse.json();
          callback(null, { status: 200, data });
        } else {
          callback(new Error(`Failed to load ${url}`), null);
        }
      } catch (error) {
        callback(error, null);
      }
    },
  },

  // React specific settings
  react: {
    useSuspense: true, // Use React Suspense for loading
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '', // How to handle empty trans nodes
    transSupportBasicHtmlNodes: true, // Allow basic HTML in translations
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'b', 'u', 'em'],
  },

  // Custom options
  saveMissing: process.env.NODE_ENV === 'development',
  missingKeyHandler: (lng: string[], ns: string, key: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation: [${lng.join(', ')}] ${ns}:${key}`);
    }
  },

  // Jurisdiction-specific settings
  contextSeparator: '_',
  pluralSeparator: '_',
  keySeparator: '.',
  nsSeparator: ':',
};

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    lng: getDefaultLanguage(),
    whitelist: getSupportedLanguages(),
    load: 'languageOnly', // Don't load region-specific variants by default
  });

// Function to load jurisdiction-specific legal translations
export const loadLegalTranslations = async (jurisdiction: string, language: string) => {
  const namespaces = [
    NAMESPACES.legalTerms,
    NAMESPACES.legalDocuments,
    NAMESPACES.legalProcedures,
    NAMESPACES.taxTerms,
    NAMESPACES.notaryTerms,
  ];

  for (const ns of namespaces) {
    try {
      const response = await fetch(`/locales/${jurisdiction}/${language}/${ns}.json`);
      if (response.ok) {
        const translations = await response.json();
        i18n.addResourceBundle(language, ns, translations, true, true);
      }
    } catch (error) {
      console.error(`Failed to load legal translations for ${jurisdiction}/${language}/${ns}:`, error);
    }
  }
};

// Helper function to get translation with jurisdiction context
export const getJurisdictionTranslation = (
  key: string,
  options?: any
) => {
  const jurisdiction = getCurrentJurisdiction();
  const jurisdictionKey = `${key}_${jurisdiction}`;

  // Try jurisdiction-specific translation first
  if (i18n.exists(jurisdictionKey)) {
    return i18n.t(jurisdictionKey, options);
  }

  // Fallback to general translation
  return i18n.t(key, options);
};

// Export configured i18n instance
export default i18n;
