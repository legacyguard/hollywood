export interface Guardian {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string | null;
  relationship?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGuardianRequest {
  name: string;
  email: string;
  phone?: string;
  relationship?: string;
  notes?: string;
}

export interface UpdateGuardianRequest extends Partial<CreateGuardianRequest> {
  is_active?: boolean;
}

export type GuardianRelationship = 
  | 'spouse'
  | 'partner'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'friend'
  | 'lawyer'
  | 'financial_advisor'
  | 'other';

export const GUARDIAN_RELATIONSHIPS: { value: GuardianRelationship; label: string }[] = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'partner', label: 'Partner' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'financial_advisor', label: 'Financial Advisor' },
  { value: 'other', label: 'Other' },
];