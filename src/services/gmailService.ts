/**
 * Gmail API Service
 * Handles Gmail API integration for document import
 */

import type {
  GmailAuthConfig,
  GmailTokens,
  GmailMessage,
  GmailAttachment,
  ExtractedDocument,
  EmailImportConfig,
  DocumentType,
  DocumentCategorizationResult
} from '@/types/gmail';

export class GmailService {
  private static instance: GmailService;
  private tokens: GmailTokens | null = null;
  private config: GmailAuthConfig;

  private constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUri: `${window.location.origin}/auth/gmail/callback`,
      scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
      ]
    };
  }

  public static getInstance(): GmailService {
    if (!GmailService.instance) {
      GmailService.instance = new GmailService();
    }
    return GmailService.instance;
  }

  /**
   * Initialize OAuth2 authentication flow
   */
  public async authenticate(): Promise<GmailTokens> {
    try {
      if (!this.config.clientId) {
        throw new Error('Gmail API client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in environment variables.');
      }

      // Load Google APIs
      await this.loadGoogleAPIs();

      // Initialize OAuth2
      return new Promise((resolve, reject) => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: this.config.clientId,
            scope: this.config.scopes.join(' ')
          }).then(() => {
            const authInstance = window.gapi.auth2.getAuthInstance();

            if (authInstance.isSignedIn.get()) {
              const user = authInstance.currentUser.get();
              const authResponse = user.getAuthResponse();

              this.tokens = {
                accessToken: authResponse.access_token,
                refreshToken: authResponse.refresh_token,
                expiryDate: authResponse.expires_at,
                tokenType: 'Bearer'
              };

              resolve(this.tokens);
            } else {
              authInstance.signIn().then((user: any) => {
                const authResponse = user.getAuthResponse();

                this.tokens = {
                  accessToken: authResponse.access_token,
                  refreshToken: authResponse.refresh_token,
                  expiryDate: authResponse.expires_at,
                  tokenType: 'Bearer'
                };

                resolve(this.tokens);
              }).catch(reject);
            }
          }).catch(reject);
        });
      });
    } catch (error) {
      console.error('Gmail authentication failed:', error);
      throw error;
    }
  }

  /**
   * Load Google APIs dynamically
   */
  private async loadGoogleAPIs(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            clientId: this.config.clientId,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
            scope: this.config.scopes.join(' ')
          }).then(resolve).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Search for emails with potential documents
   */
  public async searchEmails(config: EmailImportConfig): Promise<GmailMessage[]> {
    if (!this.tokens) {
      throw new Error('Not authenticated. Please call authenticate() first.');
    }

    try {
      const query = this.buildSearchQuery(config);

      const response = await window.gapi.client.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: Math.min(config.maxDocuments, 100)
      });

      if (!response.result.messages) {
        return [];
      }

      // Fetch detailed message data for each message
      const messages: GmailMessage[] = [];
      for (const messageRef of response.result.messages) {
        try {
          const messageResponse = await window.gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: messageRef.id
          });
          messages.push(messageResponse.result);
        } catch (error) {
          console.warn(`Failed to fetch message ${messageRef.id}:`, error);
        }
      }

      return messages;
    } catch (error) {
      console.error('Failed to search emails:', error);
      throw error;
    }
  }

  /**
   * Build Gmail search query from config
   */
  private buildSearchQuery(config: EmailImportConfig): string {
    const queries: string[] = [];

    // Date range
    const fromDate = config.dateRange.from.toISOString().split('T')[0].replace(/-/g, '/');
    const toDate = config.dateRange.to.toISOString().split('T')[0].replace(/-/g, '/');
    queries.push(`after:${fromDate}`);
    queries.push(`before:${toDate}`);

    // Has attachments
    queries.push('has:attachment');

    // File type filters
    const fileExtensions = [
      'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'tiff'
    ];
    const extensionQuery = fileExtensions.map(ext => `filename:${ext}`).join(' OR ');
    queries.push(`(${extensionQuery})`);

    return queries.join(' ');
  }

  /**
   * Extract attachments from Gmail messages
   */
  public async extractAttachments(messages: GmailMessage[]): Promise<ExtractedDocument[]> {
    const documents: ExtractedDocument[] = [];

    for (const message of messages) {
      try {
        const attachments = this.findAttachments(message.payload);

        for (const attachment of attachments) {
          if (this.isDocumentAttachment(attachment)) {
            const extractedDoc = await this.downloadAttachment(message, attachment);
            documents.push(extractedDoc);
          }
        }
      } catch (error) {
        console.warn(`Failed to extract attachments from message ${message.id}:`, error);
      }
    }

    return documents;
  }

  /**
   * Recursively find attachments in message payload
   */
  private findAttachments(payload: any, attachments: GmailAttachment[] = []): GmailAttachment[] {
    if (payload.body && payload.body.attachmentId && payload.filename) {
      attachments.push({
        partId: payload.partId,
        filename: payload.filename,
        mimeType: payload.mimeType,
        size: payload.body.size
      });
    }

    if (payload.parts) {
      payload.parts.forEach((part: any) => {
        this.findAttachments(part, attachments);
      });
    }

    return attachments;
  }

  /**
   * Check if attachment is a document we're interested in
   */
  private isDocumentAttachment(attachment: GmailAttachment): boolean {
    const supportedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/tiff'
    ];

    return supportedTypes.includes(attachment.mimeType) && attachment.size < 10 * 1024 * 1024; // 10MB limit
  }

  /**
   * Download attachment content
   */
  private async downloadAttachment(message: GmailMessage, attachment: GmailAttachment): Promise<ExtractedDocument> {
    try {
      const response = await window.gapi.client.gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: message.id,
        id: attachment.partId
      });

      // Decode base64 data
      const base64Data = response.result.data.replace(/-/g, '+').replace(/_/g, '/');
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Extract metadata from message headers
      const fromHeader = message.payload.headers.find(h => h.name === 'From');
      const subjectHeader = message.payload.headers.find(h => h.name === 'Subject');
      const dateHeader = message.payload.headers.find(h => h.name === 'Date');

      return {
        id: `${message.id}_${attachment.partId}`,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
        content: bytes.buffer,
        metadata: {
          fromEmail: fromHeader?.value || '',
          subject: subjectHeader?.value || '',
          date: dateHeader?.value || message.internalDate,
          messageId: message.id
        }
      };
    } catch (error) {
      console.error(`Failed to download attachment ${attachment.filename}:`, error);
      throw error;
    }
  }

  /**
   * Categorize documents using AI-powered analysis
   */
  public async categorizeDocuments(documents: ExtractedDocument[]): Promise<DocumentCategorizationResult[]> {
    const results: DocumentCategorizationResult[] = [];

    for (const document of documents) {
      try {
        const categorization = await this.analyzeDocument(document);
        results.push(categorization);
      } catch (error) {
        console.warn(`Failed to categorize document ${document.filename}:`, error);
        // Provide fallback categorization
        results.push({
          type: 'other',
          confidence: 0.1,
          suggestedName: document.filename,
          familyRelevance: 'medium',
          insights: ['Unable to analyze document automatically']
        });
      }
    }

    return results;
  }

  /**
   * Analyze document content for categorization
   */
  private async analyzeDocument(document: ExtractedDocument): Promise<DocumentCategorizationResult> {
    // Extract text content if possible
    let extractedText = '';
    if (document.mimeType === 'application/pdf') {
      extractedText = await this.extractTextFromPDF(document.content);
    } else if (document.mimeType.startsWith('image/')) {
      extractedText = await this.extractTextFromImage(document.content);
    }

    // Analyze filename and content
    const type = this.categorizeByContent(document.filename, extractedText);
    const confidence = this.calculateConfidence(type, document.filename, extractedText);
    const suggestedName = this.generateSuggestedName(type, document.filename, document.metadata);

    return {
      type,
      confidence,
      suggestedName,
      familyRelevance: this.assessFamilyRelevance(type, extractedText),
      insights: this.generateInsights(type, extractedText, document.metadata)
    };
  }

  /**
   * Categorize document by analyzing filename and content
   */
  private categorizeByContent(filename: string, content: string): DocumentType {
    const lowerFilename = filename.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Will and estate planning documents
    if (
      lowerFilename.includes('will') ||
      lowerFilename.includes('testament') ||
      lowerContent.includes('last will') ||
      lowerContent.includes('testament')
    ) {
      return 'will';
    }

    // Trust documents
    if (
      lowerFilename.includes('trust') ||
      lowerContent.includes('trust agreement') ||
      lowerContent.includes('living trust')
    ) {
      return 'trust';
    }

    // Insurance documents
    if (
      lowerFilename.includes('insurance') ||
      lowerFilename.includes('policy') ||
      lowerContent.includes('policy number') ||
      lowerContent.includes('premium')
    ) {
      return 'insurance';
    }

    // Bank statements
    if (
      lowerFilename.includes('statement') ||
      lowerFilename.includes('bank') ||
      lowerContent.includes('account balance') ||
      lowerContent.includes('transaction')
    ) {
      return 'bank_statement';
    }

    // Property documents
    if (
      lowerFilename.includes('deed') ||
      lowerFilename.includes('property') ||
      lowerFilename.includes('mortgage') ||
      lowerContent.includes('property deed')
    ) {
      return 'property_deed';
    }

    // Tax documents
    if (
      lowerFilename.includes('tax') ||
      lowerFilename.includes('1040') ||
      lowerFilename.includes('w2') ||
      lowerContent.includes('tax return')
    ) {
      return 'tax_document';
    }

    return 'other';
  }

  /**
   * Calculate confidence score for categorization
   */
  private calculateConfidence(type: DocumentType, filename: string, content: string): number {
    let confidence = 0.3; // Base confidence

    if (type !== 'other') {
      confidence += 0.3; // Bonus for successful categorization
    }

    // Filename matches
    const typeKeywords = this.getTypeKeywords(type);
    const filenameMatches = typeKeywords.filter(keyword =>
      filename.toLowerCase().includes(keyword)
    ).length;
    confidence += filenameMatches * 0.1;

    // Content matches (if available)
    if (content) {
      const contentMatches = typeKeywords.filter(keyword =>
        content.toLowerCase().includes(keyword)
      ).length;
      confidence += contentMatches * 0.05;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Get keywords associated with document type
   */
  private getTypeKeywords(type: DocumentType): string[] {
    const keywords: Record<DocumentType, string[]> = {
      will: ['will', 'testament', 'executor', 'beneficiary', 'bequest'],
      trust: ['trust', 'trustee', 'grantor', 'beneficiary'],
      insurance: ['insurance', 'policy', 'premium', 'coverage', 'claim'],
      bank_statement: ['statement', 'balance', 'transaction', 'deposit', 'withdrawal'],
      investment: ['investment', 'portfolio', 'stocks', 'bonds', 'mutual fund'],
      property_deed: ['deed', 'property', 'real estate', 'mortgage', 'title'],
      tax_document: ['tax', '1040', 'w2', 'deduction', 'refund'],
      medical: ['medical', 'health', 'doctor', 'prescription', 'diagnosis'],
      identification: ['id', 'passport', 'license', 'certificate', 'birth'],
      other: []
    };

    return keywords[type] || [];
  }

  /**
   * Generate suggested name for document
   */
  private generateSuggestedName(type: DocumentType, originalName: string, metadata: { date: string }): string {
    const date = new Date(metadata.date);
    const year = date.getFullYear();

    const typeNames: Record<DocumentType, string> = {
      will: `Last Will and Testament ${year}`,
      trust: `Trust Document ${year}`,
      insurance: `Insurance Policy ${year}`,
      bank_statement: `Bank Statement ${year}`,
      investment: `Investment Statement ${year}`,
      property_deed: `Property Deed ${year}`,
      tax_document: `Tax Return ${year}`,
      medical: `Medical Document ${year}`,
      identification: `ID Document ${year}`,
      other: originalName
    };

    return typeNames[type];
  }

  /**
   * Assess family relevance of document
   */
  private assessFamilyRelevance(type: DocumentType, content: string): 'high' | 'medium' | 'low' {
    const highRelevanceTypes: DocumentType[] = ['will', 'trust', 'insurance', 'property_deed'];
    const mediumRelevanceTypes: DocumentType[] = ['investment', 'tax_document', 'medical'];

    if (highRelevanceTypes.includes(type)) {
      return 'high';
    }

    if (mediumRelevanceTypes.includes(type)) {
      return 'medium';
    }

    // Check content for family references
    if (content.toLowerCase().includes('family') ||
        content.toLowerCase().includes('spouse') ||
        content.toLowerCase().includes('children')) {
      return 'high';
    }

    return 'low';
  }

  /**
   * Generate insights about the document
   */
  private generateInsights(type: DocumentType, content: string, metadata: any): string[] {
    const insights: string[] = [];

    switch (type) {
      case 'will':
        insights.push('Important estate planning document');
        insights.push('Consider professional legal review');
        break;
      case 'trust':
        insights.push('Trust document for asset protection');
        insights.push('May need regular updates');
        break;
      case 'insurance':
        insights.push('Insurance coverage documentation');
        insights.push('Check policy expiration dates');
        break;
      case 'tax_document':
        insights.push('Tax-related document');
        insights.push('Keep for IRS audit purposes');
        break;
      default:
        insights.push('Document imported from email');
    }

    // Add time-based insights
    const documentDate = new Date(metadata.date);
    const monthsOld = (Date.now() - documentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsOld > 12) {
      insights.push('Document is over a year old - consider updating');
    }

    return insights;
  }

  /**
   * Extract text from PDF using PDF.js (stub - would need actual implementation)
   */
  private async extractTextFromPDF(_content: ArrayBuffer): Promise<string> {
    // This would require PDF.js integration
    // For now, return empty string
    return '';
  }

  /**
   * Extract text from image using OCR (stub - would need actual implementation)
   */
  private async extractTextFromImage(_content: ArrayBuffer): Promise<string> {
    // This would require OCR service integration (Tesseract.js, Google Vision API, etc.)
    // For now, return empty string
    return '';
  }

  /**
   * Sign out and clear tokens
   */
  public async signOut(): Promise<void> {
    if (window.gapi && window.gapi.auth2) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) {
        await authInstance.signOut();
      }
    }
    this.tokens = null;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.tokens !== null && this.tokens.accessToken !== '';
  }
}

// Global type declarations for Google APIs
declare global {
  interface Window {
    gapi: any;
  }
}

export const gmailService = GmailService.getInstance();
