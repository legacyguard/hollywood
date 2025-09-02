/**
 * Will API Service
 * Handles all database operations and API calls for will management
 */

import { supabase } from '../integrations/supabase/client';
import type {
  WillUserData,
  GeneratedWill,
  Jurisdiction,
  LanguageCode,
  WillTemplateType
} from '../types/will-templates';
import { type Will } from '../types/will';
import { willGenerationService } from './willGenerationService';
import { willGuardianIntegration } from './willGuardianIntegration';

export class WillApiService {

  /**
   * Create a new will in database
   */
  async createWill(userData: WillUserData, jurisdiction: Jurisdiction, language: LanguageCode, willType: WillTemplateType): Promise<string> {
    try {
      const userId = await this.getCurrentUserId();

      // Generate the will
      const generatedWill = await willGenerationService.generateWill({
        userId,
        jurisdiction,
        language,
        willType,
        userData,
        preferences: {
          includeOptionalClauses: true,
          detailLevel: 'detailed',
          languageStyle: 'formal',
          includeLegalExplanations: true,
          generateMultipleLanguages: false
        }
      });

      // Prepare will data for database
      const willData: Partial<Will> = {
        user_id: userId,
        will_type: this.mapToDbWillType(willType),
        status: 'draft',
        jurisdiction,
        language,
        legal_framework: `${jurisdiction} Civil Code`,

        // Personal information
        testator_data: {
          fullName: userData.personal.fullName,
          dateOfBirth: userData.personal.dateOfBirth,
          address: this.formatAddress(userData.personal.address),
          citizenship: userData.personal.citizenship,
          maritalStatus: userData.personal.maritalStatus
        },

        // Beneficiaries
        beneficiaries: userData.beneficiaries.map(b => ({
          id: b.id,
          type: this.mapBeneficiaryType(b.relationship),
          full_name: b.name,
          relationship: b.relationship,
          date_of_birth: b.dateOfBirth,
          contact_info: b.contactInfo,
          share_percentage: b.share.type === 'percentage' ? Number(b.share.value) : undefined,
          conditions: b.conditions
        })),

        // Assets
        asset_distributions: userData.assets.map(asset => ({
          id: asset.id,
          asset_type: asset.type as any,
          description: asset.description,
          estimated_value: asset.value,
          currency: asset.currency || 'EUR',
          location: asset.location,
          beneficiary_ids: [], // Will be populated based on beneficiary assignments
          distribution_type: 'equal' as const,
          distribution_details: {}
        })),

        // Executors
        executor_appointments: userData.executors?.map(executor => ({
          id: executor.id,
          type: executor.type as any,
          full_name: executor.name,
          relationship: executor.relationship,
          contact_info: executor.contactInfo,
          professional: executor.isProfessional,
          compensation: executor.compensation,
          powers_granted: []
        })) || [],

        // Guardianship
        guardianship_appointments: userData.guardians?.map(guardianship => ({
          id: guardianship.childId,
          child_name: '',
          child_date_of_birth: '',
          primary_guardian: {
            full_name: guardianship.primaryGuardian.name,
            relationship: guardianship.primaryGuardian.relationship,
            contact_info: guardianship.primaryGuardian.contactInfo
          },
          alternate_guardian: guardianship.alternateGuardian ? {
            full_name: guardianship.alternateGuardian.name,
            relationship: guardianship.alternateGuardian.relationship,
            contact_info: guardianship.alternateGuardian.contactInfo
          } : undefined,
          special_instructions: guardianship.specialInstructions
        })) || [],

        // Special instructions
        special_instructions: userData.specialInstructions.map(instruction => ({
          id: instruction.id,
          category: instruction.type as any,
          title: instruction.title,
          content: instruction.content,
          priority: instruction.priority as any
        })),

        // AI data
        ai_suggestions: generatedWill.aiSuggestions.map(suggestion => ({
          id: suggestion.id,
          type: suggestion.type === 'optimization' ? 'improvement' : 
                suggestion.type === 'legal_consideration' ? 'legal_requirement' : 
                suggestion.type as 'improvement' | 'warning' | 'missing' | 'legal_requirement',
          category: suggestion.category,
          title: suggestion.title,
          description: suggestion.description,
          suggested_action: suggestion.suggestedAction,
          priority: suggestion.priority,
          jurisdiction_specific: suggestion.isJurisdictionSpecific,
          created_at: new Date().toISOString()
        })),

        validation_errors: generatedWill.validationResult.errors.map(error => ({
          field: error.field,
          message: error.message,
          severity: error.severity,
          legal_reference: error.legalReference
        })),

        completeness_score: generatedWill.validationResult.completenessScore
      };

      // Insert into database
      const { data, error } = await supabase
        .from('wills')
        .insert(willData)
        .select('id')
        .single();

      if (error) {
        console.error('Error creating will:', error);
        throw new Error(`Failed to create will: ${error.message}`);
      }

      // Store generated content separately (as it can be large)
      await this.saveWillContent(data.id, generatedWill);

      // Sync with guardians
      await willGuardianIntegration.syncBeneficiariesWithGuardians(userId, userData.beneficiaries);
      if (userData.executors) {
        await willGuardianIntegration.syncExecutorsWithGuardians(userId, userData.executors);
      }
      if (userData.guardians) {
        await willGuardianIntegration.syncChildGuardiansWithGuardians(userId, userData.guardians);
      }

      // Create guidance entry
      await willGuardianIntegration.createWillGuidanceEntry(userId, userData);

      return data.id;
    } catch (error) {
      console.error('Error in createWill:', error);
      throw error;
    }
  }

  /**
   * Get user's wills
   */
  async getUserWills(): Promise<Will[]> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabase
        .from('wills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wills:', error);
        throw new Error(`Failed to fetch wills: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserWills:', error);
      throw error;
    }
  }

  /**
   * Get specific will by ID
   */
  async getWill(willId: string): Promise<Will | null> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabase
        .from('wills')
        .select('*')
        .eq('id', willId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        console.error('Error fetching will:', error);
        throw new Error(`Failed to fetch will: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getWill:', error);
      throw error;
    }
  }

  /**
   * Update will
   */
  async updateWill(willId: string, updates: Partial<Will>): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();

      const { error } = await supabase
        .from('wills')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', willId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating will:', error);
        throw new Error(`Failed to update will: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in updateWill:', error);
      throw error;
    }
  }

  /**
   * Delete will
   */
  async deleteWill(willId: string): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();

      const { error } = await supabase
        .from('wills')
        .delete()
        .eq('id', willId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting will:', error);
        throw new Error(`Failed to delete will: ${error.message}`);
      }

      // Also delete stored content
      await this.deleteWillContent(willId);
    } catch (error) {
      console.error('Error in deleteWill:', error);
      throw error;
    }
  }

  /**
   * Generate and update will content
   */
  async regenerateWill(willId: string): Promise<GeneratedWill> {
    try {
      const will = await this.getWill(willId);
      if (!will) {
        throw new Error('Will not found');
      }

      // Convert database will back to userData format
      const userData: WillUserData = {
        personal: will.testator_data as any,
        family: {
          spouse: will.testator_data.maritalStatus !== 'single' ? { fullName: 'Spouse Name' } : undefined,
          children: []
        },
        beneficiaries: will.beneficiaries.map(b => ({
          id: b.id,
          name: b.full_name,
          relationship: b.relationship,
          dateOfBirth: b.date_of_birth,
          contactInfo: b.contact_info,
          share: {
            type: b.share_percentage ? 'percentage' : 'equal',
            value: b.share_percentage || 0
          },
          conditions: b.conditions,
          address: {
            street: '',
            city: '',
            postalCode: '',
            country: ''
          }
        })),
        assets: will.asset_distributions.map(a => ({
          id: a.id,
          type: a.asset_type,
          description: a.description,
          value: a.estimated_value || 0,
          currency: a.currency || 'EUR',
          location: a.location,
          ownershipPercentage: 100
        })),
        executors: will.executor_appointments.map(e => ({
          id: e.id,
          type: e.type,
          name: e.full_name,
          relationship: e.relationship,
          address: {
            street: '',
            city: '',
            postalCode: '',
            country: ''
          },
          contactInfo: e.contact_info as any,
          isProfessional: e.professional || false,
          compensation: e.compensation
        })),
        guardians: will.guardianship_appointments?.map(g => ({
          childId: g.id,
          primaryGuardian: {
            id: 'primary',
            type: 'primary' as const,
            name: g.primary_guardian.full_name,
            relationship: g.primary_guardian.relationship,
            address: {
              street: '',
              city: '',
              postalCode: '',
              country: ''
            },
            contactInfo: g.primary_guardian.contact_info as any,
            isProfessional: false
          },
          alternateGuardian: g.alternate_guardian ? {
            id: 'alternate',
            type: 'alternate' as const,
            name: g.alternate_guardian.full_name,
            relationship: g.alternate_guardian.relationship,
            address: {
              street: '',
              city: '',
              postalCode: '',
              country: ''
            },
            contactInfo: g.alternate_guardian.contact_info as any,
            isProfessional: false
          } : undefined,
          specialInstructions: g.special_instructions
        })) || [],
        specialInstructions: will.special_instructions?.map(s => ({
          id: s.id,
          type: s.category === 'pets' ? 'pet_care' :
                s.category === 'business' ? 'business_succession' :
                s.category === 'debts' ? 'other' :
                s.category === 'taxes' ? 'other' :
                s.category === 'charity' ? 'charitable_giving' :
                s.category === 'other' ? 'other' : 'other' as any,
          title: s.title,
          content: s.content,
          priority: s.priority
        })) || []
      };

      // Regenerate will
      const generatedWill = await willGenerationService.generateWill({
        userId: will.user_id,
        jurisdiction: will.jurisdiction as Jurisdiction,
        language: will.language as LanguageCode,
        willType: this.mapFromDbWillType(will.will_type),
        userData,
        preferences: {
          includeOptionalClauses: true,
          detailLevel: 'detailed',
          languageStyle: 'formal',
          includeLegalExplanations: true,
          generateMultipleLanguages: false
        }
      });

      // Update database with new validation results
      await this.updateWill(willId, {
        validation_errors: generatedWill.validationResult.errors.map(error => ({
          field: error.field,
          message: error.message,
          severity: error.severity,
          legal_reference: error.legalReference
        })),
        completeness_score: generatedWill.validationResult.completenessScore,
        ai_suggestions: generatedWill.aiSuggestions.map(suggestion => ({
          id: suggestion.id,
          type: suggestion.type,
          category: suggestion.category,
          title: suggestion.title,
          description: suggestion.description,
          suggested_action: suggestion.suggestedAction,
          priority: suggestion.priority,
          jurisdiction_specific: suggestion.isJurisdictionSpecific,
          created_at: new Date().toISOString()
        }))
      });

      // Save new content
      await this.saveWillContent(willId, generatedWill);

      return generatedWill;
    } catch (error) {
      console.error('Error in regenerateWill:', error);
      throw error;
    }
  }

  /**
   * Get will content (text, HTML, PDF)
   */
  async getWillContent(willId: string): Promise<{ text: string; html: string; pdf?: ArrayBuffer }> {
    try {
      const { data, error } = await supabase.storage
        .from('user_documents')
        .download(`wills/${willId}/content.json`);

      if (error) {
        console.error('Error fetching will content:', error);
        throw new Error(`Failed to fetch will content: ${error.message}`);
      }

      const content = JSON.parse(await data.text());
      return content;
    } catch (error) {
      console.error('Error in getWillContent:', error);
      // Return empty content if not found
      return { text: '', html: '' };
    }
  }

  /**
   * Save will content to storage
   */
  private async saveWillContent(willId: string, generatedWill: GeneratedWill): Promise<void> {
    try {
      const content = {
        text: generatedWill.content.text,
        html: generatedWill.content.html,
        metadata: generatedWill.metadata
      };

      const { error } = await supabase.storage
        .from('user_documents')
        .upload(`wills/${willId}/content.json`, JSON.stringify(content, null, 2), {
          contentType: 'application/json',
          upsert: true
        });

      if (error) {
        console.error('Error saving will content:', error);
      }
    } catch (error) {
      console.error('Error in saveWillContent:', error);
    }
  }

  /**
   * Delete will content from storage
   */
  private async deleteWillContent(willId: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('user_documents')
        .remove([`wills/${willId}/content.json`]);

      if (error) {
        console.error('Error deleting will content:', error);
      }
    } catch (error) {
      console.error('Error in deleteWillContent:', error);
    }
  }

  /**
   * Get current user ID from Clerk
   */
  private async getCurrentUserId(): Promise<string> {
    // This would integrate with your existing Clerk authentication
    // For now, we'll use a placeholder
    const user = await this.getCurrentUser();
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    return user.id;
  }

  /**
   * Get current user (placeholder for Clerk integration)
   */
  private async getCurrentUser(): Promise<{ id: string } | null> {
    // This would integrate with your existing Clerk auth system
    // Return mock user for now
    return { id: 'user-123' };
  }

  /**
   * Utility methods for data mapping
   */
  private mapToDbWillType(willType: WillTemplateType): 'simple' | 'detailed' | 'international' | 'trust' {
    const mapping: Record<WillTemplateType, 'simple' | 'detailed' | 'international' | 'trust'> = {
      'holographic': 'simple',
      'allographic': 'detailed',
      'witnessed': 'detailed',
      'notarial': 'international'
    };
    return mapping[willType] || 'simple';
  }

  private mapFromDbWillType(dbType: string): WillTemplateType {
    const mapping: Record<string, WillTemplateType> = {
      'simple': 'holographic',
      'detailed': 'allographic',
      'international': 'notarial',
      'trust': 'notarial'
    };
    return mapping[dbType] || 'holographic';
  }

  private mapBeneficiaryType(relationship: string): 'primary' | 'secondary' | 'contingent' | 'charitable' {
    const familyRelationships = ['spouse', 'child', 'parent'];
    const otherRelationships = ['sibling', 'friend'];

    if (familyRelationships.includes(relationship)) {
      return 'primary';
    } else if (otherRelationships.includes(relationship)) {
      return 'secondary';
    } else if (relationship === 'charity') {
      return 'charitable';
    }
    return 'contingent';
  }

  private formatAddress(address: any): string {
    if (!address) return '';
    return `${address.street || ''}, ${address.city || ''}, ${address.postalCode || ''}, ${address.country || ''}`.replace(/,\s*,/g, ',').trim();
  }
}

// Export singleton instance
export const willApiService = new WillApiService();
