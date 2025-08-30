/**
 * Supplementary interface definitions for Phase 9-12 implementation
 * This file contains missing interfaces referenced by the new services
 */

// Common interfaces used across multiple services
export interface ValidationRule {
  rule: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface FilingRequirement {
  authority: string;
  deadline: string;
  frequency: string;
  mandatory: boolean;
}

export interface RetentionPolicy {
  period: string;
  action: 'archive' | 'delete' | 'review';
  legalBasis?: string;
}

export interface DocumentVersion {
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string[];
}

// Business succession planning interfaces
export interface BusinessGovernance {
  boardOfDirectors: BoardMember[];
  officers: Officer[];
  committees: Committee[];
  votingAgreements: VotingAgreement[];
  operatingAgreements: OperatingAgreement[];
  bylaws: ByLaws;
  meetingRequirements: MeetingRequirement[];
}

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  term: string;
  responsibilities: string[];
}

export interface Officer {
  id: string;
  name: string;
  title: string;
  responsibilities: string[];
  signatureAuthority: boolean;
}

export interface Committee {
  id: string;
  name: string;
  purpose: string;
  members: string[];
  charter: string;
}

export interface VotingAgreement {
  id: string;
  parties: string[];
  terms: string[];
  restrictions: string[];
  effectiveDate: string;
}

export interface OperatingAgreement {
  id: string;
  type: string;
  effectiveDate: string;
  terms: string[];
  amendments: string[];
}

export interface ByLaws {
  lastUpdated: string;
  sections: string[];
  amendments: string[];
}

export interface MeetingRequirement {
  type: 'annual' | 'quarterly' | 'special';
  frequency: string;
  notice: string;
  quorum: number;
}

export interface Encumbrance {
  type: string;
  description: string;
  amount?: number;
  creditor?: string;
}

export interface PersonalGuarantee {
  guarantor: string;
  amount: number;
  terms: string[];
}

export interface KeyRelationship {
  type: string;
  party: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface CompensationPackage {
  baseSalary: number;
  bonus: number;
  equity: number;
  benefits: string[];
}

export interface RetentionStrategy {
  type: string;
  description: string;
  cost: number;
  effectiveness: number;
}

export interface SuccessorCandidate {
  name: string;
  qualifications: string[];
  readiness: number;
  trainingNeeds: string[];
}

export interface DocumentationStatus {
  processesDocumented: boolean;
  knowledgeTransferred: boolean;
  contactsShared: boolean;
  systemsAccess: boolean;
}

// Additional interfaces for other services...
export interface AccelerationTrigger {
  event: string;
  percentage: number;
}

export interface PaymentTerms {
  amount: number;
  schedule: string;
  interest?: number;
}

export interface ResourceRequirement {
  type: string;
  description: string;
  cost?: number;
}

export interface SuccessionTimeline {
  planningPhase: string;
  implementationPhase: string;
  transitionPhase: string;
  milestones: string[];
  criticalDates: string[];
}

export interface BusinessValuation {
  id: string;
  businessId: string;
  method: string;
  appraiser?: string;
  valuationDate: string;
  enterpriseValue: number;
  equityValue: number;
  assetValues: AssetValuation[];
  assumptions: string[];
  discounts: DiscountFactor[];
  multiples: IndustryMultiple[];
  sensitivity: SensitivityAnalysis;
  validity: string;
  nextValuation: string;
}

export interface AssetValuation {
  assetId: string;
  method: string;
  value: number;
  currency: string;
}

export interface DiscountFactor {
  type: string;
  rate: number;
  reason: string;
}

export interface IndustryMultiple {
  metric: string;
  multiple: number;
}

export interface SensitivityAnalysis {
  variables: string[];
  scenarios: {
    name: string;
    probability: number;
    value: number;
  }[];
}

export interface TaxStrategy {
  objectives: string[];
  structures: string[];
  elections: string[];
  planning: string[];
  projectedLiability: number;
  currency: string;
}

export interface FinancingStrategy {
  fundingSources: string[];
  paymentStructure: string[];
  contingencies: string[];
  totalFinancingNeeded: number;
  currency: string;
}

export interface TransitionPlan {
  phases: string[];
  keyActivities: string[];
  stakeholderCommunication: string[];
  trainingPrograms: string[];
  retentionStrategies: string[];
}

// API Ecosystem interfaces
export interface JSONSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  [key: string]: unknown;
}

export interface CachingConfiguration {
  enabled: boolean;
  ttl: number;
  strategy: string;
  headers: string[];
}

export interface EndpointMonitoring {
  enabled: boolean;
  metrics: string[];
  alerting: {
    enabled: boolean;
    thresholds: Record<string, number>;
  };
  logging: {
    level: string;
    includePayload: boolean;
    retention: string;
  };
}

export interface EndpointDocumentation {
  summary: string;
  description: string;
  examples: unknown[];
  errors: unknown[];
  notes: string[];
}

// Team Collaboration interfaces
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  organization: string;
}

export interface AvailabilitySchedule {
  timezone: string;
  workingHours: {
    day: string;
    start: string;
    end: string;
  }[];
  breaks: unknown[];
  vacations: unknown[];
}

export interface ContributionStats {
  documentsShared: number;
  commentsAdded: number;
  tasksCompleted: number;
  meetingsOrganized: number;
  reviewsCompleted: number;
  hoursContributed: number;
  lastContribution: string;
}

export interface CollaborationMetrics {
  averageResponseTime: number;
  documentShares: number;
  meetingAttendance: number;
  taskCompletion: number;
}

export interface ProductivityMetrics {
  tasksCompleted: number;
  documentsReviewed: number;
  meetingsHeld: number;
  decisionsReached: number;
}

export interface EngagementMetrics {
  activeMembers: number;
  messagesSent: number;
  commentsAdded: number;
  hoursSpent: number;
}

// White Label Solution interfaces
export interface CustomFeatureSpecification {
  name: string;
  description: string;
  type: 'ui_component' | 'workflow' | 'integration' | 'report';
  configuration: Record<string, unknown>;
}

export interface DeploymentConfiguration {
  environment: 'development' | 'staging' | 'production';
  region: string;
}

export interface Deployment {
  id: string;
  partnerId: string;
  type: string;
  status: string;
  environment: string;
  region: string;
  configuration: unknown;
  infrastructure: unknown;
  endpoints: string[];
  monitoring: unknown;
  backup: unknown;
  security: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueSharingSetup {
  partnerId: string;
  configuration: unknown;
  payoutSchedule: unknown;
  trackingSystem: unknown;
  reportingSystem: unknown;
  status: string;
  createdAt: string;
}

export interface IntegrationSettings {
  sso: {
    enabled: boolean;
    provider: string;
    configuration: Record<string, unknown>;
    userMapping: unknown[];
    groupMapping: unknown[];
  };
  apis: {
    enabled: boolean;
    version: string;
    authentication: string;
    rateLimiting: unknown[];
    allowedEndpoints: string[];
    customEndpoints: unknown[];
  };
  webhooks: {
    enabled: boolean;
    endpoints: unknown[];
    authentication: Record<string, unknown>;
    retryPolicy: Record<string, unknown>;
  };
  thirdPartyIntegrations: unknown[];
  dataSync: {
    enabled: boolean;
    schedule: string;
    mappings: unknown[];
  };
  customIntegrations: unknown[];
}

// Additional generic interfaces
export interface TimeRange {
  start: string;
  end: string;
}

export interface ReadinessScore {
  overall: number;
  categories: Record<string, number>;
}

export interface GapAnalysis {
  category: string;
  currentState: string;
  desiredState: string;
  gap: string;
  priority: string;
  effort: string;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  timeline: string;
  resources: string[];
  estimatedCost: number;
  currency: string;
}

export interface ImplementationMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  dependencies: string[];
  responsible: string;
  status: string;
}

export interface RiskAssessment {
  id: string;
  category: string;
  description: string;
  impact: string;
  probability: string;
  severity: string;
  mitigation: string[];
  owner: string;
  reviewDate: string;
}

export interface FinancialProjection {
  scenario: string;
  timeframe: string;
  projections: {
    revenue: number[];
    expenses: number[];
    netIncome: number[];
  };
  assumptions: string[];
}

export interface ReviewSchedule {
  frequency: string;
  participants: string[];
  agenda: string[];
  nextReview: string;
}

// Export all interfaces
export * from './phase9-12-interfaces';