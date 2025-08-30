/**
 * LegacyGuard Business Succession Planning Service
 * Comprehensive business succession planning and corporate document management
 * for enterprise clients and business owners.
 */

export type BusinessType =
  | 'sole_proprietorship'
  | 'partnership'
  | 'llc'
  | 'corporation'
  | 'non_profit'
  | 'trust';

export type SuccessionTrigger =
  | 'death'
  | 'disability'
  | 'retirement'
  | 'departure'
  | 'sale'
  | 'merger'
  | 'dissolution';

export type StakeholderRole =
  | 'owner'
  | 'partner'
  | 'shareholder'
  | 'key_employee'
  | 'board_member'
  | 'advisor'
  | 'successor';

export type BusinessAssetType =
  | 'intellectual_property'
  | 'real_estate'
  | 'equipment'
  | 'inventory'
  | 'accounts_receivable'
  | 'contracts'
  | 'licenses'
  | 'goodwill';

export interface BusinessEntity {
  id: string;
  name: string;
  type: BusinessType;
  ein: string;
  incorporationDate: string;
  jurisdiction: string;
  industry: string;
  description: string;
  valuation: {
    amount: number;
    currency: string;
    valuationDate: string;
    method: string;
    appraiser?: string;
  };
  ownership: BusinessOwnership[];
  governance: BusinessGovernance;
  assets: BusinessAsset[];
  liabilities: BusinessLiability[];
  keyPersons: KeyPerson[];
  documents: CorporateDocument[];
  successionPlan?: SuccessionPlan;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessOwnership {
  id: string;
  stakeholderId: string;
  stakeholderName: string;
  role: StakeholderRole;
  ownershipPercentage: number;
  equityType: string;
  votingRights: boolean;
  transferRestrictions: TransferRestriction[];
  vestingSchedule?: VestingSchedule;
  buyoutProvisions: BuyoutProvision[];
  createdAt: string;
}

export interface BusinessGovernance {
  boardOfDirectors: BoardMember[];
  officers: Officer[];
  committees: Committee[];
  votingAgreements: VotingAgreement[];
  operatingAgreements: OperatingAgreement[];
  bylaws: ByLaws;
  meetingRequirements: MeetingRequirement[];
}

export interface BusinessAsset {
  id: string;
  name: string;
  type: BusinessAssetType;
  description: string;
  valuation: {
    amount: number;
    currency: string;
    valuationDate: string;
  };
  ownership: string;
  transferability: string;
  criticalToOperations: boolean;
  successorDesignation?: string;
  encumbrances: Encumbrance[];
}

export interface BusinessLiability {
  id: string;
  description: string;
  amount: number;
  currency: string;
  creditor: string;
  maturityDate?: string;
  personalGuarantees: PersonalGuarantee[];
  successorLiability: boolean;
}

export interface KeyPerson {
  id: string;
  name: string;
  role: string;
  department: string;
  criticalKnowledge: string[];
  relationships: KeyRelationship[];
  compensationPackage: CompensationPackage;
  retentionStrategies: RetentionStrategy[];
  successorCandidates: SuccessorCandidate[];
  documentationStatus: DocumentationStatus;
}

export interface SuccessionPlan {
  id: string;
  businessId: string;
  planName: string;
  objectives: string[];
  timeline: SuccessionTimeline;
  triggers: SuccessionTrigger[];
  scenarios: SuccessionScenario[];
  valuation: BusinessValuation;
  tax: TaxStrategy;
  financing: FinancingStrategy;
  transition: TransitionPlan;
  contingencies: ContingencyPlan[];
  status: 'draft' | 'active' | 'under_review' | 'executed';
  lastReviewed: string;
  nextReview: string;
  advisors: PlanAdvisor[];
  createdAt: string;
  updatedAt: string;
}

export interface SuccessionScenario {
  id: string;
  name: string;
  trigger: SuccessionTrigger;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeline: string;
  successors: SuccessorDesignation[];
  actions: ActionItem[];
  risks: RiskAssessment[];
  financialImplications: FinancialImpact;
}

export interface CorporateDocument {
  id: string;
  name: string;
  type: CorporateDocumentType;
  category: string;
  importance: 'critical' | 'important' | 'supporting';
  status: 'current' | 'expired' | 'pending_renewal';
  expirationDate?: string;
  filingRequirements: FilingRequirement[];
  accessLevel: 'public' | 'restricted' | 'confidential';
  retention: RetentionPolicy;
  versions: DocumentVersion[];
  relatedDocuments: string[];
}

export type CorporateDocumentType =
  | 'articles_of_incorporation'
  | 'operating_agreement'
  | 'shareholder_agreement'
  | 'employment_contract'
  | 'non_disclosure_agreement'
  | 'partnership_agreement'
  | 'buy_sell_agreement'
  | 'succession_plan'
  | 'business_plan'
  | 'financial_statement'
  | 'tax_return'
  | 'license'
  | 'permit'
  | 'contract'
  | 'insurance_policy';

export interface TransferRestriction {
  type: string;
  description: string;
  exceptions: string[];
  approvalRequired: boolean;
  rightOfFirstRefusal: boolean;
  tagAlongRights: boolean;
  dragAlongRights: boolean;
}

export interface VestingSchedule {
  totalShares: number;
  vestingPeriod: string;
  cliffPeriod?: string;
  acceleration: AccelerationTrigger[];
}

export interface BuyoutProvision {
  trigger: SuccessionTrigger;
  valuationMethod: string;
  paymentTerms: PaymentTerms;
  fundingMechanism: string;
  timeframe: string;
}

export interface ContingencyPlan {
  id: string;
  scenario: string;
  triggers: string[];
  actions: ActionItem[];
  responsible: string[];
  timeline: string;
  resources: ResourceRequirement[];
}

export class BusinessSuccessionPlanningService {
  private businesses: Map<string, BusinessEntity> = new Map();
  private successionPlans: Map<string, SuccessionPlan> = new Map();
  private templates: Map<string, SuccessionPlanTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  async createBusiness(businessData: Partial<BusinessEntity>): Promise<BusinessEntity> {
    const business: BusinessEntity = {
      id: this.generateId(),
      name: businessData.name || '',
      type: businessData.type || 'llc',
      ein: businessData.ein || '',
      incorporationDate: businessData.incorporationDate || new Date().toISOString(),
      jurisdiction: businessData.jurisdiction || '',
      industry: businessData.industry || '',
      description: businessData.description || '',
      valuation: businessData.valuation || {
        amount: 0,
        currency: 'USD',
        valuationDate: new Date().toISOString(),
        method: 'book_value'
      },
      ownership: businessData.ownership || [],
      governance: businessData.governance || this.createDefaultGovernance(),
      assets: businessData.assets || [],
      liabilities: businessData.liabilities || [],
      keyPersons: businessData.keyPersons || [],
      documents: businessData.documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.businesses.set(business.id, business);
    return business;
  }

  async createSuccessionPlan(
    businessId: string,
    planData: Partial<SuccessionPlan>
  ): Promise<SuccessionPlan> {
    const business = this.businesses.get(businessId);
    if (!business) {
      throw new Error(`Business not found: ${businessId}`);
    }

    const plan: SuccessionPlan = {
      id: this.generateId(),
      businessId,
      planName: planData.planName || `${business.name} Succession Plan`,
      objectives: planData.objectives || [],
      timeline: planData.timeline || this.createDefaultTimeline(),
      triggers: planData.triggers || ['death', 'disability', 'retirement'],
      scenarios: planData.scenarios || [],
      valuation: planData.valuation || await this.createBusinessValuation(businessId),
      tax: planData.tax || this.createDefaultTaxStrategy(),
      financing: planData.financing || this.createDefaultFinancingStrategy(),
      transition: planData.transition || this.createDefaultTransitionPlan(),
      contingencies: planData.contingencies || [],
      status: 'draft',
      lastReviewed: new Date().toISOString(),
      nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      advisors: planData.advisors || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.successionPlans.set(plan.id, plan);
    business.successionPlan = plan;
    business.updatedAt = new Date().toISOString();

    return plan;
  }

  async addSuccessionScenario(
    planId: string,
    scenario: Partial<SuccessionScenario>
  ): Promise<SuccessionScenario> {
    const plan = this.successionPlans.get(planId);
    if (!plan) {
      throw new Error(`Succession plan not found: ${planId}`);
    }

    const newScenario: SuccessionScenario = {
      id: this.generateId(),
      name: scenario.name || `Scenario ${plan.scenarios.length + 1}`,
      trigger: scenario.trigger || 'retirement',
      probability: scenario.probability || 0.3,
      impact: scenario.impact || 'medium',
      timeline: scenario.timeline || '6-12 months',
      successors: scenario.successors || [],
      actions: scenario.actions || [],
      risks: scenario.risks || [],
      financialImplications: scenario.financialImplications || {
        estimatedCost: 0,
        currency: 'USD',
        taxImplications: [],
        financingNeeded: false
      }
    };

    plan.scenarios.push(newScenario);
    plan.updatedAt = new Date().toISOString();

    return newScenario;
  }

  async performValuation(
    businessId: string,
    method: string = 'dcf',
    appraiser?: string
  ): Promise<BusinessValuation> {
    const business = this.businesses.get(businessId);
    if (!business) {
      throw new Error(`Business not found: ${businessId}`);
    }

    const valuation: BusinessValuation = {
      id: this.generateId(),
      businessId,
      method,
      appraiser,
      valuationDate: new Date().toISOString(),
      enterpriseValue: this.calculateEnterpriseValue(business, method),
      equityValue: this.calculateEquityValue(business),
      assetValues: business.assets.map(asset => ({
        assetId: asset.id,
        method,
        value: asset.valuation.amount,
        currency: asset.valuation.currency
      })),
      assumptions: this.getValuationAssumptions(method),
      discounts: this.calculateDiscounts(business),
      multiples: this.getIndustryMultiples(business.industry),
      sensitivity: this.performSensitivityAnalysis(business),
      validity: '12 months',
      nextValuation: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };

    return valuation;
  }

  async generateSuccessionReport(planId: string): Promise<SuccessionReport> {
    const plan = this.successionPlans.get(planId);
    if (!plan) {
      throw new Error(`Succession plan not found: ${planId}`);
    }

    const business = this.businesses.get(plan.businessId);
    if (!business) {
      throw new Error(`Business not found: ${plan.businessId}`);
    }

    const report: SuccessionReport = {
      id: this.generateId(),
      planId,
      businessId: plan.businessId,
      reportDate: new Date().toISOString(),
      executiveSummary: this.generateExecutiveSummary(business, plan),
      readinessScore: this.calculateReadinessScore(plan),
      gapAnalysis: await this.performGapAnalysis(plan),
      recommendations: await this.generateRecommendations(plan),
      timeline: this.generateImplementationTimeline(plan),
      riskAssessment: await this.assessRisks(plan),
      financialProjections: await this.createFinancialProjections(plan),
      actionItems: this.generateActionItems(plan),
      reviewSchedule: this.createReviewSchedule(plan)
    };

    return report;
  }

  async trackImplementation(
    planId: string,
    actionId: string,
    status: ActionStatus,
    notes?: string
  ): Promise<void> {
    const plan = this.successionPlans.get(planId);
    if (!plan) {
      throw new Error(`Succession plan not found: ${planId}`);
    }

    const action = this.findActionItem(plan, actionId);
    if (!action) {
      throw new Error(`Action item not found: ${actionId}`);
    }

    action.status = status;
    action.lastUpdated = new Date().toISOString();
    if (notes) {
      action.notes = notes;
    }

    if (status === 'completed') {
      action.completedDate = new Date().toISOString();
    }

    plan.updatedAt = new Date().toISOString();
    await this.updatePlanProgress(plan);
  }

  private initializeTemplates(): void {
    // Initialize succession plan templates
    const templates = [
      {
        id: 'family_business',
        name: 'Family Business Succession',
        type: 'family_business',
        scenarios: ['next_generation', 'sale_to_family', 'management_buyout'],
        requirements: ['family_governance', 'training_program', 'fairness_assessment']
      },
      {
        id: 'management_buyout',
        name: 'Management Buyout Plan',
        type: 'management_transition',
        scenarios: ['internal_succession', 'key_employee_buyout'],
        requirements: ['valuation', 'financing', 'earnout_structure']
      },
      {
        id: 'strategic_sale',
        name: 'Strategic Sale Preparation',
        type: 'external_exit',
        scenarios: ['strategic_buyer', 'financial_buyer', 'public_offering'],
        requirements: ['due_diligence', 'value_optimization', 'deal_structure']
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template as SuccessionPlanTemplate);
    });
  }

  private createDefaultGovernance(): BusinessGovernance {
    return {
      boardOfDirectors: [],
      officers: [],
      committees: [],
      votingAgreements: [],
      operatingAgreements: [],
      bylaws: {} as ByLaws,
      meetingRequirements: []
    };
  }

  private createDefaultTimeline(): SuccessionTimeline {
    return {
      planningPhase: '6-12 months',
      implementationPhase: '12-24 months',
      transitionPhase: '6-18 months',
      milestones: [],
      criticalDates: []
    };
  }

  private async createBusinessValuation(businessId: string): Promise<BusinessValuation> {
    return this.performValuation(businessId);
  }

  private createDefaultTaxStrategy(): TaxStrategy {
    return {
      objectives: [],
      structures: [],
      elections: [],
      planning: [],
      projectedLiability: 0,
      currency: 'USD'
    };
  }

  private createDefaultFinancingStrategy(): FinancingStrategy {
    return {
      fundingSources: [],
      paymentStructure: [],
      contingencies: [],
      totalFinancingNeeded: 0,
      currency: 'USD'
    };
  }

  private createDefaultTransitionPlan(): TransitionPlan {
    return {
      phases: [],
      keyActivities: [],
      stakeholderCommunication: [],
      trainingPrograms: [],
      retentionStrategies: []
    };
  }

  private calculateEnterpriseValue(business: BusinessEntity, method: string): number {
    // Simplified valuation calculation
    const assetValue = business.assets.reduce((sum, asset) => sum + asset.valuation.amount, 0);
    const liabilityValue = business.liabilities.reduce((sum, liability) => sum + liability.amount, 0);

    switch (method) {
      case 'asset_based':
        return assetValue - liabilityValue;
      case 'dcf':
        return assetValue * 1.2; // Simplified DCF multiple
      case 'market_multiple':
        return assetValue * 1.5; // Market multiple approach
      default:
        return assetValue - liabilityValue;
    }
  }

  private calculateEquityValue(business: BusinessEntity): number {
    return this.calculateEnterpriseValue(business, 'asset_based');
  }

  private getValuationAssumptions(method: string): string[] {
    const assumptions = {
      dcf: ['Discount rate: 10%', 'Growth rate: 3%', 'Terminal multiple: 10x'],
      market_multiple: ['Industry multiple: 1.5x', 'Revenue multiple: 2x'],
      asset_based: ['Market value of assets', 'Book value of liabilities']
    };

    return assumptions[method as keyof typeof assumptions] || [];
  }

  private calculateDiscounts(business: BusinessEntity): DiscountFactor[] {
    return [
      { type: 'marketability', rate: 0.2, reason: 'Private company discount' },
      { type: 'control', rate: 0.1, reason: 'Minority interest discount' }
    ];
  }

  private getIndustryMultiples(industry: string): IndustryMultiple[] {
    // Industry-specific multiples (simplified)
    return [
      { metric: 'revenue', multiple: 2.0 },
      { metric: 'ebitda', multiple: 8.0 },
      { metric: 'earnings', multiple: 12.0 }
    ];
  }

  private performSensitivityAnalysis(business: BusinessEntity): SensitivityAnalysis {
    return {
      variables: ['revenue_growth', 'margin_improvement', 'discount_rate'],
      scenarios: [
        { name: 'Base Case', probability: 0.5, value: business.valuation.amount },
        { name: 'Best Case', probability: 0.25, value: business.valuation.amount * 1.3 },
        { name: 'Worst Case', probability: 0.25, value: business.valuation.amount * 0.7 }
      ]
    };
  }

  private generateExecutiveSummary(business: BusinessEntity, plan: SuccessionPlan): string {
    return `This succession plan for ${business.name} outlines a comprehensive strategy for business continuity and ownership transition. The plan addresses ${plan.triggers.length} potential succession triggers and includes ${plan.scenarios.length} detailed scenarios.`;
  }

  private calculateReadinessScore(plan: SuccessionPlan): ReadinessScore {
    const totalItems = this.countTotalActionItems(plan);
    const completedItems = this.countCompletedActionItems(plan);
    const score = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    return {
      overall: Math.round(score),
      categories: {
        planning: Math.round(score * 0.9),
        documentation: Math.round(score * 1.1),
        implementation: Math.round(score * 0.8),
        review: Math.round(score * 0.95)
      }
    };
  }

  private async performGapAnalysis(plan: SuccessionPlan): Promise<GapAnalysis[]> {
    return [
      {
        category: 'Documentation',
        currentState: 'Basic documents in place',
        desiredState: 'Complete legal documentation',
        gap: 'Missing buy-sell agreement updates',
        priority: 'high',
        effort: 'medium'
      }
    ];
  }

  private async generateRecommendations(plan: SuccessionPlan): Promise<Recommendation[]> {
    return [
      {
        id: this.generateId(),
        category: 'legal',
        title: 'Update Buy-Sell Agreement',
        description: 'Review and update buy-sell agreement to reflect current valuation methods',
        priority: 'high',
        timeline: '30 days',
        resources: ['attorney', 'valuation_expert'],
        estimatedCost: 10000,
        currency: 'USD'
      }
    ];
  }

  private generateImplementationTimeline(plan: SuccessionPlan): ImplementationMilestone[] {
    return [
      {
        id: this.generateId(),
        name: 'Plan Finalization',
        description: 'Complete succession plan documentation',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        dependencies: [],
        responsible: 'planning_committee',
        status: 'pending'
      }
    ];
  }

  private async assessRisks(plan: SuccessionPlan): Promise<RiskAssessment[]> {
    return [
      {
        id: this.generateId(),
        category: 'operational',
        description: 'Key person dependency risk',
        impact: 'high',
        probability: 'medium',
        severity: 'high',
        mitigation: ['Cross-training program', 'Documentation of processes'],
        owner: 'management_team',
        reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private async createFinancialProjections(plan: SuccessionPlan): Promise<FinancialProjection[]> {
    return [
      {
        scenario: 'base_case',
        timeframe: '5_years',
        projections: {
          revenue: [1000000, 1100000, 1210000, 1331000, 1464100],
          expenses: [800000, 860000, 924400, 992924, 1066172],
          netIncome: [200000, 240000, 285600, 338076, 397928]
        },
        assumptions: ['3% annual growth', 'Stable margins']
      }
    ];
  }

  private generateActionItems(plan: SuccessionPlan): ActionItem[] {
    return [
      {
        id: this.generateId(),
        title: 'Complete valuation update',
        description: 'Obtain current business valuation from qualified appraiser',
        category: 'valuation',
        priority: 'high',
        assignee: 'business_owner',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        dependencies: [],
        estimatedEffort: '20 hours',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  private createReviewSchedule(plan: SuccessionPlan): ReviewSchedule {
    return {
      frequency: 'quarterly',
      participants: ['owner', 'advisors', 'successors'],
      agenda: ['Progress review', 'Plan updates', 'Market conditions'],
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private findActionItem(plan: SuccessionPlan, actionId: string): ActionItem | undefined {
    // Search through all scenarios and contingencies for the action item
    for (const scenario of plan.scenarios) {
      const action = scenario.actions.find(a => a.id === actionId);
      if (action) return action;
    }

    for (const contingency of plan.contingencies) {
      const action = contingency.actions.find(a => a.id === actionId);
      if (action) return action;
    }

    return undefined;
  }

  private async updatePlanProgress(plan: SuccessionPlan): Promise<void> {
    const readinessScore = this.calculateReadinessScore(plan);

    if (readinessScore.overall >= 90) {
      plan.status = 'active';
    } else if (readinessScore.overall >= 50) {
      plan.status = 'under_review';
    }

    plan.updatedAt = new Date().toISOString();
  }

  private countTotalActionItems(plan: SuccessionPlan): number {
    let count = 0;
    plan.scenarios.forEach(scenario => count += scenario.actions.length);
    plan.contingencies.forEach(contingency => count += contingency.actions.length);
    return count;
  }

  private countCompletedActionItems(plan: SuccessionPlan): number {
    let count = 0;
    plan.scenarios.forEach(scenario => {
      count += scenario.actions.filter(action => action.status === 'completed').length;
    });
    plan.contingencies.forEach(contingency => {
      count += contingency.actions.filter(action => action.status === 'completed').length;
    });
    return count;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Additional interface definitions
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

export interface SuccessionReport {
  id: string;
  planId: string;
  businessId: string;
  reportDate: string;
  executiveSummary: string;
  readinessScore: ReadinessScore;
  gapAnalysis: GapAnalysis[];
  recommendations: Recommendation[];
  timeline: ImplementationMilestone[];
  riskAssessment: RiskAssessment[];
  financialProjections: FinancialProjection[];
  actionItems: ActionItem[];
  reviewSchedule: ReviewSchedule;
}

export interface SuccessionPlanTemplate {
  id: string;
  name: string;
  type: string;
  scenarios: string[];
  requirements: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: string;
  status: ActionStatus;
  dependencies: string[];
  estimatedEffort: string;
  notes?: string;
  completedDate?: string;
  createdAt: string;
  lastUpdated: string;
}

export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';

// Export the service instance
export const businessSuccessionPlanningService = new BusinessSuccessionPlanningService();
