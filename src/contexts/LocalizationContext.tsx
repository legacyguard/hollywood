import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type CountryCode = 'sk' | 'cz' | 'en';
export type LanguageCode = 'sk' | 'cs' | 'en';

interface LocalizationState {
  countryCode: CountryCode;
  languageCode: LanguageCode;
  jurisdiction: string;
  currency: string;
}

interface LocalizationContextType extends LocalizationState {
  setCountryCode: (code: CountryCode) => void;
  setLanguageCode: (code: LanguageCode) => void;
  isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
);

interface LocalizationProviderProps {
  children: ReactNode;
}

const COUNTRY_MAPPINGS: Record<CountryCode, LocalizationState> = {
  sk: {
    countryCode: 'sk',
    languageCode: 'sk',
    jurisdiction: 'Slovakia',
    currency: 'EUR',
  },
  cz: {
    countryCode: 'cz',
    languageCode: 'cs',
    jurisdiction: 'Czech Republic',
    currency: 'CZK',
  },
  en: {
    countryCode: 'en',
    languageCode: 'en',
    jurisdiction: 'General (English)',
    currency: 'USD',
  },
};

const detectCountryFromDomain = (): CountryCode => {
  if (typeof window === 'undefined') return 'en';

  const hostname = window.location.hostname.toLowerCase();

  // Check for country-specific domains
  if (hostname.includes('legacyguard.sk') || hostname.endsWith('.sk')) {
    return 'sk';
  }
  if (hostname.includes('legacyguard.cz') || hostname.endsWith('.cz')) {
    return 'cz';
  }

  // Check for development/staging patterns
  if (hostname.includes('slovakia') || hostname.includes('sk-')) {
    return 'sk';
  }
  if (hostname.includes('czech') || hostname.includes('cz-')) {
    return 'cz';
  }

  // Default to English for development and unknown domains
  return 'en';
};

const detectCountryFromGeolocation = async (): Promise<CountryCode> => {
  try {
    // Simple IP-based country detection
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    const countryCode = data.country_code?.toLowerCase();
    if (countryCode === 'sk') return 'sk';
    if (countryCode === 'cz') return 'cz';

    return 'en';
  } catch (error) {
    console.log('Geolocation detection failed, using default');
    return 'en';
  }
};

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<LocalizationState>(COUNTRY_MAPPINGS.en);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLocalization = async () => {
      // First try domain detection (fastest and most reliable)
      let detectedCountry = detectCountryFromDomain();

      // If no specific domain match, try geolocation as fallback
      if (detectedCountry === 'en' && typeof window !== 'undefined') {
        const geoCountry = await detectCountryFromGeolocation();
        if (geoCountry !== 'en') {
          detectedCountry = geoCountry;
        }
      }

      // Check if user has previously selected a different country
      const savedCountry = localStorage.getItem(
        'legacyguard-country'
      ) as CountryCode;
      if (savedCountry && COUNTRY_MAPPINGS[savedCountry]) {
        detectedCountry = savedCountry;
      }

      setState(COUNTRY_MAPPINGS[detectedCountry]);
      setIsLoading(false);
    };

    initializeLocalization();
  }, []);

  const setCountryCode = (code: CountryCode) => {
    const newState = COUNTRY_MAPPINGS[code];
    setState(newState);
    localStorage.setItem('legacyguard-country', code);
  };

  const setLanguageCode = (code: LanguageCode) => {
    setState(prev => ({ ...prev, languageCode: code }));
  };

  const contextValue: LocalizationContextType = {
    ...state,
    setCountryCode,
    setLanguageCode,
    isLoading,
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error(
      'useLocalization must be used within a LocalizationProvider'
    );
  }
  return context;
};

// Hook for loading country-specific content
export const useCountryContent = <T,>(
  contentType: 'legal_info' | 'wizard_steps' | 'will_template'
) => {
  const { countryCode } = useLocalization();
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (contentType === 'will_template') {
          // For markdown templates, we'll need special handling
          const response = await fetch(
            `/src/content/legacy/${countryCode}/will_template.md`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status}`);
          }
          const text = await response.text();
          setContent(text as T);
        } else {
          // For JSON files, use dynamic imports
          let module;
          if (countryCode === 'sk' && contentType === 'legal_info') {
            module = await import('../content/legacy/sk/legal_info.json');
          } else if (countryCode === 'sk' && contentType === 'wizard_steps') {
            module = await import('../content/legacy/sk/wizard_steps.json');
          } else if (countryCode === 'cz' && contentType === 'legal_info') {
            module = await import('../content/legacy/cz/legal_info.json');
          } else if (countryCode === 'cz' && contentType === 'wizard_steps') {
            module = await import('../content/legacy/cz/wizard_steps.json');
          } else if (countryCode === 'en' && contentType === 'legal_info') {
            module = await import('../content/legacy/en/legal_info.json');
          } else if (countryCode === 'en' && contentType === 'wizard_steps') {
            module = await import('../content/legacy/en/wizard_steps.json');
          } else {
            throw new Error(
              `Unsupported content type: ${contentType} for country: ${countryCode}`
            );
          }
          setContent(module.default as T);
        }
      } catch (err) {
        console.error(`Failed to load ${contentType} for ${countryCode}:`, err);
        setError(`Failed to load ${contentType}`);

        // Fallback to English if country-specific content fails
        if (countryCode !== 'en') {
          try {
            if (contentType === 'will_template') {
              const response = await fetch(
                `/src/content/legacy/en/will_template.md`
              );
              if (response.ok) {
                const text = await response.text();
                setContent(text as T);
                setError(null);
              }
            } else {
              let fallbackModule;
              if (contentType === 'legal_info') {
                fallbackModule = await import(
                  '../content/legacy/en/legal_info.json'
                );
              } else if (contentType === 'wizard_steps') {
                fallbackModule = await import(
                  '../content/legacy/en/wizard_steps.json'
                );
              }
              if (fallbackModule) {
                setContent(fallbackModule.default as T);
                setError(null);
              }
            }
          } catch (fallbackErr) {
            console.error(`Fallback also failed:`, fallbackErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [countryCode, contentType]);

  return { content, loading, error, reload: loadContent };
};
