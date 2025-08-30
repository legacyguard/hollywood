/**
 * Will Template System Types
 * Multi-jurisdiction, multi-language will generation system
 */

export type Jurisdiction = 'CZ' | 'SK' | 'DE' | 'AT' | 'FR' | 'ES' | 'IT' | 'NL' | 'BE' | 'LU' |
  'CH' | 'LI' | 'UK' | 'DK' | 'SE' | 'FI' | 'PL' | 'HU' | 'SI' | 'EE' | 'LV' | 'LT' |
  'PT' | 'GR' | 'MT' | 'CY' | 'IE' | 'NO' | 'IS' | 'RO' | 'BG' | 'HR' | 'RS' | 'AL' |
  'MK' | 'ME' | 'MD' | 'UA' | 'BA';

export type WillTemplateType = 'holographic' | 'allographic' | 'notarial' | 'witnessed';

export type LanguageCode = 'cs' | 'sk' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'da' |
  'sv' | 'fi' | 'pl' | 'hu' | 'sl' | 'et' | 'lv' | 'lt' | 'pt' | 'el' | 'mt' | 'ga' |
  'no' | 'is' | 'ro' | 'bg' | 'hr' | 'sr' | 'sq' | 'mk' | 'me' | 'ru' | 'uk' | 'bs';

export interface WillJurisdictionConfig {
  jurisdiction: Jurisdiction;
  countryName: {
    [key in LanguageCode]?: string;
  };
  supportedLanguages: LanguageCode[];
  primaryLanguage: LanguageCode;
  supportedWillTypes: WillTemplateType[];
  defaultWillType: WillTemplateType;
  legalRequirements: JurisdictionRequirements;
  taxInfo: TaxInfo;
  notaryRequirements?: NotaryRequirements;
}

export interface JurisdictionRequirements {
  minimumAge: number;
  witnessRequirements: {
    required: boolean;
    minimumCount: number;
    witnessRestrictions: string[];
  };
  notarization: {
    required: boolean;
    optional: boolean;
    circumstances?: string[];
  };
  holographicAllowed: boolean;
  forcedHeirship: boolean;
  revocationRules: string[];
  formalRequirements: string[];
}

export interface TaxInfo {
  inheritanceTax: boolean;
  taxRates?: {
    relationship: string;
    threshold: number;
    rate: number;
  }[];
  exemptions?: string[];
  notes?: string;
}

export interface NotaryRequirements {
  organization: string;
  searchUrl?: string;
  verificationRequired: boolean;
  estimatedFees?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface WillTemplate {
  id: string;
  jurisdiction: Jurisdiction;
  type: WillTemplateType;
  language: LanguageCode;
  version: string;

  metadata: {
    name: string;
    description: string;
    lastUpdated: string;
    legalReview: {
      reviewedBy?: string;
      reviewDate?: string;
      isApproved: boolean;
    };
  };

  structure: WillTemplateStructure;
  variables: TemplateVariable[];
  validationRules: ValidationRule[];
  legalClauses: LegalClause[];
}

export interface WillTemplateStructure {
  header: TemplateSection;
  sections: TemplateSection[];
  footer: TemplateSection;
  executionInstructions: ExecutionInstructions;
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string;
  order: number;
  required: boolean;
  conditionalLogic?: ConditionalLogic;
  variables?: string[];
  helpText?: string;
  legalReference?: string;
}

export interface ConditionalLogic {
  condition: string;
  dependencies: string[];
  showIf?: Record<string, any>;
  hideIf?: Record<string, any>;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
  options?: SelectOption[];
  description?: string;
  placeholder?: string;
  dataSource?: 'user' | 'guardian' | 'asset' | 'beneficiary';
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'legal';
  value?: any;
  message: string;
  severity: 'error' | 'warning' | 'info';
  jurisdictionSpecific?: boolean;
}

export interface LegalClause {
  id: string;
  type: 'mandatory' | 'conditional' | 'optional';
  jurisdiction: Jurisdiction;
  content: string;
  legalBasis: string;
  applicableWhenConditions?: Record<string, any>;
}

export interface ExecutionInstructions {
  holographic?: {
    steps: string[];
    requirements: string[];
    warnings: string[];
  };
  witnessed?: {
    steps: string[];
    witnessRequirements: string[];
    warnings: string[];
  };
  notarial?: {
    steps: string[];
    notaryRequirements: string[];
    expectedCosts: string;
    warnings: string[];
  };
}

export interface WillGenerationRequest {
  userId: string;
  jurisdiction: Jurisdiction;
  language: LanguageCode;
  willType: WillTemplateType;
  templateId?: string;
  userData: WillUserData;
  preferences: WillGenerationPreferences;
}

export interface WillUserData {
  personal: PersonalInfo;
  family: FamilyInfo;
  assets: AssetInfo[];
  beneficiaries: BeneficiaryInfo[];
  executors: ExecutorInfo[];
  guardians?: GuardianshipInfo[];
  specialInstructions: SpecialInstruction[];
}

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  personalId?: string;
  citizenship: string;
  address: AddressInfo;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'partnership';
  profession?: string;
}

export interface AddressInfo {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  region?: string;
}

export interface FamilyInfo {
  spouse?: PersonalInfo;
  children: ChildInfo[];
  parents?: PersonalInfo[];
  siblings?: PersonalInfo[];
}

export interface ChildInfo extends PersonalInfo {
  isMinor: boolean;
  guardianship?: {
    currentGuardian?: string;
    proposedGuardian?: string;
    specialNeeds?: string;
  };
}

export interface AssetInfo {
  id: string;
  type: 'real_estate' | 'bank_account' | 'investment' | 'vehicle' | 'business' | 'personal_property' | 'digital_asset' | 'other';
  description: string;
  value: number;
  currency: string;
  location?: string;
  ownershipPercentage: number;
  encumbrances?: string;
  documentReference?: string;
}

export interface BeneficiaryInfo {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth?: string;
  personalId?: string;
  address: AddressInfo;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  share: {
    type: 'percentage' | 'specific_amount' | 'specific_assets' | 'remainder';
    value: number | string;
    assets?: string[];
  };
  conditions?: string;
  alternativeBeneficiary?: string;
}

export interface ExecutorInfo {
  id: string;
  type: 'primary' | 'alternate' | 'co_executor';
  name: string;
  relationship: string;
  address: AddressInfo;
  contactInfo: {
    email?: string;
    phone?: string;
  };
  isProfessional: boolean;
  specialization?: string;
  compensation?: string;
  powerLimitations?: string[];
}

export interface GuardianshipInfo {
  childId: string;
  primaryGuardian: ExecutorInfo;
  alternateGuardian?: ExecutorInfo;
  specialInstructions?: string;
  financialProvisions?: string;
  educationWishes?: string;
}

export interface SpecialInstruction {
  id: string;
  type: 'funeral' | 'burial' | 'organ_donation' | 'pet_care' | 'digital_assets' |
        'business_succession' | 'charitable_giving' | 'personal_message' | 'other';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  recipient?: string;
}

export interface WillGenerationPreferences {
  includeOptionalClauses: boolean;
  detailLevel: 'basic' | 'detailed' | 'comprehensive';
  languageStyle: 'formal' | 'simplified' | 'traditional';
  includeLegalExplanations: boolean;
  generateMultipleLanguages: boolean;
  targetLanguages?: LanguageCode[];
}

export interface GeneratedWill {
  id: string;
  templateId: string;
  userId: string;
  jurisdiction: Jurisdiction;
  language: LanguageCode;
  type: WillTemplateType;

  content: {
    text: string;
    html: string;
    pdf?: ArrayBuffer;
  };

  metadata: {
    generationDate: string;
    version: string;
    wordCount: number;
    pageCount: number;
    checksum: string;
  };

  validationResult: WillValidationResult;
  aiSuggestions: AISuggestion[];

  executionInstructions: ExecutionInstructions;
  legalDisclaimer: string;
}

export interface WillValidationResult {
  isValid: boolean;
  completenessScore: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  legalRequirementsMet: boolean;
  missingRequiredFields: string[];
  suggestedImprovements: string[];
}

export interface AISuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'optimization' | 'legal_consideration';
  category: string;
  title: string;
  description: string;
  suggestedAction: string;
  priority: 'high' | 'medium' | 'low';
  isJurisdictionSpecific: boolean;
  affectedSections: string[];
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  legalReference?: string;
  suggestedFix?: string;
}

// Template Library System
export interface TemplateLibrary {
  getTemplate(jurisdiction: Jurisdiction, type: WillTemplateType, language: LanguageCode): Promise<WillTemplate>;
  getAllTemplates(): Promise<WillTemplate[]>;
  getJurisdictionConfig(jurisdiction: Jurisdiction): Promise<WillJurisdictionConfig>;
  getSupportedLanguages(jurisdiction: Jurisdiction): Promise<LanguageCode[]>;
  validateWillData(data: WillUserData, template: WillTemplate): Promise<WillValidationResult>;
}

// Sofia AI Integration
export interface SofiaWillAssistant {
  generateWillSuggestions(userData: WillUserData, jurisdiction: Jurisdiction): Promise<AISuggestion[]>;
  optimizeWillContent(will: GeneratedWill): Promise<GeneratedWill>;
  explainLegalTerms(content: string, language: LanguageCode): Promise<Record<string, string>>;
  validateCompliance(will: GeneratedWill): Promise<WillValidationResult>;
  suggestBeneficiaryOptimizations(beneficiaries: BeneficiaryInfo[], assets: AssetInfo[]): Promise<AISuggestion[]>;
}

// Constants for Czech Republic and Slovakia
export const CZ_SK_JURISDICTIONS: Record<'CZ' | 'SK', WillJurisdictionConfig> = {
  CZ: {
    jurisdiction: 'CZ',
    countryName: {
      cs: 'Česká republika',
      sk: 'Česká republika',
      en: 'Czech Republic',
      de: 'Tschechische Republik',
      uk: 'Чеська Республіка'
    },
    supportedLanguages: ['cs', 'sk', 'en', 'de', 'uk'],
    primaryLanguage: 'cs',
    supportedWillTypes: ['holographic', 'witnessed', 'notarial'],
    defaultWillType: 'holographic',
    legalRequirements: {
      minimumAge: 18,
      witnessRequirements: {
        required: false,
        minimumCount: 2,
        witnessRestrictions: ['not_beneficiary', 'adult', 'mentally_capable']
      },
      notarization: {
        required: false,
        optional: true,
        circumstances: ['complex_assets', 'international_assets', 'business_succession']
      },
      holographicAllowed: true,
      forcedHeirship: true,
      revocationRules: ['explicit_revocation', 'new_will_supersedes', 'marriage_revokes_partial'],
      formalRequirements: ['handwritten', 'signed', 'dated']
    },
    taxInfo: {
      inheritanceTax: false,
      exemptions: ['close_relatives'],
      notes: 'No inheritance tax between spouses, children, and parents'
    },
    notaryRequirements: {
      organization: 'Notářská komora České republiky',
      searchUrl: 'https://www.nkcr.cz',
      verificationRequired: false,
      estimatedFees: {
        min: 1000,
        max: 5000,
        currency: 'CZK'
      }
    }
  },
  SK: {
    jurisdiction: 'SK',
    countryName: {
      sk: 'Slovenská republika',
      cs: 'Slovenská republika',
      en: 'Slovak Republic',
      de: 'Slowakische Republik',
      uk: 'Словацька Республіка'
    },
    supportedLanguages: ['sk', 'cs', 'en', 'de', 'uk'],
    primaryLanguage: 'sk',
    supportedWillTypes: ['holographic', 'witnessed', 'notarial'],
    defaultWillType: 'holographic',
    legalRequirements: {
      minimumAge: 18,
      witnessRequirements: {
        required: false,
        minimumCount: 2,
        witnessRestrictions: ['not_beneficiary', 'adult', 'mentally_capable', 'simultaneous_presence']
      },
      notarization: {
        required: false,
        optional: true,
        circumstances: ['international_validity', 'complex_estate']
      },
      holographicAllowed: true,
      forcedHeirship: true,
      revocationRules: ['explicit_revocation', 'new_will_supersedes', 'material_change_in_circumstances'],
      formalRequirements: ['handwritten', 'signed', 'dated', 'personal_handwriting_required']
    },
    taxInfo: {
      inheritanceTax: false,
      exemptions: ['all_heirs'],
      notes: 'No inheritance tax in Slovakia'
    },
    notaryRequirements: {
      organization: 'Notárska komora Slovenskej republiky',
      searchUrl: 'https://www.notar.sk',
      verificationRequired: false,
      estimatedFees: {
        min: 50,
        max: 300,
        currency: 'EUR'
      }
    }
  }
};
