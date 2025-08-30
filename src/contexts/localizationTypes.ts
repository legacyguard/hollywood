export type CountryCode = 'sk' | 'cz' | 'en';
export type LanguageCode = 'sk' | 'cs' | 'en';

export interface LocalizationState {
  countryCode: CountryCode;
  languageCode: LanguageCode;
  jurisdiction: string;
  currency: string;
}

export interface LocalizationContextType extends LocalizationState {
  setCountryCode: (code: CountryCode) => void;
  setLanguageCode: (code: LanguageCode) => void;
  isLoading: boolean;
}
