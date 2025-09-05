// @ts-nocheck

// Generated Database Types
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
      documents: {
        Row: {
          id: string
          user_id: string
          category: string
          original_filename: string
          storage_path: string
          file_size: number
          mime_type: string
          created_at: string
          updated_at: string
          metadata: Json
          description?: string
          is_archived?: boolean
          tags?: string[]
          share_link?: string
          share_type?: 'public' | 'private' | 'restricted'
          share_expires_at?: string
          ai_suggestions?: AISuggestions
          scenario_id?: string
        }
        Insert: Partial<Database['public']['Tables']['documents']['Row']>
        Update: Partial<Database['public']['Tables']['documents']['Row']>
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          metadata?: Json
        }
      }
      wills: {
        Row: {
          id: string
          user_id: string
          content: Json
          status: string
          created_at: string
          updated_at: string
        }
      }
      scenarios: {
        Row: {
          id: string
          user_id: string
          name: string
          data: Json
          created_at: string
          updated_at: string
        }
      }
    }
    Enums: {
      document_category: 'will' | 'trust' | 'insurance' | 'property' | 'financial' | 'medical' | 'personal' | 'other'
      share_type: 'public' | 'private' | 'restricted'
    }
  }
}

export interface AISuggestions {
  category?: string
  subcategory?: string
  tags?: string[]
  summary?: string
  key_points?: string[]
  related_documents?: string[]
  confidence?: number
}

export type DocumentUploadRequest = {
  file: File
  category: string
  description?: string
  metadata?: Json
}

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];
  
export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T];
