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
