/**
 * Professional Network Service
 * Handles attorney applications, verification, and marketplace operations
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  ProfessionalReviewer,
  ProfessionalOnboarding,
  DocumentReview,
  ReviewRequest,
  ProfessionalPartnership,
  ReviewResult,
  ProfessionalSpecialization
} from '@/types/professional';

export class ProfessionalService {
  private static instance: ProfessionalService;

  static getInstance(): ProfessionalService {
    if (!ProfessionalService.instance) {
      ProfessionalService.instance = new ProfessionalService();
    }
    return ProfessionalService.instance;
  }

  // Professional Applications
  async submitApplication(application: Omit<ProfessionalOnboarding, 'id' | 'created_at' | 'updated_at'>): Promise<ProfessionalOnboarding> {
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

  async getApplicationByEmail(email: string): Promise<ProfessionalOnboarding | null> {
    const { data, error } = await supabase
      .from('professional_onboarding')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateApplicationStatus(
    id: string,
    status: ProfessionalOnboarding['status'],
    reviewNotes?: string
  ): Promise<ProfessionalOnboarding> {
    const updates: Partial<ProfessionalOnboarding> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'under_review' || status === 'approved' || status === 'rejected') {
      updates.reviewed_at = new Date().toISOString();
    }

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
    application: ProfessionalOnboarding,
    userId: string
  ): Promise<ProfessionalReviewer> {
    const reviewer: Omit<ProfessionalReviewer, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      email: application.email,
      full_name: application.full_name,
      professional_title: application.professional_title,
      law_firm_name: application.law_firm_name,
      bar_number: application.bar_number,
      licensed_states: application.licensed_states,
      specializations: await this.getSpecializationsByNames(application.specializations),
      experience_years: application.experience_years,
      status: 'active',
      verification_status: 'verified',
      hourly_rate: application.hourly_rate,
      bio: application.bio
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

    // Create default partnership settings
    await this.createDefaultPartnership(data.id);

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

  async getReviewerByUserId(userId: string): Promise<ProfessionalReviewer | null> {
    const { data, error } = await supabase
      .from('professional_reviewers')
      .select('*')
      .eq('user_id', userId)
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
    states?: string[];
    experienceMin?: number;
    status?: ProfessionalReviewer['status'];
    available?: boolean;
  }): Promise<ProfessionalReviewer[]> {
    let query = supabase
      .from('professional_reviewers')
      .select('*');

    if (filters.specializations?.length) {
      query = query.overlaps('specializations', filters.specializations);
    }

    if (filters.states?.length) {
      query = query.overlaps('licensed_states', filters.states);
    }

    if (filters.experienceMin) {
      query = query.gte('experience_years', filters.experienceMin);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  // Review Requests and Assignments
  async createReviewRequest(request: Omit<ReviewRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ReviewRequest> {
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

    // Find and notify suitable reviewers
    await this.findAndNotifyReviewers(data);

    return data;
  }

  async assignReviewRequest(
    requestId: string,
    reviewerId: string,
    estimatedHours?: number
  ): Promise<DocumentReview> {
    // Create the document review record
    const { data: request } = await supabase
      .from('review_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!request) throw new Error('Review request not found');

    const review: Omit<DocumentReview, 'id' | 'created_at' | 'updated_at'> = {
      document_id: request.document_id,
      reviewer_id: reviewerId,
      user_id: request.user_id,
      review_type: request.review_type,
      status: 'assigned',
      priority: request.priority,
      requested_at: request.created_at,
      assigned_at: new Date().toISOString(),
      due_date: request.deadline,
      estimated_hours: estimatedHours
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
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    // Notify reviewer and client
    await this.notifyReviewAssignment(data);

    return data;
  }

  async updateReviewStatus(
    reviewId: string,
    status: DocumentReview['status'],
    result?: Partial<ReviewResult>
  ): Promise<DocumentReview> {
    const updates: Partial<DocumentReview> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'in_progress') {
      updates.assigned_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
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

    // Send notifications
    await this.notifyReviewStatusChange(data);

    return data;
  }

  // Professional Network Directory
  async getNetworkDirectory(filters?: {
    specialization?: string;
    state?: string;
    experience?: 'junior' | 'mid' | 'senior';
  }): Promise<ProfessionalReviewer[]> {
    let query = supabase
      .from('professional_reviewers')
      .select('*')
      .eq('status', 'active')
      .eq('verification_status', 'verified');

    if (filters?.specialization) {
      query = query.contains('specializations', [filters.specialization]);
    }

    if (filters?.state) {
      query = query.contains('licensed_states', [filters.state]);
    }

    if (filters?.experience) {
      const experienceRanges = {
        junior: [1, 5],
        mid: [6, 15],
        senior: [16, 50]
      };
      const [min, max] = experienceRanges[filters.experience];
      query = query.gte('experience_years', min).lte('experience_years', max);
    }

    const { data, error } = await query.order('experience_years', { ascending: false });
    if (error) throw error;

    return data || [];
  }

  // Pricing and Booking
  async getReviewPricing(_reviewType: DocumentReview['review_type']): Promise<{
    basic: number;
    comprehensive: number;
    certified: number;
  }> {
    // This would typically come from a pricing configuration table
    const pricing = {
      basic: 150,
      comprehensive: 350,
      certified: 750
    };

    return pricing;
  }

  async bookConsultation(
    reviewerId: string,
    userId: string,
    consultationType: 'phone' | 'video' | 'in_person',
    preferredDateTime: string,
    duration: number = 60
  ): Promise<{
    consultationId: string;
    scheduledAt: string;
    meetingLink?: string;
  }> {
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        reviewer_id: reviewerId,
        user_id: userId,
        consultation_type: consultationType,
        scheduled_at: preferredDateTime,
        duration_minutes: duration,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Generate meeting link if video consultation
    let meetingLink: string | undefined;
    if (consultationType === 'video') {
      meetingLink = await this.generateVideoMeetingLink(data.id);
    }

    // Send confirmation emails
    await this.notifyConsultationScheduled(data, meetingLink);

    return {
      consultationId: data.id,
      scheduledAt: data.scheduled_at,
      meetingLink
    };
  }

  // Private helper methods
  private async getSpecializationsByNames(names: string[]): Promise<ProfessionalSpecialization[]> {
    const { data, error } = await supabase
      .from('professional_specializations')
      .select('*')
      .in('name', names);

    if (error) throw error;
    return data || [];
  }

  private async createDefaultPartnership(reviewerId: string): Promise<ProfessionalPartnership> {
    const partnership: Omit<ProfessionalPartnership, 'id' | 'created_at' | 'updated_at'> = {
      reviewer_id: reviewerId,
      partnership_type: 'individual',
      commission_rate: 30, // 30% commission
      minimum_review_fee: 100,
      preferred_review_types: ['basic', 'comprehensive'],
      availability_hours: {
        monday: ['09:00-17:00'],
        tuesday: ['09:00-17:00'],
        wednesday: ['09:00-17:00'],
        thursday: ['09:00-17:00'],
        friday: ['09:00-17:00'],
        saturday: [],
        sunday: []
      },
      max_concurrent_reviews: 5,
      auto_assign_enabled: false,
      notification_preferences: {
        email: true,
        sms: false,
        in_app: true
      },
      status: 'active'
    };

    const { data, error } = await supabase
      .from('professional_partnerships')
      .insert({
        ...partnership,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async findAndNotifyReviewers(request: ReviewRequest): Promise<void> {
    const reviewers = await this.searchReviewers({
      specializations: request.required_specializations,
      status: 'active',
      available: true
    });

    // Send notifications to suitable reviewers
    for (const reviewer of reviewers.slice(0, 5)) { // Notify top 5 matches
      await this.notifyReviewerOpportunity(reviewer, request);
    }
  }

  private async createReviewResult(
    reviewId: string,
    result: Partial<ReviewResult>
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

  private async generateVideoMeetingLink(consultationId: string): Promise<string> {
    // Integration with video meeting service (Zoom, Google Meet, etc.)
    // This is a placeholder implementation
    return `https://meet.legacyguard.com/consultation/${consultationId}`;
  }

  // Notification methods (placeholders for email/SMS integration)
  private async notifyAdminNewApplication(application: ProfessionalOnboarding): Promise<void> {
    console.log('Admin notification: New professional application', application.id);
  }

  private async notifyApplicantStatusChange(
    application: ProfessionalOnboarding,
    _notes?: string
  ): Promise<void> {
    console.log('Applicant notification: Status changed to', application.status);
  }

  private async notifyReviewAssignment(review: DocumentReview): Promise<void> {
    console.log('Review assignment notification', review.id);
  }

  private async notifyReviewStatusChange(review: DocumentReview): Promise<void> {
    console.log('Review status change notification', review.status);
  }

  private async notifyReviewerOpportunity(
    reviewer: ProfessionalReviewer,
    request: ReviewRequest
  ): Promise<void> {
    console.log('Reviewer opportunity notification', reviewer.id, request.id);
  }

  private async notifyConsultationScheduled(
    consultation: any,
    _meetingLink?: string
  ): Promise<void> {
    console.log('Consultation scheduled notification', consultation.id);
  }
}

export const professionalService = ProfessionalService.getInstance();
