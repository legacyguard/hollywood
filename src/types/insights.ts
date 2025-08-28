/**
 * Quick Insights Engine Types
 * Interfaces for document analysis and value extraction
 */

export interface QuickInsight {
  id: string;
  userId: string;
  documentId?: string;
  type: 'document_analysis' | 'family_impact' | 'time_saved' | 'protection_level' | 'completion_gap' | 'urgent_action';
  title: string;
  description: string;
  value?: string; // e.g., "2.5 hours saved", "85% protection level"
  impact: 'high' | 'medium' | 'low';
  priority: 'urgent' | 'important' | 'nice_to_have';
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
  metadata: {
    calculatedAt: string;
    expiresAt?: string;
    confidence: number; // 0-1
    category: string;
    tags: string[];
  };
  familyImpact?: {
    affectedMembers: string[];
    riskReduction: number; // percentage
    emotionalBenefit: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InsightCalculation {
  timeSaved: {
    hours: number;
    tasks: string[];
    comparison: string;
  };
  protectionLevel: {
    percentage: number;
    gaps: string[];
    strengths: string[];
  };
  familyImpact: {
    members: number;
    scenarios: string[];
    benefits: string[];
  };
  urgencyScore: {
    score: number; // 0-100
    factors: string[];
    timeline: string;
  };
}

export interface DocumentAnalysis {
  documentId: string;
  documentType: string;
  extractedValue: {
    keyInfo: string[];
    missingInfo: string[];
    qualityScore: number;
    completenessPercentage: number;
  };
  insights: {
    immediate: QuickInsight[];
    potential: QuickInsight[];
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    reason: string;
    impact: string;
  }[];
}

export interface FamilyImpactStatement {
  userId: string;
  scenario: string;
  impactDescription: string;
  affectedMembers: {
    memberId: string;
    name: string;
    impact: string;
    riskLevel: 'high' | 'medium' | 'low';
  }[];
  protectionGaps: {
    area: string;
    risk: string;
    recommendation: string;
    urgency: 'immediate' | 'near_term' | 'future';
  }[];
  overallProtectionLevel: number;
  estimatedTimeSaved: number;
  emotionalBenefits: string[];
  generatedAt: string;
}

export interface InsightFilters {
  types?: QuickInsight['type'][];
  impact?: QuickInsight['impact'][];
  priority?: QuickInsight['priority'][];
  timeRange?: {
    start: string;
    end: string;
  };
  actionable?: boolean;
  documentIds?: string[];
}

export interface InsightAnalytics {
  totalInsights: number;
  actionableInsights: number;
  completedActions: number;
  averageProtectionLevel: number;
  totalTimeSaved: number;
  topCategories: {
    category: string;
    count: number;
    averageImpact: string;
  }[];
  trendData: {
    date: string;
    insightsGenerated: number;
    actionsCompleted: number;
    protectionLevel: number;
  }[];
}