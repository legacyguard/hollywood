/**
 * i18n TypeScript Types and Helpers
 * Type-safe internationalization utilities
 */

import type { TFunction } from 'i18next';
import { SUPPORTED_LANGUAGES, NAMESPACES } from './config';

// Language codes
export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Namespace types
export type CoreNamespace = typeof NAMESPACES.CORE[number];
export type FeatureNamespace =
  | typeof NAMESPACES.FEATURES.vault[number]
  | typeof NAMESPACES.FEATURES.garden[number]
  | typeof NAMESPACES.FEATURES.family[number]
  | typeof NAMESPACES.FEATURES.sofia[number];
export type WebNamespace = typeof NAMESPACES.PLATFORM.web[number];
export type MobileNamespace = typeof NAMESPACES.PLATFORM.mobile[number];
export type LegalNamespace = typeof NAMESPACES.LEGAL.terms[number] | string;

export type AllNamespaces = CoreNamespace | FeatureNamespace | WebNamespace | MobileNamespace | LegalNamespace;

// Translation key structure
export interface TranslationKeys {
  // Common UI
  'common.ui': {
    button: {
      save: string;
      cancel: string;
      delete: string;
      edit: string;
      add: string;
      remove: string;
      submit: string;
      back: string;
      next: string;
      finish: string;
      close: string;
      confirm: string;
      retry: string;
      refresh: string;
      download: string;
      upload: string;
      copy: string;
      share: string;
      search: string;
      filter: string;
      sort: string;
      export: string;
      import: string;
      print: string;
      select: string;
      selectAll: string;
      deselectAll: string;
      expand: string;
      collapse: string;
      more: string;
      less: string;
      loading: string;
    };
    label: {
      email: string;
      password: string;
      name: string;
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      zipCode: string;
      date: string;
      time: string;
      description: string;
      title: string;
      status: string;
      type: string;
      category: string;
      tags: string;
      notes: string;
      optional: string;
      required: string;
      search: string;
      filter: string;
      sortBy: string;
      language: string;
      theme: string;
      notifications: string;
      privacy: string;
      security: string;
      settings: string;
      profile: string;
      account: string;
      preferences: string;
    };
    message: {
      loading: string;
      saving: string;
      saved: string;
      deleting: string;
      deleted: string;
      updating: string;
      updated: string;
      creating: string;
      created: string;
      sending: string;
      sent: string;
      copying: string;
      copied: string;
      uploading: string;
      uploaded: string;
      downloading: string;
      downloaded: string;
      processing: string;
      processed: string;
      success: string;
      error: string;
      warning: string;
      info: string;
      noData: string;
      noResults: string;
      confirmDelete: string;
      confirmCancel: string;
      unsavedChanges: string;
      areYouSure: string;
    };
    time: {
      now: string;
      today: string;
      yesterday: string;
      tomorrow: string;
      thisWeek: string;
      lastWeek: string;
      nextWeek: string;
      thisMonth: string;
      lastMonth: string;
      nextMonth: string;
      thisYear: string;
      lastYear: string;
      nextYear: string;
      seconds: string;
      minutes: string;
      hours: string;
      days: string;
      weeks: string;
      months: string;
      years: string;
      ago: string;
      in: string;
      remaining: string;
      elapsed: string;
    };
  };

  // Auth
  'auth.login': {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    signIn: string;
    signUp: string;
    or: string;
    continueWith: string;
    google: string;
    facebook: string;
    apple: string;
    noAccount: string;
    createAccount: string;
    errors: {
      invalidCredentials: string;
      userNotFound: string;
      wrongPassword: string;
      tooManyAttempts: string;
      accountLocked: string;
      emailNotVerified: string;
      networkError: string;
    };
  };

  // Features - Vault
  'features.vault.categories': {
    all: string;
    documents: string;
    financial: string;
    medical: string;
    personal: string;
    passwords: string;
    notes: string;
    cards: string;
    identities: string;
    custom: string;
  };

  // Add more namespace definitions as needed...
}

// Type-safe translation function
export type TypedTFunction<NS extends AllNamespaces = AllNamespaces> =
  NS extends keyof TranslationKeys ? TFunction<NS, TranslationKeys[NS]> : TFunction;

// Translation interpolation values
export interface InterpolationValues {
  [key: string]: string | number | boolean | Date | undefined | null;
}

// Pluralization rules
export interface PluralizationRule {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

// Date formatting options
export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full';
  timezone?: string;
  relative?: boolean;
}

// Number formatting options
export interface NumberFormatOptions {
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
}

// Translation metadata
export interface TranslationMetadata {
  key: string;
  namespace: string;
  language: string;
  lastModified?: Date;
  author?: string;
  reviewed?: boolean;
  context?: string;
  maxLength?: number;
  tags?: string[];
}

// Helper class for type-safe translations
export class TranslationHelper {
  /**
   * Generate a type-safe translation key
   */
  static key<NS extends keyof TranslationKeys>(
    namespace: NS,
    ...keys: string[]
  ): string {
    return `${namespace}.${keys.join('.')}`;
  }

  /**
   * Check if a translation exists
   */
  static exists(): boolean {
    // Implementation would check i18n.exists
    // TODO: Implement with actual key and namespace checking
    return true; // Placeholder
  }

  /**
   * Format a date according to locale
   */
  static formatDate(
    date: Date | string | number,
    language: LanguageCode,
    options?: DateFormatOptions
  ): string {
    const d = date instanceof Date ? date : new Date(date);
    const locale = SUPPORTED_LANGUAGES[language].code;

    if (options?.relative) {
      return this.getRelativeTime(d, language);
    }

    const formatOptions: Intl.DateTimeFormatOptions = {};

    switch (options?.format) {
      case 'short':
        formatOptions.dateStyle = 'short';
        break;
      case 'medium':
        formatOptions.dateStyle = 'medium';
        break;
      case 'long':
        formatOptions.dateStyle = 'long';
        break;
      case 'full':
        formatOptions.dateStyle = 'full';
        break;
      default:
        formatOptions.dateStyle = 'medium';
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(d);
  }

  /**
   * Format a number according to locale
   */
  static formatNumber(
    value: number,
    language: LanguageCode,
    options?: NumberFormatOptions
  ): string {
    const locale = SUPPORTED_LANGUAGES[language].code;
    const currency = options?.currency || SUPPORTED_LANGUAGES[language].currency;

    const formatOptions: Intl.NumberFormatOptions = {
      style: options?.style || 'decimal',
      currency: options?.style === 'currency' ? currency : undefined,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      useGrouping: options?.useGrouping ?? true
    };

    return new Intl.NumberFormat(locale, formatOptions).format(value);
  }

  /**
   * Get relative time string
   */
  private static getRelativeTime(date: Date, language: LanguageCode): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const rtf = new Intl.RelativeTimeFormat(SUPPORTED_LANGUAGES[language].code, {
      numeric: 'auto'
    });

    if (Math.abs(diffInDays) >= 365) {
      return rtf.format(-Math.floor(diffInDays / 365), 'year');
    }
    if (Math.abs(diffInDays) >= 30) {
      return rtf.format(-Math.floor(diffInDays / 30), 'month');
    }
    if (Math.abs(diffInDays) >= 7) {
      return rtf.format(-Math.floor(diffInDays / 7), 'week');
    }
    if (Math.abs(diffInDays) >= 1) {
      return rtf.format(-diffInDays, 'day');
    }
    if (Math.abs(diffInHours) >= 1) {
      return rtf.format(-diffInHours, 'hour');
    }
    if (Math.abs(diffInMinutes) >= 1) {
      return rtf.format(-diffInMinutes, 'minute');
    }

    return rtf.format(-diffInSeconds, 'second');
  }

  /**
   * Validate translation completeness
   */
  static validateTranslations(): { missing: string[]; incomplete: string[] } {
    const missing: string[] = [];
    const incomplete: string[] = [];

    // TODO: Implement actual validation with namespace and language parameters
    // Implementation would check actual translation files
    // This is a placeholder

    return { missing, incomplete };
  }

  /**
   * Generate translation statistics
   */
  static getStatistics(): {
    total: number;
    translated: number;
    untranslated: number;
    percentage: number;
  } {
    // Implementation would analyze actual translation files
    // This is a placeholder

    return {
      total: 100,
      translated: 85,
      untranslated: 15,
      percentage: 85
    };
  }
}

// React hooks types
export interface UseTranslationResponse<NS extends AllNamespaces = AllNamespaces> {
  t: TypedTFunction<NS>;
  i18n: {
    language: LanguageCode;
    changeLanguage: (lng: LanguageCode) => Promise<void>;
    languages: LanguageCode[];
    isReady: boolean;
  };
  ready: boolean;
}

// Custom hook return types
export interface UseNamespaceLoadingState {
  isLoading: boolean;
  error: Error | null;
  isLoaded: boolean;
}

// Translation validation rules
export interface ValidationRule {
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  required?: boolean;
  customValidator?: (value: string) => boolean | string;
}

// Translation context for components
export interface TranslationContext {
  namespace: AllNamespaces;
  language: LanguageCode;
  fallbackLanguage: LanguageCode;
  missingKeyHandler?: (key: string) => void;
}

export default TranslationHelper;
