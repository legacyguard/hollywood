/**
 * Professional Network Service
 * Handles attorney applications, verification, and marketplace operations
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  professionalReviewCache, 
  useCachedProfessionalReviews,
  cacheInvalidation 
} from '@/lib/performance/caching';
import type {
  ProfessionalReviewer,
  ProfessionalReviewerInsert,
  ProfessionalOnboarding,
  ProfessionalOnboardingInsert,
  DocumentReview,
  DocumentReviewInsert,
  ReviewRequest,
  ReviewRequestInsert,
  ReviewResult,
  ReviewResultInsert,
  ProfessionalSpecialization,
  ProfessionalSpecializationInsert,
  Consultation,
  ConsultationInsert
} from '@/integrations/supabase/types';

export class ProfessionalService {
  private static instance: ProfessionalService;

  static getInstance(): ProfessionalService {
    if (!ProfessionalService.instance) {
      ProfessionalService.instance = new ProfessionalService();
    }
    return ProfessionalService.instance;
  }

  // Professional Applications
  async submitApplication(application: Omit<ProfessionalOnboardingInsert, 'id' | 'created_at' | 'updated_at'>): Promise<ProfessionalOnboarding> {
    const { data, error } = await supabase
      .from('professional_onboarding')
      .insert({
        ...application,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Send notification to admin team
    await this.notifyAdminNewApplication(data);

    return data;
  }

  async getApplication(id: string): Promise<ProfessionalOnboarding | null> {
    const { data, error } = await supabase
      .from('professional_onboarding')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getApplicationByUserId(userId: string): Promise<ProfessionalOnboarding | null> {
    const { data, error } = await supabase
      .from('professional_onboarding')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateApplicationStatus(
    id: string,
    status: ProfessionalOnboarding['verification_status'],
    reviewNotes?: string
  ): Promise<ProfessionalOnboarding> {
    const updates: Partial<ProfessionalOnboarding> = {
      verification_status: status,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('professional_onboarding')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Send notification to applicant
    await this.notifyApplicantStatusChange(data, reviewNotes);

    return data;
  }

  // Professional Reviewers
  async createReviewerProfile(
    onboarding: ProfessionalOnboarding,
    userId: string
  ): Promise<ProfessionalReviewer> {
    const reviewer: Omit<ProfessionalReviewerInsert, 'id' | 'created_at' | 'updated_at'> = {
      name: onboarding.credentials?.full_name || 'Unknown',
      credentials: onboarding.credentials?.professional_title || 'Professional',
      bar_number: onboarding.credentials?.bar_number || null,
      jurisdiction: onboarding.credentials?.licensed_states?.[0] || 'Unknown',
      specializations: onboarding.credentials?.specializations || [],
      rating: 0,
      reviews_completed: 0,
      average_turnaround_hours: 48,
      profile_verified: onboarding.verification_status === 'verified',
      contact_email: onboarding.credentials?.email || 'unknown@example.com'
    };

    const { data, error } = await supabase
      .from('professional_reviewers')
      .insert({
        ...reviewer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async getReviewer(id: string): Promise<ProfessionalReviewer | null> {
    const { data, error } = await supabase
      .from('professional_reviewers')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateReviewer(id: string, updates: Partial<ProfessionalReviewerUpdate>): Promise<ProfessionalReviewer> {
    const { data, error } = await supabase
      .from('professional_reviewers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async searchReviewers(filters: {
    specializations?: string[];
    jurisdiction?: string;
    ratingMin?: number;
    verified?: boolean;
  }): Promise<ProfessionalReviewer[]> {
    let query = supabase
      .from('professional_reviewers')
      .select('*');

    if (filters.specializations?.length) {
      query = query.overlaps('specializations', filters.specializations);
    }

    if (filters.jurisdiction) {
      query = query.eq('jurisdiction', filters.jurisdiction);
    }

    if (filters.ratingMin !== undefined) {
      query = query.gte('rating', filters.ratingMin);
    }

    if (filters.verified !== undefined) {
      query = query.eq('profile_verified', filters.verified);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  // Review Requests and Assignments
  async createReviewRequest(request: Omit<ReviewRequestInsert, 'id' | 'created_at' | 'updated_at'>): Promise<ReviewRequest> {
    const { data, error } = await supabase
      .from('review_requests')
      .insert({
        ...request,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async assignReviewRequest(
    requestId: string,
    reviewerId: string
  ): Promise<DocumentReview> {
    // Get the review request
    const { data: request } = await supabase
      .from('review_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!request) throw new Error('Review request not found');

    // Create the document review record
    const review: Omit<DocumentReviewInsert, 'id' | 'created_at' | 'updated_at'> = {
      document_id: request.document_id,
      reviewer_id: reviewerId,
      review_type: 'legal',
      status: 'pending',
      risk_level: 'medium',
      review_date: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('document_reviews')
      .insert({
        ...review,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Update request status
    await supabase
      .from('review_requests')
      .update({
        status: 'assigned',
        reviewer_id: reviewerId,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    return data;
  }

  async updateReviewStatus(
    reviewId: string,
    status: DocumentReview['status'],
    result?: Partial<ReviewResultInsert>
  ): Promise<DocumentReview> {
    const updates: Partial<DocumentReviewUpdate> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updates.completion_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('document_reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;

    // Create review result if provided
    if (result && status === 'completed') {
      await this.createReviewResult(reviewId, result);
    }

    return data;
  }

  // Professional Network Directory
  async getNetworkDirectory(filters?: {
    specialization?: string;
    jurisdiction?: string;
    rating?: number;
  }): Promise<ProfessionalReviewer[]> {
    let query = supabase
      .from('professional_reviewers')
      .select('*')
      .eq('profile_verified', true);

    if (filters?.specialization) {
      query = query.contains('specializations', [filters.specialization]);
    }

    if (filters?.jurisdiction) {
      query = query.eq('jurisdiction', filters.jurisdiction);
    }

    if (filters?.rating !== undefined) {
      query = query.gte('rating', filters.rating);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    if (error) throw error;

    return data || [];
  }

  // Pricing and Booking
  async getReviewPricing(): Promise<{
    basic: number;
    comprehensive: number;
    certified: number;
  }> {
    const pricing = {
      basic: 150,
      comprehensive: 350,
      certified: 750
    };

    return pricing;
  }

  async bookConsultation(
    professionalId: string,
    userId: string,
    consultationType: Consultation['consultation_type'],
    scheduledTime: string,
    duration: number = 60
  ): Promise<Consultation> {
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        user_id: userId,
        professional_id: professionalId,
        consultation_type: consultationType,
        scheduled_time: scheduledTime,
        duration_minutes: duration,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Specializations
  async getSpecializations(): Promise<ProfessionalSpecialization[]> {
    const { data, error } = await supabase
      .from('professional_specializations')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  async createSpecialization(specialization: Omit<ProfessionalSpecializationInsert, 'id' | 'created_at' | 'updated_at'>): Promise<ProfessionalSpecialization> {
    const { data, error } = await supabase
      .from('professional_specializations')
      .insert({
        ...specialization,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Review Results
  private async createReviewResult(
    reviewId: string,
    result: Partial<ReviewResultInsert>
  ): Promise<ReviewResult> {
    const { data, error } = await supabase
      .from('review_results')
      .insert({
        review_id: reviewId,
        ...result,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Caching methods for performance optimization
  async getCachedReviews(userId: string): Promise<DocumentReview[]> {
    const cacheKey = `document_reviews_${userId}`;
    const cached = professionalReviewCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('document_reviews')
      .select(`
        *,
        professional_reviewers(
          id,
          first_name,
          last_name,
          credentials,
          specializations,
          profile_image_url
        ),
        review_results(*)
      `)
      .eq('reviewer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    professionalReviewCache.set(cacheKey, data || []);
    return data || [];
  }

  async getCachedReviewById(reviewId: string): Promise<DocumentReview | null> {
    const cacheKey = `document_review_${reviewId}`;
    const cached = professionalReviewCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('document_reviews')
      .select(`
        *,
        professional_reviewers(
          id,
          first_name,
          last_name,
          credentials,
          specializations,
          profile_image_url
        ),
        review_results(*)
      `)
      .eq('id', reviewId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (data) {
      professionalReviewCache.set(cacheKey, data);
    }
    
    return data || null;
  }

  async getCachedProfessionalReviewers(): Promise<ProfessionalReviewer[]> {
    const cacheKey = 'active_professional_reviewers';
    const cached = professionalReviewCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('professional_reviewers')
      .select(`
        *,
        professional_specializations(*)
      `)
      .eq('is_active', true)
      .eq('verification_status', 'verified')
      .order('rating_average', { ascending: false });

    if (error) throw error;

    professionalReviewCache.set(cacheKey, data || []);
    return data || [];
  }

  // Cache invalidation methods
  async invalidateUserReviewCache(userId: string): Promise<void> {
    cacheInvalidation.invalidateProfessionalReviewCaches();
    professionalReviewCache.invalidate(`document_reviews_${userId}`);
    professionalReviewCache.invalidate(`professional_reviews_${userId}`);
  }

  async invalidateReviewCache(reviewId: string): Promise<void> {
    professionalReviewCache.invalidate(`document_review_${reviewId}`);
    // Also invalidate any user-specific caches that might contain this review
    cacheInvalidation.invalidateProfessionalReviewCaches(reviewId);
  }

  async refreshProfessionalReviewersCache(): Promise<void> {
    professionalReviewCache.invalidate('active_professional_reviewers');
    // Pre-warm the cache
    await this.getCachedProfessionalReviewers();
  }

  // Notification methods (placeholders for email/SMS integration)
  private async notifyAdminNewApplication(application: ProfessionalOnboarding): Promise<void> {
    console.log('Admin notification: New professional application', application.id);
  }

  private async notifyApplicantStatusChange(
    application: ProfessionalOnboarding,
    _notes?: string
  ): Promise<void> {
    console.log('Applicant notification: Status changed to', application.verification_status);
  }

  private async notifyReviewAssignment(review: DocumentReview): Promise<void> {
    console.log('Review assignment notification', review.id);
  }

  private async notifyReviewStatusChange(review: DocumentReview): Promise<void> {
    console.log('Review status change notification', review.status);
  }
}

export const professionalService = ProfessionalService.getInstance();
