/**
 * Gmail API Integration Types
 * Comprehensive TypeScript interfaces for Gmail API integration
 */

export interface GmailAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

export interface GmailTokens {
  accessToken: string;
  refreshToken?: string;
  expiryDate?: number;
  tokenType: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: GmailPayload;
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
}

export interface GmailPayload {
  partId: string;
  mimeType: string;
  filename?: string;
  headers: GmailHeader[];
  body?: GmailBody;
  parts?: GmailPayload[];
}

export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailBody {
  attachmentId?: string;
  size: number;
  data?: string;
}

export interface GmailAttachment {
  partId: string;
  filename: string;
  mimeType: string;
  size: number;
  data?: string; // Base64 encoded
}

export interface ExtractedDocument {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  content: ArrayBuffer;
  extractedText?: string;
  documentType?: DocumentType;
  confidence?: number;
  metadata: {
    fromEmail: string;
    subject: string;
    date: string;
    messageId: string;
  };
}

export type DocumentType =
  | 'will'
  | 'trust'
  | 'insurance'
  | 'bank_statement'
  | 'investment'
  | 'property_deed'
  | 'tax_document'
  | 'medical'
  | 'identification'
  | 'other';

export interface DocumentCategorizationResult {
  type: DocumentType;
  confidence: number;
  suggestedName: string;
  expiryDate?: Date;
  familyRelevance: 'high' | 'medium' | 'low';
  insights: string[];
}

export interface EmailImportSession {
  id: string;
  status: 'scanning' | 'processing' | 'completed' | 'failed';
  totalEmails: number;
  processedEmails: number;
  foundDocuments: ExtractedDocument[];
  errors: string[];
  startedAt: Date;
  completedAt?: Date;
}

export interface EmailImportConfig {
  dateRange: {
    from: Date;
    to: Date;
  };
  includeTypes: string[];
  maxDocuments: number;
  sizeLimit: number; // in bytes
}

export interface BulkImportResult {
  session: EmailImportSession;
  documents: ExtractedDocument[];
  categorizations: DocumentCategorizationResult[];
  duplicates: number;
  timeSaved: number; // estimated time saved in minutes
  protectionIncrease: number; // percentage increase in family protection
}
