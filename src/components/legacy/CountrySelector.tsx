import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { type CountryCode, useLocalization } from '@/contexts/LocalizationContext';

interface CountrySelectorProps {
  onCountryConfirmed: () => void;
}

const SUPPORTED_COUNTRIES = [
  {
    code: 'sk' as CountryCode,
    name: 'Slovakia',
    flag: '🇸🇰',
    domain: 'legacyguard.sk',
    description: 'Slovak Republic legal framework',
  },
  {
    code: 'cz' as CountryCode,
    name: 'Czech Republic',
    flag: '🇨🇿',
    domain: 'legacyguard.cz',
    description: 'Czech Republic legal framework',
  },
  {
    code: 'en' as CountryCode,
    name: 'Other/International',
    flag: '🌍',
    domain: 'legacyguard.com',
    description: 'General international framework',
  },
];

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  onCountryConfirmed,
}) => {
  const { countryCode, jurisdiction, setCountryCode, isLoading } =
    useLocalization();
  const [showCountryList, setShowCountryList] = React.useState(false);

  const currentCountry = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);

  const handleCountryChange = (newCountryCode: CountryCode) => {
    setCountryCode(newCountryCode);
    setShowCountryList(false);
  };

  const handleConfirmCountry = () => {
    onCountryConfirmed();
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <Icon name={"loader" as any}
            className='w-8 h-8 text-primary animate-spin mx-auto mb-4'
          />
          <p className='text-muted-foreground'>Detecting your location...</p>
        </div>
      </div>
    );
  }

  if (showCountryList) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='max-w-4xl mx-auto px-6 py-16'>
          <FadeIn duration={0.6}>
            <div className='text-center mb-12'>
              <Icon name={"globe" as any}
                className='w-12 h-12 text-primary mx-auto mb-6'
              />
              <h1 className='text-3xl font-bold mb-4'>Select Your Country</h1>
              <p className='text-lg text-muted-foreground'>
                Choose your country to ensure your will complies with local laws
              </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto'>
              {SUPPORTED_COUNTRIES.map((country, index) => (
                <FadeIn key={country.code} duration={0.4} delay={0.1 * index}>
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                      country.code === countryCode
                        ? 'border-primary bg-primary/5'
                        : ''
                    }`}
                    onClick={() => handleCountryChange(country.code)}
                  >
                    <div className='text-center'>
                      <div className='text-4xl mb-4'>{country.flag}</div>
                      <h3 className='text-xl font-semibold mb-2'>
                        {country.name}
                      </h3>
                      <p className='text-sm text-muted-foreground mb-4'>
                        {country.description}
                      </p>
                      <div className='text-xs text-primary font-medium'>
                        {country.domain}
                      </div>
                      {country.code === countryCode && (
                        <div className='mt-4'>
                          <Icon name={"check-circle" as any}
                            className='w-5 h-5 text-green-600 mx-auto'
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>

            <div className='text-center mt-8'>
              <Button
                onClick={() => setShowCountryList(false)}
                variant={"outline" as any}
              >
                <Icon name={"arrow-left" as any} className='w-4 h-4 mr-2' />
                Back
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-4xl mx-auto px-6 py-16'>
        <FadeIn duration={0.8}>
          <div className='text-center mb-12'>
            <Icon name={"shield-check" as any}
              className='w-16 h-16 text-primary mx-auto mb-6'
            />
            <h1 className='text-4xl font-bold mb-6'>Will Creator</h1>
            <p className='text-xl text-muted-foreground mb-8'>
              Let's ensure your will complies with the right legal framework
            </p>
          </div>

          <Card className='p-8 max-w-2xl mx-auto'>
            <div className='text-center mb-8'>
              <div className='text-6xl mb-4'>{currentCountry?.flag}</div>
              <h2 className='text-2xl font-semibold mb-2'>
                We're creating your will according to the laws of {jurisdiction}
              </h2>
              <p className='text-muted-foreground'>Is this correct?</p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                onClick={handleConfirmCountry}
                className='bg-primary hover:bg-primary-hover text-primary-foreground px-8'
                size='lg'
              >
                <Icon name={"check" as any} className='w-5 h-5 mr-2' />
                Yes, that's correct
              </Button>

              <Button
                onClick={() => setShowCountryList(true)}
                variant={"outline" as any}
                size='lg'
                className='px-8'
              >
                <Icon name={"globe" as any} className='w-5 h-5 mr-2' />
                Change Country
              </Button>
            </div>

            <div className='mt-8 p-4 bg-muted/30 rounded-lg'>
              <div className='flex items-start gap-3'>
                <Icon name={"info" as any}
                  className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5'
                />
                <div>
                  <h4 className='font-semibold text-sm mb-1'>
                    Why country matters
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Different countries have varying legal requirements for
                    wills. Selecting the correct jurisdiction ensures your will
                    is legally valid and enforceable.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
};
