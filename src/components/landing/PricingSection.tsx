import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
  cta: string;
  ctaAction: () => void;
  highlighted?: boolean;
  badge?: string;
}

const PricingCard: React.FC<{ tier: PricingTier; index: number }> = ({ tier, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={cn(
        "relative flex flex-col h-full p-8 rounded-2xl border transition-all duration-300",
        tier.highlighted
          ? "bg-gradient-to-b from-primary/5 to-transparent border-primary/20 shadow-xl scale-105"
          : "bg-card/50 backdrop-blur-sm border-border hover:border-primary/20 hover:shadow-lg"
      )}
    >
      {tier.badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            <Star className="w-3 h-3" />
            {tier.badge}
          </span>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold">{tier.price}</span>
          {tier.period && (
            <span className="text-muted-foreground ml-2">/ {tier.period}</span>
          )}
        </div>
        <p className="text-muted-foreground">{tier.description}</p>
      </div>

      <div className="space-y-4 mb-8 flex-grow">
        {tier.features.map((feature, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium mb-1">{feature.title}</div>
              <div className="text-sm text-muted-foreground">
                {feature.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={tier.ctaAction}
        variant={tier.highlighted ? "default" : "outline"}
        className={cn(
          "w-full",
          tier.highlighted && "bg-primary hover:bg-primary/90"
        )}
      >
        {tier.cta}
      </Button>
    </motion.div>
  );
};

export const PricingSection: React.FC = () => {
  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Forever Free',
      price: '€0',
      description: 'The perfect starting point, powered by our mobile app.',
      features: [
        {
          title: 'Intelligent Document Scanner',
          description: 'Transform paper chaos into digital order with a single photo.'
        },
        {
          title: 'Basic Digital Vault',
          description: 'Secure storage for up to 10 of your most important documents.'
        },
        {
          title: 'Sofia AI Assistant (Basic)',
          description: 'Get help and answers to your basic questions.'
        },
        {
          title: 'Basic Family Shield',
          description: 'Invite 1 Guardian to ensure your family has someone to turn to.'
        }
      ],
      cta: 'Start with the Free App',
      ctaAction: () => {
        // Navigate to app download or sign up
        window.location.href = '/sign-up';
      }
    },
    {
      id: 'premium',
      name: 'Legacy Premium',
      price: '€9.99',
      period: 'month',
      description: 'For individuals ready to create a complete, lasting legacy.',
      highlighted: true,
      badge: 'Most Popular',
      features: [
        {
          title: 'Unlimited Digital Vault',
          description: 'Store everything that matters, without any limits.'
        },
        {
          title: 'Premium Will Creator',
          description: 'Create a legally robust will with our intelligent guide.'
        },
        {
          title: 'Time Capsule (Personal Messages)',
          description: 'Record video and audio messages to be delivered to your loved ones in the future.'
        },
        {
          title: 'Complete Family Shield',
          description: 'Set up detailed emergency protocols and invite unlimited Guardians.'
        },
        {
          title: 'Advanced AI Assistance',
          description: 'Sofia helps you draft your will and provides in-depth analysis.'
        }
      ],
      cta: 'Build Your Legacy',
      ctaAction: () => {
        // Navigate to premium sign up
        window.location.href = '/sign-up?plan=premium';
      }
    },
    {
      id: 'family',
      name: 'Family Premium',
      price: '€14.99',
      period: 'month',
      description: 'The ultimate solution for protecting your entire family circle.',
      features: [
        {
          title: 'Shared Access for up to 5 Members',
          description: 'Your entire family can collaborate in one connected ecosystem.'
        },
        {
          title: 'Shared Family Calendar',
          description: 'Track all important dates and anniversaries in one place.'
        },
        {
          title: 'Collaborative Family Shield',
          description: 'Together set up and test emergency protocols.'
        },
        {
          title: 'Visual Family Tree',
          description: 'Clearly map your entire family and assign roles and inheritance.'
        },
        {
          title: 'Priority Support',
          description: 'Get priority access to our team of experts.'
        }
      ],
      cta: 'Protect Your Entire Family',
      ctaAction: () => {
        // Navigate to family plan sign up
        window.location.href = '/sign-up?plan=family';
      }
    }
  ];

  return (
    <section className="relative py-24 px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            A Plan for Every Stage of Your Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start for free with our mobile app, and upgrade when you're ready to build your complete legacy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Bank-level encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Trusted by 50,000+ families</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Have questions?{' '}
            <a href="#faq" className="text-primary hover:underline">
              Check our FAQ
            </a>{' '}
            or{' '}
            <a href="#contact" className="text-primary hover:underline">
              contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
