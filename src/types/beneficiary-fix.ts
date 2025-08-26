/**
 * Beneficiary Interface Fixes and Extensions
 * This file provides compatibility fixes for the Beneficiary interface
 */

import type { Beneficiary as OriginalBeneficiary } from './will';

// Extended Beneficiary interface with legacy compatibility
export interface Beneficiary extends OriginalBeneficiary {
  // Legacy compatibility properties
  name?: string;
  dateOfBirth?: string;
  percentage?: number;
  specificGifts?: string[];
  conditions?: string;

  // Additional properties for component compatibility
  fullName?: string;
  relationshipText?: string;
  share?: number;
}

// Helper function to convert legacy Beneficiary to new format
export const normalizeBeneficiary = (beneficiary: any): Beneficiary => {
  return {
    id: beneficiary.id || '',
    type: beneficiary.type || 'primary',
    full_name: beneficiary.full_name || beneficiary.name || '',
    relationship: beneficiary.relationship || '',
    date_of_birth: beneficiary.date_of_birth || beneficiary.dateOfBirth || undefined,
    share_percentage: beneficiary.share_percentage || beneficiary.percentage || undefined,
    specific_bequests: beneficiary.specific_bequests || beneficiary.specificGifts || [],
    conditions: beneficiary.conditions || '',
    contact_info: beneficiary.contact_info || {
      email: beneficiary.email || '',
      phone: beneficiary.phone || '',
      address: beneficiary.address || '',
    },
    // Legacy compatibility
    name: beneficiary.name || beneficiary.full_name || '',
    dateOfBirth: beneficiary.date_of_birth || beneficiary.dateOfBirth || '',
    percentage: beneficiary.share_percentage || beneficiary.percentage || 0,
    specificGifts: beneficiary.specific_bequests || [],
  };
};

// Type guard for Beneficiary
export const isValidBeneficiary = (obj: any): obj is Beneficiary => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.full_name === 'string' &&
    typeof obj.relationship === 'string'
  );
};
