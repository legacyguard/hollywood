/**
 * Guardian Service Stub
 * Basic service to provide guardian functionality for will generation
 */

import type { Guardian, CreateGuardianRequest } from '../types/guardian';

export const guardianService = {
  /**
   * Get guardians for a user
   */
  async getGuardians(): Promise<Guardian[]> {
    // Stub implementation - return empty array for now
    console.warn('guardianService.getGuardians called with stub implementation');
    return [];
  },

  /**
   * Create a new guardian
   */
  async createGuardian(guardianRequest: CreateGuardianRequest, userId: string): Promise<Guardian> {
    // Stub implementation
    console.warn('guardianService.createGuardian called with stub implementation');
    return {
      id: 'stub-id',
      user_id: userId,
      name: guardianRequest.name,
      email: guardianRequest.email,
      phone: guardianRequest.phone || '',
      relationship: guardianRequest.relationship || '',
      notes: guardianRequest.notes || '',
      can_trigger_emergency: guardianRequest.can_trigger_emergency || false,
      can_access_health_docs: guardianRequest.can_access_health_docs || false,
      can_access_financial_docs: guardianRequest.can_access_financial_docs || false,
      is_child_guardian: guardianRequest.is_child_guardian || false,
      is_will_executor: guardianRequest.is_will_executor || false,
      emergency_contact_priority: guardianRequest.emergency_contact_priority || 999,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  /**
   * Update an existing guardian
   */
  async updateGuardian(): Promise<void> {
    // Stub implementation
    console.warn('guardianService.updateGuardian called with stub implementation');
  }
};
