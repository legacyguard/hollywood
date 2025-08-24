// Sofia Action Router - Handles actions from search without OpenAI
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { SofiaAction, faqResponses } from './sofia-search-dictionary';
import { DocumentFilter } from '../contexts/DocumentFilterContext';

export interface SofiaActionContext {
  navigate: NavigateFunction;
  userId?: string;
  setDocumentFilter?: (filter: DocumentFilter) => void;
  onSofiaMessage?: (userMessage: string, sofiaResponse: string) => void;
}

export const executeSofiaAction = async (
  action: SofiaAction, 
  context: SofiaActionContext
): Promise<void> => {
  const { navigate, userId, setDocumentFilter, onSofiaMessage } = context;

  switch (action.actionId) {
    case 'navigate':
      // Simple navigation
      navigate(action.payload);
      toast.success(`Navigated to ${action.payload}`);
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `Perfect! I've taken you to ${action.payload}. What would you like to do here?`
        );
      }
      break;

    case 'filter_category': {
      // Filter documents by category
      navigate('/vault');
      
      const category = action.payload;
      const categoryDisplayName = category.charAt(0).toUpperCase() + category.slice(1);
      
      // Apply filter via context
      if (setDocumentFilter) {
        setDocumentFilter({ category });
      }
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `Perfect! I've filtered your documents to show only ${categoryDisplayName} category. ${
            category === 'insurance' ? 'These are your insurance policies and related documents.' :
            category === 'legal' ? 'These are your legal documents including contracts and official papers.' :
            category === 'financial' ? 'These are your financial documents including bank statements and tax records.' :
            category === 'medical' ? 'These are your healthcare documents and medical records.' :
            category === 'personal' ? 'These are your personal identification documents.' :
            'These are your important documents in this category.'
          }`
        );
      }
      
      toast.success(`Showing ${categoryDisplayName} documents`);
      break;
    }

    case 'filter_document_type': {
      // Filter documents by specific type
      navigate('/vault');
      
      const docType = action.payload;
      const typeDisplayName = docType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      
      // Apply document type filter
      if (setDocumentFilter) {
        setDocumentFilter({ documentType: docType });
      }
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `Perfect! I've found your ${typeDisplayName} documents. ${
            docType === 'passport' ? 'Remember to check the expiration date and renew if needed.' :
            docType === 'bank_statement' ? 'These statements help track your financial history.' :
            'These documents are important for your records.'
          }`
        );
      }
      
      toast.success(`Showing ${typeDisplayName} documents`);
      break;
    }

    case 'filter_expiring': {
      // Show documents expiring soon
      navigate('/vault');
      
      const days = action.payload.days;
      
      // Apply expiring filter
      if (setDocumentFilter) {
        setDocumentFilter({ isExpiring: true, expiringDays: days });
      }
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `Perfect! Here are documents expiring within ${days} days. I recommend setting calendar reminders for renewal dates. Your guardians can also help you keep track of important expiration dates.`
        );
      }
      
      toast.success(`Showing documents expiring in ${days} days`);
      break;
    }

    case 'navigate_and_suggest': {
      // Navigate and provide contextual suggestion
      const { url, suggestion, category: suggestedCategory } = action.payload;
      navigate(url);
      
      if (onSofiaMessage) {
        let suggestionText = '';
        if (suggestion.includes('poistka') || suggestion.includes('insurance')) {
          suggestionText = `I see you want to add insurance documents. Click "AI Scan Mode" to automatically extract policy details, or use "Manual Entry" if you prefer to enter information yourself. I can help categorize it properly.`;
        } else if (suggestion.includes('guardian') || suggestion.includes('strážcu')) {
          suggestionText = `Adding a guardian is a wise decision! Click "Add Guardian" and I'll guide you through selecting someone who truly understands your values and will honor your wishes.`;
        } else {
          suggestionText = `I've brought you here to help with "${suggestion}". Look for the relevant buttons or forms on this page, and I'm here if you need guidance.`;
        }
        
        onSofiaMessage(action.text, suggestionText);
      }
      
      toast.success(`Ready to help with: ${suggestion}`);
      break;
    }

    case 'show_faq': {
      // Display FAQ response
      const faqKey = action.payload;
      const response = faqResponses[faqKey];
      
      if (response && onSofiaMessage) {
        onSofiaMessage(action.text, response);
      } else {
        toast.error('Information not available at the moment');
      }
      break;
    }

    case 'filter_learned_category': {
      // Filter by category learned from user's documents
      navigate('/vault');
      
      const { searchTerm, category, matchedCount } = action.payload as {
        searchTerm: string;
        category: string;
        matchedCount: number;
      };
      
      if (setDocumentFilter) {
        setDocumentFilter({ category });
      }
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `Perfect! I found ${matchedCount} documents related to "${searchTerm}". I've filtered your vault to show only these relevant documents. This is exactly the kind of intelligent assistance I love providing - learning from your document patterns to help you faster!`
        );
      }
      
      toast.success(`Found ${matchedCount} documents related to "${searchTerm}"`);
      break;
    }

    case 'open_specific_document': {
      // Navigate to vault and highlight specific document
      navigate('/vault');
      
      const { documentId, documentTitle } = action.payload as {
        documentId: string;
        documentTitle: string;
      };
      
      // TODO: Implement document highlighting in vault
      // For now, just navigate and provide feedback
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `I've taken you to your vault and located "${documentTitle}". This is one of the documents I remembered from your search. Smart document discovery like this is one of my favorite features - I learn from your document library to provide instant access to what you need!`
        );
      }
      
      toast.success(`Opening "${documentTitle}"`);
      break;
    }

    case 'create_smart_filter': {
      // Create a smart filter based on learned patterns
      navigate('/vault');
      
      const { searchTerm, category, documentIds } = action.payload as {
        searchTerm: string;
        category: string;
        documentIds: string[];
      };
      
      // Apply the smart filter
      if (setDocumentFilter) {
        setDocumentFilter({ 
          category,
          searchQuery: searchTerm // Custom search filter
        });
      }
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `Brilliant! I've created a smart filter for your "${searchTerm}" documents. This filter will help you quickly find similar documents in the future. I'm constantly learning from your document patterns to make your experience more intuitive. You now have ${documentIds.length} documents in this smart collection!`
        );
      }
      
      toast.success(`Created smart filter for "${searchTerm}" documents`);
      break;
    }

    case 'celebrate_milestone': {
      // Celebrate milestone achievement
      const { milestoneName, milestoneDescription } = action.payload as {
        milestoneName: string;
        milestoneDescription: string;
      };
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `🎉 Úžasné! Práve ste odomkli míľnik "${milestoneName}"! ${milestoneDescription} Toto je skutočne krásny moment na vašej Ceste Pokoja.`
        );
      }
      
      toast.success(`🌟 Nový míľnik odomknutý: ${milestoneName}`);
      break;
    }

    case 'start_challenge': {
      // Start a 5-minute challenge
      const { challengeTitle, navigationTarget } = action.payload as {
        challengeTitle: string;
        navigationTarget: string;
      };
      
      navigate(navigationTarget);
      
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          `Spustili sme výzvu "${challengeTitle}"! Budem vás viesť krok za krokom. Nepohľadiac na to, ako sa cítite, pamätajte - každý malý krok je pokrokom k väčšej istote pre vašu rodinu.`
        );
      }
      
      toast.success(`🚀 Výzva spustená: ${challengeTitle}`);
      break;
    }

    case 'show_serenity_guidance': {
      // Provide guidance about Path of Serenity
      if (onSofiaMessage) {
        onSofiaMessage(
          action.text,
          'Cesta Pokoja nie je o percentách alebo číslach - je o tom, akú istotu a pokoj vytvárate pre svoju rodinu. Každý míľnik, ktorý odomknete, je dôkazom vašej lásky a starostlivosti. Nie je dôležité, ako rýchlo pokračujete, ale že pokračujete.'
        );
      }
      break;
    }

    default:
      console.warn('Unknown Sofia action:', action.actionId);
      toast.error('Action not recognized');
  }
};

// Helper to create user-friendly messages based on search context
export const generateContextualMessage = (searchQuery: string, action: SofiaAction): string => {
  const query = searchQuery.toLowerCase();
  
  if (query.includes('poistka') || query.includes('insurance')) {
    return `I understand you're looking for insurance-related information. Let me help you ${action.text.toLowerCase()}.`;
  }
  
  if (query.includes('pas') || query.includes('passport')) {
    return `Looking for passport information? I'll ${action.text.toLowerCase()} for you.`;
  }
  
  if (query.includes('guardian') || query.includes('strážca')) {
    return `Guardian-related question detected. Let me ${action.text.toLowerCase()}.`;
  }
  
  return `Based on your search for "${searchQuery}", I'll ${action.text.toLowerCase()}.`;
};