export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          date_of_birth: string | null
          emergency_contacts: Json | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          emergency_contacts?: Json | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          emergency_contacts?: Json | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      legacy_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: 'document' | 'wish' | 'memory' | 'instruction' | 'asset'
          status: 'draft' | 'in_progress' | 'completed' | 'archived'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          tags: string[] | null
          metadata: Json | null
          file_urls: string[] | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category: 'document' | 'wish' | 'memory' | 'instruction' | 'asset'
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          tags?: string[] | null
          metadata?: Json | null
          file_urls?: string[] | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: 'document' | 'wish' | 'memory' | 'instruction' | 'asset'
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          tags?: string[] | null
          metadata?: Json | null
          file_urls?: string[] | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "legacy_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          file_type: string | null
          file_size: number | null
          document_type: string
          expires_at: string | null
          encrypted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          document_type?: string
          expires_at?: string | null
          encrypted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          file_type?: string | null
          file_size?: number | null
          document_type?: string
          expires_at?: string | null
          encrypted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers for better developer experience
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type LegacyItem = Database['public']['Tables']['legacy_items']['Row']
export type LegacyItemInsert = Database['public']['Tables']['legacy_items']['Insert']
export type LegacyItemUpdate = Database['public']['Tables']['legacy_items']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

// Category and status types for better type safety
export type LegacyItemCategory = LegacyItem['category']
export type LegacyItemStatus = LegacyItem['status']
export type LegacyItemPriority = LegacyItem['priority']

// Emergency contact type
export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
  address?: string
}

// User preferences type
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: boolean
  language: string
  timezone?: string
  currency?: string
}

// Legacy item metadata type
export interface LegacyItemMetadata {
  location?: string
  backup_status?: string
  estimated_size?: string
  lawyer_contact?: string
  review_frequency?: string
  next_review?: string
  property_address?: string
  insurance_info?: string
  maintenance_schedule?: string
  healthcare_proxy?: string
  dni_status?: boolean
  organ_donation?: boolean
  total_recipes?: number
  completed_recipes?: number
  format?: string
  [key: string]: unknown
}
