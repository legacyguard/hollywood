/**
 * Professional Reviewer Application Form
 * Premium UI/UX for attorney and professional onboarding
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  Scale,
  GraduationCap,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Shield,
  Calendar,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { ProfessionalOnboarding, ProfessionalSpecialization } from '@/types/professional';

interface ProfessionalApplicationFormProps {
  onSubmit: (application: Omit<ProfessionalOnboarding, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  className?: string;
}

type ApplicationStep = 'personal' | 'credentials' | 'expertise' | 'preferences' | 'review';

const SPECIALIZATIONS: Omit<ProfessionalSpecialization, 'id'>[] = [
  { name: 'Estate Planning', category: 'estate_planning', description: 'Wills, trusts, and inheritance planning' },
  { name: 'Probate Law', category: 'estate_planning', description: 'Estate administration and probate proceedings' },
  { name: 'Family Law', category: 'family_law', description: 'Divorce, custody, and family matters' },
  { name: 'Real Estate Law', category: 'real_estate', description: 'Property transactions and real estate matters' },
  { name: 'Business Law', category: 'business_law', description: 'Corporate structures and business planning' },
  { name: 'Tax Law', category: 'tax_law', description: 'Tax planning and compliance' },
  { name: 'Elder Law', category: 'estate_planning', description: 'Legal issues affecting seniors' },
  { name: 'Asset Protection', category: 'estate_planning', description: 'Protecting wealth from creditors' }
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export function ProfessionalApplicationForm({
  onSubmit,
  onCancel,
  className
}: ProfessionalApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('personal');
  const [application, setApplication] = useState<Partial<ProfessionalOnboarding>>({
    status: 'draft',
    licensed_states: [],
    specializations: [],
    experience_years: 0
  });
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: { key: ApplicationStep; title: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'personal', title: 'Personal Information', icon: User },
    { key: 'credentials', title: 'Professional Credentials', icon: Scale },
    { key: 'expertise', title: 'Areas of Expertise', icon: GraduationCap },
    { key: 'preferences', title: 'Work Preferences', icon: Clock },
    { key: 'review', title: 'Review & Submit', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const validateStep = (step: ApplicationStep): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'personal':
        if (!application.full_name?.trim()) newErrors.full_name = 'Full name is required';
        if (!application.email?.trim()) newErrors.email = 'Email is required';
        if (!application.professional_title?.trim()) newErrors.professional_title = 'Professional title is required';
        break;
      case 'credentials':
        if (!application.bar_number?.trim()) newErrors.bar_number = 'Bar number is required';
        if (!application.licensed_states?.length) newErrors.licensed_states = 'At least one licensed state is required';
        if (!application.experience_years || application.experience_years < 1) newErrors.experience_years = 'Experience years must be at least 1';
        break;
      case 'expertise':
        if (!selectedSpecializations.length) newErrors.specializations = 'At least one specialization is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].key);
      }
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSubmit = () => {
    if (validateStep('review')) {
      const finalApplication: Omit<ProfessionalOnboarding, 'id' | 'created_at' | 'updated_at'> = {
        ...application as Required<Pick<ProfessionalOnboarding, 'email' | 'full_name' | 'professional_title' | 'bar_number' | 'licensed_states' | 'experience_years'>>,
        specializations: selectedSpecializations,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      };
      onSubmit(finalApplication);
    }
  };

  const handleSpecializationToggle = (specialization: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(specialization)
        ? prev.filter(s => s !== specialization)
        : [...prev, specialization]
    );
  };

  const handleStateToggle = (state: string) => {
    setApplication(prev => ({
      ...prev,
      licensed_states: prev.licensed_states?.includes(state)
        ? prev.licensed_states.filter(s => s !== state)
        : [...(prev.licensed_states || []), state]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-muted-foreground">Tell us about yourself and your professional background</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={application.full_name || ''}
                  onChange={(e) => setApplication(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="John Smith"
                  className={errors.full_name ? 'border-red-500' : ''}
                />
                {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={application.email || ''}
                  onChange={(e) => setApplication(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@lawfirm.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="professional_title">Professional Title *</Label>
                <Input
                  id="professional_title"
                  value={application.professional_title || ''}
                  onChange={(e) => setApplication(prev => ({ ...prev, professional_title: e.target.value }))}
                  placeholder="Attorney, Esq."
                  className={errors.professional_title ? 'border-red-500' : ''}
                />
                {errors.professional_title && <p className="text-sm text-red-500">{errors.professional_title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="law_firm_name">Law Firm Name</Label>
                <Input
                  id="law_firm_name"
                  value={application.law_firm_name || ''}
                  onChange={(e) => setApplication(prev => ({ ...prev, law_firm_name: e.target.value }))}
                  placeholder="Smith & Associates"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={application.bio || ''}
                onChange={(e) => setApplication(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description of your legal practice and experience..."
                rows={4}
              />
            </div>
          </div>
        );

      case 'credentials':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Credentials</h3>
              <p className="text-muted-foreground">Verify your legal credentials and experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bar_number">Bar Number *</Label>
                <Input
                  id="bar_number"
                  value={application.bar_number || ''}
                  onChange={(e) => setApplication(prev => ({ ...prev, bar_number: e.target.value }))}
                  placeholder="123456789"
                  className={errors.bar_number ? 'border-red-500' : ''}
                />
                {errors.bar_number && <p className="text-sm text-red-500">{errors.bar_number}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_years">Years of Experience *</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="1"
                  max="50"
                  value={application.experience_years || ''}
                  onChange={(e) => setApplication(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                  className={errors.experience_years ? 'border-red-500' : ''}
                />
                {errors.experience_years && <p className="text-sm text-red-500">{errors.experience_years}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Licensed States *</Label>
              {errors.licensed_states && <p className="text-sm text-red-500">{errors.licensed_states}</p>}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 border rounded-lg">
                {US_STATES.map(state => (
                  <Button
                    key={state}
                    variant={application.licensed_states?.includes(state) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStateToggle(state)}
                    className="text-xs h-8"
                  >
                    {state}
                  </Button>
                ))}
              </div>
              {application.licensed_states && application.licensed_states.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {application.licensed_states.map(state => (
                    <Badge key={state} variant="secondary" className="text-xs">
                      {state}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'expertise':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Areas of Expertise</h3>
              <p className="text-muted-foreground">Select your legal specializations and areas of practice</p>
            </div>

            {errors.specializations && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {errors.specializations}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPECIALIZATIONS.map(specialization => (
                <Card
                  key={specialization.name}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md',
                    selectedSpecializations.includes(specialization.name)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:border-blue-200'
                  )}
                  onClick={() => handleSpecializationToggle(specialization.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{specialization.name}</h4>
                      {selectedSpecializations.includes(specialization.name) && (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{specialization.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {specialization.category.replace('_', ' ')}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedSpecializations.length > 0 && (
              <div className="mt-6">
                <Label>Selected Specializations ({selectedSpecializations.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSpecializations.map(spec => (
                    <Badge key={spec} className="bg-blue-100 text-blue-800">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Work Preferences</h3>
              <p className="text-muted-foreground">Set your availability and work preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hourly_rate"
                    type="number"
                    min="50"
                    max="1000"
                    step="25"
                    value={application.hourly_rate || ''}
                    onChange={(e) => setApplication(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || undefined }))}
                    placeholder="250"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Optional - leave blank if you prefer project-based pricing</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral_source">How did you hear about us?</Label>
                <Input
                  id="referral_source"
                  value={application.referral_source || ''}
                  onChange={(e) => setApplication(prev => ({ ...prev, referral_source: e.target.value }))}
                  placeholder="Professional network, Google, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Why do you want to join our network?</Label>
              <Textarea
                id="motivation"
                value={application.motivation || ''}
                onChange={(e) => setApplication(prev => ({ ...prev, motivation: e.target.value }))}
                placeholder="Tell us what motivates you to help families with their legacy planning..."
                rows={4}
              />
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Professional Standards</AlertTitle>
              <AlertDescription className="text-blue-700">
                All reviewers must maintain professional liability insurance and commit to our quality standards and turnaround times.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Review Your Application</h3>
              <p className="text-muted-foreground">Please review your information before submitting</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Name:</strong> {application.full_name}</div>
                  <div><strong>Email:</strong> {application.email}</div>
                  <div><strong>Title:</strong> {application.professional_title}</div>
                  {application.law_firm_name && <div><strong>Firm:</strong> {application.law_firm_name}</div>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Scale className="h-5 w-5" />
                    Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Bar Number:</strong> {application.bar_number}</div>
                  <div><strong>Experience:</strong> {application.experience_years} years</div>
                  <div><strong>Licensed States:</strong> {application.licensed_states?.join(', ')}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="h-5 w-5" />
                    Specializations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecializations.map(spec => (
                      <Badge key={spec} className="bg-blue-100 text-blue-800">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Next Steps</AlertTitle>
              <AlertDescription className="text-green-700">
                After submission, our team will review your application within 3-5 business days. You'll receive an email with the status and next steps.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('max-w-4xl mx-auto', className)}
    >
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Join Our Professional Network</CardTitle>
              <p className="text-muted-foreground">Help families secure their legacy with professional legal review</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="h-2" />

            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors',
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-blue-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={cn(
                      'text-xs text-center font-medium',
                      (isCompleted || isCurrent) ? 'text-gray-900' : 'text-gray-500'
                    )}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <div className="p-6 pt-0">
          <Separator className="mb-6" />

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>

            <div className="flex gap-3">
              {currentStep !== 'review' ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <Star className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
