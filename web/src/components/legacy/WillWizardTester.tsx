import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  type JurisdictionCode,
  type LanguageCode,
  SUPPORTED_COMBINATIONS,
  useLocalization
} from '@/contexts/LocalizationContext';
import { EnhancedWillWizard } from './EnhancedWillWizard';

interface TestConfiguration {
  jurisdiction: JurisdictionCode;
  label: string;
  language: LanguageCode;
}

export const WillWizardTester: React.FC = () => {
  const { setLanguageCode, setJurisdictionCode, languageCode, jurisdictionCode } = useLocalization();
  const [showWizard, setShowWizard] = useState(false);
  const [currentTest, setCurrentTest] = useState<null | TestConfiguration>(null);

  const runTest = (config: TestConfiguration) => {
    setLanguageCode(config.language);
    setJurisdictionCode(config.jurisdiction);
    setCurrentTest(config);
    setShowWizard(true);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    setCurrentTest(null);
  };

  const handleWizardComplete = (willData: any) => {
    console.log('Will completed for:', currentTest, willData);
    // Create a simple HTML snapshot for testing
    const snapshot = {
      combination: `${currentTest?.language}-${currentTest?.jurisdiction}`,
      timestamp: new Date().toISOString(),
      willData,
      success: true,
    };

    // Save to localStorage for inspection
    const testResults = JSON.parse(localStorage.getItem('willWizardTests') || '[]');
    testResults.push(snapshot);
    localStorage.setItem('willWizardTests', JSON.stringify(testResults));

    alert(`✅ Test completed for ${currentTest?.label}!\nCheck console and localStorage for results.`);
    handleWizardClose();
  };

  const getStatusBadge = (config: TestConfiguration) => {
    const testResults = JSON.parse(localStorage.getItem('willWizardTests') || '[]');
    const hasTest = testResults.some((result: any) =>
      result.combination === `${config.language}-${config.jurisdiction}`
    );

    return hasTest ? (
      <Badge className="bg-green-100 text-green-800">✅ Tested</Badge>
    ) : (
      <Badge variant="outline">⏳ Pending</Badge>
    );
  };

  const clearTestResults = () => {
    localStorage.removeItem('willWizardTests');
    window.location.reload();
  };

  const getTestResults = () => {
    const testResults = JSON.parse(localStorage.getItem('willWizardTests') || '[]');
    return testResults;
  };

  if (showWizard && currentTest) {
    return (
      <div className="fixed inset-0 z-50">
        <EnhancedWillWizard
          onClose={handleWizardClose}
          onComplete={handleWizardComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Will Wizard Testing Suite
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Test all 8 language-jurisdiction combinations for the will wizard
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <div className="text-sm">
              <strong>Current:</strong> {languageCode}-{jurisdictionCode}
            </div>
            <Button variant="outline" size="sm" onClick={clearTestResults}>
              Clear Test Results
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Test Results:', getTestResults())}
            >
              View Test Results
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SUPPORTED_COMBINATIONS.map((config) => (
            <Card key={`${config.language}-${config.jurisdiction}`} className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg mb-2">
                  {config.language.toUpperCase()}-{config.jurisdiction}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {config.label}
                </p>
                {getStatusBadge(config)}
              </div>

              <Button
                className="w-full"
                onClick={() => runTest(config)}
              >
                Test {config.language}-{config.jurisdiction}
              </Button>

              <div className="mt-3 text-xs text-muted-foreground">
                <div><strong>UI:</strong> {config.language}</div>
                <div><strong>Law:</strong> {config.jurisdiction}</div>
                <div><strong>File:</strong> {config.language}_{config.jurisdiction}.json</div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Expected Test Combinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Slovakia Jurisdiction (SK)</h3>
              <ul className="text-sm space-y-1">
                <li>• 🇸🇰 sk-SK: Slovak interface + Slovak law</li>
                <li>• 🇨🇿 cs-SK: Czech interface + Slovak law</li>
                <li>• 🇬🇧 en-SK: English interface + Slovak law</li>
                <li>• 🇩🇪 de-SK: German interface + Slovak law</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Czech Jurisdiction (CZ)</h3>
              <ul className="text-sm space-y-1">
                <li>• 🇸🇰 sk-CZ: Slovak interface + Czech law</li>
                <li>• 🇨🇿 cs-CZ: Czech interface + Czech law</li>
                <li>• 🇬🇧 en-CZ: English interface + Czech law</li>
                <li>• 🇩🇪 de-CZ: German interface + Czech law</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 mt-4">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click each test button to launch the will wizard in that language-jurisdiction combination</li>
            <li>Navigate through the wizard steps to verify the interface language is correct</li>
            <li>Check that legal terms and requirements match the selected jurisdiction</li>
            <li>Complete the wizard or go through several steps to verify functionality</li>
            <li>Close the wizard and check that the test is marked as completed</li>
            <li>Repeat for all 8 combinations</li>
            <li>Use "View Test Results" to inspect the saved test data</li>
            <li>Use browser dev tools to take HTML snapshots if needed</li>
          </ol>
        </Card>

        <Card className="p-6 mt-4">
          <h2 className="text-xl font-semibold mb-4">Expected File Routing</h2>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm mb-2">
              The system should load translation files from:
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                /public/locales/content/wills/[language]_[jurisdiction].json
              </code>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
              {SUPPORTED_COMBINATIONS.map((config) => (
                <div key={`${config.language}-${config.jurisdiction}`}>
                  {config.language}_{config.jurisdiction}.json
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
