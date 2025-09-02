/**
 * React hooks for new i18n architecture
 * Provides easy access to translations and jurisdiction-specific content
 */

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_JURISDICTIONS,
  NAMESPACES,
  NamespaceLoader,
  getContentNamespace,
  type SupportedLanguageCode,
  type SupportedJurisdictionCode,
} from './config';

// Type definitions
export interface UseTranslationReturn {
  t: (key: string, options?: any) => string;
  i18n: {
    language: SupportedLanguageCode;
    changeLanguage: (lng: SupportedLanguageCode) => Promise<void>;
    isReady: boolean;
    supportedLanguages: SupportedLanguageCode[];
  };
}

export interface UseContentNamespaceReturn {
  isLoading: boolean;
  error: Error | null;
  isLoaded: boolean;
}

export interface UseJurisdictionReturn {
  jurisdiction: SupportedJurisdictionCode;
  changeJurisdiction: (code: SupportedJurisdictionCode) => void;
  supportedJurisdictions: SupportedJurisdictionCode[];
}

/**
 * Enhanced useTranslation hook for new architecture
 */
export const useTranslation = (namespace?: string): UseTranslationReturn => {
  const { t: i18nT, i18n } = useI18nTranslation(namespace || NAMESPACES.UI);

  return {
    t: i18nT,
    i18n: {
      language: (i18n.language || 'en') as SupportedLanguageCode,
      changeLanguage: async (lng: SupportedLanguageCode) => {
        await i18n.changeLanguage(lng);
      },
      isReady: i18n.isInitialized,
      supportedLanguages: Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguageCode[],
    },
  };
};

/**
 * Hook for loading and using content namespaces (wills, family-shield)
 */
export const useContentNamespace = (
  contentType: keyof typeof NAMESPACES.CONTENT,
  language: SupportedLanguageCode,
  jurisdiction: SupportedJurisdictionCode
): UseContentNamespaceReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const namespace = useMemo(() => 
    getContentNamespace(contentType, language, jurisdiction), 
    [contentType, language, jurisdiction]
  );

  useEffect(() => {
    const loadNamespace = async () => {
      if (NamespaceLoader.isLoaded(namespace)) {
        setIsLoaded(true);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await NamespaceLoader.loadContent(contentType, language, jurisdiction);
        setIsLoaded(true);
      } catch (err) {
        setError(err as Error);
        console.error(`Failed to load content namespace for ${String(contentType)}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNamespace();
  }, [contentType, language, jurisdiction, namespace]);

  return { isLoading, error, isLoaded };
};

/**
 * Hook for managing jurisdiction
 */
export const useJurisdiction = (): UseJurisdictionReturn => {
  const [jurisdiction, setJurisdiction] = useState<SupportedJurisdictionCode>(() => {
    // Try to get from localStorage or default to SK
    const stored = localStorage.getItem('preferredJurisdiction') as SupportedJurisdictionCode;
    return stored && Object.keys(SUPPORTED_JURISDICTIONS).includes(stored) ? stored : 'SK';
  });

  const changeJurisdiction = useCallback((code: SupportedJurisdictionCode) => {
    setJurisdiction(code);
    localStorage.setItem('preferredJurisdiction', code);
  }, []);

  return {
    jurisdiction,
    changeJurisdiction,
    supportedJurisdictions: Object.keys(SUPPORTED_JURISDICTIONS) as SupportedJurisdictionCode[],
  };
};

/**
 * Hook for language formatting utilities
 */
export const useLanguageFormatting = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const languageConfig = SUPPORTED_LANGUAGES[currentLang as SupportedLanguageCode];

  const formatDate = useCallback(
    (date: Date): string => {
      if (!languageConfig) return date.toLocaleDateString();

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return languageConfig.dateFormat
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', String(year));
    },
    [languageConfig]
  );

  const formatCurrency = useCallback(
    (amount: number): string => {
      if (!languageConfig) return amount.toString();

      return new Intl.NumberFormat(currentLang, {
        style: 'currency',
        currency: languageConfig.currency,
      }).format(amount);
    },
    [languageConfig, currentLang]
  );

  return {
    formatDate,
    formatCurrency,
    language: languageConfig,
    isRTL: languageConfig?.rtl || false,
  };
};

/**
 * Hook for wills-specific content
 */
export const useWillsContent = (
  language: SupportedLanguageCode,
  jurisdiction: SupportedJurisdictionCode
) => {
  const contentNamespace = useContentNamespace('wills', language, jurisdiction);
  const { t } = useI18nTranslation(getContentNamespace('wills', language, jurisdiction));

  return {
    ...contentNamespace,
    t: contentNamespace.isLoaded ? t : () => '',
    namespace: getContentNamespace('wills', language, jurisdiction),
  };
};

/**
 * Hook for family shield content
 */
export const useFamilyShieldContent = (
  language: SupportedLanguageCode,
  jurisdiction: SupportedJurisdictionCode
) => {
  const contentNamespace = useContentNamespace('familyShield', language, jurisdiction);
  const { t } = useI18nTranslation(getContentNamespace('familyShield', language, jurisdiction));

  return {
    ...contentNamespace,
    t: contentNamespace.isLoaded ? t : () => '',
    namespace: getContentNamespace('familyShield', language, jurisdiction),
  };
};

/**
 * Hook for language switcher functionality
 */
export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const availableLanguages = useMemo(() => {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, config]) => ({
      code: code as SupportedLanguageCode,
      name: config.name,
      nativeName: config.nativeName,
      flag: config.flag,
      isActive: i18n.language === code,
    }));
  }, [i18n.language]);

  const switchLanguage = useCallback(
    async (code: SupportedLanguageCode) => {
      await i18n.changeLanguage(code);
      localStorage.setItem('i18nextLng', code);
      document.documentElement.lang = code;
    },
    [i18n]
  );

  return {
    currentLanguage: i18n.language as SupportedLanguageCode,
    availableLanguages,
    switchLanguage,
  };
};
