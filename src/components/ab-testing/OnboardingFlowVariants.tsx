/**
 * A/B Testing Onboarding Flow Variants
 * Tests different onboarding approaches for conversion optimization
 */

import { useState, useEffect } from 'react';
import { ArrowRight, Heart, Shield, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useABTest } from '@/lib/ab-testing/ab-testing-system';
import { useOnboardingTracking } from '@/hooks/useConversionTracking';

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
  onSkip?: () => void;
  userId?: string;
  className?: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

export function ABTestOnboardingFlow({
  onComplete,
  onSkip,
  userId,
  className,
}: OnboardingFlowProps) {
  const { variant, trackConversion } = useABTest('onboarding_flow_v1', userId);
  const { trackOnboardingStart, trackOnboardingStep, trackOnboardingComplete } = useOnboardingTracking();
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const [userData, setUserData] = useState({});

  // Track onboarding start
  useEffect(() => {
    trackOnboardingStart();
    trackConversion('onboarding_started', 1, { variant });
  }, [trackOnboardingStart, trackConversion, variant]);

  const handleStepComplete = (stepData: any) => {
    const timeSpent = Date.now() - stepStartTime;
    const stepId = getSteps(variant)[currentStep]?.id || 'unknown';

    trackOnboardingStep(stepId, 'completed', timeSpent);

    setUserData(prev => ({ ...prev, ...stepData }));

    if (currentStep < getSteps(variant).length - 1) {
      setCurrentStep(prev => prev + 1);
      setStepStartTime(Date.now());
    } else {
      // Onboarding complete
      const totalTime = Date.now() - startTime;
      trackOnboardingComplete(totalTime, getSteps(variant).length);
      trackConversion('onboarding_completed', 1, {
        variant,
        totalTime,
        stepsCompleted: getSteps(variant).length
      });
      onComplete({ ...userData, ...stepData });
    }
  };

  const handleStepSkip = () => {
    const stepId = getSteps(variant)[currentStep]?.id || 'unknown';
    trackOnboardingStep(stepId, 'abandoned');

    if (onSkip) {
      onSkip();
    } else {
      // Skip to next step
      if (currentStep < getSteps(variant).length - 1) {
        setCurrentStep(prev => prev + 1);
        setStepStartTime(Date.now());
      }
    }
  };

  const steps = getSteps(variant);
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('max-w-2xl mx-auto p-6', className)}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {variant === 'variant_a' ? 'Protect Your Family' : 'Welcome to LegacyGuard'}
          </h1>
          <Badge variant="outline" className="text-sm">
            {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-sm text-gray-600">
          {variant === 'variant_a'
            ? 'Every step brings more security to those you love'
            : `Step ${currentStep + 1}: ${currentStepData?.description}`
          }
        </p>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStepData && (
            <currentStepData.component
              onComplete={handleStepComplete}
              onSkip={handleStepSkip}
              userData={userData}
              variant={variant}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Get steps based on A/B test variant
 */
function getSteps(variant: string): OnboardingStep[] {
  const controlSteps = [
    {
      id: 'name',
      title: 'Tell us your name',
      description: 'Personal information',
      component: NameStep,
    },
    {
      id: 'purpose',
      title: 'What brings you here?',
      description: 'Understanding your needs',
      component: PurposeStep,
    },
    {
      id: 'family',
      title: 'Family information',
      description: 'Those you want to protect',
      component: FamilyStep,
    },
    {
      id: 'next_steps',
      title: 'Your next steps',
      description: 'Getting started',
      component: NextStepsStep,
    },
  ];

  const emotionFirstSteps = [
    {
      id: 'family_impact',
      title: 'Who do you want to protect?',
      description: 'The people who matter most',
      component: FamilyImpactStep,
    },
    {
      id: 'protection_goals',
      title: 'What would give you peace of mind?',
      description: 'Your protection priorities',
      component: ProtectionGoalsStep,
    },
    {
      id: 'personal_info',
      title: 'Let\'s personalize your experience',
      description: 'Basic information',
      component: PersonalInfoStep,
    },
    {
      id: 'first_action',
      title: 'Take your first protective step',
      description: 'Start protecting your family today',
      component: FirstActionStep,
    },
  ];

  return variant === 'variant_a' ? emotionFirstSteps : controlSteps;
}

/**
 * Control Flow Step Components
 */
function NameStep({ onComplete, onSkip }: { onComplete: (data: any) => void; onSkip: () => void }) {
  const [name, setName] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>What should we call you?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onComplete({ name })}
            disabled={!name.trim()}
            className="flex-1"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PurposeStep({ onComplete, onSkip }: { onComplete: (data: any) => void; onSkip: () => void }) {
  const [purpose, setPurpose] = useState('');

  const purposes = [
    'Organize important documents',
    'Create a will or estate plan',
    'Ensure my family can access information',
    'Get professional legal review',
    'All of the above',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>What brings you to LegacyGuard?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {purposes.map((option, index) => (
            <button
              key={index}
              onClick={() => setPurpose(option)}
              className={cn(
                'w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors',
                purpose === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onComplete({ purpose })}
            disabled={!purpose}
            className="flex-1"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FamilyStep({ onComplete, onSkip }: { onComplete: (data: any) => void; onSkip: () => void }) {
  const [familySize, setFamilySize] = useState('');
  const [hasMinors, setHasMinors] = useState<boolean | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell us about your family</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>How many family members do you want to protect?</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['1-2', '3-4', '5-6', '7+'].map((size) => (
              <button
                key={size}
                onClick={() => setFamilySize(size)}
                className={cn(
                  'p-2 border rounded hover:bg-gray-50',
                  familySize === size ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                )}
              >
                {size} people
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Do you have minor children?</Label>
          <div className="flex gap-2 mt-2">
            <Button
              variant={hasMinors === true ? 'default' : 'outline'}
              onClick={() => setHasMinors(true)}
              className="flex-1"
            >
              Yes
            </Button>
            <Button
              variant={hasMinors === false ? 'default' : 'outline'}
              onClick={() => setHasMinors(false)}
              className="flex-1"
            >
              No
            </Button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onComplete({ familySize, hasMinors })}
            className="flex-1"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NextStepsStep({ onComplete, userData: _userData }: { onComplete: (data: any) => void; userData: any }) {
  const recommendations = [
    {
      icon: Shield,
      title: 'Upload Important Documents',
      description: 'Secure your ID, insurance, and financial documents',
      time: '5 minutes',
    },
    {
      icon: Users,
      title: 'Add Emergency Contacts',
      description: 'Let trusted people access your information if needed',
      time: '2 minutes',
    },
    {
      icon: CheckCircle,
      title: 'Complete Will Wizard',
      description: 'Create a legally sound will with our guided process',
      time: '15 minutes',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfect! Here's what we recommend next</CardTitle>
        <p className="text-gray-600">Based on your information, these steps will give you the most protection</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
            <rec.icon className="h-5 w-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium">{rec.title}</h4>
              <p className="text-sm text-gray-600">{rec.description}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {rec.time}
            </Badge>
          </div>
        ))}

        <Button
          onClick={() => onComplete({ onboardingComplete: true })}
          className="w-full mt-6"
          size="lg"
        >
          Start Protecting My Family
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Emotion-First Flow Step Components
 */
function FamilyImpactStep({ onComplete, onSkip }: { onComplete: (data: any) => void; onSkip: () => void }) {
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const people = [
    { id: 'spouse', label: 'Spouse/Partner', icon: Heart },
    { id: 'children', label: 'Children', icon: Users },
    { id: 'parents', label: 'Parents', icon: Shield },
    { id: 'siblings', label: 'Siblings', icon: Users },
    { id: 'extended', label: 'Extended Family', icon: Users },
  ];

  const togglePerson = (id: string) => {
    setSelectedPeople(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Who do you want to protect?
        </CardTitle>
        <p className="text-gray-600">
          Your family's security and peace of mind starts with you.
          Select everyone who matters most to you.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {people.map((person) => (
            <button
              key={person.id}
              onClick={() => togglePerson(person.id)}
              className={cn(
                'flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-gray-50 transition-all',
                selectedPeople.includes(person.id)
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200'
              )}
            >
              <person.icon className={cn(
                'h-5 w-5',
                selectedPeople.includes(person.id) ? 'text-blue-600' : 'text-gray-400'
              )} />
              <span className="font-medium">{person.label}</span>
              {selectedPeople.includes(person.id) && (
                <CheckCircle className="h-4 w-4 text-blue-600 ml-auto" />
              )}
            </button>
          ))}
        </div>

        {selectedPeople.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <Shield className="h-4 w-4 inline mr-1" />
              Great choice! We'll help you create a protection plan for{' '}
              {selectedPeople.length === 1 ? 'your loved one' : `all ${selectedPeople.length} of your loved ones`}.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onComplete({ protectedPeople: selectedPeople })}
            disabled={selectedPeople.length === 0}
            className="flex-1"
          >
            Continue Protecting My Family
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProtectionGoalsStep({ onComplete, onSkip }: { onComplete: (data: any) => void; onSkip: () => void }) {
  const [goals, setGoals] = useState<string[]>([]);

  const protectionGoals = [
    {
      id: 'emergency_access',
      title: 'Emergency Access to Information',
      description: 'Family can quickly find important documents and contacts',
      impact: 'High',
    },
    {
      id: 'financial_security',
      title: 'Financial Security',
      description: 'Clear instructions for accessing accounts and assets',
      impact: 'High',
    },
    {
      id: 'child_care',
      title: 'Child Care Instructions',
      description: 'Guardianship plans and care preferences',
      impact: 'Critical',
    },
    {
      id: 'legal_compliance',
      title: 'Legal Compliance',
      description: 'Documents that will stand up in court',
      impact: 'High',
    },
    {
      id: 'peace_of_mind',
      title: 'Peace of Mind',
      description: 'Know your family is prepared for anything',
      impact: 'Essential',
    },
  ];

  const toggleGoal = (id: string) => {
    setGoals(prev =>
      prev.includes(id)
        ? prev.filter(g => g !== id)
        : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          What would give you peace of mind?
        </CardTitle>
        <p className="text-gray-600">
          Select the protection goals that matter most to your family's future.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {protectionGoals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                'w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-all',
                goals.includes(goal.id)
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{goal.title}</h4>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
                <div className="ml-3 flex flex-col items-end">
                  <Badge
                    variant={goal.impact === 'Critical' ? 'destructive' : 'secondary'}
                    className="text-xs mb-2"
                  >
                    {goal.impact}
                  </Badge>
                  {goals.includes(goal.id) && (
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onComplete({ protectionGoals: goals })}
            disabled={goals.length === 0}
            className="flex-1"
          >
            Build My Protection Plan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PersonalInfoStep({ onComplete, onSkip }: { onComplete: (data: any) => void; onSkip: () => void }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Let's personalize your protection plan</CardTitle>
        <p className="text-gray-600">
          This helps us provide more relevant guidance and legal compliance.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="personal-name">Your Name</Label>
          <Input
            id="personal-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="location">State/Province</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., California, Ontario"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            This ensures your documents comply with local laws
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onComplete({ name, location })}
            disabled={!name.trim()}
            className="flex-1"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FirstActionStep({ onComplete, userData: _userData }: { onComplete: (data: any) => void; userData: any }) {
  const quickActions = [
    {
      id: 'upload_document',
      title: 'Upload Your First Document',
      description: 'Start with ID, insurance, or any important document',
      time: '2 minutes',
      impact: 'Immediate protection for your family',
      icon: Shield,
      primary: true,
    },
    {
      id: 'add_contact',
      title: 'Add Emergency Contact',
      description: 'Someone who can access your information if needed',
      time: '1 minute',
      impact: 'Peace of mind in emergencies',
      icon: Users,
      primary: false,
    },
    {
      id: 'start_will',
      title: 'Begin Will Creation',
      description: 'Start the guided will wizard for comprehensive protection',
      time: '5 minutes',
      impact: 'Complete family legal protection',
      icon: CheckCircle,
      primary: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Take your first protective step
        </CardTitle>
        <p className="text-gray-600">
          Every journey begins with a single step. Choose how you'd like to start protecting your family today.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickActions.map((action, _index) => (
          <button
            key={action.id}
            onClick={() => onComplete({ firstAction: action.id, onboardingComplete: true })}
            className={cn(
              'w-full p-4 text-left border rounded-lg hover:shadow-md transition-all',
              action.primary
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50'
            )}
          >
            <div className="flex items-start gap-3">
              <action.icon className={cn(
                'h-6 w-6 mt-1',
                action.primary ? 'text-blue-600' : 'text-gray-500'
              )} />
              <div className="flex-1">
                <h4 className="font-medium mb-1">{action.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {action.time}
                  </span>
                  <span className={cn(
                    'font-medium',
                    action.primary ? 'text-blue-600' : 'text-gray-600'
                  )}>
                    {action.impact}
                  </span>
                </div>
              </div>
              <ArrowRight className={cn(
                'h-4 w-4 mt-1',
                action.primary ? 'text-blue-600' : 'text-gray-400'
              )} />
            </div>
          </button>
        ))}

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            You can always do the other actions later from your dashboard
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ABTestOnboardingFlow;
