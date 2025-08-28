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

  async updateReviewer(id: string, updates: Partial<ProfessionalReviewer>): Promise<ProfessionalReviewer> {
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
    // Create the document review record
    const review: Omit<DocumentReviewInsert, 'id' | 'created_at' | 'updated_at'> = {
      document_id: request.document_id,
      reviewer_id: reviewerId,
      review_type: request.review_type || 'general',              // Use request type or fallback
      status: 'pending',                                          // Initial status remains pending
      risk_level: request.priority === 'urgent' ? 'high' : 'medium', // Derive from request priority
      review_date: new Date().toISOString()
    };
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

import type {
  ProfessionalReviewer,
  ProfessionalReviewerInsert,
  ProfessionalReviewerUpdate,
  ProfessionalOnboarding,
  ProfessionalOnboardingInsert,
  DocumentReview,
  DocumentReviewInsert,
  DocumentReviewUpdate,
} from '@/db/schemas';
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

  // Email notification system with actual API integration
  private async notifyAdminNewApplication(application: ProfessionalOnboarding): Promise<void> {
    try {
      const emailData = {
        to: 'admin@legacyguard.app',
        subject: `New Professional Application - ${application.credentials?.full_name}`,
        template: 'admin_new_application',
        data: {
          applicantName: application.credentials?.full_name,
          applicationId: application.id,
          professionalTitle: application.credentials?.professional_title,
          barNumber: application.credentials?.bar_number,
          licensedStates: application.credentials?.licensed_states,
          specializations: application.credentials?.specializations,
          applicationDate: new Date().toLocaleDateString(),
          reviewUrl: `${window.location.origin}/admin/applications/${application.id}`
        }
      };

      await this.sendEmail(emailData);
      
      // Log notification in database for tracking
      await this.logNotification({
        type: 'admin_application',
        recipient: 'admin@legacyguard.app',
        applicationId: application.id,
        status: 'sent'
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      await this.logNotification({
        type: 'admin_application',
        recipient: 'admin@legacyguard.app',
        applicationId: application.id,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async notifyApplicantStatusChange(
    application: ProfessionalOnboarding,
    reviewNotes?: string
  ): Promise<void> {
    try {
      const templateMap = {
        'pending': 'application_received',
        'under_review': 'application_under_review',
        'verified': 'application_approved',
        'rejected': 'application_rejected'
      };

      const emailData = {
        to: application.credentials?.email || 'unknown@example.com',
        subject: `Professional Application Update - ${application.verification_status}`,
        template: templateMap[application.verification_status] || 'application_status_change',
        data: {
          applicantName: application.credentials?.full_name,
          status: application.verification_status,
          statusDisplay: this.formatStatusForDisplay(application.verification_status),
          reviewNotes: reviewNotes || 'No additional notes provided',
          nextSteps: this.getNextStepsForStatus(application.verification_status),
          supportEmail: 'support@legacyguard.app',
          dashboardUrl: `${window.location.origin}/professional/dashboard`
        }
      };

      await this.sendEmail(emailData);
      
      await this.logNotification({
        type: 'applicant_status_change',
        recipient: application.credentials?.email || 'unknown@example.com',
        applicationId: application.id,
        status: 'sent',
        metadata: { newStatus: application.verification_status }
      });
    } catch (error) {
      console.error('Failed to send applicant notification:', error);
      await this.logNotification({
        type: 'applicant_status_change',
        recipient: application.credentials?.email || 'unknown@example.com',
        applicationId: application.id,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async notifyReviewAssignment(review: DocumentReview): Promise<void> {
    try {
      // Get reviewer details
      const reviewer = await this.getReviewer(review.reviewer_id);
      if (!reviewer) return;

      // Get document details
      const { data: document } = await supabase
        .from('documents')
        .select('*')
        .eq('id', review.document_id)
        .single();

      const emailData = {
        to: reviewer.contact_email,
        subject: `New Document Review Assignment - ${document?.type || 'Document'}`,
        template: 'reviewer_assignment',
        data: {
          reviewerName: reviewer.name,
          reviewId: review.id,
          documentType: document?.type || 'Unknown Document',
          documentTitle: document?.title || 'Untitled Document',
          reviewType: review.review_type,
          riskLevel: review.risk_level,
          assignmentDate: new Date().toLocaleDateString(),
          expectedCompletionDate: this.calculateExpectedCompletion(reviewer.average_turnaround_hours),
          reviewPortalUrl: `${window.location.origin}/professional/review/${review.id}`,
          supportEmail: 'support@legacyguard.app'
        }
      };

      await this.sendEmail(emailData);

      await this.logNotification({
        type: 'review_assignment',
        recipient: reviewer.contact_email,
        reviewId: review.id,
        status: 'sent'
      });
    } catch (error) {
      console.error('Failed to send review assignment notification:', error);
      await this.logNotification({
        type: 'review_assignment',
        recipient: 'unknown',
        reviewId: review.id,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async notifyReviewStatusChange(review: DocumentReview): Promise<void> {
    try {
      // Get document and user details
      const { data: document } = await supabase
        .from('documents')
        .select('*, profiles(email, full_name)')
        .eq('id', review.document_id)
        .single();

      if (!document || !document.profiles) return;

      const statusMessages = {
        'pending': 'Your document review has been assigned and is pending',
        'in_progress': 'Your document review is currently in progress',
        'completed': 'Your document review has been completed',
        'cancelled': 'Your document review has been cancelled'
      };

      const emailData = {
        to: document.profiles.email,
        subject: `Document Review Update - ${review.status}`,
        template: 'review_status_update',
        data: {
          userName: document.profiles.full_name,
          documentTitle: document.title || 'Untitled Document',
          documentType: document.type,
          reviewStatus: review.status,
          statusMessage: statusMessages[review.status] || 'Status updated',
          reviewId: review.id,
          completionDate: review.completion_date ? new Date(review.completion_date).toLocaleDateString() : null,
          dashboardUrl: `${window.location.origin}/vault/${document.id}/reviews`,
          supportEmail: 'support@legacyguard.app'
        }
      };

      await this.sendEmail(emailData);

      await this.logNotification({
        type: 'review_status_change',
        recipient: document.profiles.email,
        reviewId: review.id,
        status: 'sent',
        metadata: { newStatus: review.status }
      });
    } catch (error) {
      console.error('Failed to send review status notification:', error);
      await this.logNotification({
        type: 'review_status_change',
        recipient: 'unknown',
        reviewId: review.id,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Email service integration
  private async sendEmail(emailData: {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
  }): Promise<void> {
    // For now, we'll use Supabase Edge Functions for email sending
    // In production, this would integrate with SendGrid, AWS SES, or similar service
    
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData
      });

      if (error) throw error;
      
      console.log('Email sent successfully:', emailData.to);
    } catch (error) {
      console.error('Email sending failed:', error);
      // Fallback: log to database for manual processing
      await this.logFailedEmail(emailData, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private async logNotification(notification: {
    type: string;
    recipient: string;
    applicationId?: string;
    reviewId?: string;
    status: 'sent' | 'failed';
    error?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await supabase
        .from('notification_logs')
        .insert({
          ...notification,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log notification:', error);
    }
  }

  private async logFailedEmail(emailData: any, error: string): Promise<void> {
    try {
      await supabase
        .from('failed_emails')
        .insert({
          recipient: emailData.to,
          subject: emailData.subject,
          template: emailData.template,
          email_data: emailData.data,
          error_message: error,
          retry_count: 0,
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log failed email:', logError);
    }
  }

  // Helper methods
  private formatStatusForDisplay(status: string): string {
    const statusMap = {
      'pending': 'Pending Review',
      'under_review': 'Under Review',
      'verified': 'Approved & Verified',
      'rejected': 'Application Rejected'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  private getNextStepsForStatus(status: string): string {
    const nextStepsMap = {
      'pending': 'Your application is in queue for review. You will be notified when the review begins.',
      'under_review': 'Our team is currently reviewing your credentials. This typically takes 2-3 business days.',
      'verified': 'Congratulations! You can now access the professional portal and start accepting review assignments.',
      'rejected': 'Please review the feedback provided and feel free to reapply after addressing the noted concerns.'
    };
    return nextStepsMap[status as keyof typeof nextStepsMap] || 'Please check your dashboard for updates.';
  }

  private calculateExpectedCompletion(averageTurnaroundHours: number): string {
    const completionDate = new Date();
    completionDate.setHours(completionDate.getHours() + averageTurnaroundHours);
    return completionDate.toLocaleDateString();
  }
}

export const professionalService = ProfessionalService.getInstance();
