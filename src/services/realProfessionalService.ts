/**
 * Real Professional Network Service
 * Complete database integration without mock data
 */

import { supabase } from '@/integrations/supabase/client';
import { professionalReviewRealtimeService } from '@/lib/realtime/professionalReviewUpdates';

export interface ProfessionalReviewer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  credentials: {
    bar_number?: string;
    licensed_states: string[];
    specializations: string[];
    years_experience: number;
    law_firm?: string;
    certifications?: string[];
  };
  profile: {
    bio: string;
    education: string[];
    practice_areas: string[];
    languages: string[];
    timezone: string;
  };
  verification_status: 'pending' | 'verified' | 'rejected';
  profile_verified: boolean;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  availability_status: 'available' | 'busy' | 'unavailable';
  created_at: string;
  updated_at: string;
}

export interface DocumentReview {
  id: string;
  user_id: string;
  document_id: string;
  reviewer_id: string;
  status: 'requested' | 'in_progress' | 'completed' | 'cancelled';
  review_type: 'basic' | 'comprehensive' | 'certified';
  urgency_level: 'standard' | 'priority' | 'urgent';
  estimated_cost: number;
  actual_cost?: number;
  findings: ReviewFinding[];
  recommendations: ReviewRecommendation[];
  score: number;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewFinding {
  id: string;
  type: 'error' | 'warning' | 'suggestion' | 'compliment';
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  line_reference?: string;
  recommendation?: string;
}

export interface ReviewRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  action_required: boolean;
  estimated_time: string;
  impact: string;
}

export interface ReviewRequest {
  id: string;
  user_id: string;
  document_id: string;
  review_type: 'basic' | 'comprehensive' | 'certified';
  urgency_level: 'standard' | 'priority' | 'urgent';
  specialization_required?: string;
  request_notes?: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  assigned_reviewer_id?: string;
  estimated_cost: number;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  user_id: string;
  professional_id: string;
  consultation_type: 'initial_consultation' | 'document_review' | 'estate_planning' | 'family_planning';
  scheduled_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meeting_url?: string;
  notes?: string;
  cost: number;
  created_at: string;
  updated_at: string;
}

class RealProfessionalService {
  private static instance: RealProfessionalService;

  static getInstance(): RealProfessionalService {
    if (!RealProfessionalService.instance) {
      RealProfessionalService.instance = new RealProfessionalService();
    }
    return RealProfessionalService.instance;
  }

  // Professional Directory - Real Attorney Network
  async getVerifiedAttorneys(filters?: {
    specializations?: string[];
    jurisdiction?: string;
    ratingMin?: number;
    availableOnly?: boolean;
  }): Promise<ProfessionalReviewer[]> {
    try {
      let query = supabase
        .from('professional_reviewers')
        .select('*')
        .eq('profile_verified', true)
        .eq('verification_status', 'verified');

      if (filters?.ratingMin) {
        query = query.gte('rating', filters.ratingMin);
      }

      if (filters?.availableOnly) {
        query = query.eq('availability_status', 'available');
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) throw error;

      // Filter by specializations and jurisdiction in-memory since JSONB queries are complex
      let filteredData = data || [];

      if (filters?.specializations?.length) {
        filteredData = filteredData.filter(attorney =>
          attorney.credentials?.specializations?.some((spec: string) =>
            filters.specializations!.includes(spec)
          )
        );
      }

      if (filters?.jurisdiction) {
        filteredData = filteredData.filter(attorney =>
          attorney.credentials?.licensed_states?.includes(filters.jurisdiction!)
        );
      }

      return filteredData;
    } catch (error) {
      console.error('Failed to fetch verified attorneys:', error);
      return [];
    }
  }

  async getAttorneyById(id: string): Promise<ProfessionalReviewer | null> {
    try {
      const { data, error } = await supabase
        .from('professional_reviewers')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch attorney by ID:', error);
      return null;
    }
  }

  // Review Request System - Real Database Operations
  async createReviewRequest(requestData: {
    user_id: string;
    document_id: string;
    review_type: 'basic' | 'comprehensive' | 'certified';
    urgency_level: 'standard' | 'priority' | 'urgent';
    specialization_required?: string;
    request_notes?: string;
    estimated_cost: number;
  }): Promise<ReviewRequest> {
    try {
      const { data, error } = await supabase
        .from('review_requests')
        .insert({
          ...requestData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update document status to reflect review request
      await this.updateDocumentReviewStatus(requestData.document_id, 'requested');

      // Notify available reviewers
      await this.notifyAvailableReviewers(data);

      return data;
    } catch (error) {
      console.error('Failed to create review request:', error);
      throw error;
    }
  }

  async assignReviewRequest(requestId: string, reviewerId: string): Promise<DocumentReview> {
    try {
      // Get the review request
      const { data: request, error: requestError } = await supabase
        .from('review_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Create document review
      const { data: review, error: reviewError } = await supabase
        .from('document_reviews')
        .insert({
          user_id: request.user_id,
          document_id: request.document_id,
          reviewer_id: reviewerId,
          status: 'in_progress',
          review_type: request.review_type,
          urgency_level: request.urgency_level,
          estimated_cost: request.estimated_cost,
          findings: [],
          recommendations: [],
          score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      // Update request status
      await supabase
        .from('review_requests')
        .update({
          status: 'assigned',
          assigned_reviewer_id: reviewerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      // Update document status
      await this.updateDocumentReviewStatus(request.document_id, 'in_progress');

      // Send real-time update
      await professionalReviewRealtimeService.broadcastUpdateToUser(request.user_id, {
        review_id: review.id,
        document_id: request.document_id,
        status: 'in_progress',
        progress_percentage: 25
      });

      // Notify user
      await this.notifyUserReviewAssigned(review);

      return review;
    } catch (error) {
      console.error('Failed to assign review request:', error);
      throw error;
    }
  }

  async completeDocumentReview(
    reviewId: string,
    findings: ReviewFinding[],
    recommendations: ReviewRecommendation[],
    score: number
  ): Promise<DocumentReview> {
    try {
      const { data: review, error } = await supabase
        .from('document_reviews')
        .update({
          status: 'completed',
          findings,
          recommendations,
          score,
          completion_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select('*, documents(*)')
        .single();

      if (error) throw error;

      // Update document with review results
      await professionalReviewRealtimeService.completeReview(
        review.document_id,
        score,
        findings,
        recommendations
      );

      // Send real-time update
      await professionalReviewRealtimeService.broadcastUpdateToUser(review.user_id, {
        review_id: reviewId,
        document_id: review.document_id,
        status: 'completed',
        progress_percentage: 100,
        score,
        findings,
        recommendations,
        completion_date: review.completion_date
      });

      // Send completion notification
      await this.notifyUserReviewCompleted(review);

      return review;
    } catch (error) {
      console.error('Failed to complete review:', error);
      throw error;
    }
  }

  // Consultation Booking System
  async bookConsultation(
    professionalId: string,
    userId: string,
    consultationType: Consultation['consultation_type'],
    scheduledTime: string,
    durationMinutes: number = 60
  ): Promise<Consultation> {
    try {
      // Get professional's hourly rate
      const { data: professional } = await supabase
        .from('professional_reviewers')
        .select('hourly_rate')
        .eq('id', professionalId)
        .single();

      const cost = professional ? (professional.hourly_rate * durationMinutes / 60) : 0;

      const { data, error } = await supabase
        .from('consultations')
        .insert({
          user_id: userId,
          professional_id: professionalId,
          consultation_type: consultationType,
          scheduled_time: scheduledTime,
          duration_minutes: durationMinutes,
          status: 'scheduled',
          cost,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation emails
      await this.sendConsultationConfirmation(data);

      return data;
    } catch (error) {
      console.error('Failed to book consultation:', error);
      throw error;
    }
  }

  // Pricing System
  async getReviewPricing(): Promise<Record<string, number>> {
    return {
      basic: 199,
      comprehensive: 399,
      certified: 699
    };
  }

  // Real Database Helper Methods
  private async updateDocumentReviewStatus(
    documentId: string,
    status: 'none' | 'requested' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          professional_review_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update document review status:', error);
    }
  }

  private async notifyAvailableReviewers(request: ReviewRequest): Promise<void> {
    try {
      // Get reviewers who match the specialization
      const { data: reviewers } = await supabase
        .from('professional_reviewers')
        .select('*')
        .eq('availability_status', 'available')
        .eq('profile_verified', true);

      if (reviewers?.length) {
        // Send notifications to matching reviewers
        const notifications = reviewers
          .filter(reviewer =>
            !request.specialization_required ||
            reviewer.credentials?.specializations?.includes(request.specialization_required)
          )
          .map(reviewer => ({
            user_id: reviewer.user_id,
            type: 'new_review_request',
            title: 'New Review Request Available',
            message: `A ${request.review_type} review is available for ${request.urgency_level} completion`,
            data: { request_id: request.id, document_id: request.document_id },
            created_at: new Date().toISOString()
          }));

        if (notifications.length > 0) {
          await supabase.from('notifications').insert(notifications);
        }
      }
    } catch (error) {
      console.error('Failed to notify available reviewers:', error);
    }
  }

  private async notifyUserReviewAssigned(review: DocumentReview): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        user_id: review.user_id,
        type: 'review_assigned',
        title: 'Document Review Assigned',
        message: 'A professional has been assigned to review your document',
        data: { review_id: review.id, document_id: review.document_id },
        created_at: new Date().toISOString()
      });

      // Send email notification
      await this.sendEmail({
        to: review.user_id,
        subject: 'Document Review Assigned',
        template: 'review_assigned',
        data: {
          reviewId: review.id,
          documentId: review.document_id,
          reviewType: review.review_type
        }
      });
    } catch (error) {
      console.error('Failed to notify user of review assignment:', error);
    }
  }

  private async notifyUserReviewCompleted(review: DocumentReview): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        user_id: review.user_id,
        type: 'review_completed',
        title: 'Document Review Completed',
        message: `Your document review has been completed with a score of ${review.score}/100`,
        data: {
          review_id: review.id,
          document_id: review.document_id,
          score: review.score,
          findings_count: review.findings.length,
          recommendations_count: review.recommendations.length
        },
        created_at: new Date().toISOString()
      });

      // Send email notification
      await this.sendEmail({
        to: review.user_id,
        subject: 'Document Review Completed',
        template: 'review_completed',
        data: {
          reviewId: review.id,
          score: review.score,
          findingsCount: review.findings.length,
          recommendationsCount: review.recommendations.length
        }
      });
    } catch (error) {
      console.error('Failed to notify user of review completion:', error);
    }
  }

  private async sendConsultationConfirmation(consultation: Consultation): Promise<void> {
    try {
      // Send to user
      await this.sendEmail({
        to: consultation.user_id,
        subject: 'Consultation Confirmation',
        template: 'consultation_confirmed_user',
        data: {
          consultationType: consultation.consultation_type,
          scheduledTime: consultation.scheduled_time,
          duration: consultation.duration_minutes,
          cost: consultation.cost
        }
      });

      // Send to professional
      await this.sendEmail({
        to: consultation.professional_id,
        subject: 'New Consultation Booked',
        template: 'consultation_confirmed_professional',
        data: {
          consultationType: consultation.consultation_type,
          scheduledTime: consultation.scheduled_time,
          duration: consultation.duration_minutes
        }
      });
    } catch (error) {
      console.error('Failed to send consultation confirmations:', error);
    }
  }

  private async sendEmail(emailData: {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
  }): Promise<void> {
    try {
      await supabase.functions.invoke('send-email', {
        body: emailData
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  // User Review Methods
  async getUserReviews(userId: string): Promise<DocumentReview[]> {
    try {
      const { data, error } = await supabase
        .from('document_reviews')
        .select(`
          *,
          documents(title, type),
          professional_reviewers(name, credentials)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch user reviews:', error);
      return [];
    }
  }

  async getUserReviewRequests(userId: string): Promise<ReviewRequest[]> {
    try {
      const { data, error } = await supabase
        .from('review_requests')
        .select(`
          *,
          documents(title, type),
          professional_reviewers(name, credentials)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch user review requests:', error);
      return [];
    }
  }

  async getUserConsultations(userId: string): Promise<Consultation[]> {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          professional_reviewers(name, credentials, profile)
        `)
        .eq('user_id', userId)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch user consultations:', error);
      return [];
    }
  }
}

export const realProfessionalService = RealProfessionalService.getInstance();
