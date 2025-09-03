export interface ProfileData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  relationship?: string;
  dateOfBirth?: string;
  address?: string;
  roles?: string[];
  status?: 'active' | 'pending' | 'inactive';
  completionPercentage?: number;
  metadata?: Record<string, unknown>;
}
