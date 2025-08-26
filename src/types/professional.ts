/**
 * Professional Network Types
 * Types for attorney and professional reviewer system
 */

export interface ProfessionalReviewer {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  professional_title: string;
  law_firm_name?: string;
  bar_number: string;
  licensed_states: string[];
  specializations: ProfessionalSpecialization[];
  experience_years: number;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  hourly_rate?: number;
  bio?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
  last_active_at?: string;
}

export interface ProfessionalSpecialization {
  id: string;
  name: string;
  category: 'estate_planning' | 'family_law' | 'real_estate' | 'business_law' | 'tax_law' | 'other';
  description?: string;
}

export interface DocumentReview {
  id: string;
  document_id: string;
  reviewer_id: string;
  user_id: string;
  review_type: 'basic' | 'comprehensive' | 'certified';
  status: 'requested' | 'assigned' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requested_at: string;
  assigned_at?: string;
  completed_at?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  review_fee?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewResult {
  id: string;
  review_id: string;
  overall_status: 'approved' | 'approved_with_changes' | 'requires_revision' | 'rejected';
  trust_score_impact: number; // -10 to +10
  legal_compliance_score: number; // 0-100
  recommendations: ReviewRecommendation[];
  issues_found: ReviewIssue[];
  summary: string;
  detailed_feedback: string;
  next_steps?: string[];
  follow_up_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewRecommendation {
  id: string;
  type: 'critical' | 'important' | 'suggested' | 'informational';
  category: 'legal_compliance' | 'best_practice' | 'optimization' | 'family_protection';
  title: string;
  description: string;
  action_required: boolean;
  estimated_impact: 'low' | 'medium' | 'high';
}

export interface ReviewIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'legal_error' | 'missing_information' | 'unclear_language' | 'family_consideration';
  title: string;
  description: string;
  suggested_fix?: string;
  page_reference?: number;
  section_reference?: string;
}

export interface ProfessionalOnboarding {
  id: string;
  email: string;
  full_name: string;
  professional_title: string;
  law_firm_name?: string;
  bar_number: string;
  licensed_states: string[];
  specializations: string[];
  experience_years: number;
  hourly_rate?: number;
  bio?: string;
  motivation?: string;
  referral_source?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submitted_at?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewRequest {
  id: string;
  user_id: string;
  document_id: string;
  review_type: 'basic' | 'comprehensive' | 'certified';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  preferred_reviewer_id?: string;
  required_specializations: string[];
  deadline?: string;
  budget_max?: number;
  special_instructions?: string;
  family_context: {
    family_members_count: number;
    minor_children: boolean;
    complex_assets: boolean;
    business_interests: boolean;
  };
  status: 'pending' | 'assigned' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ProfessionalPartnership {
  id: string;
  reviewer_id: string;
  partnership_type: 'individual' | 'firm' | 'network';
  commission_rate: number; // 0-100
  minimum_review_fee: number;
  preferred_review_types: ('basic' | 'comprehensive' | 'certified')[];
  availability_hours: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  max_concurrent_reviews: number;
  auto_assign_enabled: boolean;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    in_app: boolean;
  };
  status: 'active' | 'paused' | 'terminated';
  created_at: string;
  updated_at: string;
}

export type ReviewStatus = DocumentReview['status'];
export type ReviewerStatus = ProfessionalReviewer['status'];
export type OnboardingStatus = ProfessionalOnboarding['status'];