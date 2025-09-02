// API Types for LegacyGuard centralized API layer
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiClientInterface {
  get<T = any>(endpoint: string): Promise<T>;
  post<T = any>(endpoint: string, data?: any): Promise<T>;
  put<T = any>(endpoint: string, data?: any): Promise<T>;
  delete<T = any>(endpoint: string): Promise<T>;
  uploadFile(endpoint: string, file: {
    base64: string;
    mimeType: string;
    fileName: string;
  }): Promise<any>;
}

// Request/Response types for different endpoints
export interface DocumentUploadRequest {
  file: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
  documentType?: string;
  category?: string;
}

export interface DocumentListResponse {
  documents: Array<{
    id: string;
    file_name: string;
    file_path: string;
    file_type: string | null;
    document_type: string;
    created_at: string;
    updated_at: string;
  }>;
}

export interface UserProfileResponse {
  profile: {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface WillData {
  beneficiaries?: Array<{
    name: string;
    relationship: string;
    percentage: number;
  }>;
  executor?: {
    name: string;
    email: string;
    phone?: string;
  };
  assets?: Array<{
    type: string;
    description: string;
    value?: number;
  }>;
  wishes?: string;
}

export interface GuardianData {
  name: string;
  email: string;
  phone?: string | null;
  relationship?: string | null;
  notes?: string | null;
  is_active?: boolean;
}

// Service method parameter types
export interface GetDocumentsParams {
  limit?: number;
  offset?: number;
  documentType?: string;
  category?: string;
}

export interface GetGuardiansParams {
  activeOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateLegacyItemParams {
  title: string;
  description?: string;
  category: 'document' | 'wish' | 'memory' | 'instruction' | 'asset';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  tags?: string[];
  metadata?: any;
}
