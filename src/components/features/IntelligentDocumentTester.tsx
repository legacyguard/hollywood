'use client';

import React, { useState } from 'react';
import { DocumentConfirmation } from './DocumentConfirmation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';

// Mock analysis result for testing
const mockAnalysisResult = {
  extractedText:
    'ELECTRIC UTILITY BILL\n\nAccount Number: 1234567890\nService Address: 123 Main St, Springfield, IL\nBilling Period: March 1 - March 31, 2024\n\nElectricity Charges: $85.50\nTaxes and Fees: $12.20\nTotal Amount Due: $97.70\n\nDue Date: April 15, 2024\n\nThank you for your business!',
  confidence: 0.92,
  suggestedCategory: {
    category: 'housing',
    confidence: 0.95,
    icon: 'home',
    reasoning:
      'Document contains utility bill keywords and service address information',
  },
  suggestedTitle: {
    title: 'Electric Bill - March 2024',
    confidence: 0.88,
    reasoning: 'Based on document type and billing period',
  },
  expirationDate: {
    date: '2024-04-15',
    confidence: 0.9,
    originalText: 'Due Date: April 15, 2024',
    reasoning: 'Found due date pattern in document text',
  },
  keyData: [
    {
      label: 'Account Number',
      value: '1234567890',
      confidence: 0.95,
      type: 'account',
    },
    {
      label: 'Total Amount',
      value: '$97.70',
      confidence: 0.92,
      type: 'amount',
    },
    {
      label: 'Service Address',
      value: '123 Main St, Springfield, IL',
      confidence: 0.85,
      type: 'contact',
    },
  ],
  suggestedTags: ['utility', 'monthly', 'housing', 'expires'],

  // Bundle Intelligence (Phase 2) - Mock data
  potentialBundles: [
    {
      bundleId: 'bundle_001',
      bundleName: 'Property: 123 Main St',
      bundleCategory: 'housing',
      primaryEntity: '123 Main St, Springfield, IL',
      documentCount: 3,
      matchScore: 85,
      matchReasons: ['Same address found', 'Housing category match'],
    },
    {
      bundleId: 'bundle_002',
      bundleName: 'Utility Bills',
      bundleCategory: 'housing',
      primaryEntity: 'Electric & Gas',
      documentCount: 12,
      matchScore: 75,
      matchReasons: ['Utility category match', 'Monthly recurring pattern'],
    },
  ],

  suggestedNewBundle: {
    name: 'Property: 123 Main St - Utilities',
    category: 'housing',
    primaryEntity: '123 Main St, Springfield, IL',
    entityType: 'property',
    keywords: ['electric', 'utility', '123 main st', 'springfield'],
    confidence: 0.8,
    reasoning: 'Detected property utility bill with specific address',
  },

  processingId: 'test_processing_12345',
  processingTime: 1250,
};

// Mock file for testing
const mockFile = new File(
  [new Blob(['mock pdf content'], { type: 'application/pdf' })],
  'electric-bill-march-2024.pdf',
  { type: 'application/pdf' }
);

export const IntelligentDocumentTester: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartTest = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = (
    confirmedData: typeof mockAnalysisResult & { bundleSelection?: any }
  ) => {
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);
      alert('Test completed! Check console for confirmed data.');
    }, 2000);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <DocumentConfirmation
        file={mockFile}
        analysisResult={mockAnalysisResult}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isProcessing={isProcessing}
      />
    );
  }

  return (
    <FadeIn duration={0.5}>
      <Card className='p-6 bg-card border-card-border max-w-2xl mx-auto'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <Icon name={"play" as any} className='w-5 h-5 text-primary' />
          </div>
          <div>
            <h3 className='font-semibold text-lg'>
              Test Intelligent Document Organizer
            </h3>
            <p className='text-sm text-muted-foreground'>
              Demo the AI analysis and confirmation interface with mock data
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <div className='p-4 bg-muted rounded-lg'>
            <h4 className='font-medium mb-2'>
              Mock Document: Electric Utility Bill
            </h4>
            <div className='text-sm text-muted-foreground space-y-1'>
              <p>• File: electric-bill-march-2024.pdf</p>
              <p>• Contains: Account number, billing amount, due date</p>
              <p>• Expected category: Housing</p>
              <p>• Expected expiration: April 15, 2024</p>
            </div>
          </div>

          <Button onClick={handleStartTest} className='w-full gap-2'>
            <Icon name={"play" as any} className='w-4 h-4' />
            Test Document Analysis Interface
          </Button>
        </div>

        <div className='mt-4 p-3 bg-primary/5 rounded-lg'>
          <div className='flex gap-2'>
            <Icon name={"info" as any}
              className='w-4 h-4 text-primary flex-shrink-0 mt-0.5'
            />
            <div className='text-xs text-muted-foreground'>
              <p className='font-medium mb-1'>Testing Mode</p>
              <p>
                This demonstrates the confirmation interface with mock AI
                analysis results. The actual AI analysis requires API
                integration.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
};
