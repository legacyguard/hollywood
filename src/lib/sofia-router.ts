import { SofiaCommand, SofiaContext, CommandResult, ActionButton, COMMON_ACTIONS, getContextualActions } from './sofia-types';
import { sofiaKnowledgeBase } from './sofia-knowledge-base';
import { sofiaAPI, createSofiaAPIRequest } from './sofia-api';

// Sofia Command Router - The Brain of Sofia
// Decides how to handle each user command without expensive AI calls when possible

export class SofiaRouter {
  private static instance: SofiaRouter;
  
  private constructor() {}
  
  static getInstance(): SofiaRouter {
    if (!SofiaRouter.instance) {
      SofiaRouter.instance = new SofiaRouter();
    }
    return SofiaRouter.instance;
  }

  /**
   * Main command processing function
   * Routes commands to appropriate handlers based on category and cost optimization
   */
  async processCommand(command: SofiaCommand): Promise<CommandResult> {
    const { command: commandText, category, context } = command;
    
    console.log(`[Sofia Router] Processing command: ${commandText}, category: ${category}`);
    
    try {
      // Category 1: Free predefined actions (80% of interactions)
      if (category === 'navigation') {
        return this.handleNavigationCommand(commandText, context);
      }
      
      if (category === 'ui_action') {
        return this.handleUIActionCommand(commandText, context);
      }
      
      // Category 2: Knowledge base queries (low cost)
      if (category === 'ai_query' && commandText.startsWith('faq_')) {
        return this.handleKnowledgeBaseQuery(commandText, context);
      }
      
      if (commandText === 'suggest_next_step') {
        return this.handleNextStepSuggestion(context);
      }
      
      // Category 3: Premium AI features (high cost)
      if (category === 'premium_feature') {
        return this.handlePremiumFeature(commandText, context);
      }
      
      // Fallback: Try to parse free-form text input
      return this.handleFreeFormInput(commandText, context);
      
    } catch (error) {
      console.error('[Sofia Router] Error processing command:', error);
      return {
        type: 'error',
        payload: {
          message: 'I apologize, an error occurred. Please try again.',
          actions: getContextualActions(context)
        },
        cost: 'free'
      };
    }
  }

  /**
   * Handle navigation commands (FREE)
   */
  private handleNavigationCommand(command: string, context: SofiaContext): CommandResult {
    const navigationMap: Record<string, string> = {
      'navigate_vault': '/vault',
      'navigate_guardians': '/guardians', 
      'navigate_legacy': '/legacy',
      'navigate_dashboard': '/'
    };
    
    const route = navigationMap[command];
    if (!route) {
      return {
        type: 'error',
        payload: { message: 'Unknown navigation action.' },
        cost: 'free'
      };
    }
    
    return {
      type: 'navigation',
      payload: { route },
      cost: 'free',
      requiresFollowup: true,
      followupActions: [{
        id: 'back_to_sofia',
        text: '↩️ Back to Sofia',
        icon: 'bot',
        category: 'ui_action',
        cost: 'free',
        payload: { action: 'show_sofia' }
      }]
    };
  }

  /**
   * Handle UI action commands (FREE)
   */
  private handleUIActionCommand(command: string, context: SofiaContext): CommandResult {
    switch (command) {
      case 'trigger_upload':
        return {
          type: 'ui_action',
          payload: { 
            action: 'open_uploader',
            message: `Great, ${context.userName || ''}! Let's add a new document. What would you like to upload?`
          },
          cost: 'free'
        };
        
      case 'show_progress':
        return {
          type: 'ui_action', 
          payload: {
            action: 'show_progress_modal',
            data: {
              completionPercentage: context.completionPercentage,
              documentCount: context.documentCount,
              guardianCount: context.guardianCount,
              nextSteps: this.generateNextSteps(context)
            }
          },
          cost: 'free'
        };
        
      case 'show_sofia':
        return {
          type: 'response',
          payload: {
            message: this.generateWelcomeMessage(context),
            actions: getContextualActions(context)
          },
          cost: 'free'
        };
        
      default:
        return {
          type: 'error',
          payload: { message: 'Neznáma UI akcia.' },
          cost: 'free'
        };
    }
  }

  /**
   * Handle knowledge base queries (LOW COST)
   */
  private handleKnowledgeBaseQuery(command: string, context: SofiaContext): CommandResult {
    const answer = sofiaKnowledgeBase.getAnswer(command, context);
    
    if (!answer) {
      return {
        type: 'error',
        payload: { 
          message: 'I apologize, I don\'t have a prepared answer for this question.',
          actions: getContextualActions(context)
        },
        cost: 'free'
      };
    }
    
    return {
      type: 'response',
      payload: {
        message: answer.content,
        actions: answer.followupActions || getContextualActions(context)
      },
      cost: 'low_cost'
    };
  }

  /**
   * Generate next step suggestions (LOW COST - rule-based)
   */
  private handleNextStepSuggestion(context: SofiaContext): CommandResult {
    const suggestions = this.generateNextSteps(context);
    const primarySuggestion = suggestions[0];
    
    const message = `Na základe vášho pokroku (${context.completionPercentage}%) odporúčam: ${primarySuggestion.description}`;
    
    const actions: ActionButton[] = suggestions.map(suggestion => ({
      id: suggestion.actionId,
      text: suggestion.title,
      icon: suggestion.icon,
      category: suggestion.category,
      cost: 'free',
      payload: suggestion.payload
    }));
    
    return {
      type: 'response',
      payload: { message, actions },
      cost: 'low_cost'
    };
  }

  /**
   * Handle premium AI features (HIGH COST)
   */
  private async handlePremiumFeature(command: string, context: SofiaContext): Promise<CommandResult> {
    const prompts: Record<string, string> = {
      'generate_legacy_letter': `Pomôžte mi napísať osobný odkaz pre moju rodinu. Mojim najbližším chcem zanechať slová lásky a povzbudenia.`,
      'generate_financial_summary': `Vytvorte mi súhrn mojich financií a majetku, ktorý pomôže mojej rodine v núdzi. Zahrnite praktické kroky a dôležité kontakty.`,
    };
    
    const prompt = prompts[command];
    if (!prompt) {
      return {
        type: 'error',
        payload: { message: 'Neznáma prémiová funkcia.' },
        cost: 'premium'
      };
    }
    
    // Call AI API for premium generation
    const apiRequest = createSofiaAPIRequest(prompt, context, 'premium_generation');
    const apiResponse = await sofiaAPI.processPremiumGeneration(apiRequest);
    
    if (apiResponse.success && apiResponse.response) {
      return {
        type: 'response',
        payload: {
          message: apiResponse.response,
          actions: getContextualActions(context)
        },
        cost: 'premium'
      };
    } else {
      return {
        type: 'response',
        payload: {
          message: apiResponse.error || 'Bohužiaľ, prémiové funkcie nie sú momentálne dostupné. Skúste to neskôr.',
          actions: [{
            id: 'retry_premium',
            text: '🔄 Skúsiť znova',
            icon: 'sparkles',
            category: 'premium_feature',
            cost: 'premium',
            payload: { command }
          }]
        },
        cost: 'premium'
      };
    }
  }

  /**
   * Handle free-form text input (try to parse and route)
   */
  private async handleFreeFormInput(input: string, context: SofiaContext): Promise<CommandResult> {
    const lowerInput = input.toLowerCase();
    
    // Simple keyword matching for common requests (FREE)
    if (lowerInput.includes('document') || lowerInput.includes('upload') || lowerInput.includes('add')) {
      return this.handleUIActionCommand('trigger_upload', context);
    }
    
    if (lowerInput.includes('trezor') || lowerInput.includes('vault')) {
      return this.handleNavigationCommand('navigate_vault', context);
    }
    
    if (lowerInput.includes('guardian') || lowerInput.includes('protector')) {
      return this.handleNavigationCommand('navigate_guardians', context);
    }
    
    if (lowerInput.includes('závet') || lowerInput.includes('legacy')) {
      return this.handleNavigationCommand('navigate_legacy', context);
    }
    
    if (lowerInput.includes('pomoc') || lowerInput.includes('help') || lowerInput.includes('čo')) {
      return this.handleNextStepSuggestion(context);
    }
    
    // Security/FAQ keywords (LOW COST)
    if (lowerInput.includes('bezpečnosť') || lowerInput.includes('šifrovanie') || lowerInput.includes('security')) {
      return this.handleKnowledgeBaseQuery('faq_security', context);
    }
    
    // Try AI-powered interpretation for complex questions (LOW COST)
    if (input.length > 10 && input.includes('?')) {
      try {
        const apiRequest = createSofiaAPIRequest(
          `Interpret this user question and provide a helpful response: "${input}"`, 
          context, 
          'simple_query'
        );
        const apiResponse = await sofiaAPI.processSimpleQuery(apiRequest);
        
        if (apiResponse.success && apiResponse.response) {
          return {
            type: 'response',
            payload: {
              message: apiResponse.response,
              actions: getContextualActions(context)
            },
            cost: 'low_cost'
          };
        }
      } catch (error) {
        console.warn('[Sofia Router] AI interpretation failed:', error);
      }
    }
    
    // Fallback: offer helpful actions
    return {
      type: 'response',
      payload: {
        message: `Hmm, I'm not sure how I can help you with that. Try one of these options:`,
        actions: getContextualActions(context)
      },
      cost: 'free'
    };
  }

  /**
   * Generate contextual next steps
   */
  private generateNextSteps(context: SofiaContext) {
    const steps = [];
    
    if (context.documentCount < 3) {
      steps.push({
        title: '📄 Add basic documents',
        description: 'Nahrajte občiansky preukaz, pas a kartičku poistenca',
        actionId: 'trigger_upload',
        icon: 'upload',
        category: 'ui_action' as const,
        payload: { action: 'open_uploader' }
      });
    }
    
    if (context.documentCount >= 3 && context.guardianCount === 0) {
      steps.push({
        title: '👥 Add first guardian',
        description: 'Určte dôveryhodnú osobu, ktorá vám pomôže v núdzi',
        actionId: 'navigate_guardians',
        icon: 'guardians',
        category: 'navigation' as const,
        payload: { route: '/guardians' }
      });
    }
    
    if (context.completionPercentage > 50) {
      steps.push({
        title: '📜 Vytvoriť závet',
        description: 'Zabezpečte svoju rodinu vytvorením základného závetu',
        actionId: 'navigate_legacy', 
        icon: 'legacy',
        category: 'navigation' as const,
        payload: { route: '/legacy' }
      });
    }
    
    // Always have a fallback suggestion
    if (steps.length === 0) {
      steps.push({
        title: '🔍 Preskúmať možnosti',
        description: 'Prezrieme si, čo môžete ešte vylepšiť',
        actionId: 'show_progress',
        icon: 'info',
        category: 'ui_action' as const,
        payload: { action: 'show_progress_modal' }
      });
    }
    
    return steps;
  }

  /**
   * Generate personalized welcome message
   */
  private generateWelcomeMessage(context: SofiaContext): string {
    const { userName, completionPercentage, documentCount, guardianCount } = context;
    const greeting = this.getTimeBasedGreeting();
    const name = userName || 'tam';
    
    if (completionPercentage < 20) {
      return `${greeting}, ${name}! Vitajte v LegacyGuard. Som Sofia a som tu, aby som vám pomohla chrániť vašu rodinu. Poďme začať!`;
    }
    
    if (completionPercentage < 60) {
      return `${greeting}, ${name}! I see you've already secured ${documentCount} documents. Great work! How can I help you today?`;
    }
    
    return `${greeting}, ${name}! Máte už ${completionPercentage}% hotovo - to je fantastické! Vaša rodina je čím ďalej, tým viac chránená.`;
  }

  private getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dobré ráno';
    if (hour < 18) return 'Dobrý deň'; 
    return 'Dobrý večer';
  }
}

// Export singleton instance
export const sofiaRouter = SofiaRouter.getInstance();