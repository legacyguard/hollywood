import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type LanguageCode,
  type JurisdictionCode,
  SUPPORTED_COMBINATIONS,
  useLocalization,
} from '@/contexts/LocalizationContext';

interface EnhancedCountrySelectorProps {
  onSelectionConfirmed: () => void;
}

export const EnhancedCountrySelector: React.FC<EnhancedCountrySelectorProps> = ({
  onSelectionConfirmed,
}) => {
  const { languageCode, jurisdictionCode, setLanguageCode, setJurisdictionCode, isLoading } =
    useLocalization();
  
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(languageCode);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionCode>(jurisdictionCode);
  const [step, setStep] = useState<'language' | 'jurisdiction' | 'confirmation'>('language');

  const getLanguageFlag = (lang: LanguageCode): string => {
    const flags = {
      sk: '🇸🇰',
      cs: '🇨🇿', 
      en: '🇬🇧',
      de: '🇩🇪',
    };
    return flags[lang] || '🌍';
  };

  const getJurisdictionFlag = (jurisdiction: JurisdictionCode): string => {
    return jurisdiction === 'SK' ? '🇸🇰' : '🇨🇿';
  };

  const getLanguageLabel = (lang: LanguageCode): string => {
    const labels = {
      sk: 'Slovenčina',
      cs: 'Čeština',
      en: 'English',
      de: 'Deutsch',
    };
    return labels[lang] || lang;
  };

  const getJurisdictionLabel = (jurisdiction: JurisdictionCode): string => {
    return jurisdiction === 'SK' ? 'Slovenská republika' : 'Česká republika';
  };

  const getCurrentCombination = () => {
    return SUPPORTED_COMBINATIONS.find(
      combo => combo.language === selectedLanguage && combo.jurisdiction === selectedJurisdiction
    );
  };

  const handleLanguageSelect = (language: LanguageCode) => {
    setSelectedLanguage(language);
    setStep('jurisdiction');
  };

  const handleJurisdictionSelect = (jurisdiction: JurisdictionCode) => {
    setSelectedJurisdiction(jurisdiction);
    setStep('confirmation');
  };

  const handleConfirm = () => {
    setLanguageCode(selectedLanguage);
    setJurisdictionCode(selectedJurisdiction);
    onSelectionConfirmed();
  };

  const handleBack = () => {
    if (step === 'jurisdiction') {
      setStep('language');
    } else if (step === 'confirmation') {
      setStep('jurisdiction');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon
            name={'loader' as any}
            className="w-8 h-8 text-primary animate-spin mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <FadeIn duration={0.8}>
          <div className="text-center mb-12">
            <Icon
              name={'shield-check' as any}
              className="w-16 h-16 text-primary mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold mb-6">Will Creator</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose your preferred language and legal jurisdiction
            </p>
          </div>

          {step === 'language' && (
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Select Your Language
                </h2>
                <p className="text-muted-foreground">
                  Choose the language you want to use for creating your will
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['sk', 'cs', 'en', 'de'] as LanguageCode[]).map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? 'default' : 'outline'}
                    className="h-16 text-lg"
                    onClick={() => handleLanguageSelect(lang)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getLanguageFlag(lang)}</span>
                      <span>{getLanguageLabel(lang)}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {step === 'jurisdiction' && (
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-2xl">{getLanguageFlag(selectedLanguage)}</span>
                  <h2 className="text-2xl font-semibold">
                    Language: {getLanguageLabel(selectedLanguage)}
                  </h2>
                </div>
                <h3 className="text-xl font-medium mb-4">
                  Select Legal Jurisdiction
                </h3>
                <p className="text-muted-foreground">
                  Choose which country's laws will govern your will
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {(['SK', 'CZ'] as JurisdictionCode[]).map((jurisdiction) => (
                  <Button
                    key={jurisdiction}
                    variant={selectedJurisdiction === jurisdiction ? 'default' : 'outline'}
                    className="h-16 text-lg"
                    onClick={() => handleJurisdictionSelect(jurisdiction)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getJurisdictionFlag(jurisdiction)}</span>
                      <span>{getJurisdictionLabel(jurisdiction)}</span>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <Button variant="ghost" onClick={handleBack}>
                  <Icon name={'arrow-left' as any} className="w-4 h-4 mr-2" />
                  Back to Language
                </Button>
              </div>
            </Card>
          )}

          {step === 'confirmation' && (
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-6">Confirm Your Selection</h2>
                
                <div className="bg-muted/30 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getLanguageFlag(selectedLanguage)}</span>
                      <span className="font-medium">{getLanguageLabel(selectedLanguage)}</span>
                    </div>
                    <Icon name={'arrow-right' as any} className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getJurisdictionFlag(selectedJurisdiction)}</span>
                      <span className="font-medium">{getJurisdictionLabel(selectedJurisdiction)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {getCurrentCombination()?.label}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Icon name={'info' as any} className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-semibold text-sm mb-1 text-blue-900">
                        Your Will Configuration
                      </h4>
                      <p className="text-sm text-blue-800">
                        <strong>Interface Language:</strong> {getLanguageLabel(selectedLanguage)}<br/>
                        <strong>Legal Framework:</strong> {getJurisdictionLabel(selectedJurisdiction)}<br/>
                        <strong>Currency:</strong> {selectedJurisdiction === 'SK' ? 'EUR' : 'CZK'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleConfirm}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-8"
                  size="lg"
                >
                  <Icon name={'check' as any} className="w-5 h-5 mr-2" />
                  Start Creating Will
                </Button>

                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  <Icon name={'arrow-left' as any} className="w-5 h-5 mr-2" />
                  Change Selection
                </Button>
              </div>

              <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    name={'info' as any}
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Why these settings matter
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Language</strong> determines the interface and document language, while{' '}
                      <strong>Jurisdiction</strong> determines which country's legal requirements 
                      your will must follow. You can use any language with any supported jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </FadeIn>
      </div>
    </div>
  );
};
