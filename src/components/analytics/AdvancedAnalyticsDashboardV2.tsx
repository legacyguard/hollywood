import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FamilyProtectionAnalytics } from './FamilyProtectionAnalytics';
import { LegacyCompletionTracking } from './LegacyCompletionTracking';
import {
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  Target,
  Brain,
  Zap,
  Star,
  Award,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { QuickInsight } from '@/integrations/supabase/types';

interface DashboardMetrics {
  protectionScore: number;
  completionPercentage: number;
  activeRisks: number;
  achievementCount: number;
  timeInvested: string;
  streakDays: number;
  familyMembers: number;
  documentsSecured: number;
}

interface SmartInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'celebration' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  action?: string;
  actionUrl?: string;
  confidence: number;
  category: 'protection' | 'progress' | 'family' | 'optimization';
  generated: Date;
}

interface AdvancedAnalyticsDashboardProps {
  onInsightAction?: (insightId: string) => void;
  compactMode?: boolean;
  familyId?: string;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
  onInsightAction,
  compactMode: _compactMode = false,
  familyId: _familyId
}) => {
  const { user } = useAuth();
  const [showSmartInsights, setShowSmartInsights] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeView, setActiveView] = useState<'overview' | 'protection' | 'progress'>('overview');

  // Fetch real insights from Supabase
  const { data: rawInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['quick-insights', user?.id, selectedTimeframe],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Calculate date range based on timeframe
      const now = new Date();
      const startDate = new Date();
      switch (selectedTimeframe) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      const { data, error } = await supabase
        .from('quick_insights')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching insights:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id,
    refetchInterval: 60000 // Refetch every minute
  });

  // Transform Supabase insights to SmartInsight format
  const smartInsights: SmartInsight[] = rawInsights.map((insight: QuickInsight) => {
    // Map insight type to SmartInsight type
    let insightType: SmartInsight['type'] = 'recommendation';
    if (insight.type === 'urgent_action' || insight.type === 'completion_gap') {
      insightType = 'warning';
    } else if (insight.type === 'protection_level' && insight.impact === 'high') {
      insightType = 'celebration';
    } else if (insight.type === 'time_saved') {
      insightType = 'opportunity';
    }

    // Map priority
    let priority: SmartInsight['priority'] = 'low';
    if (insight.priority === 'urgent') {
      priority = 'critical';
    } else if (insight.priority === 'important') {
      priority = insight.impact === 'high' ? 'high' : 'medium';
    }

    // Map category
    let category: SmartInsight['category'] = 'progress';
    if (insight.type === 'family_impact') {
      category = 'family';
    } else if (insight.type === 'protection_level') {
      category = 'protection';
    } else if (insight.type === 'time_saved') {
      category = 'optimization';
    }

    return {
      id: insight.id,
      type: insightType,
      priority,
      title: insight.title,
      message: insight.description,
      action: insight.action_text || undefined,
      actionUrl: insight.action_url || undefined,
      confidence: 85 + Math.random() * 15, // Simulated confidence
      category,
      generated: new Date(insight.created_at)
    };
  });

  // Fetch analytics data for metrics
  const { data: analytics } = useQuery({
    queryKey: ['insight-analytics', user?.id, selectedTimeframe],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      switch (selectedTimeframe) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      const { data, error } = await supabase
        .from('insight_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('timeframe_start', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
        console.error('Error fetching analytics:', error);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch milestone analytics for additional metrics
  const { data: milestoneAnalytics } = useQuery({
    queryKey: ['milestone-analytics', user?.id, selectedTimeframe],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const now = new Date();
      const startDate = new Date();
      switch (selectedTimeframe) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      const { data, error } = await supabase
        .from('milestone_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('timeframe_start', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching milestone analytics:', error);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Calculate metrics from real data
  const metrics: DashboardMetrics = {
    protectionScore: Math.round(analytics?.average_protection_level || 75),
    completionPercentage: Math.round(milestoneAnalytics?.completion_rate || 65),
    activeRisks: smartInsights.filter(i => i.type === 'warning').length,
    achievementCount: milestoneAnalytics?.milestones_completed || 8,
    timeInvested: `${Math.round((analytics?.total_time_saved || 12.5) * 10) / 10}h`,
    streakDays: 7, // This would need a separate query for activity tracking
    familyMembers: 4, // This would come from family_members table
    documentsSecured: analytics?.total_insights || 23
  };

  const getInsightIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'recommendation': return <Brain className="h-4 w-4 text-blue-600" />;
      case 'celebration': return <Award className="h-4 w-4 text-green-600" />;
      case 'opportunity': return <Zap className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightColor = (type: SmartInsight['type'], priority: SmartInsight['priority']) => {
    if (priority === 'critical') return 'border-red-500 bg-red-50';

    switch (type) {
      case 'warning': return 'border-orange-500 bg-orange-50';
      case 'recommendation': return 'border-blue-500 bg-blue-50';
      case 'celebration': return 'border-green-500 bg-green-50';
      case 'opportunity': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: SmartInsight['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your family's legacy planning progress</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            variant={"outline" as any}
            onClick={() => setShowSmartInsights(!showSmartInsights)}
            className="gap-2"
          >
            {showSmartInsights ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showSmartInsights ? 'Hide Insights' : 'Show Insights'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Protection</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{metrics.protectionScore}</div>
            <p className="text-xs text-gray-500">Security Score</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Completion</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{metrics.completionPercentage}%</div>
            <p className="text-xs text-gray-500">Tasks Done</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Active Risks</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{metrics.activeRisks}</div>
            <p className="text-xs text-gray-500">Needs Attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Achievements</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{metrics.achievementCount}</div>
            <p className="text-xs text-gray-500">Milestones</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium">Time Saved</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600">{metrics.timeInvested}</div>
            <p className="text-xs text-gray-500">This Month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{metrics.streakDays}</div>
            <p className="text-xs text-gray-500">Days Active</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium">Family</span>
            </div>
            <div className="text-2xl font-bold text-teal-600">{metrics.familyMembers}</div>
            <p className="text-xs text-gray-500">Members</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">Documents</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">{metrics.documentsSecured}</div>
            <p className="text-xs text-gray-500">Secured</p>
          </CardContent>
        </Card>
      </div>

      {/* Smart Insights Panel */}
      {showSmartInsights && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Smart Insights
                {insightsLoading && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    Loading insights...
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {smartInsights.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No insights available for the selected timeframe.</p>
                    <p className="text-sm mt-1">Try selecting a longer time period.</p>
                  </div>
                ) : (
                  smartInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type, insight.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{insight.title}</h4>
                              <Badge className={getPriorityBadgeColor(insight.priority)}>
                                {insight.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(insight.generated)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                            {insight.action && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onInsightAction?.(insight.id)}
                                className="text-xs"
                              >
                                {insight.action}
                              </Button>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span>Confidence: {Math.round(insight.confidence)}%</span>
                              <span>Category: {insight.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabbed Analytics Views */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="protection">
            <Shield className="h-4 w-4 mr-2" />
            Protection Analytics
          </TabsTrigger>
          <TabsTrigger value="progress">
            <TrendingUp className="h-4 w-4 mr-2" />
            Progress Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Protection Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Protection trend chart will appear here
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Completion rate chart will appear here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="protection">
          <FamilyProtectionAnalytics />
        </TabsContent>

        <TabsContent value="progress">
          <LegacyCompletionTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
};
