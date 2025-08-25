/**
 * i18n System for LegacyGuard
 * Main export file for internationalization
 */

// Core exports
export { default as i18n, NAMESPACES, getCurrentJurisdiction, getSupportedLanguages, getDefaultLanguage, loadLegalTranslations, getJurisdictionTranslation } from './config';
export { JURISDICTION_CONFIG, getJurisdictionByDomain, getJurisdictionsByTier, getJurisdictionsByLanguage, getAllJurisdictions } from './jurisdictions';
export { LANGUAGE_CONFIG, getLanguageConfig, getLanguagesByScript, getRTLLanguages, formatDate, formatNumber, formatCurrency } from './languages';
export { LegalTermCategory, LEGAL_TERMS_DATABASE, getLegalTerm, getLegalDefinition, getLegalReference, getRelatedLegalTerms, searchLegalTerms, getLegalTermsByCategory } from './legal-terminology';

// Type exports
export type {
  TranslationNamespace,
  LanguageCode,
  JurisdictionCode,
  TranslationKeys,
  TFunction,
  TranslationOptions,
  I18nConfig,
  TranslationResource,
  JurisdictionTranslationOverride,
  ExtractNamespaceKeys,
  DeepPartial,
  UseTranslationReturn,
  UseJurisdictionReturn,
  UseLegalTermReturn,
} from './types';

export type { JurisdictionConfig } from './jurisdictions';
export type { LanguageConfig } from './languages';
export type { LegalTerm } from './legal-terminology';

// Re-export hooks (will be created in separate file)
export { useTranslation, useJurisdiction, useLegalTerm, useLanguage } from './hooks';
