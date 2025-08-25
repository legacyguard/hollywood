import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon-library';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import {
  findSofiaActions,
  generateDynamicSuggestions,
  hasDocumentBasedSuggestions,
  type SofiaAction
} from '@/lib/sofia-search-dictionary';
import { toast } from 'sonner';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSofiaAction?: (action: SofiaAction) => void;
}

interface SearchResult {
  id: string;
  type: 'document' | 'guardian' | 'action';
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({ isOpen, onClose, onSofiaAction }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [sofiaActions, setSofiaActions] = useState<SofiaAction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseWithClerk();
  const navigate = useNavigate();

  // Quick actions memoized to prevent unnecessary re-renders
  const quickActions: SearchResult[] = useMemo(() => [
    {
      id: 'upload-document',
      type: 'action',
      title: 'Upload Document',
      subtitle: 'Add new document to vault',
      icon: 'upload',
      action: () => {
        navigate('/vault');
        onClose();
        toast.success('Navigate to Vault to upload documents');
      }
    },
    {
      id: 'add-guardian',
      type: 'action',
      title: 'Add Guardian',
      subtitle: 'Add trusted person to your circle',
      icon: 'user-plus',
      action: () => {
        navigate('/guardians');
        onClose();
        toast.success('Navigate to Guardians to add new guardian');
      }
    },
    {
      id: 'dashboard',
      type: 'action',
      title: 'Dashboard',
      subtitle: 'View your progress overview',
      icon: 'home',
      action: () => {
        navigate('/');
        onClose();
      }
    },
    {
      id: 'legacy-planning',
      type: 'action',
      title: 'Legacy Planning',
      subtitle: 'Plan your digital legacy',
      icon: 'heart',
      action: () => {
        navigate('/legacy');
        onClose();
      }
    }
  ], [navigate, onClose]);

  const searchDocuments = useCallback(async (searchQuery: string) => {
    if (!userId || !searchQuery.trim()) return [];

    try {
      const supabase = await createSupabaseClient();

      const { data, error } = await supabase
        .from('documents')
        .select('id, title, file_name, document_type, category')
        .eq('user_id', userId)
        .or(`title.ilike.%${searchQuery}%,file_name.ilike.%${searchQuery}%,document_type.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) throw error;

      return (data || []).map(doc => ({
        id: doc.id,
        type: 'document' as const,
        title: doc.title || doc.file_name,
        subtitle: `${doc.document_type} • ${doc.category}`,
        icon: 'file-text',
        action: () => {
          navigate('/vault');
          onClose();
          toast.success(`Found document: ${doc.title || doc.file_name}`);
        }
      }));
    } catch (error) {
      console.error('Document search error:', error);
      return [];
    }
  }, [userId, createSupabaseClient, navigate, onClose]);

  const searchGuardians = useCallback(async (searchQuery: string) => {
    if (!userId || !searchQuery.trim()) return [];

    try {
      const supabase = await createSupabaseClient();

      const { data, error } = await supabase
        .from('guardians')
        .select('id, name, email, relationship')
        .eq('user_id', userId)
        .eq('is_active', true)
        .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,relationship.ilike.%${searchQuery}%`)
        .limit(3);

      if (error) throw error;

      return (data || []).map(guardian => ({
        id: guardian.id,
        type: 'guardian' as const,
        title: guardian.name,
        subtitle: `${guardian.email} • ${guardian.relationship || 'Guardian'}`,
        icon: 'users',
        action: () => {
          navigate('/guardians');
          onClose();
          toast.success(`Found guardian: ${guardian.name}`);
        }
      }));
    } catch (error) {
      console.error('Guardian search error:', error);
      return [];
    }
  }, [userId, createSupabaseClient, navigate, onClose]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(quickActions);
      setSofiaActions([]);
      return;
    }

    setIsSearching(true);

    try {
      // Filter quick actions
      const filteredActions = quickActions.filter(action =>
        action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Search documents and guardians
      const [documents, guardians] = await Promise.all([
        searchDocuments(searchQuery),
        searchGuardians(searchQuery)
      ]);

      // Find Sofia intelligent suggestions (static dictionary)
      const staticSuggestions = findSofiaActions(searchQuery);

      // Generate dynamic suggestions based on user's document library
      const userDocuments = documents.map(doc => ({
        id: doc.id,
        file_name: doc.title || '',
        title: doc.title,
        category: doc.subtitle?.replace('Document • ', ''),
        document_type: doc.subtitle?.replace('Document • ', ''),
        tags: [],
        created_at: new Date().toISOString()
      }));

      const dynamicSuggestions = generateDynamicSuggestions(searchQuery, userDocuments);

      // Combine static and dynamic suggestions, prioritizing dynamic ones
      const allSuggestions = [
        ...dynamicSuggestions,
        ...staticSuggestions.filter(staticSuggestion =>
          !dynamicSuggestions.some(dynamic => dynamic.actionId === staticSuggestion.actionId)
        )
      ].slice(0, 6); // Limit total suggestions

      setResults([...filteredActions, ...documents, ...guardians]);
      setSofiaActions(allSuggestions);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [quickActions, searchDocuments, searchGuardians]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, performSearch]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setResults(quickActions);
    }
  }, [isOpen, quickActions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      results[selectedIndex].action();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Icon name="search" className="w-5 h-5" />
            Quick Search
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, guardians, or quick actions..."
            className="w-full"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Icon name="loader" className="w-5 h-5 animate-spin mr-2" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1 pb-4">
              {results.map((result, index) => (
                <Button
                  key={result.id}
                  variant={index === selectedIndex ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-4 mx-4"
                  onClick={result.action}
                >
                  <Icon name={result.icon as never} className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Icon name="search-x" className="w-8 h-8 mb-2" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for documents, guardians, or actions</p>
            </div>
          ) : null}
        </div>

        {/* Sofia Intelligent Suggestions */}
        {sofiaActions.length > 0 && (
          <div className="border-t bg-primary/5">
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="sparkles" className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">
                  {hasDocumentBasedSuggestions(query, documents.map(d => ({
                    id: d.id,
                    file_name: d.title || '',
                    title: d.title,
                    category: d.subtitle?.replace('Document • ', ''),
                    document_type: d.subtitle?.replace('Document • ', ''),
                    tags: [],
                    created_at: new Date().toISOString()
                  }))) ? 'Sofia learned from your documents:' : 'Ask Sofia Assistant:'}
                </span>
              </div>

              <div className="space-y-2">
                {sofiaActions.map((action, index) => {
                  const isDynamic = ['filter_learned_category', 'open_specific_document', 'create_smart_filter'].includes(action.actionId);

                  return (
                    <Button
                      key={`sofia-${index}`}
                      variant="outline"
                      className={`w-full justify-start h-auto p-3 ${
                        isDynamic
                          ? 'border-green-200 hover:bg-green-50 hover:border-green-300 bg-green-50/50'
                          : 'border-primary/20 hover:bg-primary/10 hover:border-primary/30'
                      }`}
                      onClick={() => {
                        if (onSofiaAction) {
                          onSofiaAction(action);
                          onClose();
                        }
                      }}
                    >
                      <div className="flex items-center">
                        {isDynamic && (
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        )}
                        <Icon
                          name={action.icon || 'message-circle'}
                          className={`w-4 h-4 mr-3 flex-shrink-0 ${
                            isDynamic ? 'text-green-600' : 'text-primary'
                          }`}
                        />
                        <span className={`font-medium ${
                          isDynamic ? 'text-green-700' : 'text-primary'
                        }`}>
                          {action.text}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground mt-3 text-center">
                {hasDocumentBasedSuggestions(query, documents.map(d => ({
                  id: d.id,
                  file_name: d.title || '',
                  title: d.title,
                  category: d.subtitle?.replace('Document • ', ''),
                  document_type: d.subtitle?.replace('Document • ', ''),
                  tags: [],
                  created_at: new Date().toISOString()
                }))) ? (
                  <>
                    <Icon name="zap" className="w-3 h-3 inline mr-1" />
                    Sofia remembers your document patterns
                  </>
                ) : (
                  'Sofia will help you find exactly what you need'
                )}
              </p>
            </div>
          </div>
        )}

        <div className="px-6 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Use ↑ ↓ to navigate • Enter to select</span>
            <span>Press Esc to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
