/**
 * Professional Review Pricing Tiers
 * Premium pricing display for legal review services
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Star,
  Clock,
  FileText,
  CheckCircle,
  Award,
  Zap,
  Users,
  Phone,
  Calendar,
  ArrowRight,
  Sparkles,
  Crown,
  MessageSquare,
  BookOpen,
  Scale,
  Heart,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { cn } from '@/lib/utils';

interface ReviewTier {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  estimatedTime: string;
  turnaroundTime: string;
  features: ReviewFeature[];
  includes: string[];
  bestFor: string[];
  popular?: boolean;
  premium?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ReviewFeature {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  included: boolean;
}

interface ProfessionalReviewPricingProps {
  onSelectTier: (tierId: string) => void;
  selectedTier?: string;
  documentType?: string;
  familyContext?: {
    members: number;
    minorChildren: boolean;
    complexAssets: boolean;
    businessInterests: boolean;
  };
  className?: string;
}

const REVIEW_TIERS: ReviewTier[] = [
  {
    id: 'basic',
    name: 'Basic Review',
    description: 'Essential legal review for straightforward documents',
    price: 149,
    originalPrice: 199,
    estimatedTime: '2-3 hours',
    turnaroundTime: '2-3 business days',
    icon: Shield,
    color: 'blue',
    features: [
      {
        name: 'Document Structure Review',
        description: 'Check overall document organization and completeness',
        icon: FileText,
        included: true
      },
      {
        name: 'Legal Compliance Check',
        description: 'Verify compliance with state laws and regulations',
        icon: Scale,
        included: true
      },
      {
        name: 'Basic Error Detection',
        description: 'Identify obvious errors and inconsistencies',
        icon: Target,
        included: true
      },
      {
        name: 'Written Summary',
        description: 'Brief summary of findings and recommendations',
        icon: BookOpen,
        included: true
      },
      {
        name: 'Follow-up Call',
        description: 'One 15-minute follow-up call to discuss findings',
        icon: Phone,
        included: false
      },
      {
        name: 'Priority Processing',
        description: 'Fast-track your review ahead of regular queue',
        icon: Zap,
        included: false
      }
    ],
    includes: [
      'Document structure and completeness review',
      'Basic legal compliance verification',
      'Written findings report',
      'Email support during review process'
    ],
    bestFor: [
      'Simple wills with standard provisions',
      'Basic estate planning documents',
      'Documents with straightforward family situations'
    ]
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Review',
    description: 'Thorough analysis with detailed recommendations',
    price: 349,
    originalPrice: 449,
    estimatedTime: '4-6 hours',
    turnaroundTime: '3-5 business days',
    icon: Star,
    color: 'purple',
    popular: true,
    features: [
      {
        name: 'Document Structure Review',
        description: 'Check overall document organization and completeness',
        icon: FileText,
        included: true
      },
      {
        name: 'Legal Compliance Check',
        description: 'Verify compliance with state laws and regulations',
        icon: Scale,
        included: true
      },
      {
        name: 'Advanced Error Detection',
        description: 'Deep analysis for subtle issues and improvements',
        icon: Target,
        included: true
      },
      {
        name: 'Detailed Written Report',
        description: 'Comprehensive report with specific recommendations',
        icon: BookOpen,
        included: true
      },
      {
        name: 'Follow-up Call',
        description: 'One 30-minute consultation to discuss findings',
        icon: Phone,
        included: true
      },
      {
        name: 'Priority Processing',
        description: 'Fast-track your review ahead of regular queue',
        icon: Zap,
        included: false
      }
    ],
    includes: [
      'Everything in Basic Review',
      'Advanced legal strategy analysis',
      'Tax optimization recommendations',
      'Family protection assessment',
      '30-minute consultation call',
      'Revision suggestions with reasoning'
    ],
    bestFor: [
      'Complex family situations',
      'Significant assets or business interests',
      'Multi-generational planning needs',
      'Tax optimization requirements'
    ]
  },
  {
    id: 'certified',
    name: 'Certified Review',
    description: 'Premium service with legal certification and ongoing support',
    price: 749,
    originalPrice: 999,
    estimatedTime: '6-8 hours',
    turnaroundTime: '5-7 business days',
    icon: Crown,
    color: 'gold',
    premium: true,
    features: [
      {
        name: 'Document Structure Review',
        description: 'Check overall document organization and completeness',
        icon: FileText,
        included: true
      },
      {
        name: 'Legal Compliance Check',
        description: 'Verify compliance with state laws and regulations',
        icon: Scale,
        included: true
      },
      {
        name: 'Comprehensive Analysis',
        description: 'Complete legal, tax, and strategic analysis',
        icon: Target,
        included: true
      },
      {
        name: 'Certified Legal Opinion',
        description: 'Formal legal opinion with professional certification',
        icon: BookOpen,
        included: true
      },
      {
        name: 'Extended Consultation',
        description: 'One 60-minute consultation with unlimited follow-up',
        icon: Phone,
        included: true
      },
      {
        name: 'Priority Processing',
        description: 'Highest priority processing with dedicated attorney',
        icon: Zap,
        included: true
      }
    ],
    includes: [
      'Everything in Comprehensive Review',
      'Formal legal certification',
      'Multi-jurisdiction compliance check',
      '60-minute consultation + unlimited follow-up',
      'Document revision assistance',
      '90-day support period',
      'Emergency contact access'
    ],
    bestFor: [
      'High-value estates ($1M+)',
      'Complex business structures',
      'Multi-state property ownership',
      'Regulatory compliance requirements',
      'Peace of mind with formal certification'
    ]
  }
];

export function ProfessionalReviewPricing({
  onSelectTier,
  selectedTier,
  documentType = 'will',
  familyContext,
  className
}: ProfessionalReviewPricingProps) {
  const [showComparison, setShowComparison] = useState(false);

  const getRecommendedTier = (): string => {
    if (!familyContext) return 'basic';

    let score = 0;
    if (familyContext.members > 4) score += 2;
    if (familyContext.minorChildren) score += 1;
    if (familyContext.complexAssets) score += 2;
    if (familyContext.businessInterests) score += 3;

    if (score >= 5) return 'certified';
    if (score >= 2) return 'comprehensive';
    return 'basic';
  };

  const recommendedTier = getRecommendedTier();

  const getTierColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500 to-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'gold':
        return {
          gradient: 'from-yellow-500 to-orange-500',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          button: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  return (
    <motion.div
      initial={{  opacity: 0, y: 20  }}
      animate={{  opacity: 1, y: 0  }}
      className={cn('space-y-8', className)}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Professional Legal Review
        </div>
        <h2 className="text-3xl font-bold">Choose Your Review Level</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get your estate planning documents reviewed by licensed attorneys with our tiered service levels.
          Each review includes legal compliance verification and personalized recommendations.
        </p>
      </div>

      {/* Recommended Tier Alert */}
      {familyContext && (
        <Alert className="border-green-200 bg-green-50 max-w-3xl mx-auto">
          <Heart className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Recommended for Your Family</AlertTitle>
          <AlertDescription className="text-green-700">
            Based on your family situation ({familyContext.members} members
            {familyContext.minorChildren && ', minor children'}
            {familyContext.complexAssets && ', complex assets'}
            {familyContext.businessInterests && ', business interests'}),
            we recommend the <strong>{REVIEW_TIERS.find(t => t.id === recommendedTier)?.name}</strong> for optimal protection.
          </AlertDescription>
        </Alert>
      )}

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {REVIEW_TIERS.map((tier, index) => {
          const colors = getTierColorClasses(tier.color);
          const isRecommended = tier.id === recommendedTier;
          const isSelected = selectedTier === tier.id;

          return (
            <motion.div
              key={tier.id}
              initial={{  opacity: 0, y: 20  }}
              animate={{  opacity: 1, y: 0  }}
              transition={{  delay: index * 0.1  }}
              className="relative"
            >
              <Card className={cn(
                'relative overflow-hidden transition-all duration-300 hover:shadow-xl',
                isSelected && 'ring-2 ring-blue-500 shadow-lg',
                isRecommended && 'ring-2 ring-green-500',
                tier.premium && 'border-2 border-yellow-200'
              )}>
                {/* Header */}
                <div className={cn('relative p-6 text-white bg-gradient-to-br', colors.gradient)}>
                  {tier.popular && (
                    <div className="absolute -top-1 -right-1">
                      <Badge className="bg-white text-purple-700 font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {tier.premium && (
                    <div className="absolute -top-1 -right-1">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}

                  {isRecommended && (
                    <div className="absolute -top-1 -left-1">
                      <Badge className="bg-green-600 text-white font-semibold">
                        <Heart className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <tier.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <p className="text-white/80 text-sm">{tier.description}</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold">${tier.price}</span>
                    {tier.originalPrice && (
                      <span className="text-lg text-white/60 line-through">${tier.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {tier.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {tier.turnaroundTime}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* What's Included */}
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      What's Included
                    </h4>
                    <ul className="space-y-2">
                      {tier.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="mb-6" />

                  {/* Best For */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      Best For
                    </h4>
                    <ul className="space-y-1">
                      {tier.bestFor.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 text-blue-600 flex-shrink-0 mt-1" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Select Button */}
                  <Button
                    onClick={() => onSelectTier(tier.id)}
                    className={cn('w-full font-semibold', colors.button)}
                    variant={isSelected ? 'default' : 'outline'}
                  >
                    {isSelected ? 'Selected' : 'Choose This Plan'}
                    {!isSelected && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>

                  {tier.originalPrice && (
                    <p className="text-center text-sm text-green-600 mt-2 font-medium">
                      Save ${tier.originalPrice - tier.price} • Limited Time
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison Toggle */}
      <div className="text-center">
        <Button
          variant={"outline" as any}
          onClick={() => setShowComparison(!showComparison)}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          {showComparison ? 'Hide' : 'Show'} Detailed Feature Comparison
        </Button>
      </div>

      {/* Detailed Feature Comparison */}
      {showComparison && (
        <motion.div
          initial={{  opacity: 0, height: 0  }}
          animate={{  opacity: 1, height: 'auto'  }}
          exit={{  opacity: 0, height: 0  }}
          className="max-w-6xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      {REVIEW_TIERS.map(tier => (
                        <th key={tier.id} className="text-center py-3 px-4 min-w-32">
                          <div className={cn('p-2 rounded-lg', getTierColorClasses(tier.color).bg)}>
                            {tier.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REVIEW_TIERS[0].features.map(feature => (
                      <tr key={feature.name} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <feature.icon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{feature.name}</div>
                              <div className="text-sm text-muted-foreground">{feature.description}</div>
                            </div>
                          </div>
                        </td>
                        {REVIEW_TIERS.map(tier => {
                          const tierFeature = tier.features.find(f => f.name === feature.name);
                          return (
                            <td key={`${tier.id}-${feature.name}`} className="text-center py-3 px-4">
                              {tierFeature?.included ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <div className="w-5 h-5 bg-gray-200 rounded-full mx-auto" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Trust Indicators */}
      <div className="bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold">Licensed Attorneys</h4>
            <p className="text-sm text-muted-foreground">
              All reviews conducted by licensed, verified attorneys with estate planning expertise
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold">Quality Guaranteed</h4>
            <p className="text-sm text-muted-foreground">
              100% satisfaction guarantee with unlimited revisions on recommendations
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold">Family Focused</h4>
            <p className="text-sm text-muted-foreground">
              Specialized in family protection with personalized recommendations for your situation
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
