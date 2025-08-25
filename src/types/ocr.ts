// OCR and Document Processing Types

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes: BoundingBox[];
  detectedLanguage: string;
  metadata: OCRMetadata;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRMetadata {
  processingTime: number;
  imageSize: {
    width: number;
    height: number;
  };
  textBlocks: TextBlock[];
  extractedEntities: ExtractedEntity[];
}

export interface TextBlock {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  type: 'paragraph' | 'line' | 'word';
}

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export type EntityType =
  | 'name'
  | 'date'
  | 'address'
  | 'phone'
  | 'email'
  | 'ssn'
  | 'account_number'
  | 'policy_number'
  | 'amount'
  | 'organization'
  | 'signature';

// Document Categories based on LegacyGuard context
export type DocumentCategory =
  | 'legal'
  | 'financial'
  | 'medical'
  | 'insurance'
  | 'personal'
  | 'property'
  | 'business'
  | 'government'
  | 'other';

export type DocumentType =
  // Legal Documents
  | 'will'
  | 'trust'
  | 'power_of_attorney'
  | 'living_will'
  | 'marriage_certificate'
  | 'divorce_decree'
  | 'adoption_papers'
  | 'contract'

  // Financial Documents
  | 'bank_statement'
  | 'investment_account'
  | 'retirement_account'
  | 'tax_return'
  | 'loan_document'
  | 'mortgage'
  | 'credit_card_statement'
  | 'financial_statement'

  // Medical Documents
  | 'medical_record'
  | 'prescription'
  | 'medical_directive'
  | 'health_insurance_card'
  | 'vaccination_record'

  // Insurance Documents
  | 'life_insurance'
  | 'health_insurance'
  | 'auto_insurance'
  | 'home_insurance'
  | 'disability_insurance'

  // Personal Documents
  | 'birth_certificate'
  | 'passport'
  | 'drivers_license'
  | 'social_security_card'
  | 'military_records'

  // Property Documents
  | 'property_deed'
  | 'property_tax'
  | 'home_appraisal'
  | 'utility_bill'

  // Business Documents
  | 'business_license'
  | 'business_contract'
  | 'business_tax'

  // Government Documents
  | 'tax_document'
  | 'government_benefit'
  | 'voter_registration'

  // Other
  | 'receipt'
  | 'warranty'
  | 'manual'
  | 'correspondence'
  | 'other';

export interface DocumentClassification {
  category: DocumentCategory;
  type: DocumentType;
  confidence: number;
  reasons: string[];
  suggestedTags: string[];
}

export interface ProcessedDocument {
  id: string;
  originalFileName: string;
  ocrResult: OCRResult;
  classification: DocumentClassification;
  extractedMetadata: DocumentMetadata;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  processingError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentMetadata {
  // Common metadata
  title?: string;
  date?: string;
  issuer?: string;
  recipient?: string;
  amount?: string;

  // Legal specific
  legalEntity?: string;
  jurisdiction?: string;
  witnessRequired?: boolean;

  // Financial specific
  accountNumber?: string;
  institutionName?: string;
  balance?: string;
  transactionDate?: string;

  // Medical specific
  patientName?: string;
  doctorName?: string;
  diagnosis?: string;
  medicationList?: string[];

  // Insurance specific
  policyNumber?: string;
  coverageAmount?: string;
  deductible?: string;
  expirationDate?: string;

  // Personal identity
  fullName?: string;
  dateOfBirth?: string;
  address?: string;
  idNumber?: string;

  // Property specific
  propertyAddress?: string;
  ownerName?: string;
  assessedValue?: string;

  // Custom fields
  customFields?: Record<string, string>;
}

// Document processing configuration
export interface OCRProcessingConfig {
  enableEntityExtraction: boolean;
  enableDocumentClassification: boolean;
  enableMetadataExtraction: boolean;
  confidenceThreshold: number;
  languageHints?: string[];
  processingMode: 'fast' | 'accurate';
}

// API request/response types
export interface OCRProcessingRequest {
  fileData: string; // base64 encoded
  fileName: string;
  config: OCRProcessingConfig;
}

export interface OCRProcessingResponse {
  success: boolean;
  processedDocument?: ProcessedDocument;
  error?: string;
  processingId: string;
}

// Document categorization patterns
export const DOCUMENT_PATTERNS: Record<DocumentType, {
  keywords: string[];
  patterns: RegExp[];
  category: DocumentCategory;
  requiredEntities?: EntityType[];
}> = {
  // Legal Documents
  will: {
    keywords: ['last will', 'testament', 'executor', 'beneficiary', 'estate', 'bequest'],
    patterns: [/last\s+will\s+and\s+testament/i, /hereby\s+revoke/i, /sound\s+mind/i],
    category: 'legal',
    requiredEntities: ['name', 'signature']
  },
  trust: {
    keywords: ['trust agreement', 'trustee', 'grantor', 'settlor', 'trust fund'],
    patterns: [/trust\s+agreement/i, /revocable\s+trust/i, /irrevocable\s+trust/i],
    category: 'legal'
  },
  power_of_attorney: {
    keywords: ['power of attorney', 'attorney-in-fact', 'agent', 'principal'],
    patterns: [/power\s+of\s+attorney/i, /attorney.in.fact/i],
    category: 'legal'
  },

  // Financial Documents
  bank_statement: {
    keywords: ['bank statement', 'account summary', 'balance', 'transaction', 'deposit', 'withdrawal'],
    patterns: [/account\s+balance/i, /statement\s+period/i, /routing\s+number/i],
    category: 'financial',
    requiredEntities: ['account_number', 'amount']
  },
  tax_return: {
    keywords: ['form 1040', 'tax return', 'irs', 'adjusted gross income', 'tax liability'],
    patterns: [/form\s+1040/i, /tax\s+year/i, /adjusted\s+gross\s+income/i],
    category: 'financial'
  },

  // Medical Documents
  medical_record: {
    keywords: ['patient', 'diagnosis', 'treatment', 'medical history', 'physician'],
    patterns: [/patient\s+name/i, /date\s+of\s+birth/i, /diagnosis/i],
    category: 'medical',
    requiredEntities: ['name', 'date']
  },

  // Insurance Documents
  life_insurance: {
    keywords: ['life insurance', 'policy', 'beneficiary', 'death benefit', 'premium'],
    patterns: [/life\s+insurance\s+policy/i, /death\s+benefit/i, /policy\s+number/i],
    category: 'insurance',
    requiredEntities: ['policy_number', 'amount']
  },

  // Personal Documents
  birth_certificate: {
    keywords: ['birth certificate', 'date of birth', 'place of birth', 'parents'],
    patterns: [/certificate\s+of\s+birth/i, /born\s+on/i, /place\s+of\s+birth/i],
    category: 'personal',
    requiredEntities: ['name', 'date']
  },

  // Property Documents
  property_deed: {
    keywords: ['deed', 'property', 'grantor', 'grantee', 'real estate'],
    patterns: [/warranty\s+deed/i, /quit\s+claim\s+deed/i, /property\s+description/i],
    category: 'property',
    requiredEntities: ['name', 'address']
  },

  // Default for other types
  other: {
    keywords: [],
    patterns: [],
    category: 'other'
  },

  // Add minimal patterns for remaining types
  living_will: { keywords: ['living will'], patterns: [], category: 'legal' },
  marriage_certificate: { keywords: ['marriage certificate'], patterns: [], category: 'personal' },
  divorce_decree: { keywords: ['divorce decree'], patterns: [], category: 'legal' },
  adoption_papers: { keywords: ['adoption'], patterns: [], category: 'legal' },
  contract: { keywords: ['contract', 'agreement'], patterns: [], category: 'legal' },
  investment_account: { keywords: ['investment', 'portfolio'], patterns: [], category: 'financial' },
  retirement_account: { keywords: ['401k', 'ira', 'retirement'], patterns: [], category: 'financial' },
  loan_document: { keywords: ['loan'], patterns: [], category: 'financial' },
  mortgage: { keywords: ['mortgage'], patterns: [], category: 'financial' },
  credit_card_statement: { keywords: ['credit card'], patterns: [], category: 'financial' },
  financial_statement: { keywords: ['financial statement'], patterns: [], category: 'financial' },
  prescription: { keywords: ['prescription'], patterns: [], category: 'medical' },
  medical_directive: { keywords: ['medical directive'], patterns: [], category: 'medical' },
  health_insurance_card: { keywords: ['health insurance'], patterns: [], category: 'insurance' },
  vaccination_record: { keywords: ['vaccination'], patterns: [], category: 'medical' },
  health_insurance: { keywords: ['health insurance'], patterns: [], category: 'insurance' },
  auto_insurance: { keywords: ['auto insurance'], patterns: [], category: 'insurance' },
  home_insurance: { keywords: ['home insurance'], patterns: [], category: 'insurance' },
  disability_insurance: { keywords: ['disability insurance'], patterns: [], category: 'insurance' },
  passport: { keywords: ['passport'], patterns: [], category: 'personal' },
  drivers_license: { keywords: ['drivers license'], patterns: [], category: 'personal' },
  social_security_card: { keywords: ['social security'], patterns: [], category: 'personal' },
  military_records: { keywords: ['military'], patterns: [], category: 'personal' },
  property_tax: { keywords: ['property tax'], patterns: [], category: 'property' },
  home_appraisal: { keywords: ['appraisal'], patterns: [], category: 'property' },
  utility_bill: { keywords: ['utility', 'electric', 'gas', 'water'], patterns: [], category: 'property' },
  business_license: { keywords: ['business license'], patterns: [], category: 'business' },
  business_contract: { keywords: ['business contract'], patterns: [], category: 'business' },
  business_tax: { keywords: ['business tax'], patterns: [], category: 'business' },
  tax_document: { keywords: ['tax'], patterns: [], category: 'government' },
  government_benefit: { keywords: ['social security', 'medicare', 'medicaid'], patterns: [], category: 'government' },
  voter_registration: { keywords: ['voter registration'], patterns: [], category: 'government' },
  receipt: { keywords: ['receipt'], patterns: [], category: 'other' },
  warranty: { keywords: ['warranty'], patterns: [], category: 'other' },
  manual: { keywords: ['manual', 'instructions'], patterns: [], category: 'other' },
  correspondence: { keywords: ['letter', 'correspondence'], patterns: [], category: 'other' }
};
