// Sofia Search Dictionary - Intelligent keyword-to-action mapping without AI
export interface SofiaAction {
  text: string;
  actionId: string;
  payload: any;
  icon?: string;
}

export interface DictionaryEntry {
  category?: string;
  actions: SofiaAction[];
}

export const searchDictionary: Record<string, DictionaryEntry> = {
  // Insurance related terms
  'insurance': {
    category: 'insurance',
    actions: [
      {
        text: 'Show all insurance policies',
        actionId: 'filter_category',
        payload: 'insurance',
        icon: 'shield-check'
      },
      {
        text: 'Help me add new insurance',
        actionId: 'navigate_and_suggest',
        payload: { url: '/vault', suggestion: 'insurance', category: 'insurance' },
        icon: 'plus'
      },
      {
        text: 'Why are insurance policies important?',
        actionId: 'show_faq',
        payload: 'faq_insurance_importance',
        icon: 'help-circle'
      }
    ]
  },
  'poistka': {
    category: 'insurance', 
    actions: [
      {
        text: 'Ukáž mi všetky poistné zmluvy',
        actionId: 'filter_category',
        payload: 'insurance',
        icon: 'shield-check'
      },
      {
        text: 'Pomôž mi pridať novú poistku',
        actionId: 'navigate_and_suggest',
        payload: { url: '/vault', suggestion: 'poistka', category: 'insurance' },
        icon: 'plus'
      },
      {
        text: 'Prečo sú poistky dôležité?',
        actionId: 'show_faq',
        payload: 'faq_insurance_importance',
        icon: 'help-circle'
      }
    ]
  },

  // Legal documents
  'will': {
    category: 'legal',
    actions: [
      {
        text: 'Show information about creating wills',
        actionId: 'navigate',
        payload: '/legacy',
        icon: 'scroll'
      },
      {
        text: 'Why do I need a will?',
        actionId: 'show_faq',
        payload: 'faq_will_importance',
        icon: 'help-circle'
      },
      {
        text: 'Find my legal documents',
        actionId: 'filter_category',
        payload: 'legal',
        icon: 'file-text'
      }
    ]
  },
  'zavet': {
    category: 'legal',
    actions: [
      {
        text: 'Informácie o tvorbe závetu',
        actionId: 'navigate',
        payload: '/legacy',
        icon: 'scroll'
      },
      {
        text: 'Prečo potrebujem závet?',
        actionId: 'show_faq',
        payload: 'faq_will_importance',
        icon: 'help-circle'
      },
      {
        text: 'Nájdi moje právne dokumenty',
        actionId: 'filter_category',
        payload: 'legal',
        icon: 'file-text'
      }
    ]
  },

  // Personal documents  
  'passport': {
    category: 'personal',
    actions: [
      {
        text: 'Find my passport',
        actionId: 'filter_document_type',
        payload: 'passport',
        icon: 'users'
      },
      {
        text: 'How to renew passport?',
        actionId: 'show_faq',
        payload: 'faq_passport_renewal',
        icon: 'help-circle'
      },
      {
        text: 'Show all personal documents',
        actionId: 'filter_category',
        payload: 'personal',
        icon: 'user'
      }
    ]
  },
  'pas': {
    category: 'personal',
    actions: [
      {
        text: 'Nájdi môj pas',
        actionId: 'filter_document_type',
        payload: 'passport',
        icon: 'users'
      },
      {
        text: 'Ako obnoviť pas?',
        actionId: 'show_faq',
        payload: 'faq_passport_renewal',
        icon: 'help-circle'
      },
      {
        text: 'Ukáž všetky osobné dokumenty',
        actionId: 'filter_category',
        payload: 'personal',
        icon: 'user'
      }
    ]
  },

  // Financial documents
  'bank': {
    category: 'financial',
    actions: [
      {
        text: 'Show bank statements',
        actionId: 'filter_document_type',
        payload: 'bank_statement',
        icon: 'landmark'
      },
      {
        text: 'Add new bank document',
        actionId: 'navigate_and_suggest',
        payload: { url: '/vault', suggestion: 'bank statement', category: 'financial' },
        icon: 'plus'
      },
      {
        text: 'Show all financial documents',
        actionId: 'filter_category',
        payload: 'financial',
        icon: 'dollar-sign'
      }
    ]
  },
  'banka': {
    category: 'financial',
    actions: [
      {
        text: 'Ukáž bankové výpisy',
        actionId: 'filter_document_type',
        payload: 'bank_statement',
        icon: 'landmark'
      },
      {
        text: 'Pridaj nový bankový dokument',
        actionId: 'navigate_and_suggest',
        payload: { url: '/vault', suggestion: 'bankový výpis', category: 'financial' },
        icon: 'plus'
      },
      {
        text: 'Ukáž všetky finančné dokumenty',
        actionId: 'filter_category',
        payload: 'financial',
        icon: 'dollar-sign'
      }
    ]
  },

  // Guardians
  'guardian': {
    actions: [
      {
        text: 'Show my guardians',
        actionId: 'navigate',
        payload: '/guardians',
        icon: 'users'
      },
      {
        text: 'What is a guardian?',
        actionId: 'show_faq',
        payload: 'faq_what_is_guardian',
        icon: 'help-circle'
      },
      {
        text: 'Add new guardian',
        actionId: 'navigate_and_suggest',
        payload: { url: '/guardians', suggestion: 'add guardian' },
        icon: 'user-plus'
      }
    ]
  },
  'strazca': {
    actions: [
      {
        text: 'Ukáž mojich strážcov',
        actionId: 'navigate',
        payload: '/guardians',
        icon: 'users'
      },
      {
        text: 'Čo je to strážca?',
        actionId: 'show_faq',
        payload: 'faq_what_is_guardian',
        icon: 'help-circle'
      },
      {
        text: 'Pridaj nového strážcu',
        actionId: 'navigate_and_suggest',
        payload: { url: '/guardians', suggestion: 'pridať strážcu' },
        icon: 'user-plus'
      }
    ]
  },

  // Medical documents
  'medical': {
    category: 'medical',
    actions: [
      {
        text: 'Show medical documents',
        actionId: 'filter_category',
        payload: 'medical',
        icon: 'heart'
      },
      {
        text: 'Add medical record',
        actionId: 'navigate_and_suggest',
        payload: { url: '/vault', suggestion: 'medical record', category: 'medical' },
        icon: 'plus'
      },
      {
        text: 'Healthcare directives info',
        actionId: 'navigate',
        payload: '/legacy',
        icon: 'clipboard'
      }
    ]
  },
  'zdravotny': {
    category: 'medical',
    actions: [
      {
        text: 'Ukáž zdravotné dokumenty',
        actionId: 'filter_category',
        payload: 'medical',
        icon: 'heart'
      },
      {
        text: 'Pridaj zdravotný záznam',
        actionId: 'navigate_and_suggest',
        payload: { url: '/vault', suggestion: 'zdravotný záznam', category: 'medical' },
        icon: 'plus'
      },
      {
        text: 'Info o zdravotných direktívach',
        actionId: 'navigate',
        payload: '/legacy',
        icon: 'clipboard'
      }
    ]
  },

  // Expiring documents
  'expiring': {
    actions: [
      {
        text: 'Show expiring documents',
        actionId: 'filter_expiring',
        payload: { days: 30 },
        icon: 'clock'
      },
      {
        text: 'How to handle expiring documents?',
        actionId: 'show_faq',
        payload: 'faq_expiring_documents',
        icon: 'help-circle'
      }
    ]
  },
  'expiruje': {
    actions: [
      {
        text: 'Ukáž expirujúce dokumenty',
        actionId: 'filter_expiring',
        payload: { days: 30 },
        icon: 'clock'
      },
      {
        text: 'Ako riešiť expirujúce dokumenty?',
        actionId: 'show_faq',
        payload: 'faq_expiring_documents',
        icon: 'help-circle'
      }
    ]
  },

  // Upload/Add documents
  'upload': {
    actions: [
      {
        text: 'Upload new document',
        actionId: 'navigate',
        payload: '/vault',
        icon: 'upload'
      },
      {
        text: 'How to scan documents?',
        actionId: 'show_faq',
        payload: 'faq_how_to_scan',
        icon: 'help-circle'
      }
    ]
  },
  'pridat': {
    actions: [
      {
        text: 'Pridať nový dokument',
        actionId: 'navigate',
        payload: '/vault',
        icon: 'upload'
      },
      {
        text: 'Ako skenovať dokumenty?',
        actionId: 'show_faq',
        payload: 'faq_how_to_scan',
        icon: 'help-circle'
      }
    ]
  }
};

// Helper function to find matching dictionary entries
export const findSofiaActions = (searchQuery: string): SofiaAction[] => {
  const query = searchQuery.toLowerCase().trim();
  const matchedActions: SofiaAction[] = [];

  // Find all matching keywords
  Object.keys(searchDictionary).forEach(keyword => {
    if (query.includes(keyword)) {
      const entry = searchDictionary[keyword];
      matchedActions.push(...entry.actions);
    }
  });

  // Remove duplicates based on actionId and payload
  const uniqueActions = matchedActions.filter((action, index, self) => 
    index === self.findIndex(a => 
      a.actionId === action.actionId && 
      JSON.stringify(a.payload) === JSON.stringify(action.payload)
    )
  );

  // Limit to 3 most relevant suggestions
  return uniqueActions.slice(0, 3);
};

// FAQ responses that don't require OpenAI
export const faqResponses: Record<string, string> = {
  'faq_insurance_importance': `Insurance policies are crucial for protecting your family's financial future. They provide security in case of unexpected events and help ensure your loved ones are taken care of. I recommend storing all your insurance documents here for easy access by your guardians.`,
  
  'faq_will_importance': `A will is one of the most important documents you can create. It ensures your wishes are carried out and helps prevent family conflicts. The Legacy Planning section will guide you through creating essential legal documents when it becomes available.`,
  
  'faq_what_is_guardian': `A guardian in LegacyGuard is someone you trust completely - a person who would protect your family's interests just as you would. They're the extension of your care and wisdom when your loved ones need guidance most. Think of someone who knows your values and would act with the same care you would.`,
  
  'faq_passport_renewal': `Passport renewal typically requires: 1) Current passport, 2) New passport photos, 3) Completed application form, 4) Renewal fee. Processing usually takes 4-6 weeks. I recommend storing your passport details and renewal dates here so you get reminded before expiration.`,
  
  'faq_expiring_documents': `Expiring documents need attention! I suggest: 1) Set reminders 60-90 days before expiration, 2) Gather required renewal documents early, 3) Update your records here once renewed. Your guardians will also be able to help manage these important dates.`,
  
  'faq_how_to_scan': `Our AI-powered scanner makes it easy! Simply click "AI Scan Mode" in the Vault, upload your document, and our system will automatically extract key information and categorize it for you. This saves time and ensures nothing important is missed.`
};