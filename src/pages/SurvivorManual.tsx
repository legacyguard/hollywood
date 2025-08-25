import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import { SurvivorManualEntry, CreateManualEntryRequest, ManualEntryType, Guardian } from '@/types/guardian';

const ENTRY_TYPES: { value: ManualEntryType; label: string; description: string; icon: string; color: string }[] = [
  {
    value: 'important_contacts',
    label: 'Important Contacts',
    description: 'Key people your family should contact',
    icon: 'phone',
    color: 'blue'
  },
  {
    value: 'financial_access',
    label: 'Financial Access',
    description: 'Bank accounts, passwords, and financial information',
    icon: 'credit-card',
    color: 'green'
  },
  {
    value: 'property_management',
    label: 'Property Management',
    description: 'What to do with house, car, and other assets',
    icon: 'home',
    color: 'purple'
  },
  {
    value: 'funeral_wishes',
    label: 'Final Wishes',
    description: 'Your preferences for funeral and memorial',
    icon: 'heart',
    color: 'pink'
  },
  {
    value: 'document_locations',
    label: 'Document Locations',
    description: 'Where to find important papers and documents',
    icon: 'file-text',
    color: 'amber'
  },
  {
    value: 'child_care_instructions',
    label: 'Child Care Instructions',
    description: 'Specific guidance for caring for your children',
    icon: 'baby',
    color: 'cyan'
  },
  {
    value: 'emergency_procedure',
    label: 'Emergency Procedures',
    description: 'Step-by-step emergency response instructions',
    icon: 'alert-triangle',
    color: 'red'
  },
  {
    value: 'custom_instruction',
    label: 'Custom Instructions',
    description: 'Any other important guidance for your family',
    icon: 'edit',
    color: 'gray'
  }
];

export default function SurvivorManualPage() {
  usePageTitle('Family Guidance Manual');
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseWithClerk();
  
  const [entries, setEntries] = useState<SurvivorManualEntry[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SurvivorManualEntry | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateManualEntryRequest>({
    entry_type: 'important_contacts',
    title: '',
    content: '',
    priority: 1,
    tags: [],
    related_document_ids: []
  });

  // Generate initial entries based on user's guardians and documents
  const generateInitialEntries = useCallback(async (supabase: unknown, userGuardians: Guardian[]) => {
    const initialEntries: Omit<SurvivorManualEntry, 'id' | 'created_at' | 'updated_at'>[] = [];

    // Important Contacts - auto-filled with guardians
    if (userGuardians.length > 0) {
      const contactsList = userGuardians.map(g => `${g.name} (${g.relationship}): ${g.email}${g.phone ? `, ${g.phone}` : ''}`).join('\n');
      initialEntries.push({
        user_id: userId!,
        entry_type: 'important_contacts',
        title: 'Emergency Contacts',
        content: `Key people to contact in case of emergency:\n\n${contactsList}`,
        is_completed: false,
        priority: 1,
        tags: ['contacts', 'guardians'],
        related_document_ids: [],
        is_auto_generated: true
      });
    }

    // Financial Access - template
    initialEntries.push({
      user_id: userId!,
      entry_type: 'financial_access',
      title: 'Bank Account Access',
      content: 'Location of financial documents:\n\n• Bank statements: [Location]\n• Online banking passwords: [Secure location]\n• Financial advisor contact: [Name and phone]\n• Investment accounts: [Details]',
      is_completed: false,
      priority: 2,
      tags: ['finances', 'banks'],
      related_document_ids: [],
      is_auto_generated: true
    });

    // Document Locations - template
    initialEntries.push({
      user_id: userId!,
      entry_type: 'document_locations',
      title: 'Important Document Locations',
      content: 'Where to find crucial documents:\n\n• Will and testament: [Location]\n• Insurance policies: [Location]\n• Property deeds: [Location]\n• Birth certificates: [Location]\n• Passport and ID: [Location]',
      is_completed: false,
      priority: 3,
      tags: ['documents', 'legal'],
      related_document_ids: [],
      is_auto_generated: true
    });

    try {
      const { data, error } = await supabase
        .from('survivor_manual_entries')
        .insert(initialEntries)
        .select();

      if (error) throw error;

      setEntries(data || []);
      toast.success('Initial survivor manual created! Please review and customize the entries.');
    } catch (error) {
      console.error('Error generating initial entries:', error);
    }
  }, [userId]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const supabase = await createSupabaseClient();
      
      // Fetch manual entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('survivor_manual_entries')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: true });

      if (entriesError) throw entriesError;

      // Fetch guardians for auto-suggestions
      const { data: guardiansData, error: guardiansError } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (guardiansError) throw guardiansError;

      setEntries(entriesData || []);
      setGuardians(guardiansData || []);

      // Auto-generate entries if none exist
      if (!entriesData || entriesData.length === 0) {
        await generateInitialEntries(supabase, guardiansData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load survivor manual');
    } finally {
      setIsLoading(false);
    }
  }, [userId, createSupabaseClient, generateInitialEntries]);



  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Validation
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = await createSupabaseClient();
      
      if (editingEntry) {
        // Update existing entry
        const { data, error } = await supabase
          .from('survivor_manual_entries')
          .update({
            entry_type: formData.entry_type,
            title: formData.title.trim(),
            content: formData.content.trim(),
            priority: formData.priority || 1,
            tags: formData.tags || []
          })
          .eq('id', editingEntry.id)
          .select()
          .single();

        if (error) throw error;

        setEntries(prev => prev.map(entry => 
          entry.id === editingEntry.id ? data : entry
        ));
        toast.success('Manual entry updated successfully!');
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('survivor_manual_entries')
          .insert({
            user_id: userId,
            entry_type: formData.entry_type,
            title: formData.title.trim(),
            content: formData.content.trim(),
            priority: formData.priority || 1,
            tags: formData.tags || [],
            is_auto_generated: false
          })
          .select()
          .single();

        if (error) throw error;

        setEntries(prev => [...prev, data].sort((a, b) => a.priority - b.priority));
        toast.success('Manual entry added successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      entry_type: 'important_contacts',
      title: '',
      content: '',
      priority: 1,
      tags: [],
      related_document_ids: []
    });
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  // Handle edit
  const handleEdit = (entry: SurvivorManualEntry) => {
    setFormData({
      entry_type: entry.entry_type,
      title: entry.title,
      content: entry.content,
      priority: entry.priority,
      tags: entry.tags,
      related_document_ids: entry.related_document_ids
    });
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  // Toggle completion
  const toggleCompletion = async (entry: SurvivorManualEntry) => {
    try {
      const supabase = await createSupabaseClient();
      
      const { data, error } = await supabase
        .from('survivor_manual_entries')
        .update({ is_completed: !entry.is_completed })
        .eq('id', entry.id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(e => e.id === entry.id ? data : e));
      toast.success(`Entry marked as ${data.is_completed ? 'completed' : 'incomplete'}`);
    } catch (error) {
      console.error('Error updating completion:', error);
      toast.error('Failed to update entry');
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CreateManualEntryRequest, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get completion percentage
  const completionPercentage = entries.length > 0 ? 
    Math.round((entries.filter(e => e.is_completed).length / entries.length) * 100) : 0;

  // Group entries by type
  const entriesByType = entries.reduce((acc, entry) => {
    if (!acc[entry.entry_type]) {
      acc[entry.entry_type] = [];
    }
    acc[entry.entry_type].push(entry);
    return acc;
  }, {} as Record<ManualEntryType, SurvivorManualEntry[]>);

  const getTypeConfig = (type: ManualEntryType) => 
    ENTRY_TYPES.find(t => t.value === type) || ENTRY_TYPES[0];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Icon name="loader" className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading survivor manual...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-card-border">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-start justify-between">
              <div>
                <FadeIn duration={0.5} delay={0.2}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="book-open" className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold font-heading text-card-foreground">
                      Family Guidance Manual
                    </h1>
                  </div>
                </FadeIn>
                <FadeIn duration={0.5} delay={0.4}>
                  <p className="text-lg leading-relaxed max-w-3xl mb-4" style={{ color: 'hsl(var(--muted-text))' }}>
                    A step-by-step guide for your loved ones. Sofia is helping you create a comprehensive manual 
                    that will give your family clear directions when they need them most.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{completionPercentage}% Complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="check-circle" className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">
                        {entries.filter(e => e.is_completed).length} of {entries.length} entries completed
                      </span>
                    </div>
                  </div>
                </FadeIn>
              </div>
              <FadeIn duration={0.5} delay={0.6}>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-md" 
                      size="lg"
                      onClick={() => setEditingEntry(null)}
                    >
                      <Icon name="plus" className="w-5 h-5 mr-2" />
                      Add Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingEntry ? 'Edit Manual Entry' : 'Add New Manual Entry'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="entry_type">Category</Label>
                          <Select 
                            value={formData.entry_type} 
                            onValueChange={(value) => handleInputChange('entry_type', value as ManualEntryType)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ENTRY_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon name={type.icon as never} className="w-4 h-4" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority (1 = highest)</Label>
                          <Input
                            id="priority"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.priority}
                            onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 1)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="e.g., Contact the family lawyer"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Instructions *</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                          placeholder="Provide detailed, step-by-step instructions..."
                          rows={6}
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetForm}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Icon name="loader" className="w-4 h-4 mr-2 animate-spin" />
                              {editingEntry ? 'Updating...' : 'Adding...'}
                            </>
                          ) : (
                            <>
                              <Icon name="save" className="w-4 h-4 mr-2" />
                              {editingEntry ? 'Update Entry' : 'Add Entry'}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </FadeIn>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          {entries.length === 0 ? (
            <FadeIn duration={0.5} delay={0.8}>
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Icon name="book-open" className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Creating Your Family Guidance Manual</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Sofia is preparing your personalized manual based on your guardians and documents. 
                  This will give your family clear, step-by-step guidance when they need it most.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Icon name="plus" className="w-4 h-4 mr-2" />
                  Start Creating Manual
                </Button>
              </Card>
            </FadeIn>
          ) : (
            <div className="space-y-8">
              {/* Progress Overview */}
              <FadeIn duration={0.5} delay={0.8}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Manual Progress</h3>
                    <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {completionPercentage === 100 
                      ? 'Congratulations! Your survival manual is complete. Your family will have clear guidance when they need it.'
                      : `Complete ${entries.filter(e => !e.is_completed).length} more entries to finish your manual.`
                    }
                  </p>
                </Card>
              </FadeIn>

              {/* Entries by Category */}
              {ENTRY_TYPES.map((typeConfig, typeIndex) => {
                const typeEntries = entriesByType[typeConfig.value] || [];
                if (typeEntries.length === 0) return null;

                return (
                  <FadeIn key={typeConfig.value} duration={0.5} delay={1.0 + typeIndex * 0.1}>
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 bg-${typeConfig.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon name={typeConfig.icon as never} className={`w-5 h-5 text-${typeConfig.color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{typeConfig.label}</h3>
                          <p className="text-sm text-muted-foreground">{typeConfig.description}</p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          {typeEntries.filter(e => e.is_completed).length} of {typeEntries.length} complete
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        {typeEntries.map((entry) => (
                          <div key={entry.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={entry.is_completed}
                                  onCheckedChange={() => toggleCompletion(entry)}
                                />
                                <div className="flex-1">
                                  <h4 className={`font-medium ${entry.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {entry.title}
                                  </h4>
                                  {entry.tags.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {entry.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEdit(entry)}
                                >
                                  <Icon name="pencil" className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className={`text-sm leading-relaxed pl-7 ${entry.is_completed ? 'text-muted-foreground' : ''}`}>
                              <pre className="whitespace-pre-wrap font-sans">{entry.content}</pre>
                            </div>
                            {entry.is_auto_generated && (
                              <div className="pl-7 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Icon name="sparkles" className="w-3 h-3 mr-1" />
                                  Auto-generated by Sofia
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}