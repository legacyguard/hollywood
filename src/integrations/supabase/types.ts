export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          date_of_birth: string | null;
          emergency_contacts: Json | null;
          preferences: Json | null;
          memorial_message: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          emergency_contacts?: Json | null;
          preferences?: Json | null;
          memorial_message?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          emergency_contacts?: Json | null;
          preferences?: Json | null;
          memorial_message?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      legacy_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: 'document' | 'wish' | 'memory' | 'instruction' | 'asset';
          status: 'draft' | 'in_progress' | 'completed' | 'archived';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          due_date: string | null;
          tags: string[] | null;
          metadata: Json | null;
          file_urls: string[] | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: 'document' | 'wish' | 'memory' | 'instruction' | 'asset';
          status?: 'draft' | 'in_progress' | 'completed' | 'archived';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string | null;
          tags?: string[] | null;
          metadata?: Json | null;
          file_urls?: string[] | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: 'document' | 'wish' | 'memory' | 'instruction' | 'asset';
          status?: 'draft' | 'in_progress' | 'completed' | 'archived';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string | null;
          tags?: string[] | null;
          metadata?: Json | null;
          file_urls?: string[] | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'legacy_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_path: string;
          file_type: string | null;
          file_size: number | null;
          document_type: string;
          expires_at: string | null;
          encrypted_at: string | null;
          last_notification_sent_at: string | null;
          // Professional review fields
          professional_review_status: 'none' | 'requested' | 'in_progress' | 'completed' | 'cancelled' | null;
          professional_review_score: number | null;
          professional_review_date: string | null;
          professional_reviewer_id: string | null;
          review_findings: Json | null;
          review_recommendations: Json | null;
          // New OCR and AI fields
          category: string | null;
          title: string | null;
          description: string | null;
          tags: string[] | null;
          is_important: boolean;
          ocr_text: string | null;
          ocr_confidence: number | null;
          extracted_entities: Json | null;
          classification_confidence: number | null;
          extracted_metadata: Json | null;
          processing_status:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'failed'
            | 'manual';
          completion_percentage: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_path: string;
          file_type?: string | null;
          file_size?: number | null;
          document_type?: string;
          expires_at?: string | null;
          encrypted_at?: string | null;
          last_notification_sent_at?: string | null;
          // Professional review fields
          professional_review_status?: 'none' | 'requested' | 'in_progress' | 'completed' | 'cancelled' | null;
          professional_review_score?: number | null;
          professional_review_date?: string | null;
          professional_reviewer_id?: string | null;
          review_findings?: Json | null;
          review_recommendations?: Json | null;
          // New OCR and AI fields
          category?: string | null;
          title?: string | null;
          description?: string | null;
          tags?: string[] | null;
          is_important?: boolean;
          ocr_text?: string | null;
          ocr_confidence?: number | null;
          extracted_entities?: Json | null;
          classification_confidence?: number | null;
          extracted_metadata?: Json | null;
          processing_status?:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'failed'
            | 'manual';
          completion_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          file_path?: string;
          file_type?: string | null;
          file_size?: number | null;
          document_type?: string;
          expires_at?: string | null;
          encrypted_at?: string | null;
          last_notification_sent_at?: string | null;
          // Professional review fields
          professional_review_status?: 'none' | 'requested' | 'in_progress' | 'completed' | 'cancelled' | null;
          professional_review_score?: number | null;
          professional_review_date?: string | null;
          professional_reviewer_id?: string | null;
          review_findings?: Json | null;
          review_recommendations?: Json | null;
          // New OCR and AI fields
          category?: string | null;
          title?: string | null;
          description?: string | null;
          tags?: string[] | null;
          is_important?: boolean;
          ocr_text?: string | null;
          ocr_confidence?: number | null;
          extracted_entities?: Json | null;
          classification_confidence?: number | null;
          extracted_metadata?: Json | null;
          processing_status?:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'failed'
            | 'manual';
          completion_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guardians: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string | null;
          relationship: string | null;
          notes: string | null;
          is_active: boolean;
          emergency_contact_priority?: number | null;
          memorial_message?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone?: string | null;
          relationship?: string | null;
          notes?: string | null;
          is_active?: boolean;
          emergency_contact_priority?: number | null;
          memorial_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          relationship?: string | null;
          notes?: string | null;
          is_active?: boolean;
          emergency_contact_priority?: number | null;
          memorial_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'guardians_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      family_shield_activation_log: {
        Row: {
          id: string;
          user_id: string;
          guardian_id: string | null;
          guardian_email: string | null;
          guardian_name: string | null;
          trigger_type: string;
          status: string;
          verification_token: string | null;
          token_expires_at: string | null;
          notes: string | null;
          ip_address: string | null;
          user_agent: string | null;
          confirmed_at: string | null;
          expired_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guardian_id?: string | null;
          guardian_email?: string | null;
          guardian_name?: string | null;
          trigger_type: string;
          status?: string;
          verification_token?: string | null;
          token_expires_at?: string | null;
          notes?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          confirmed_at?: string | null;
          expired_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guardian_id?: string | null;
          guardian_email?: string | null;
          guardian_name?: string | null;
          trigger_type?: string;
          status?: string;
          verification_token?: string | null;
          token_expires_at?: string | null;
          notes?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          confirmed_at?: string | null;
          expired_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      time_capsules: {
        Row: {
          id: string;
          user_id: string;
          message_title: string;
          message_preview: string | null;
          message_content: string;
          delivery_condition: string;
          delivery_date: string | null;
          access_token: string | null;
          is_delivered: boolean;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message_title: string;
          message_preview?: string | null;
          message_content: string;
          delivery_condition: string;
          delivery_date?: string | null;
          access_token?: string | null;
          is_delivered?: boolean;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message_title?: string;
          message_preview?: string | null;
          message_content?: string;
          delivery_condition?: string;
          delivery_date?: string | null;
          access_token?: string | null;
          is_delivered?: boolean;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      family_guidance_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_type: string;
          title: string;
          content: string;
          priority: number;
          is_completed: boolean;
          related_document_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_type: string;
          title: string;
          content: string;
          priority?: number;
          is_completed?: boolean;
          related_document_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_type?: string;
          title?: string;
          content?: string;
          priority?: number;
          is_completed?: boolean;
          related_document_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      family_shield_settings: {
        Row: {
          id: string;
          user_id: string;
          is_enabled: boolean;
          inactivity_threshold: number;
          notification_frequency: number;
          emergency_access_level: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          is_enabled?: boolean;
          inactivity_threshold?: number;
          notification_frequency?: number;
          emergency_access_level?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          is_enabled?: boolean;
          inactivity_threshold?: number;
          notification_frequency?: number;
          emergency_access_level?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guardian_notifications: {
        Row: {
          id: string;
          guardian_id: string;
          notification_type: string;
          status: string;
          sent_at: string | null;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          guardian_id: string;
          notification_type: string;
          status?: string;
          sent_at?: string | null;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          guardian_id?: string;
          notification_type?: string;
          status?: string;
          sent_at?: string | null;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      survivor_access_requests: {
        Row: {
          id: string;
          access_token: string;
          user_id: string;
          guardian_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          access_token: string;
          user_id?: string;
          guardian_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          access_token?: string;
          user_id?: string;
          guardian_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      professional_reviewers: {
        Row: {
          id: string;
          name: string;
          credentials: string;
          bar_number: string | null;
          jurisdiction: string;
          specializations: string[];
          rating: number;
          reviews_completed: number;
          average_turnaround_hours: number;
          profile_verified: boolean;
          contact_email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          credentials: string;
          bar_number?: string | null;
          jurisdiction: string;
          specializations?: string[];
          rating?: number;
          reviews_completed?: number;
          average_turnaround_hours?: number;
          profile_verified?: boolean;
          contact_email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          credentials?: string;
          bar_number?: string | null;
          jurisdiction?: string;
          specializations?: string[];
          rating?: number;
          reviews_completed?: number;
          average_turnaround_hours?: number;
          profile_verified?: boolean;
          contact_email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      professional_reviews: {
        Row: {
          id: string;
          document_id: string;
          reviewer_id: string;
          status: 'pending' | 'in_review' | 'approved' | 'needs_revision' | 'rejected';
          review_date: string;
          completion_date: string | null;
          certification_level: 'basic' | 'premium' | 'legal_certified';
          review_notes: string | null;
          recommended_changes: string[] | null;
          legal_compliance_score: number;
          family_protection_score: number;
          review_fee: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          reviewer_id: string;
          status?: 'pending' | 'in_review' | 'approved' | 'needs_revision' | 'rejected';
          review_date?: string;
          completion_date?: string | null;
          certification_level?: 'basic' | 'premium' | 'legal_certified';
          review_notes?: string | null;
          recommended_changes?: string[] | null;
          legal_compliance_score?: number;
          family_protection_score?: number;
          review_fee?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          reviewer_id?: string;
          status?: 'pending' | 'in_review' | 'approved' | 'needs_revision' | 'rejected';
          review_date?: string;
          completion_date?: string | null;
          certification_level?: 'basic' | 'premium' | 'legal_certified';
          review_notes?: string | null;
          recommended_changes?: string[] | null;
          legal_compliance_score?: number;
          family_protection_score?: number;
          review_fee?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'professional_reviews_reviewer_id_fkey';
            columns: ['reviewer_id'];
            isOneToOne: false;
            referencedRelation: 'professional_reviewers';
            referencedColumns: ['id'];
          }
        ];
      };
      // New professional network tables
      professional_specializations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      professional_onboarding: {
        Row: {
          id: string;
          user_id: string;
          professional_type: 'attorney' | 'notary' | 'financial_advisor' | 'estate_planner' | 'tax_specialist';
          credentials: Json;
          verification_status: 'pending' | 'verified' | 'rejected';
          background_check_status: 'pending' | 'passed' | 'failed';
          onboarding_step: string;
          completed_steps: string[];
          documents_uploaded: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          professional_type: 'attorney' | 'notary' | 'financial_advisor' | 'estate_planner' | 'tax_specialist';
          credentials?: Json;
          verification_status?: 'pending' | 'verified' | 'rejected';
          background_check_status?: 'pending' | 'passed' | 'failed';
          onboarding_step?: string;
          completed_steps?: string[];
          documents_uploaded?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          professional_type?: 'attorney' | 'notary' | 'financial_advisor' | 'estate_planner' | 'tax_specialist';
          credentials?: Json;
          verification_status?: 'pending' | 'verified' | 'rejected';
          background_check_status?: 'pending' | 'passed' | 'failed';
          onboarding_step?: string;
          completed_steps?: string[];
          documents_uploaded?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'professional_onboarding_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      review_requests: {
        Row: {
          id: string;
          user_id: string;
          document_id: string;
          reviewer_id: string | null;
          status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          requested_date: string;
          due_date: string | null;
          completion_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_id: string;
          reviewer_id?: string | null;
          status?: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          requested_date?: string;
          due_date?: string | null;
          completion_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_id?: string;
          reviewer_id?: string | null;
          status?: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          requested_date?: string;
          due_date?: string | null;
          completion_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_requests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_requests_reviewer_id_fkey';
            columns: ['reviewer_id'];
            isOneToOne: false;
            referencedRelation: 'professional_reviewers';
            referencedColumns: ['id'];
          }
        ];
      };
      document_reviews: {
        Row: {
          id: string;
          document_id: string;
          reviewer_id: string;
          review_type: 'legal' | 'financial' | 'medical' | 'general';
          status: 'pending' | 'in_progress' | 'completed' | 'needs_revision';
          findings: Json | null;
          recommendations: Json | null;
          risk_level: 'low' | 'medium' | 'high' | 'critical';
          compliance_score: number | null;
          review_date: string;
          completion_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          reviewer_id: string;
          review_type: 'legal' | 'financial' | 'medical' | 'general';
          status?: 'pending' | 'in_progress' | 'completed' | 'needs_revision';
          findings?: Json | null;
          recommendations?: Json | null;
          risk_level?: 'low' | 'medium' | 'high' | 'critical';
          compliance_score?: number | null;
          review_date?: string;
          completion_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          reviewer_id?: string;
          review_type?: 'legal' | 'financial' | 'medical' | 'general';
          status?: 'pending' | 'in_progress' | 'completed' | 'needs_revision';
          findings?: Json | null;
          recommendations?: Json | null;
          risk_level?: 'low' | 'medium' | 'high' | 'critical';
          compliance_score?: number | null;
          review_date?: string;
          completion_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'document_reviews_reviewer_id_fkey';
            columns: ['reviewer_id'];
            isOneToOne: false;
            referencedRelation: 'professional_reviewers';
            referencedColumns: ['id'];
          }
        ];
      };
      review_results: {
        Row: {
          id: string;
          review_id: string;
          result_type: 'approval' | 'rejection' | 'revision_required' | 'conditional_approval';
          summary: string;
          detailed_findings: Json;
          action_items: Json;
          legal_references: string[] | null;
          next_steps: string[] | null;
          validity_period: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          result_type: 'approval' | 'rejection' | 'revision_required' | 'conditional_approval';
          summary: string;
          detailed_findings?: Json;
          action_items?: Json;
          legal_references?: string[] | null;
          next_steps?: string[] | null;
          validity_period?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          result_type?: 'approval' | 'rejection' | 'revision_required' | 'conditional_approval';
          summary?: string;
          detailed_findings?: Json;
          action_items?: Json;
          legal_references?: string[] | null;
          next_steps?: string[] | null;
          validity_period?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_results_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'document_reviews';
            referencedColumns: ['id'];
          }
        ];
      };
      professional_partnerships: {
        Row: {
          id: string;
          professional_id: string;
          partner_type: 'law_firm' | 'accounting_firm' | 'financial_institution' | 'insurance_company' | 'estate_service';
          partner_name: string;
          partner_contact: Json;
          partnership_status: 'active' | 'pending' | 'suspended' | 'terminated';
          agreement_details: Json;
          commission_structure: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          partner_type: 'law_firm' | 'accounting_firm' | 'financial_institution' | 'insurance_company' | 'estate_service';
          partner_name: string;
          partner_contact?: Json;
          partnership_status?: 'active' | 'pending' | 'suspended' | 'terminated';
          agreement_details?: Json;
          commission_structure?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          partner_type?: 'law_firm' | 'accounting_firm' | 'financial_institution' | 'insurance_company' | 'estate_service';
          partner_name?: string;
          partner_contact?: Json;
          partnership_status?: 'active' | 'pending' | 'suspended' | 'terminated';
          agreement_details?: Json;
          commission_structure?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'professional_partnerships_professional_id_fkey';
            columns: ['professional_id'];
            isOneToOne: false;
            referencedRelation: 'professional_reviewers';
            referencedColumns: ['id'];
          }
        ];
      };
      // New Analytics and Insights Tables
      quick_insights: {
        Row: {
          id: string;
          user_id: string;
          document_id: string | null;
          type: 'document_analysis' | 'family_impact' | 'time_saved' | 'protection_level' | 'completion_gap' | 'urgent_action';
          title: string;
          description: string;
          value: string | null;
          impact: 'high' | 'medium' | 'low';
          priority: 'urgent' | 'important' | 'nice_to_have';
          actionable: boolean;
          action_text: string | null;
          action_url: string | null;
          metadata: Json;
          family_impact: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_id?: string | null;
          type: 'document_analysis' | 'family_impact' | 'time_saved' | 'protection_level' | 'completion_gap' | 'urgent_action';
          title: string;
          description: string;
          value?: string | null;
          impact: 'high' | 'medium' | 'low';
          priority: 'urgent' | 'important' | 'nice_to_have';
          actionable?: boolean;
          action_text?: string | null;
          action_url?: string | null;
          metadata?: Json;
          family_impact?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_id?: string | null;
          type?: 'document_analysis' | 'family_impact' | 'time_saved' | 'protection_level' | 'completion_gap' | 'urgent_action';
          title?: string;
          description?: string;
          value?: string | null;
          impact?: 'high' | 'medium' | 'low';
          priority?: 'urgent' | 'important' | 'nice_to_have';
          actionable?: boolean;
          action_text?: string | null;
          action_url?: string | null;
          metadata?: Json;
          family_impact?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      legacy_milestones: {
        Row: {
          id: string;
          user_id: string;
          type: 'first_document' | 'protection_threshold' | 'family_complete' | 'professional_review' | 'annual_update' | 'legacy_complete';
          title: string;
          description: string;
          category: 'foundation' | 'protection' | 'family' | 'professional' | 'maintenance' | 'mastery';
          criteria_type: 'document_count' | 'protection_percentage' | 'family_members' | 'time_based' | 'action_completed' | 'review_score';
          criteria_threshold: string;
          criteria_current_value: string;
          criteria_is_complete: boolean;
          progress_percentage: number;
          progress_steps_completed: number;
          progress_total_steps: number;
          progress_next_action: string | null;
          progress_next_action_url: string | null;
          celebration_should_show: boolean;
          celebration_text: string | null;
          celebration_family_impact_message: string | null;
          celebration_emotional_framing: string | null;
          celebration_icon: string | null;
          celebration_color: string | null;
          rewards: Json;
          triggers: Json;
          metadata: Json;
          created_at: string;
          completed_at: string | null;
          last_checked_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'first_document' | 'protection_threshold' | 'family_complete' | 'professional_review' | 'annual_update' | 'legacy_complete';
          title: string;
          description: string;
          category: 'foundation' | 'protection' | 'family' | 'professional' | 'maintenance' | 'mastery';
          criteria_type: 'document_count' | 'protection_percentage' | 'family_members' | 'time_based' | 'action_completed' | 'review_score';
          criteria_threshold: string;
          criteria_current_value: string;
          criteria_is_complete?: boolean;
          progress_percentage?: number;
          progress_steps_completed?: number;
          progress_total_steps?: number;
          progress_next_action?: string | null;
          progress_next_action_url?: string | null;
          celebration_should_show?: boolean;
          celebration_text?: string | null;
          celebration_family_impact_message?: string | null;
          celebration_emotional_framing?: string | null;
          celebration_icon?: string | null;
          celebration_color?: string | null;
          rewards?: Json;
          triggers?: Json;
          metadata?: Json;
          created_at?: string;
          completed_at?: string | null;
          last_checked_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'first_document' | 'protection_threshold' | 'family_complete' | 'professional_review' | 'annual_update' | 'legacy_complete';
          title?: string;
          description?: string;
          category?: 'foundation' | 'protection' | 'family' | 'professional' | 'maintenance' | 'mastery';
          criteria_type?: 'document_count' | 'protection_percentage' | 'family_members' | 'time_based' | 'action_completed' | 'review_score';
          criteria_threshold?: string;
          criteria_current_value?: string;
          criteria_is_complete?: boolean;
          progress_percentage?: number;
          progress_steps_completed?: number;
          progress_total_steps?: number;
          progress_next_action?: string | null;
          progress_next_action_url?: string | null;
          celebration_should_show?: boolean;
          celebration_text?: string | null;
          celebration_family_impact_message?: string | null;
          celebration_emotional_framing?: string | null;
          celebration_icon?: string | null;
          celebration_color?: string | null;
          rewards?: Json;
          triggers?: Json;
          metadata?: Json;
          created_at?: string;
          completed_at?: string | null;
          last_checked_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      consultations: {
        Row: {
          id: string;
          user_id: string;
          professional_id: string;
          consultation_type: 'initial' | 'follow_up' | 'urgent' | 'document_review';
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
          scheduled_time: string;
          duration_minutes: number;
          consultation_notes: string | null;
          follow_up_required: boolean;
          follow_up_date: string | null;
          fee_charged: number | null;
          payment_status: 'pending' | 'paid' | 'refunded' | 'disputed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          professional_id: string;
          consultation_type?: 'initial' | 'follow_up' | 'urgent' | 'document_review';
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
          scheduled_time?: string;
          duration_minutes?: number;
          consultation_notes?: string | null;
          follow_up_required?: boolean;
          follow_up_date?: string | null;
          fee_charged?: number | null;
          payment_status?: 'pending' | 'paid' | 'refunded' | 'disputed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          professional_id?: string;
          consultation_type?: 'initial' | 'follow_up' | 'urgent' | 'document_review';
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
          scheduled_time?: string;
          duration_minutes?: number;
          consultation_notes?: string | null;
          follow_up_required?: boolean;
          follow_up_date?: string | null;
          fee_charged?: number | null;
          payment_status?: 'pending' | 'paid' | 'refunded' | 'disputed';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'consultations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'consultations_professional_id_fkey';
            columns: ['professional_id'];
            isOneToOne: false;
            referencedRelation: 'professional_reviewers';
            referencedColumns: ['id'];
          }
        ];
      };
      // Family System Tables
      family_members: {
        Row: {
          id: string;
          family_owner_id: string;
          user_id: string | null;
          email: string;
          name: string;
          role: 'owner' | 'co_owner' | 'collaborator' | 'viewer' | 'emergency_contact';
          relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'grandparent' | 'grandchild' | 'aunt_uncle' | 'cousin' | 'friend' | 'professional' | 'other';
          permissions: Json;
          is_active: boolean;
          phone: string | null;
          address: Json;
          date_of_birth: string | null;
          emergency_contact: boolean;
          access_level: 'view' | 'edit' | 'admin';
          preferences: Json;
          trusted_devices: Json;
          emergency_access_enabled: boolean;
          avatar_url: string | null;
          last_active_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_owner_id: string;
          user_id?: string | null;
          email: string;
          name: string;
          role: 'owner' | 'co_owner' | 'collaborator' | 'viewer' | 'emergency_contact';
          relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'grandparent' | 'grandchild' | 'aunt_uncle' | 'cousin' | 'friend' | 'professional' | 'other';
          permissions?: Json;
          is_active?: boolean;
          phone?: string | null;
          address?: Json;
          date_of_birth?: string | null;
          emergency_contact?: boolean;
          access_level?: 'view' | 'edit' | 'admin';
          preferences?: Json;
          trusted_devices?: Json;
          emergency_access_enabled?: boolean;
          avatar_url?: string | null;
          last_active_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_owner_id?: string;
          user_id?: string | null;
          email?: string;
          name?: string;
          role?: 'owner' | 'co_owner' | 'collaborator' | 'viewer' | 'emergency_contact';
          relationship?: 'spouse' | 'parent' | 'child' | 'sibling' | 'grandparent' | 'grandchild' | 'aunt_uncle' | 'cousin' | 'friend' | 'professional' | 'other';
          permissions?: Json;
          is_active?: boolean;
          phone?: string | null;
          address?: Json;
          date_of_birth?: string | null;
          emergency_contact?: boolean;
          access_level?: 'view' | 'edit' | 'admin';
          preferences?: Json;
          trusted_devices?: Json;
          emergency_access_enabled?: boolean;
          avatar_url?: string | null;
          last_active_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      family_invitations: {
        Row: {
          id: string;
          sender_id: string;
          family_member_id: string;
          email: string;
          token: string;
          status: 'pending' | 'accepted' | 'declined' | 'expired';
          message: string | null;
          expires_at: string;
          accepted_at: string | null;
          declined_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          family_member_id: string;
          email: string;
          token: string;
          status?: 'pending' | 'accepted' | 'declined' | 'expired';
          message?: string | null;
          expires_at: string;
          accepted_at?: string | null;
          declined_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          family_member_id?: string;
          email?: string;
          token?: string;
          status?: 'pending' | 'accepted' | 'declined' | 'expired';
          message?: string | null;
          expires_at?: string;
          accepted_at?: string | null;
          declined_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      emergency_access_requests: {
        Row: {
          id: string;
          requester_id: string;
          owner_id: string;
          reason: string;
          status: 'pending' | 'approved' | 'denied' | 'expired';
          requested_at: string;
          expires_at: string;
          responded_at: string | null;
          approver_name: string | null;
          approver_relation: string | null;
          access_granted_until: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          owner_id: string;
          reason: string;
          status?: 'pending' | 'approved' | 'denied' | 'expired';
          requested_at?: string;
          expires_at: string;
          responded_at?: string | null;
          approver_name?: string | null;
          approver_relation?: string | null;
          access_granted_until?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          owner_id?: string;
          reason?: string;
          status?: 'pending' | 'approved' | 'denied' | 'expired';
          requested_at?: string;
          expires_at?: string;
          responded_at?: string | null;
          approver_name?: string | null;
          approver_relation?: string | null;
          access_granted_until?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      document_shares: {
        Row: {
          id: string;
          document_id: string;
          owner_id: string;
          shared_with_id: string | null;
          shared_with_email: string | null;
          family_member_id: string | null;
          permission_level: 'view' | 'edit' | 'admin';
          shared_at: string;
          expires_at: string | null;
          access_count: number;
          last_accessed_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          owner_id: string;
          shared_with_id?: string | null;
          shared_with_email?: string | null;
          family_member_id?: string | null;
          permission_level?: 'view' | 'edit' | 'admin';
          shared_at?: string;
          expires_at?: string | null;
          access_count?: number;
          last_accessed_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          owner_id?: string;
          shared_with_id?: string | null;
          shared_with_email?: string | null;
          family_member_id?: string | null;
          permission_level?: 'view' | 'edit' | 'admin';
          shared_at?: string;
          expires_at?: string | null;
          access_count?: number;
          last_accessed_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      family_activity_log: {
        Row: {
          id: string;
          family_owner_id: string;
          actor_id: string | null;
          actor_name: string | null;
          action_type: 'member_added' | 'member_removed' | 'member_updated' | 'invitation_sent' | 'invitation_accepted' | 'document_shared' | 'document_accessed' | 'emergency_access_requested' | 'emergency_access_granted' | 'role_changed';
          target_type: 'family_member' | 'document' | 'invitation' | 'emergency_request' | null;
          target_id: string | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_owner_id: string;
          actor_id?: string | null;
          actor_name?: string | null;
          action_type: 'member_added' | 'member_removed' | 'member_updated' | 'invitation_sent' | 'invitation_accepted' | 'document_shared' | 'document_accessed' | 'emergency_access_requested' | 'emergency_access_granted' | 'role_changed';
          target_type?: 'family_member' | 'document' | 'invitation' | 'emergency_request' | null;
          target_id?: string | null;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_owner_id?: string;
          actor_id?: string | null;
          actor_name?: string | null;
          action_type?: 'member_added' | 'member_removed' | 'member_updated' | 'invitation_sent' | 'invitation_accepted' | 'document_shared' | 'document_accessed' | 'emergency_access_requested' | 'emergency_access_granted' | 'role_changed';
          target_type?: 'family_member' | 'document' | 'invitation' | 'emergency_request' | null;
          target_id?: string | null;
          details?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      family_calendar_events: {
        Row: {
          id: string;
          family_owner_id: string;
          created_by_id: string | null;
          title: string;
          description: string | null;
          event_type: 'reminder' | 'review' | 'meeting' | 'deadline' | 'celebration';
          scheduled_at: string;
          duration_minutes: number;
          attendees: Json;
          location: string | null;
          meeting_url: string | null;
          is_recurring: boolean;
          recurrence_pattern: string | null;
          recurrence_end_date: string | null;
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
          reminders: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_owner_id: string;
          created_by_id?: string | null;
          title: string;
          description?: string | null;
          event_type?: 'reminder' | 'review' | 'meeting' | 'deadline' | 'celebration';
          scheduled_at: string;
          duration_minutes?: number;
          attendees?: Json;
          location?: string | null;
          meeting_url?: string | null;
          is_recurring?: boolean;
          recurrence_pattern?: string | null;
          recurrence_end_date?: string | null;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
          reminders?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_owner_id?: string;
          created_by_id?: string | null;
          title?: string;
          description?: string | null;
          event_type?: 'reminder' | 'review' | 'meeting' | 'deadline' | 'celebration';
          scheduled_at?: string;
          duration_minutes?: number;
          attendees?: Json;
          location?: string | null;
          meeting_url?: string | null;
          is_recurring?: boolean;
          recurrence_pattern?: string | null;
          recurrence_end_date?: string | null;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
          reminders?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      // Aggregated Analytics Tables
      insight_analytics: {
        Row: {
          id: string;
          user_id: string;
          timeframe_start: string;
          timeframe_end: string;
          total_insights: number;
          actionable_insights: number;
          completed_actions: number;
          average_protection_level: number;
          total_time_saved: number;
          top_categories: Json;
          trend_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          timeframe_start: string;
          timeframe_end: string;
          total_insights?: number;
          actionable_insights?: number;
          completed_actions?: number;
          average_protection_level?: number;
          total_time_saved?: number;
          top_categories?: Json;
          trend_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          timeframe_start?: string;
          timeframe_end?: string;
          total_insights?: number;
          actionable_insights?: number;
          completed_actions?: number;
          average_protection_level?: number;
          total_time_saved?: number;
          top_categories?: Json;
          trend_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      milestone_analytics: {
        Row: {
          id: string;
          user_id: string;
          timeframe_start: string;
          timeframe_end: string;
          milestones_completed: number;
          average_completion_time_hours: number;
          completion_rate: number;
          most_active_category: string | null;
          preferred_difficulty: string | null;
          completion_trend: 'improving' | 'stable' | 'declining' | null;
          total_protection_increase: number;
          total_time_saved: number;
          features_unlocked: Json;
          celebration_engagement: number;
          recommendation_follow_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          timeframe_start: string;
          timeframe_end: string;
          milestones_completed?: number;
          average_completion_time_hours?: number;
          completion_rate?: number;
          most_active_category?: string | null;
          preferred_difficulty?: string | null;
          completion_trend?: 'improving' | 'stable' | 'declining' | null;
          total_protection_increase?: number;
          total_time_saved?: number;
          features_unlocked?: Json;
          celebration_engagement?: number;
          recommendation_follow_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          timeframe_start?: string;
          timeframe_end?: string;
          milestones_completed?: number;
          average_completion_time_hours?: number;
          completion_rate?: number;
          most_active_category?: string | null;
          preferred_difficulty?: string | null;
          completion_trend?: 'improving' | 'stable' | 'declining' | null;
          total_protection_increase?: number;
          total_time_saved?: number;
          features_unlocked?: Json;
          celebration_engagement?: number;
          recommendation_follow_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Type helpers for better developer experience
export type QuickInsight = Database['public']['Tables']['quick_insights']['Row'];
export type QuickInsightInsert = Database['public']['Tables']['quick_insights']['Insert'];
export type QuickInsightUpdate = Database['public']['Tables']['quick_insights']['Update'];

export type LegacyMilestone = Database['public']['Tables']['legacy_milestones']['Row'];
export type LegacyMilestoneInsert = Database['public']['Tables']['legacy_milestones']['Insert'];
export type LegacyMilestoneUpdate = Database['public']['Tables']['legacy_milestones']['Update'];

// Type helpers for better developer experience
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type LegacyItem = Database['public']['Tables']['legacy_items']['Row'];
export type LegacyItemInsert =
  Database['public']['Tables']['legacy_items']['Insert'];
export type LegacyItemUpdate =
  Database['public']['Tables']['legacy_items']['Update'];

export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert =
  Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate =
  Database['public']['Tables']['documents']['Update'];

export type Guardian = Database['public']['Tables']['guardians']['Row'];
export type GuardianInsert =
  Database['public']['Tables']['guardians']['Insert'];
export type GuardianUpdate =
  Database['public']['Tables']['guardians']['Update'];

// New professional network types
export type ProfessionalReviewer = Database['public']['Tables']['professional_reviewers']['Row'];
export type ProfessionalReviewerInsert = Database['public']['Tables']['professional_reviewers']['Insert'];
export type ProfessionalReviewerUpdate = Database['public']['Tables']['professional_reviewers']['Update'];

export type ProfessionalReview = Database['public']['Tables']['professional_reviews']['Row'];
export type ProfessionalReviewInsert = Database['public']['Tables']['professional_reviews']['Insert'];
export type ProfessionalReviewUpdate = Database['public']['Tables']['professional_reviews']['Update'];

export type ProfessionalSpecialization = Database['public']['Tables']['professional_specializations']['Row'];
export type ProfessionalSpecializationInsert = Database['public']['Tables']['professional_specializations']['Insert'];
export type ProfessionalSpecializationUpdate = Database['public']['Tables']['professional_specializations']['Update'];

export type ProfessionalOnboarding = Database['public']['Tables']['professional_onboarding']['Row'];
export type ProfessionalOnboardingInsert = Database['public']['Tables']['professional_onboarding']['Insert'];
export type ProfessionalOnboardingUpdate = Database['public']['Tables']['professional_onboarding']['Update'];

export type ReviewRequest = Database['public']['Tables']['review_requests']['Row'];
export type ReviewRequestInsert = Database['public']['Tables']['review_requests']['Insert'];
export type ReviewRequestUpdate = Database['public']['Tables']['review_requests']['Update'];

export type DocumentReview = Database['public']['Tables']['document_reviews']['Row'];
export type DocumentReviewInsert = Database['public']['Tables']['document_reviews']['Insert'];
export type DocumentReviewUpdate = Database['public']['Tables']['document_reviews']['Update'];

export type ReviewResult = Database['public']['Tables']['review_results']['Row'];
export type ReviewResultInsert = Database['public']['Tables']['review_results']['Insert'];
export type ReviewResultUpdate = Database['public']['Tables']['review_results']['Update'];

export type ProfessionalPartnership = Database['public']['Tables']['professional_partnerships']['Row'];
export type ProfessionalPartnershipInsert = Database['public']['Tables']['professional_partnerships']['Insert'];
export type ProfessionalPartnershipUpdate = Database['public']['Tables']['professional_partnerships']['Update'];

export type Consultation = Database['public']['Tables']['consultations']['Row'];
export type ConsultationInsert = Database['public']['Tables']['consultations']['Insert'];
export type ConsultationUpdate = Database['public']['Tables']['consultations']['Update'];

// Category and status types for better type safety
export type LegacyItemCategory = LegacyItem['category'];
export type LegacyItemStatus = LegacyItem['status'];
export type LegacyItemPriority = LegacyItem['priority'];

// Professional types
export type ProfessionalType = 'attorney' | 'notary' | 'financial_advisor' | 'estate_planner' | 'tax_specialist';
export type ReviewStatus = 'pending' | 'in_review' | 'approved' | 'needs_revision' | 'rejected';
export type ConsultationStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type ConsultationType = 'initial' | 'follow_up' | 'urgent' | 'document_review';

// Emergency contact type
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

// User preferences type
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone?: string;
  currency?: string;
}

// Legacy item metadata type
export interface LegacyItemMetadata {
  location?: string;
  backup_status?: string;
  estimated_size?: string;
  lawyer_contact?: string;
  review_frequency?: string;
  next_review?: string;
  property_address?: string;
  insurance_info?: string;
  maintenance_schedule?: string;
  healthcare_proxy?: string;
  dni_status?: boolean;
  organ_donation?: boolean;
  total_recipes?: number;
  completed_recipes?: number;
  format?: string;
  [key: string]: unknown;
}

// Professional network metadata types
export interface ProfessionalCredentials {
  license_number?: string;
  bar_number?: string;
  certification_body?: string;
  years_experience?: number;
  education?: string[];
  specializations?: string[];
  languages?: string[];
  jurisdictions?: string[];
}

export interface PartnershipDetails {
  agreement_type?: string;
  commission_rate?: number;
  exclusivity?: boolean;
  territory?: string;
  services?: string[];
}

export interface ReviewFindings {
  legal_issues?: string[];
  compliance_gaps?: string[];
  recommendations?: string[];
  risk_factors?: string[];
  best_practices?: string[];
}
