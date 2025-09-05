
/**
 * Professional Reviewer Onboarding Flow
 * Multi-step onboarding process for attorneys and legal professionals
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle,
  Scale,
  Shield,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProfessionalOnboarding } from '@/types/professional';

interface ProfessionalOnboardingFlowProps {
  className?: string;
  onCancel?: () => void;
  onComplete: (
    data: Omit<
      ProfessionalOnboarding,
      'created_at' | 'id' | 'status' | 'updated_at'
    >
  ) => void;
}

interface OnboardingStep {
  description: string;
  icon: React.ComponentType<any>;
  id: number;
  isActive: boolean;
  isCompleted: boolean;
  title: string;
}

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'District of Columbia',
];

const SPECIALIZATIONS = [
  {
    id: 'estate_planning',
    name: 'Estate Planning',
    category: 'estate_planning',
  },
  { id: 'wills_trusts', name: 'Wills & Trusts', category: 'estate_planning' },
  { id: 'probate', name: 'Probate Law', category: 'estate_planning' },
  { id: 'family_law', name: 'Family Law', category: 'family_law' },
  { id: 'elder_law', name: 'Elder Law', category: 'estate_planning' },
  { id: 'tax_law', name: 'Tax Law', category: 'tax_law' },
  { id: 'business_law', name: 'Business Law', category: 'business_law' },
  { id: 'real_estate', name: 'Real Estate Law', category: 'real_estate' },
  {
    id: 'guardianship',
    name: 'Guardianship & Conservatorship',
    category: 'family_law',
  },
  {
    id: 'asset_protection',
    name: 'Asset Protection',
    category: 'estate_planning',
  },
];

export function ProfessionalOnboardingFlow({
  onComplete,
  onCancel,
  className,
}: ProfessionalOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    professional_title: '',
    law_firm_name: '',
    bar_number: '',
    licensed_states: [] as string[],
    specializations: [] as string[],
    experience_years: 0,
    hourly_rate: undefined as number | undefined,
    bio: '',
    motivation: '',
    referral_source: '',
  });

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Basic professional details',
      icon: Users,
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
    },
    {
      id: 2,
      title: 'Professional Credentials',
      description: 'Bar admission and licensing',
      icon: Award,
      isCompleted: currentStep > 2,
      isActive: currentStep === 2,
    },
    {
      id: 3,
      title: 'Specializations',
      description: 'Areas of legal expertise',
      icon: Scale,
      isCompleted: currentStep > 3,
      isActive: currentStep === 3,
    },
    {
      id: 4,
      title: 'Professional Profile',
      description: 'Rate, bio, and motivation',
      icon: Shield,
      isCompleted: currentStep > 4,
      isActive: currentStep === 4,
    },
  ];

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.email &&
          formData.full_name &&
          formData.professional_title
        );
      case 2:
        return !!(formData.bar_number && formData.licensed_states.length > 0);
      case 3:
        return (
          formData.specializations.length > 0 && formData.experience_years > 0
        );
      case 4:
        return !!(formData.bio && formData.motivation);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (isStepValid(4)) {
      onComplete(formData);
    }
  };

  const toggleState = (state: string) => {
    const newStates = formData.licensed_states.includes(state)
      ? formData.licensed_states.filter(s => s !== state)
      : [...formData.licensed_states, state];
    updateFormData({ licensed_states: newStates });
  };

  const toggleSpecialization = (spec: string) => {
    const newSpecs = formData.specializations.includes(spec)
      ? formData.specializations.filter(s => s !== spec)
      : [...formData.specializations, spec];
    updateFormData({ specializations: newSpecs });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key='step1'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <div>
                <Label htmlFor='email'>Email Address *</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={e => updateFormData({ email: e.target.value })}
                  placeholder='your.email@lawfirm.com'
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='full_name'>Full Name *</Label>
                <Input
                  id='full_name'
                  value={formData.full_name}
                  onChange={e => updateFormData({ full_name: e.target.value })}
                  placeholder='John Smith, Esq.'
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='professional_title'>Professional Title *</Label>
                <Input
                  id='professional_title'
                  value={formData.professional_title}
                  onChange={e =>
                    updateFormData({ professional_title: e.target.value })
                  }
                  placeholder='Attorney, Partner, Of Counsel, etc.'
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='law_firm_name'>Law Firm / Organization</Label>
                <Input
                  id='law_firm_name'
                  value={formData.law_firm_name}
                  onChange={e =>
                    updateFormData({ law_firm_name: e.target.value })
                  }
                  placeholder='Smith & Associates LLP'
                  className='mt-1'
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key='step2'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <div>
                <Label htmlFor='bar_number'>Bar Number *</Label>
                <Input
                  id='bar_number'
                  value={formData.bar_number}
                  onChange={e => updateFormData({ bar_number: e.target.value })}
                  placeholder='123456'
                  className='mt-1'
                />
                <p className='text-sm text-gray-600 mt-1'>
                  Primary state bar admission number for verification
                </p>
              </div>

              <div>
                <Label>Licensed States *</Label>
                <p className='text-sm text-gray-600 mb-3'>
                  Select all states where you are licensed to practice law
                </p>
                <div className='max-h-48 overflow-y-auto border rounded-lg p-3'>
                  <div className='grid grid-cols-2 gap-2'>
                    {US_STATES.map(state => (
                      <div key={state} className='flex items-center space-x-2'>
                        <Checkbox
                          id={state}
                          checked={formData.licensed_states.includes(state)}
                          onCheckedChange={() => toggleState(state)}
                        />
                        <Label htmlFor={state} className='text-sm font-normal'>
                          {state}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                {formData.licensed_states.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {formData.licensed_states.map(state => (
                      <Badge
                        key={state}
                        variant='secondary'
                        className='text-xs'
                      >
                        {state}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key='step3'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <div>
                <Label htmlFor='experience_years'>Years of Experience *</Label>
                <Select
                  value={formData.experience_years.toString()}
                  onValueChange={value =>
                    updateFormData({ experience_years: parseInt(value) })
                  }
                >
                  <SelectTrigger className='mt-1'>
                    <SelectValue placeholder='Select experience level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>1-2 years</SelectItem>
                    <SelectItem value='3'>3-5 years</SelectItem>
                    <SelectItem value='6'>6-10 years</SelectItem>
                    <SelectItem value='11'>11-15 years</SelectItem>
                    <SelectItem value='16'>16-20 years</SelectItem>
                    <SelectItem value='21'>20+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Areas of Specialization *</Label>
                <p className='text-sm text-gray-600 mb-3'>
                  Select your primary areas of legal expertise
                </p>
                <div className='grid grid-cols-2 gap-3'>
                  {SPECIALIZATIONS.map(spec => (
                    <div key={spec.id} className='flex items-center space-x-2'>
                      <Checkbox
                        id={spec.id}
                        checked={formData.specializations.includes(spec.id)}
                        onCheckedChange={() => toggleSpecialization(spec.id)}
                      />
                      <Label htmlFor={spec.id} className='text-sm font-normal'>
                        {spec.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.specializations.length > 0 && (
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {formData.specializations.map(specId => {
                      const spec = SPECIALIZATIONS.find(s => s.id === specId);
                      return spec ? (
                        <Badge
                          key={spec.id}
                          variant='secondary'
                          className='text-xs'
                        >
                          {spec.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key='step4'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <div>
                <Label htmlFor='hourly_rate'>Hourly Rate (USD)</Label>
                <Input
                  id='hourly_rate'
                  type='number'
                  value={formData.hourly_rate || ''}
                  onChange={e =>
                    updateFormData({
                      hourly_rate: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder='250'
                  className='mt-1'
                />
                <p className='text-sm text-gray-600 mt-1'>
                  Optional - helps clients understand your fee structure
                </p>
              </div>

              <div>
                <Label htmlFor='bio'>Professional Bio *</Label>
                <Textarea
                  id='bio'
                  value={formData.bio}
                  onChange={e => updateFormData({ bio: e.target.value })}
                  placeholder='Brief overview of your practice, experience, and approach to serving families...'
                  rows={4}
                  className='mt-1'
                />
                <p className='text-sm text-gray-600 mt-1'>
                  This will be displayed to potential clients
                </p>
              </div>

              <div>
                <Label htmlFor='motivation'>Why join LegacyGuard? *</Label>
                <Textarea
                  id='motivation'
                  value={formData.motivation}
                  onChange={e => updateFormData({ motivation: e.target.value })}
                  placeholder='What motivates you to help families protect their legacy...'
                  rows={3}
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='referral_source'>
                  How did you hear about us?
                </Label>
                <Select
                  value={formData.referral_source}
                  onValueChange={value =>
                    updateFormData({ referral_source: value })
                  }
                >
                  <SelectTrigger className='mt-1'>
                    <SelectValue placeholder='Select referral source' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='colleague'>
                      Colleague Referral
                    </SelectItem>
                    <SelectItem value='online_search'>Online Search</SelectItem>
                    <SelectItem value='legal_publication'>
                      Legal Publication
                    </SelectItem>
                    <SelectItem value='conference'>Legal Conference</SelectItem>
                    <SelectItem value='linkedin'>LinkedIn</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Header */}
      <div className='text-center mb-8'>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='flex items-center justify-center gap-3 mb-4'
        >
          <Scale className='h-8 w-8 text-blue-600' />
          <h1 className='text-3xl font-bold text-gray-900'>
            Join Our Professional Network
          </h1>
        </motion.div>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Help families protect their legacy while building your practice. Join
          a network of trusted legal professionals.
        </p>
      </div>

      {/* Progress Steps */}
      <div className='flex justify-center mb-8'>
        <div className='flex items-center space-x-4'>
          {steps.map((step, index) => (
            <div key={step.id} className='flex items-center'>
              <div
                className={cn(
                  'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300',
                  step.isCompleted
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : step.isActive
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                )}
              >
                {step.isCompleted ? (
                  <CheckCircle className='h-6 w-6' />
                ) : (
                  <step.icon className='h-6 w-6' />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-16 h-0.5 mx-2 transition-all duration-300',
                    step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Titles */}
      <div className='text-center mb-8'>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          {steps[currentStep - 1]?.title}
        </h2>
        <p className='text-gray-600'>{steps[currentStep - 1]?.description}</p>
      </div>

      {/* Form Content */}
      <Card className='shadow-lg'>
        <CardContent className='p-8'>
          <AnimatePresence mode='wait'>{renderStepContent()}</AnimatePresence>

          {/* Navigation Buttons */}
          <div className='flex justify-between mt-8 pt-6 border-t border-gray-200'>
            <div>
              {currentStep > 1 && (
                <Button
                  variant='outline'
                  onClick={handlePrevious}
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Previous
                </Button>
              )}
              {onCancel && currentStep === 1 && (
                <Button
                  variant='outline'
                  onClick={onCancel}
                  className='text-gray-600'
                >
                  Cancel
                </Button>
              )}
            </div>

            <div>
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className='flex items-center gap-2'
                >
                  Continue
                  <ArrowRight className='h-4 w-4' />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid(4)}
                  className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
                >
                  Submit Application
                  <CheckCircle className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <div className='mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8'>
        <h3 className='text-2xl font-bold text-center mb-8 text-gray-900'>
          Why Join LegacyGuard Professional Network?
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <Users className='h-12 w-12 text-blue-600 mx-auto mb-4' />
            <h4 className='font-semibold mb-2'>Build Your Practice</h4>
            <p className='text-sm text-gray-600'>
              Connect with families who value professional legal guidance
            </p>
          </div>
          <div className='text-center'>
            <Shield className='h-12 w-12 text-blue-600 mx-auto mb-4' />
            <h4 className='font-semibold mb-2'>Trusted Platform</h4>
            <p className='text-sm text-gray-600'>
              Secure, professional environment for document review
            </p>
          </div>
          <div className='text-center'>
            <Scale className='h-12 w-12 text-blue-600 mx-auto mb-4' />
            <h4 className='font-semibold mb-2'>Flexible Schedule</h4>
            <p className='text-sm text-gray-600'>
              Review documents on your schedule and set your rates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
