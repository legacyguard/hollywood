import React, { useState } from 'react';
import { CountrySelector } from './CountrySelector';
import { WillTypeSelector, WillType } from './WillTypeSelector';
import { WillWizard, WillData } from './WillWizard';

interface EnhancedWillWizardProps {
  onClose: () => void;
  onComplete: (willData: WillData & { willType: WillType }) => void;
}

type WizardStep = 'country' | 'will_type' | 'wizard';

export const EnhancedWillWizard: React.FC<EnhancedWillWizardProps> = ({
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('country');
  const [selectedWillType, setSelectedWillType] = useState<WillType | null>(null);

  const handleCountryConfirmed = () => {
    setCurrentStep('will_type');
  };

  const handleWillTypeSelected = (type: WillType) => {
    setSelectedWillType(type);
    setCurrentStep('wizard');
  };

  const handleBackToCountry = () => {
    setCurrentStep('country');
  };

  const handleBackToWillType = () => {
    setCurrentStep('will_type');
  };

  const handleWillComplete = (willData: WillData) => {
    // Add the will type to the data
    const enhancedWillData = {
      ...willData,
      willType: selectedWillType!
    };
    onComplete(enhancedWillData);
  };

  switch (currentStep) {
    case 'country':
      return (
        <CountrySelector 
          onCountryConfirmed={handleCountryConfirmed}
        />
      );

    case 'will_type':
      return (
        <WillTypeSelector
          onWillTypeSelected={handleWillTypeSelected}
          onBack={handleBackToCountry}
        />
      );

    case 'wizard':
      return (
        <WillWizard
          onClose={onClose}
          onComplete={handleWillComplete}
          onBack={handleBackToWillType}
          willType={selectedWillType!}
        />
      );

    default:
      return null;
  }
};