/**
 * React hooks for i18n system
 * Provides easy access to translations and jurisdiction-specific content
 */

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCurrentJurisdiction,
  getSupportedLanguages,
  getDefaultLanguage,
  loadLegalTranslations,
  getJurisdictionTranslation,
} from './config';
import { JURISDICTION_CONFIG } from './jurisdictions';
import { LANGUAGE_CONFIG } from './languages';
import type {
  LegalTermCategory} from './legal-terminology';
import {
  getLegalTerm,
  getLegalDefinition,
  getLegalReference,
  searchLegalTerms
} from './legal-terminology';
import type {
  LanguageCode,
  JurisdictionCode,
  TranslationNamespace,
  UseTranslationReturn,
  UseJurisdictionReturn,
  UseLegalTermReturn,
  TFunction,
} from './types';

/**
 * Enhanced useTranslation hook with jurisdiction support
 */
export const useTranslation = (
  namespace?: TranslationNamespace | TranslationNamespace[]
): UseTranslationReturn => {
  const { t: i18nT, i18n } = useI18nTranslation(namespace);
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode>(getCurrentJurisdiction());

  // Load legal translations when jurisdiction or language changes
  useEffect(() => {
    const loadTranslations = async () => {
      if (i18n.language && jurisdiction) {
        await loadLegalTranslations(jurisdiction, i18n.language);
      }
    };
    loadTranslations();
  }, [jurisdiction, i18n.language]);

  // Enhanced translation function with jurisdiction support
  const t: TFunction = useCallback((key: string, options?: any) => {
    // Try jurisdiction-specific translation first
    const jurisdictionKey = `${key}_${jurisdiction}`;
    if (i18n.exists(jurisdictionKey)) {
      return i18nT(jurisdictionKey, options);
    }

    // Fallback to general translation
    return i18nT(key, options);
  }, [i18nT, jurisdiction]);

  return {
    t,
    i18n: {
      language: i18n.language as LanguageCode,
      jurisdiction,
      changeLanguage: async (lng: LanguageCode) => {
        await i18n.changeLanguage(lng);
      },
      languages: i18n.languages as LanguageCode[],
      supportedLanguages: getSupportedLanguages(jurisdiction) as LanguageCode[],
      isReady: i18n.isInitialized,
    },
  };
};

/**
 * Hook for jurisdiction-specific functionality
 */
export const useJurisdiction = (): UseJurisdictionReturn => {
  const [jurisdictionCode, setJurisdictionCode] = useState<JurisdictionCode>(getCurrentJurisdiction());
  const jurisdiction = JURISDICTION_CONFIG[jurisdictionCode];

  const changeJurisdiction = useCallback((code: JurisdictionCode) => {
    setJurisdictionCode(code);
    // Update URL or state management as needed
    // This would typically be handled by routing in a real app
  }, []);

  return {
    jurisdiction,
    changeJurisdiction,
    supportedLanguages: jurisdiction.supportedLanguages as LanguageCode[],
    legalSystem: jurisdiction.legalSystem,
    currency: jurisdiction.currency,
    tier: jurisdiction.tier,
  };
};

/**
 * Hook for legal terminology
 */
export const useLegalTerm = (): UseLegalTermReturn => {
  const { jurisdiction } = useJurisdiction();
  const { i18n } = useTranslation();

  const getTerm = useCallback((key: string) => {
    return getLegalTerm(key, jurisdiction.code, i18n.language);
  }, [jurisdiction.code, i18n.language]);

  const getDefinition = useCallback((key: string) => {
    return getLegalDefinition(key, jurisdiction.code);
  }, [jurisdiction.code]);

  const getReference = useCallback((key: string) => {
    return getLegalReference(key, jurisdiction.code);
  }, [jurisdiction.code]);

  const searchTerms = useCallback((query: string, category?: LegalTermCategory) => {
    const results = searchLegalTerms(query, jurisdiction.code, category);
    return results.map(term => ({
      key: term.key,
      term: term.jurisdictions[jurisdiction.code]?.term || term.key,
      definition: term.jurisdictions[jurisdiction.code]?.definition,
    }));
  }, [jurisdiction.code]);

  return {
    getTerm,
    getDefinition,
    getReference,
    searchTerms,
  };
};

/**
 * Hook for language-specific formatting
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();
  const languageConfig = LANGUAGE_CONFIG[i18n.language];

  const formatDate = useCallback((date: Date): string => {
    if (!languageConfig) return date.toLocaleDateString();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return languageConfig.dateFormat
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', String(year));
  }, [languageConfig]);

  const formatTime = useCallback((date: Date): string => {
    if (!languageConfig) return date.toLocaleTimeString();

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (languageConfig.timeFormat === 'HH:mm') {
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    } else {
      // 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${period}`;
    }
  }, [languageConfig]);

  const formatNumber = useCallback((num: number, decimals: number = 2): string => {
    if (!languageConfig) return num.toLocaleString();

    const parts = num.toFixed(decimals).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, languageConfig.thousandsSeparator);
    const decimalPart = parts[1];

    if (decimals > 0 && decimalPart) {
      return `${integerPart}${languageConfig.decimalSeparator}${decimalPart}`;
    }
    return integerPart;
  }, [languageConfig]);

  const formatCurrency = useCallback((amount: number, currency: string): string => {
    if (!languageConfig) return `${currency} ${amount}`;

    const formattedAmount = formatNumber(amount, 2);

    if (languageConfig.currencyPosition === 'before') {
      return `${currency} ${formattedAmount}`;
    } else {
      return `${formattedAmount} ${currency}`;
    }
  }, [languageConfig, formatNumber]);

  return {
    language: i18n.language as LanguageCode,
    direction: languageConfig?.direction || 'ltr',
    script: languageConfig?.script || 'Latin',
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    nativeName: languageConfig?.nativeName || i18n.language,
  };
};

/**
 * Hook for language switcher component
 */
export const useLanguageSwitcher = () => {
  const { i18n, jurisdiction } = useTranslation();
  const supportedLanguages = getSupportedLanguages(jurisdiction);

  const availableLanguages = useMemo(() => {
    return supportedLanguages.map(code => ({
      code: code as LanguageCode,
      name: LANGUAGE_CONFIG[code]?.name || code,
      nativeName: LANGUAGE_CONFIG[code]?.nativeName || code,
      isActive: i18n.language === code,
    }));
  }, [supportedLanguages, i18n.language]);

  const switchLanguage = useCallback(async (code: LanguageCode) => {
    await i18n.changeLanguage(code);
    // Store preference
    localStorage.setItem('preferredLanguage', code);
  }, [i18n]);

  return {
    currentLanguage: i18n.language as LanguageCode,
    availableLanguages,
    switchLanguage,
  };
};

/**
 * Hook for jurisdiction switcher component
 */
export const useJurisdictionSwitcher = () => {
  const { jurisdiction, changeJurisdiction } = useJurisdiction();
  const { tier } = jurisdiction;

  const availableJurisdictions = useMemo(() => {
    return Object.values(JURISDICTION_CONFIG)
      .filter(j => j.tier === tier) // Only show same tier jurisdictions
      .map(j => ({
        code: j.code as JurisdictionCode,
        name: j.name,
        domain: j.domain,
        isActive: j.code === jurisdiction.code,
      }));
  }, [jurisdiction.code, tier]);

  const switchJurisdiction = useCallback((code: JurisdictionCode) => {
    const newJurisdiction = JURISDICTION_CONFIG[code];
    if (newJurisdiction) {
      // In production, this would redirect to the new domain
      changeJurisdiction(code);
      // Store preference
      localStorage.setItem('preferredJurisdiction', code);
    }
  }, [changeJurisdiction]);

  return {
    currentJurisdiction: jurisdiction.code as JurisdictionCode,
    availableJurisdictions,
    switchJurisdiction,
  };
};
