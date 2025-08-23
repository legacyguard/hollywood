// Sofia API Handler - Secure OpenAI Communication via Supabase Edge Function
// This uses the secure server-side Edge Function to protect API keys

import { SofiaContext, SofiaMessage } from './sofia-types';

interface SofiaAPIRequest {
  prompt: string;
  context: SofiaContext;
  conversationHistory?: SofiaMessage[];
  requestType: 'simple_query' | 'knowledge_lookup' | 'premium_generation';
}

interface SofiaAPIResponse {
  success: boolean;
  response?: string;
  error?: string;
  tokensUsed?: number;
  cost: 'free' | 'low_cost' | 'premium';
}

class SofiaAPI {
  private supabaseUrl: string;
  private supabaseKey: string;
  private initialized = false;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    this.initialized = !!(this.supabaseUrl && this.supabaseKey);
    
    if (this.initialized) {
      console.log('[Sofia API] Initialized with Supabase Edge Function');
    } else {
      console.warn('[Sofia API] Supabase credentials not found. Using mock responses only.');
    }
  }

  /**
   * Process simple queries (Category 2: Low cost)
   * Used for knowledge base searches and simple Q&A
   */
  async processSimpleQuery(request: SofiaAPIRequest): Promise<SofiaAPIResponse> {
    if (!this.initialized) {
      return this.getMockResponse(request);
    }

    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/sofia-ai-guided`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseKey}`
        },
        body: JSON.stringify({
          action: 'simple_query',
          data: {
            prompt: request.prompt,
            context: request.context,
            conversationHistory: request.conversationHistory
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        response: result.response,
        tokensUsed: result.tokensUsed || 0,
        cost: 'low_cost'
      };

    } catch (error) {
      console.error('[Sofia API] Error in simple query:', error);
      return this.getMockResponse(request);
    }
  }

  /**
   * Process premium AI features (Category 3: High cost)
   * Used for creative content generation like letters, summaries
   */
  async processPremiumGeneration(request: SofiaAPIRequest): Promise<SofiaAPIResponse> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Premium features require server configuration.',
        cost: 'premium'
      };
    }

    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/sofia-ai-guided`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseKey}`
        },
        body: JSON.stringify({
          action: 'premium_generation',
          data: {
            prompt: request.prompt,
            context: request.context,
            conversationHistory: request.conversationHistory
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        response: result.response,
        tokensUsed: result.tokensUsed || 0,
        cost: 'premium'
      };

    } catch (error) {
      console.error('[Sofia API] Error in premium generation:', error);
      return {
        success: false,
        error: 'Ospravedlňujem sa, vyskytla sa chyba pri generovaní prémiového obsahu.',
        cost: 'premium'
      };
    }
  }

  /**
   * Generate system prompts based on context and request type
   */
  private generateSystemPrompt(context: SofiaContext, type: 'simple' | 'premium'): string {
    const basePrompt = `You are Sofia, a warm, intelligent AI assistant for LegacyGuard - a secure family protection platform. You help users organize their digital lives, protect their families, and create meaningful legacies.

PERSONALITY:
- Warm, empathetic, and supportive
- Professional but friendly tone in Slovak language
- Focus on care, protection, and love (not fear or death)
- Use the user's name when available: ${context.userName || 'tam'}
- Be encouraging about progress and gentle with guidance

USER CONTEXT:
- Name: ${context.userName || 'Not provided'}
- Documents: ${context.documentCount}
- Guardians: ${context.guardianCount}
- Completion: ${context.completionPercentage}%
- Family: ${context.familyStatus}
- Language: ${context.language}
- Recent activity: ${context.recentActivity.join(', ') || 'No recent activity'}

RESPONSE STYLE:
- Keep responses conversational and concise
- Use encouraging language
- Provide specific, actionable advice
- Remember: You're helping someone protect what they love most`;

    if (type === 'simple') {
      return basePrompt + `

SIMPLE QUERY MODE:
- Provide brief, direct answers (max 2-3 sentences)
- Focus on being helpful and informative
- Suggest relevant next steps when appropriate`;
    }

    return basePrompt + `

PREMIUM MODE:
- Take time to craft thoughtful, personalized responses
- Use creative and emotional language when appropriate
- Consider the user's family context deeply
- Create meaningful, heartfelt content`;
  }

  /**
   * Mock responses for when OpenAI is not available
   */
  private getMockResponse(request: SofiaAPIRequest): SofiaAPIResponse {
    const mockResponses = {
      simple_query: [
        'To je zaujímavá otázka. Na základe vašich informácií by som odporučila najprv dokončiť nahrávanie základných dokumentov.',
        'Rozumiem vašej situácii. Vzhľadom na váš pokrok by ste mohli zvážiť pridanie ďalšieho strážcu.',
        'Vaša otázka je dôležitá. Pri vašom aktuálnom nastavení by som navrhla sústrediť sa na zabezpečenie dokumentov.'
      ],
      premium_generation: [
        'Bohužiaľ, prémiové funkcie vyžadujú pripojenie k AI službám. Skúste to prosím neskôr.',
        'Pre generovanie osobných odkazov potrebujeme nakonfigurovať AI služby. Zatiaľ môžete písať vlastné odkazy.'
      ]
    };

    const responses = mockResponses[request.requestType] || mockResponses.simple_query;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      success: true,
      response: randomResponse,
      tokensUsed: 0,
      cost: request.requestType === 'premium_generation' ? 'premium' : 'low_cost'
    };
  }

  /**
   * Check if API is available
   */
  isAvailable(): boolean {
    return this.initialized;
  }

  /**
   * Get API status
   */
  getStatus(): { available: boolean; hasSupabaseConfig: boolean } {
    return {
      available: this.initialized,
      hasSupabaseConfig: !!(this.supabaseUrl && this.supabaseKey)
    };
  }
}

// Export singleton instance
export const sofiaAPI = new SofiaAPI();

// Utility function to create API requests
export function createSofiaAPIRequest(
  prompt: string,
  context: SofiaContext,
  requestType: SofiaAPIRequest['requestType'] = 'simple_query',
  conversationHistory?: SofiaMessage[]
): SofiaAPIRequest {
  return {
    prompt,
    context,
    requestType,
    conversationHistory
  };
}