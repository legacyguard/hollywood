import { I18n } from 'i18n-js';
import * as Localization from 'react-native-localize';

// Import translations
import en from './locales/en.json';
import cs from './locales/cs.json';
import sk from './locales/sk.json';
import de from './locales/de.json';

// Create i18n instance
const i18n = new I18n({
  en,
  cs,
  sk,
  de,
});

// Set default locale
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Function to set the locale based on device settings
export const initializeI18n = () => {
  const locales = Localization.getLocales();
  
  if (locales.length > 0) {
    const deviceLanguage = locales[0].languageCode;
    
    // Check if we support this language
    if (['en', 'cs', 'sk', 'de'].includes(deviceLanguage)) {
      i18n.locale = deviceLanguage;
    } else {
      i18n.locale = 'en'; // fallback to English
    }
  }
};

// Initialize on import
initializeI18n();

// Listen for locale changes
Localization.addEventListener('change', () => {
  initializeI18n();
});

export default i18n;
export const t = (key: string, options?: any) => i18n.t(key, options);
