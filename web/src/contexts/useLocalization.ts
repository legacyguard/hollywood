import { useContext } from 'react';
import type { LocalizationContextType, CountryCode } from './localizationTypes';
import { LocalizationContext } from './LocalizationContext';

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

// Hook for country-specific content
export const useCountryContent = <T,>(
  contentMap: Record<CountryCode, T>,
  fallback?: T
): T => {
  const { countryCode } = useLocalization();
  return contentMap[countryCode] || fallback || contentMap.en;
};
