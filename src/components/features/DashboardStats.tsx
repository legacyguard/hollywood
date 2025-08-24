import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { KPICard, type KPICardProps } from '@/components/ui/kpi-card';
import { useSupabaseClient } from '@/integrations/supabase/client';
import { useSofiaStore } from '@/stores/sofiaStore';

interface DashboardStatsProps {
  className?: string;
}

interface StatsData {
  documentsCount: number;
  guardiansCount: number;
  expiringDocuments: number;
  recentUploads: number;
}

export function DashboardStats({ className }: DashboardStatsProps) {
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseClient();
  const { context } = useSofiaStore();
  const [stats, setStats] = useState<StatsData>({
    documentsCount: 0,
    guardiansCount: 0,
    expiringDocuments: 0,
    recentUploads: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real stats from Supabase
  const fetchStats = useCallback(async () => {
    if (!userId) return;

    try {
      const supabase = await createSupabaseClient();
      
      // Fetch documents count
      const { count: docsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Fetch guardians count  
      const { count: guardiansCount } = await supabase
        .from('guardians')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true);

      // Fetch expiring documents (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { count: expiringCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .not('expires_at', 'is', null)
        .lte('expires_at', thirtyDaysFromNow.toISOString());

      // Fetch recent uploads (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: recentCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      setStats({
        documentsCount: docsCount || 0,
        guardiansCount: guardiansCount || 0,
        expiringDocuments: expiringCount || 0,
        recentUploads: recentCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, createSupabaseClient]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getStatsData = (): KPICardProps[] => {
    const completionPercentage = Math.min(100, Math.round(
      ((stats.documentsCount > 0 ? 30 : 0) + 
       (stats.guardiansCount > 0 ? 40 : 0) + 
       (stats.documentsCount >= 3 ? 30 : 0)) * 100 / 100
    ));

    return [
      {
        title: 'Documents Secured',
        value: stats.documentsCount.toString(),
        change: stats.recentUploads > 0 ? `+${stats.recentUploads} this month` : 'No recent uploads',
        changeType: stats.recentUploads > 0 ? 'positive' : 'neutral',
        trendType: stats.recentUploads > 0 ? 'up' : 'neutral',
        showTrend: true
      },
      {
        title: 'Guardians Added',
        value: stats.guardiansCount.toString(),
        change: stats.guardiansCount > 0 ? 'Setup complete' : 'Needs setup',
        changeType: stats.guardiansCount > 0 ? 'positive' : 'negative',
        trendType: stats.guardiansCount > 0 ? 'up' : 'down',
        showTrend: true
      },
      {
        title: 'Legacy Progress',
        value: `${completionPercentage}%`,
        change: completionPercentage >= 50 ? 'Great progress!' : 'Keep going!',
        changeType: completionPercentage >= 50 ? 'positive' : 'neutral',
        trendType: completionPercentage >= 50 ? 'up' : 'neutral',
        showTrend: true
      },
      {
        title: 'Expiring Soon',
        value: stats.expiringDocuments.toString(),
        change: stats.expiringDocuments > 0 ? 'Needs attention' : 'All current',
        changeType: stats.expiringDocuments > 0 ? 'negative' : 'positive',
        trendType: stats.expiringDocuments > 0 ? 'down' : 'up',
        showTrend: true
      }
    ];
  };

  const statsCards = getStatsData();

  if (isLoading) {
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
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-card rounded-lg p-6 border animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </dl>
      </div>
    );
  }

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
        {statsCards.map((stat, index) => (
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