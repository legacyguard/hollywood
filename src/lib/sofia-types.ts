// Enhanced Sofia AI Types for Guided Dialog System
// Extends the existing sofia-ai.ts with action-based interaction types

import { SofiaContext as BaseSofiaContext, SofiaMessage as BaseSofiaMessage } from './sofia-ai';

export type ActionCategory = 'navigation' | 'ui_action' | 'ai_query' | 'premium_feature';

export type ActionCost = 'free' | 'low_cost' | 'premium';

export interface ActionButton {
  id: string;
  text: string;
  icon?: string;
  category: ActionCategory;
  cost: ActionCost;
  payload?: any;
  requiresConfirmation?: boolean;
  description?: string;
}

export interface SofiaResponse {
  id: string;
  content: string;
  timestamp: Date;
  actions?: ActionButton[];
  responseType: 'welcome' | 'information' | 'confirmation' | 'error' | 'loading';
  cost: ActionCost;
  source: 'predefined' | 'knowledge_base' | 'ai_generated';
}

export interface SofiaCommand {
  id: string;
  command: string;
  category: ActionCategory;
  parameters?: Record<string, any>;
  context: SofiaContext;
  timestamp: Date;
}

// Extended context for guided interactions
export interface SofiaContext extends BaseSofiaContext {
  currentPage?: string;
  lastInteraction?: Date;
  conversationHistory?: SofiaMessage[];
  userPreferences?: {
    preferredActions?: string[];
    skipIntros?: boolean;
    expertMode?: boolean;
  };
}

// Enhanced message type with actions support
export interface SofiaMessage extends BaseSofiaMessage {
  actions?: ActionButton[];
  responseType?: SofiaResponse['responseType'];
  metadata?: {
    cost: ActionCost;
    source: SofiaResponse['source'];
    processingTime?: number;
  };
}

// Command processing result
export interface CommandResult {
  type: 'response' | 'navigation' | 'ui_action' | 'error';
  payload: any;
  cost: ActionCost;
  requiresFollowup?: boolean;
  followupActions?: ActionButton[];
}

// Predefined action templates
export const COMMON_ACTIONS = {
  // Navigation actions (free)
  GO_TO_VAULT: {
    id: 'navigate_vault',
    text: '📁 Open my vault',
    icon: 'vault',
    category: 'navigation' as ActionCategory,
    cost: 'free' as ActionCost,
    payload: { route: '/vault' }
  },
  
  GO_TO_GUARDIANS: {
    id: 'navigate_guardians', 
    text: '👥 Manage guardians',
    icon: 'guardians',
    category: 'navigation' as ActionCategory,
    cost: 'free' as ActionCost,
    payload: { route: '/guardians' }
  },

  GO_TO_LEGACY: {
    id: 'navigate_legacy',
    text: '🎁 Create will',
    icon: 'legacy', 
    category: 'navigation' as ActionCategory,
    cost: 'free' as ActionCost,
    payload: { route: '/legacy' }
  },

  // UI actions (free)
  ADD_DOCUMENT: {
    id: 'trigger_upload',
    text: '➕ Add document', 
    icon: 'upload',
    category: 'ui_action' as ActionCategory,
    cost: 'free' as ActionCost,
    payload: { action: 'open_uploader' }
  },

  VIEW_PROGRESS: {
    id: 'show_progress',
    text: '📊 View my progress',
    icon: 'info',
    category: 'ui_action' as ActionCategory, 
    cost: 'free' as ActionCost,
    payload: { action: 'show_progress_modal' }
  },

  // Knowledge base queries (low cost)
  SECURITY_INFO: {
    id: 'faq_security',
    text: '🔒 How is my data protected?',
    icon: 'shield',
    category: 'ai_query' as ActionCategory,
    cost: 'low_cost' as ActionCost,
    payload: { topic: 'security' }
  },

  NEXT_STEP: {
    id: 'suggest_next_step',
    text: '💡 What should I do next?',
    icon: 'sparkles',
    category: 'ai_query' as ActionCategory,
    cost: 'low_cost' as ActionCost
  },

  // Premium features
  GENERATE_LETTER: {
    id: 'generate_legacy_letter',
    text: '💌 Write personal message',
    icon: 'heart',
    category: 'premium_feature' as ActionCategory,
    cost: 'premium' as ActionCost,
    requiresConfirmation: true,
    description: 'AI helps create a personal message for your loved ones'
  },

  FINANCIAL_SUMMARY: {
    id: 'generate_financial_summary',
    text: '💰 Financial overview for family',
    icon: 'documents',
    category: 'premium_feature' as ActionCategory, 
    cost: 'premium' as ActionCost,
    requiresConfirmation: true,
    description: 'AI creates a summary of your finances for emergencies'
  }
} as const;

// Context-based action suggestions
export function getContextualActions(context: SofiaContext): ActionButton[] {
  const actions: ActionButton[] = [];
  
  // Always show navigation options
  actions.push(COMMON_ACTIONS.GO_TO_VAULT);
  
  // Show based on progress
  if (context.documentCount < 5) {
    actions.push(COMMON_ACTIONS.ADD_DOCUMENT);
  }
  
  if (context.guardianCount === 0 && context.familyStatus !== 'single') {
    actions.push(COMMON_ACTIONS.GO_TO_GUARDIANS);
  }
  
  if (context.completionPercentage > 60) {
    actions.push(COMMON_ACTIONS.GO_TO_LEGACY);
  }
  
  // Always show help and next step
  actions.push(COMMON_ACTIONS.NEXT_STEP);
  actions.push(COMMON_ACTIONS.SECURITY_INFO);
  
  return actions.slice(0, 4); // Limit to 4 actions max
}