/**
 * I18nProvider
 * Provides internationalization context to the application
 */

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import i18n, { initI18n, NamespaceLoader, getNamespacesForRoute, SUPPORTED_LANGUAGES, NAMESPACES } from '@/lib/i18n/config';

interface I18nProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  fallback = <div>Loading translations...</div>
}) => {
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  // Initialize i18n on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initI18n();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // Set ready anyway to prevent infinite loading
        setIsReady(true);
      }
    };

    init();
  }, []);

  // Load namespaces based on route
  useEffect(() => {
    if (!isReady) return;

    const loadNamespaces = async () => {
      const namespaces = getNamespacesForRoute(location.pathname);
      const namespacesToLoad = namespaces.filter(ns => !i18n.hasResourceBundle(i18n.language, ns));

      if (namespacesToLoad.length > 0) {
        try {
          await i18n.loadNamespaces(namespacesToLoad);
        } catch (error) {
          console.error('Failed to load namespaces:', error);
        }
      }
    };

    loadNamespaces();
  }, [location.pathname, isReady]);

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

// Hook for loading feature-specific namespaces
export const useLoadNamespace = (feature: keyof typeof NAMESPACES.FEATURES) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await NamespaceLoader.loadFeature(feature);
      } catch (err) {
        setError(err as Error);
        console.error(`Failed to load namespace for ${feature}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [feature]);

  return { isLoading, error };
};

// Language switcher component
export const LanguageSwitcher: React.FC = () => {
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const handleLanguageChange = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      setCurrentLang(lang);

      // Store preference
      localStorage.setItem('i18nextLng', lang);

      // Update document language
      document.documentElement.lang = lang;

      // Update document direction for RTL languages
      const isRTL = ['ar', 'he', 'fa', 'ur'].includes(lang);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <select
      value={currentLang}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="px-3 py-2 border rounded-md"
    >
      {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
        <option key={code} value={code}>
          {lang.flag} {lang.nativeName}
        </option>
      ))}
    </select>
  );
};

// Lazy loading wrapper for legal documents
export const LegalDocumentLoader: React.FC<{
  country: string;
  type: 'holographic' | 'allographic';
  children: React.ReactNode;
}> = ({ country, type, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      await NamespaceLoader.loadLegalTemplate(country, type);
      setIsLoaded(true);
    };

    load();
  }, [country, type]);

  if (!isLoaded) {
    return <div>Loading legal document...</div>;
  }

  return <>{children}</>;
};

export default I18nProvider;
