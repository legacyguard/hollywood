import React from 'react';
import { Icon } from '@/components/ui/icon-library';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { useNavigate } from 'react-router-dom';
import { useDocumentFilter } from '@/contexts/DocumentFilterContext';

interface BundleCard {
  id: string;
  name: string;
  category: 'vehicle' | 'property' | 'financial' | 'legal' | 'health' | 'personal';
  primaryEntity: string;
  documentCount: number;
  lastUpdated: string;
  isRecent?: boolean;
}

interface LegacyOverviewSectionProps {
  className?: string;
}

const categoryIcons = {
  vehicle: 'car',
  property: 'home',
  financial: 'credit-card',
  legal: 'file-text',
  health: 'heart',
  personal: 'user'
} as const;

const categoryColors = {
  vehicle: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  property: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  financial: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  legal: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
  health: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  personal: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
} as const;

export const LegacyOverviewSection: React.FC<LegacyOverviewSectionProps> = ({ className }) => {
  const navigate = useNavigate();
  const { setFilter } = useDocumentFilter();

  // Mock data - in real implementation, this would come from API/hooks
  const bundleCards: BundleCard[] = [
    {
      id: '1',
      name: 'Vozidlo: Škoda Octavia',
      category: 'vehicle',
      primaryEntity: 'Škoda Octavia 2019',
      documentCount: 4,
      lastUpdated: '2025-01-20',
      isRecent: true
    },
    {
      id: '2',
      name: 'Nehnuteľnosť: Byt na Hlavnej',
      category: 'property', 
      primaryEntity: 'Hlavná 123, Bratislava',
      documentCount: 3,
      lastUpdated: '2025-01-18'
    },
    {
      id: '3',
      name: 'Financie: Účty a Investície',
      category: 'financial',
      primaryEntity: 'VÚB Banka, Tatra Banka',
      documentCount: 6,
      lastUpdated: '2025-01-15'
    },
    {
      id: '4',
      name: 'Zdravie: Lekárske záznamy',
      category: 'health',
      primaryEntity: 'Dr. Novák, Poliklinika',
      documentCount: 2,
      lastUpdated: '2025-01-10'
    },
    {
      id: '5',
      name: 'Právne: Zmluvy a Dokumenty',
      category: 'legal',
      primaryEntity: 'Hypotéka, Poistenie',
      documentCount: 5,
      lastUpdated: '2025-01-12'
    }
  ];

  const handleBundleClick = (bundle: BundleCard) => {
    // Apply bundle filter and navigate to vault
    setFilter({
      bundleName: bundle.name,
      category: bundle.category
    });
    navigate('/vault');
  };

  // Sort bundles by recent updates and importance
  const sortedBundles = bundleCards
    .sort((a, b) => {
      // Recent items first
      if (a.isRecent && !b.isRecent) return -1;
      if (!a.isRecent && b.isRecent) return 1;
      
      // Then by document count (more important)
      if (a.documentCount !== b.documentCount) {
        return b.documentCount - a.documentCount;
      }
      
      // Finally by last updated
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    })
    .slice(0, 5); // Show top 5 most relevant bundles

  return (
    <FadeIn duration={0.5} delay={0.5}>
      <section className={className}>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="folder" className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold font-heading text-card-foreground">
              Oblasti Vášho Štítu
            </h2>
          </div>
          <p className="text-muted-foreground">
            Kľúčové oblasti života, ktoré vaša ochrana pokrýva
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedBundles.map((bundle, index) => (
            <FadeIn key={bundle.id} duration={0.4} delay={0.1 * index}>
              <Card 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleBundleClick(bundle)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${categoryColors[bundle.category]}`}>
                    <Icon name={categoryIcons[bundle.category]} className="w-5 h-5" />
                  </div>
                  {bundle.isRecent && (
                    <Badge variant="secondary" className="text-xs">
                      Nové
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                  {bundle.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {bundle.primaryEntity}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {bundle.documentCount} dokumentov
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Naposledy aktualizované: {new Date(bundle.lastUpdated).toLocaleDateString('sk-SK', { 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Optional: Show all bundles link */}
        <div className="mt-6 text-center">
          <FadeIn duration={0.4} delay={0.6}>
            <button
              onClick={() => navigate('/vault')}
              className="text-primary hover:text-primary-hover text-sm font-medium underline decoration-dotted underline-offset-4"
            >
              Zobraziť všetky balíčky dokumentov →
            </button>
          </FadeIn>
        </div>
      </section>
    </FadeIn>
  );
};