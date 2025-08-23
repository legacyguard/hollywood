import React from 'react';
import { KPICard, type KPICardProps } from '@/components/ui/kpi-card';
import { useSofiaStore } from '@/stores/sofiaStore';

interface DashboardStatsProps {
  className?: string;
}

export function DashboardStats({ className }: DashboardStatsProps) {
  const { context } = useSofiaStore();

  // Mock data - in real implementation, this would come from Supabase
  const getStatsData = (): KPICardProps[] => {
    // Calculate stats based on user progress
    const documentsCount = 12; // From documents table
    const guardiansCount = 2; // From guardians table
    const completionPercentage = 65; // Calculate from pillar progress
    const expiringDocuments = 3; // Documents expiring in next 30 days

    return [
      {
        title: 'Documents Secured',
        value: documentsCount.toString(),
        change: '+3 this month',
        changeType: 'positive',
        trendType: 'up',
        showTrend: true
      },
      {
        title: 'Guardians Added',
        value: guardiansCount.toString(),
        change: guardiansCount > 0 ? 'Setup complete' : 'Needs setup',
        changeType: guardiansCount > 0 ? 'positive' : 'negative',
        trendType: guardiansCount > 0 ? 'up' : 'down',
        showTrend: true
      },
      {
        title: 'Legacy Progress',
        value: `${completionPercentage}%`,
        change: '+15% this month',
        changeType: 'positive',
        trendType: 'up',
        showTrend: true
      },
      {
        title: 'Expiring Soon',
        value: expiringDocuments.toString(),
        change: expiringDocuments > 0 ? 'Needs attention' : 'All current',
        changeType: expiringDocuments > 0 ? 'negative' : 'positive',
        trendType: expiringDocuments > 0 ? 'down' : 'up',
        showTrend: true
      }
    ];
  };

  const stats = getStatsData();

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Your Progress Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Track your journey as Guardian of Memories
        </p>
      </div>
      
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <KPICard
            key={index}
            {...stat}
            className="hover:shadow-md transition-shadow duration-200"
          />
        ))}
      </dl>
    </div>
  );
}

export default DashboardStats;