/**
 * Google API Type Definitions
 * TypeScript interfaces for Google APIs used in the application
 */

export interface GoogleAuthUser {
  getAuthResponse(): GoogleAuthResponse;
  getId(): string;
  getBasicProfile(): GoogleBasicProfile;
}

export interface GoogleAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  token_type: string;
  scope: string;
}

export interface GoogleBasicProfile {
  getId(): string;
  getName(): string;
  getGivenName(): string;
  getFamilyName(): string;
  getImageUrl(): string;
  getEmail(): string;
}

export interface GoogleAuthInstance {
  isSignedIn: {
    get(): boolean;
    listen(listener: (isSignedIn: boolean) => void): void;
  };
  currentUser: {
    get(): GoogleAuthUser;
  };
  signIn(): Promise<GoogleAuthUser>;
  signOut(): Promise<void>;
}

export interface GoogleAPI {
  load(api: string, callback: () => void): void;
  auth2: {
    init(config: GoogleAuthInitConfig): Promise<void>;
    getAuthInstance(): GoogleAuthInstance;
  };
  client: {
    init(config: GoogleClientInitConfig): Promise<void>;
    gmail: {
      users: {
        messages: {
          list(params: GmailListParams): Promise<GmailListResponse>;
          get(params: GmailGetParams): Promise<GmailGetResponse>;
          attachments: {
            get(params: GmailAttachmentParams): Promise<GmailAttachmentResponse>;
          };
        };
      };
    };
  };
}

export interface GoogleAuthInitConfig {
  client_id: string;
  scope: string;
}

export interface GoogleClientInitConfig {
  apiKey: string;
  clientId: string;
  discoveryDocs: string[];
  scope: string;
}

export interface GmailListParams {
  userId: string;
  q: string;
  maxResults: number;
}

export interface GmailListResponse {
  result: {
    messages?: Array<{ id: string }>;
  };
}

export interface GmailGetParams {
  userId: string;
  id: string;
}

export interface GmailGetResponse {
  result: GmailMessage;
}

export interface GmailAttachmentParams {
  userId: string;
  messageId: string;
  id: string;
}

export interface GmailAttachmentResponse {
  result: {
    data: string;
  };
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

// Extend the global Window interface
declare global {
  interface Window {
    gapi: GoogleAPI;
  }
}
