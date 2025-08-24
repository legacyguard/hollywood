import React from 'react';
import { Icon } from '@/components/ui/icon-library';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn } from '@/components/motion/FadeIn';

interface AttentionItem {
  id: string;
  type: 'expiration' | 'guardian' | 'sofia_suggestion' | 'milestone';
  title: string;
  description: string;
  icon: string;
  actionText: string;
  onAction: () => void;
  urgency?: 'low' | 'medium' | 'high';
}

interface AttentionSectionProps {
  className?: string;
}

export const AttentionSection: React.FC<AttentionSectionProps> = ({ className }) => {
  // Mock data - in real implementation, this would come from API/hooks
  const attentionItems: AttentionItem[] = [
    {
      id: '1',
      type: 'expiration',
      title: 'Váš pas exspiruje o 28 dní',
      description: 'Odporúčam skontrolovať možnosti obnovenia',
      icon: 'calendar',
      actionText: 'Zobraziť detail',
      onAction: () => console.log('Show passport details'),
      urgency: 'medium'
    },
    {
      id: '2', 
      type: 'guardian',
      title: 'Pozvali ste Janu Novákovú ako strážcu',
      description: 'Zatiaľ sa nepripojila k vašemu kruhu dôvery',
      icon: 'user-plus',
      actionText: 'Poslať pripomienku',
      onAction: () => console.log('Send reminder to guardian'),
      urgency: 'low'
    },
    {
      id: '3',
      type: 'sofia_suggestion',
      title: 'Sofia navrhuje prepojiť 2 nové dokumenty',
      description: 'Do balíčka "Hypotéka VÚB" môžeme pridať súvisiace dokumenty',
      icon: 'sparkles',
      actionText: 'Zobraziť návrh',
      onAction: () => console.log('Show Sofia suggestion'),
      urgency: 'low'
    }
  ];

  // If no items need attention, don't render the section
  if (attentionItems.length === 0) {
    return null;
  }

  const getUrgencyStyles = (urgency: AttentionItem['urgency']) => {
    switch (urgency) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getIconColor = (urgency: AttentionItem['urgency']) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <FadeIn duration={0.5} delay={0.3}>
      <section className={className}>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="alert-circle" className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold font-heading text-card-foreground">
              Vyžaduje si Vašu Pozornosť
            </h2>
          </div>
          <p className="text-muted-foreground">
            Dôležité úlohy a návrhy, ktoré si zasluhujú vašu starostlivosť
          </p>
        </div>

        <div className="space-y-4">
          {attentionItems.map((item, index) => (
            <FadeIn key={item.id} duration={0.4} delay={0.1 * index}>
              <Card className={`p-4 border-l-4 ${getUrgencyStyles(item.urgency)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg bg-background ${getIconColor(item.urgency)}`}>
                      <Icon name={item.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={item.onAction}
                    className="ml-4 shrink-0"
                  >
                    {item.actionText}
                  </Button>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </FadeIn>
  );
};