/**
 * TypeScript types for i18n system
 * Provides strong typing for translations and jurisdictions
 */

import type { NAMESPACES } from './config';
import type { JurisdictionConfig } from './jurisdictions';
import { LanguageConfig } from './languages';
import type { LegalTermCategory } from './legal-terminology';

// Namespace types
export type TranslationNamespace = typeof NAMESPACES[keyof typeof NAMESPACES];

// Language codes (ISO 639-1)
export type LanguageCode =
  | 'sq' // Albanian
  | 'bs' // Bosnian
  | 'bg' // Bulgarian
  | 'hr' // Croatian
  | 'cs' // Czech
  | 'da' // Danish
  | 'nl' // Dutch
  | 'en' // English
  | 'et' // Estonian
  | 'fi' // Finnish
  | 'fr' // French
  | 'de' // German
  | 'el' // Greek
  | 'hu' // Hungarian
  | 'is' // Icelandic
  | 'ga' // Irish Gaelic
  | 'it' // Italian
  | 'lv' // Latvian
  | 'lt' // Lithuanian
  | 'mk' // Macedonian
  | 'mt' // Maltese
  | 'me' // Montenegrin
  | 'no' // Norwegian
  | 'pl' // Polish
  | 'pt' // Portuguese
  | 'ro' // Romanian
  | 'ru' // Russian
  | 'sr' // Serbian
  | 'sk' // Slovak
  | 'sl' // Slovenian
  | 'es' // Spanish
  | 'sv' // Swedish
  | 'tr' // Turkish
  | 'uk'; // Ukrainian

// Jurisdiction codes (ISO 3166-1 alpha-2)
export type JurisdictionCode =
  | 'DE' | 'CZ' | 'SK' | 'FR' | 'ES' | 'IT' | 'NL' | 'BE' | 'LU' | 'CH'
  | 'LI' | 'AT' | 'UK' | 'DK' | 'SE' | 'FI' | 'PT' | 'GR' | 'PL' | 'HU'
  | 'SI' | 'EE' | 'LV' | 'LT' | 'MT' | 'CY' | 'IE' | 'NO' | 'IS' | 'RO'
  | 'BG' | 'HR' | 'RS' | 'AL' | 'MK' | 'ME' | 'MD' | 'UA' | 'BA';

// Translation key structure
export interface TranslationKeys {
  // Common namespace
  common: {
    app: {
      name: string;
      tagline: string;
      version: string;
    };
    actions: {
      save: string;
      cancel: string;
      delete: string;
      edit: string;
      create: string;
      update: string;
      confirm: string;
      back: string;
      next: string;
      finish: string;
      close: string;
      search: string;
      filter: string;
      sort: string;
      upload: string;
      download: string;
      print: string;
      share: string;
      copy: string;
    };
    status: {
      loading: string;
      success: string;
      error: string;
      warning: string;
      info: string;
      pending: string;
      completed: string;
      archived: string;
      active: string;
      inactive: string;
    };
    validation: {
      required: string;
      invalid: string;
      tooShort: string;
      tooLong: string;
      invalidEmail: string;
      invalidPhone: string;
      invalidDate: string;
      invalidFormat: string;
    };
    time: {
      today: string;
      yesterday: string;
      tomorrow: string;
      thisWeek: string;
      lastWeek: string;
      nextWeek: string;
      thisMonth: string;
      lastMonth: string;
      nextMonth: string;
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
  };

  // Auth namespace
  auth: {
    signIn: {
      title: string;
      email: string;
      password: string;
      submit: string;
      forgotPassword: string;
      noAccount: string;
      signUp: string;
      or: string;
      continueWith: string;
    };
    signUp: {
      title: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      submit: string;
      hasAccount: string;
      signIn: string;
      terms: string;
      privacy: string;
    };
    signOut: {
      title: string;
      message: string;
      confirm: string;
    };
    errors: {
      invalidCredentials: string;
      userNotFound: string;
      emailInUse: string;
      weakPassword: string;
      tooManyRequests: string;
      networkError: string;
    };
  };

  // Dashboard namespace
  dashboard: {
    title: string;
    welcome: string;
    overview: {
      title: string;
      documentsProtected: string;
      familyMembers: string;
      guardians: string;
      daysProtected: string;
      completionRate: string;
    };
    quickActions: {
      title: string;
      uploadDocument: string;
      addFamilyMember: string;
      createWill: string;
      setupGuardian: string;
    };
    recentActivity: {
      title: string;
      noActivity: string;
      viewAll: string;
    };
    alerts: {
      title: string;
      noAlerts: string;
      expiringSoon: string;
      actionRequired: string;
      updateAvailable: string;
    };
  };

  // Legal namespace with jurisdiction-specific terms
  legal: {
    terms: {
      [K in keyof typeof LegalTermCategory]: string;
    };
    documents: {
      will: string;
      powerOfAttorney: string;
      advanceDirective: string;
      trustDocument: string;
      beneficiaryDesignation: string;
    };
    procedures: {
      probate: string;
      notarization: string;
      witnessing: string;
      registration: string;
      certification: string;
    };
  };

  // Will namespace
  will: {
    create: {
      title: string;
      intro: string;
      personal: {
        title: string;
        fullName: string;
        dateOfBirth: string;
        nationality: string;
        address: string;
        maritalStatus: string;
      };
      beneficiaries: {
        title: string;
        add: string;
        name: string;
        relationship: string;
        share: string;
        specific: string;
      };
      executor: {
        title: string;
        name: string;
        relationship: string;
        alternativeExecutor: string;
      };
      witnesses: {
        title: string;
        requirements: string;
        witness1: string;
        witness2: string;
      };
      review: {
        title: string;
        checkInfo: string;
        sign: string;
        download: string;
      };
    };
    validation: {
      ageRequirement: string;
      capacityRequirement: string;
      witnessRequirement: string;
      notaryRequirement: string;
    };
  };

  // Other namespaces...
  documents: Record<string, any>;
  guardians: Record<string, any>;
  family: Record<string, any>;
  vault: Record<string, any>;
  notifications: Record<string, any>;
  settings: Record<string, any>;
  errors: Record<string, any>;
  onboarding: Record<string, any>;
  legacy: Record<string, any>;
  emergency: Record<string, any>;
  ai: Record<string, any>;
  legalTerms: Record<string, any>;
  legalDocuments: Record<string, any>;
  legalProcedures: Record<string, any>;
  taxTerms: Record<string, any>;
  notaryTerms: Record<string, any>;
}

// Translation function types
export type TFunction = (
  key: string,
  options?: TranslationOptions
) => string;

export interface TranslationOptions {
  ns?: TranslationNamespace;
  lng?: LanguageCode;
  jurisdiction?: JurisdictionCode;
  count?: number;
  context?: string;
  defaultValue?: string;
  replace?: Record<string, string | number>;
  returnObjects?: boolean;
}

// i18n configuration types
export interface I18nConfig {
  jurisdiction: JurisdictionCode;
  language: LanguageCode;
  supportedLanguages: LanguageCode[];
  namespaces: TranslationNamespace[];
  fallbackLanguage: LanguageCode;
}

// Translation resource structure
export interface TranslationResource {
  [language: string]: {
    [namespace: string]: TranslationKeys[keyof TranslationKeys];
  };
}

// Jurisdiction-specific translation overrides
export interface JurisdictionTranslationOverride {
  jurisdiction: JurisdictionCode;
  language: LanguageCode;
  namespace: TranslationNamespace;
  overrides: Partial<TranslationKeys[keyof TranslationKeys]>;
}

// Export helper types
export type ExtractNamespaceKeys<T extends TranslationNamespace> =
  T extends keyof TranslationKeys ? TranslationKeys[T] : never;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Hook return types
export interface UseTranslationReturn {
  t: TFunction;
  i18n: {
    language: LanguageCode;
    jurisdiction: JurisdictionCode;
    changeLanguage: (lng: LanguageCode) => Promise<void>;
    languages: LanguageCode[];
    supportedLanguages: LanguageCode[];
    isReady: boolean;
  };
}

export interface UseJurisdictionReturn {
  jurisdiction: JurisdictionConfig;
  changeJurisdiction: (code: JurisdictionCode) => void;
  supportedLanguages: LanguageCode[];
  legalSystem: string;
  currency: string;
  tier: 1 | 2;
}

export interface UseLegalTermReturn {
  getTerm: (key: string) => string;
  getDefinition: (key: string) => string | undefined;
  getReference: (key: string) => string | undefined;
  searchTerms: (query: string, category?: LegalTermCategory) => Array<{
    key: string;
    term: string;
    definition?: string;
  }>;
}
