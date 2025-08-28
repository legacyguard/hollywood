/**
 * Upgrade Prompts and Messaging System
 * Smart upgrade prompts that trigger at optimal moments with compelling value propositions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle,
  X,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradePromptProps {
  trigger: 'family-limit' | 'professional-review' | 'analytics-limit' | 'time-capsule' | 'priority-support';
  currentPlan: 'free' | 'premium' | 'family' | 'professional';
  userId: string;
  onUpgrade?: (plan: string) => void;
  onDismiss?: () => void;
}

interface PlanFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface UpgradePlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  recommended?: boolean;
}

export const UpgradePrompts: React.FC<UpgradePromptProps> = ({
  trigger,
  currentPlan,
  userId,
  onUpgrade,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getPromptContent = () => {
    switch (trigger) {
      case 'family-limit':
        return {
          title: "Family Plan Needed",
          subtitle: "You've reached your 2 family member limit",
          description: "Add unlimited family members and unlock collaborative features with our Family Plan.",
          icon: Users,
          urgency: "high",
          benefits: [
            "Unlimited family member invitations",
            "Advanced collaboration tools",
            "Shared family calendar and timeline",
            "Family decision voting system"
          ]
        };
      
      case 'professional-review':
        return {
          title: "Get Professional Review",
          subtitle: "Ensure your documents are legally sound",
          description: "Connect with verified attorneys for professional document review and legal guidance.",
          icon: Shield,
          urgency: "medium",
          benefits: [
            "Access to verified legal professionals",
            "Professional document reviews",
            "Legal compliance checking",
            "Direct consultation booking"
          ]
        };

      case 'analytics-limit':
        return {
          title: "Unlock Advanced Analytics",
          subtitle: "Get deeper insights into your family's protection",
          description: "Premium analytics provide AI-powered recommendations and comprehensive risk assessment.",
          icon: TrendingUp,
          urgency: "low",
          benefits: [
            "AI-powered family risk assessment",
            "Personalized improvement recommendations",
            "Advanced progress tracking",
            "Historical trend analysis"
          ]
        };

      case 'time-capsule':
        return {
          title: "Create Time Capsules",
          subtitle: "Preserve memories for future generations",
          description: "Premium Time Capsule feature lets you create scheduled messages and memory preservation.",
          icon: Clock,
          urgency: "medium",
          benefits: [
            "Unlimited time capsule creation",
            "Video and audio messages",
            "Scheduled delivery system",
            "Multi-generational sharing"
          ]
        };

      case 'priority-support':
        return {
          title: "Need Priority Support?",
          subtitle: "Get faster help when you need it most",
          description: "Premium users get priority support with dedicated assistance for urgent family matters.",
          icon: Crown,
          urgency: "low",
          benefits: [
            "Priority customer support",
            "Dedicated account manager",
            "24/7 urgent assistance",
            "Phone and video support"
          ]
        };

      default:
        return {
          title: "Upgrade to Premium",
          subtitle: "Unlock all features",
          description: "Get access to all premium features and enhanced family protection.",
          icon: Star,
          urgency: "low",
          benefits: []
        };
    }
  };

  const plans: UpgradePlan[] = [
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'month',
      description: 'Perfect for individuals and small families',
      features: [
        { name: 'Up to 5 family members', included: true },
        { name: 'Professional document reviews', included: true, highlight: true },
        { name: 'Advanced analytics & insights', included: true },
        { name: 'Priority support', included: true },
        { name: 'Time capsule creation', included: true },
        { name: 'Unlimited document storage', included: true }
      ]
    },
    {
      id: 'family',
      name: 'Family Plan',
      price: '$19.99',
      period: 'month',
      description: 'Best for larger families with collaboration needs',
      popular: true,
      recommended: trigger === 'family-limit',
      features: [
        { name: 'Unlimited family members', included: true, highlight: true },
        { name: 'Advanced collaboration tools', included: true, highlight: true },
        { name: 'Family decision voting', included: true },
        { name: 'Shared family timeline', included: true },
        { name: 'Multi-generational features', included: true },
        { name: 'Everything in Premium', included: true }
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$39.99',
      period: 'month',
      description: 'For those who need comprehensive legal support',
      recommended: trigger === 'professional-review',
      features: [
        { name: 'Unlimited attorney consultations', included: true, highlight: true },
        { name: 'Legal compliance monitoring', included: true, highlight: true },
        { name: 'Dedicated legal advisor', included: true },
        { name: 'Advanced estate planning tools', included: true },
        { name: 'White-glove setup service', included: true },
        { name: 'Everything in Family Plan', included: true }
      ]
    }
  ];

  const promptContent = getPromptContent();
  const IconComponent = promptContent.icon;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-orange-500 bg-orange-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    onUpgrade?.(planId);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
    
    // Track dismissal for smart timing
    const dismissals = JSON.parse(localStorage.getItem(`upgrade-dismissals-${userId}`) || '[]');
    dismissals.push({
      trigger,
      dismissedAt: new Date().toISOString(),
      currentPlan
    });
    localStorage.setItem(`upgrade-dismissals-${userId}`, JSON.stringify(dismissals));
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className={cn("relative", getUrgencyColor(promptContent.urgency))}>
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header */}
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {promptContent.title}
                </DialogTitle>
                <p className="text-lg text-gray-600 mt-1">
                  {promptContent.subtitle}
                </p>
                <p className="text-gray-600 mt-2">
                  {promptContent.description}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Benefits */}
          <div className="px-6 pb-4">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                  What you'll get:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {promptContent.benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans */}
          <div className="p-6 bg-white">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Plan</h3>
              <p className="text-gray-600">All plans include a 14-day free trial</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative",
                    plan.popular || plan.recommended ? "transform scale-105" : ""
                  )}
                >
                  <Card className={cn(
                    "cursor-pointer transition-all hover:shadow-lg border-2",
                    selectedPlan === plan.id 
                      ? "border-blue-500 bg-blue-50" 
                      : plan.popular || plan.recommended
                      ? "border-purple-500"
                      : "border-gray-200 hover:border-gray-300"
                  )}>
                    {(plan.popular || plan.recommended) && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          {plan.popular ? 'Most Popular' : 'Recommended'}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center p-6">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {plan.name}
                      </CardTitle>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {plan.price}
                        <span className="text-base font-normal text-gray-500">
                          /{plan.period}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </CardHeader>

                    <CardContent className="px-6 pb-6">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className={cn(
                              "h-4 w-4 mr-3 mt-0.5 flex-shrink-0",
                              feature.highlight ? "text-green-500" : "text-gray-400"
                            )} />
                            <span className={cn(
                              feature.highlight ? "font-medium text-gray-900" : "text-gray-600"
                            )}>
                              {feature.name}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={cn(
                          "w-full",
                          plan.popular || plan.recommended
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            : ""
                        )}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {currentPlan === 'free' ? 'Start Free Trial' : 'Upgrade Now'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>

                      {currentPlan === 'free' && (
                        <p className="text-center text-xs text-gray-500 mt-2">
                          No credit card required for trial
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Cancel anytime
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  30-day money-back guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Smart upgrade trigger component
interface SmartUpgradeTriggerProps {
  userId: string;
  currentPlan: 'free' | 'premium' | 'family' | 'professional';
  onUpgrade?: (plan: string) => void;
}

export const SmartUpgradeTrigger: React.FC<SmartUpgradeTriggerProps> = ({
  userId,
  currentPlan,
  onUpgrade
}) => {
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);

  useEffect(() => {
    // Smart trigger logic based on user behavior
    const checkTriggers = () => {
      // Family limit trigger
      if (currentPlan === 'free') {
        const familyMembers = JSON.parse(localStorage.getItem(`family-members-${userId}`) || '[]');
        if (familyMembers.length >= 2) {
          setActiveTrigger('family-limit');
          return;
        }
      }

      // Professional review trigger
      const documentsUploaded = JSON.parse(localStorage.getItem(`documents-${userId}`) || '[]');
      if (documentsUploaded.length >= 3 && currentPlan === 'free') {
        setActiveTrigger('professional-review');
        return;
      }

      // Analytics limit trigger
      const analyticsViews = parseInt(localStorage.getItem(`analytics-views-${userId}`) || '0');
      if (analyticsViews >= 5 && currentPlan === 'free') {
        setActiveTrigger('analytics-limit');
        return;
      }
    };

    // Check triggers after a delay to avoid immediate popup
    const timer = setTimeout(checkTriggers, 2000);
    return () => clearTimeout(timer);
  }, [userId, currentPlan]);

  const shouldShowTrigger = (trigger: string) => {
    // Check dismissal history to avoid spam
    const dismissals = JSON.parse(localStorage.getItem(`upgrade-dismissals-${userId}`) || '[]');
    const recentDismissals = dismissals.filter((d: any) => 
      d.trigger === trigger && 
      new Date(d.dismissedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours
    );
    
    return recentDismissals.length === 0;
  };

  const handleDismiss = () => {
    setActiveTrigger(null);
  };

  if (!activeTrigger || !shouldShowTrigger(activeTrigger)) {
    return null;
  }

  return (
    <UpgradePrompts
      trigger={activeTrigger as any}
      currentPlan={currentPlan}
      userId={userId}
      onUpgrade={onUpgrade}
      onDismiss={handleDismiss}
    />
  );
};

// Inline upgrade prompts for specific features
interface FeatureUpgradePromptProps {
  feature: string;
  currentPlan: string;
  className?: string;
  onUpgrade?: () => void;
}

export const FeatureUpgradePrompt: React.FC<FeatureUpgradePromptProps> = ({
  feature,
  currentPlan,
  className,
  onUpgrade
}) => {
  const getFeatureInfo = () => {
    switch (feature) {
      case 'professional-review':
        return {
          title: 'Professional Review',
          description: 'Get your documents reviewed by verified attorneys',
          requiredPlan: 'Premium',
          icon: Shield
        };
      case 'advanced-analytics':
        return {
          title: 'Advanced Analytics',
          description: 'AI-powered insights and risk assessment',
          requiredPlan: 'Premium',
          icon: TrendingUp
        };
      case 'family-collaboration':
        return {
          title: 'Family Collaboration',
          description: 'Unlimited family members and collaboration tools',
          requiredPlan: 'Family',
          icon: Users
        };
      default:
        return {
          title: 'Premium Feature',
          description: 'This feature requires a premium plan',
          requiredPlan: 'Premium',
          icon: Lock
        };
    }
  };

  const featureInfo = getFeatureInfo();
  const IconComponent = featureInfo.icon;

  return (
    <Card className={cn("border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50", className)}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {featureInfo.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {featureInfo.description}
            </p>
            <Badge className="bg-purple-100 text-purple-800 mb-4">
              <Crown className="h-3 w-3 mr-1" />
              {featureInfo.requiredPlan} Required
            </Badge>
          </div>

          <Button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Star className="h-4 w-4 mr-2" />
            Upgrade to {featureInfo.requiredPlan}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};