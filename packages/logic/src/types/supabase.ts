// Supabase types for LegacyGuard - copied from main project types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Main database interface structure
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
          // OCR and AI fields
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
          processing_status: 'pending' | 'processing' | 'completed' | 'failed' | 'manual';
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
          professional_review_status?: 'none' | 'requested' | 'in_progress' | 'completed' | 'cancelled' | null;
          professional_review_score?: number | null;
          professional_review_date?: string | null;
          professional_reviewer_id?: string | null;
          review_findings?: Json | null;
          review_recommendations?: Json | null;
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
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'manual';
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
          professional_review_status?: 'none' | 'requested' | 'in_progress' | 'completed' | 'cancelled' | null;
          professional_review_score?: number | null;
          professional_review_date?: string | null;
          professional_reviewer_id?: string | null;
          review_findings?: Json | null;
          review_recommendations?: Json | null;
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
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'manual';
          completion_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
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
      };
      quick_insights: {
        Row: {
          id: string;
          user_id: string;
          type: 'tip' | 'warning' | 'achievement' | 'reminder' | 'insight';
          title: string;
          message: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          category: string | null;
          action_required: boolean;
          action_url: string | null;
          dismissed_at: string | null;
          expires_at: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'tip' | 'warning' | 'achievement' | 'reminder' | 'insight';
          title: string;
          message: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          category?: string | null;
          action_required?: boolean;
          action_url?: string | null;
          dismissed_at?: string | null;
          expires_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'tip' | 'warning' | 'achievement' | 'reminder' | 'insight';
          title?: string;
          message?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          category?: string | null;
          action_required?: boolean;
          action_url?: string | null;
          dismissed_at?: string | null;
          expires_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      legacy_milestones: {
        Row: {
          id: string;
          user_id: string;
          milestone_type: 'essential_documents' | 'will_creation' | 'guardian_setup' | 'asset_inventory' | 'digital_estate' | 'healthcare_directives' | 'financial_planning' | 'legacy_messages' | 'emergency_contacts' | 'document_review';
          title: string;
          description: string;
          category: string;
          criteria_total: number;
          criteria_completed: number;
          criteria_is_complete: boolean;
          completion_percentage: number;
          priority: 'low' | 'medium' | 'high' | 'critical';
          estimated_time_minutes: number | null;
          reward_points: number | null;
          unlock_criteria: Json | null;
          next_steps: string[] | null;
          related_documents: string[] | null;
          completed_at: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          milestone_type: 'essential_documents' | 'will_creation' | 'guardian_setup' | 'asset_inventory' | 'digital_estate' | 'healthcare_directives' | 'financial_planning' | 'legacy_messages' | 'emergency_contacts' | 'document_review';
          title: string;
          description: string;
          category: string;
          criteria_total: number;
          criteria_completed?: number;
          criteria_is_complete?: boolean;
          completion_percentage?: number;
          priority?: 'low' | 'medium' | 'high' | 'critical';
          estimated_time_minutes?: number | null;
          reward_points?: number | null;
          unlock_criteria?: Json | null;
          next_steps?: string[] | null;
          related_documents?: string[] | null;
          completed_at?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          milestone_type?: 'essential_documents' | 'will_creation' | 'guardian_setup' | 'asset_inventory' | 'digital_estate' | 'healthcare_directives' | 'financial_planning' | 'legacy_messages' | 'emergency_contacts' | 'document_review';
          title?: string;
          description?: string;
          category?: string;
          criteria_total?: number;
          criteria_completed?: number;
          criteria_is_complete?: boolean;
          completion_percentage?: number;
          priority?: 'low' | 'medium' | 'high' | 'critical';
          estimated_time_minutes?: number | null;
          reward_points?: number | null;
          unlock_criteria?: Json | null;
          next_steps?: string[] | null;
          related_documents?: string[] | null;
          completed_at?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Type helpers for better developer experience - exactly matching main project
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

export type Guardian = Database['public']['Tables']['guardians']['Row'];
export type GuardianInsert = Database['public']['Tables']['guardians']['Insert'];
export type GuardianUpdate = Database['public']['Tables']['guardians']['Update'];

export type LegacyItem = Database['public']['Tables']['legacy_items']['Row'];
export type LegacyItemInsert = Database['public']['Tables']['legacy_items']['Insert'];
export type LegacyItemUpdate = Database['public']['Tables']['legacy_items']['Update'];

export type QuickInsight = Database['public']['Tables']['quick_insights']['Row'];
export type QuickInsightInsert = Database['public']['Tables']['quick_insights']['Insert'];
export type QuickInsightUpdate = Database['public']['Tables']['quick_insights']['Update'];

export type LegacyMilestone = Database['public']['Tables']['legacy_milestones']['Row'];
export type LegacyMilestoneInsert = Database['public']['Tables']['legacy_milestones']['Insert'];
export type LegacyMilestoneUpdate = Database['public']['Tables']['legacy_milestones']['Update'];

// Category and status types for better type safety
export type LegacyItemCategory = LegacyItem['category'];
export type LegacyItemStatus = LegacyItem['status'];
export type LegacyItemPriority = LegacyItem['priority'];

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
