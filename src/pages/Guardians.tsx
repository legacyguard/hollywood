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
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { toast } from 'sonner';
import { useSupabaseClient } from '@/integrations/supabase/client';
import { Guardian, CreateGuardianRequest, GUARDIAN_RELATIONSHIPS } from '@/types/guardian';

export default function GuardiansPage() {
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseClient();
  
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateGuardianRequest>({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    notes: ''
  });

  // Fetch guardians
  const fetchGuardians = useCallback(async () => {
    if (!userId) return;

    try {
      const supabase = await createSupabaseClient();
      
      const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGuardians(data || []);
    } catch (error) {
      console.error('Error fetching guardians:', error);
      toast.error('Failed to load guardians');
    } finally {
      setIsLoading(false);
    }
  }, [userId, createSupabaseClient]);

  useEffect(() => {
    fetchGuardians();
  }, [userId, fetchGuardians]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = await createSupabaseClient();
      
      const { data, error } = await supabase
        .from('guardians')
        .insert({
          user_id: userId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || null,
          relationship: formData.relationship || null,
          notes: formData.notes?.trim() || null
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setGuardians(prev => [data, ...prev]);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        relationship: '',
        notes: ''
      });
      
      setIsDialogOpen(false);
      toast.success('Guardian added successfully!');
      
    } catch (error) {
      console.error('Error adding guardian:', error);
      toast.error('Failed to add guardian. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CreateGuardianRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-card-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-start justify-between">
              <div>
                <FadeIn duration={0.5} delay={0.2}>
                  <h1 className="text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3">
                    My Guardians
                  </h1>
                </FadeIn>
                <FadeIn duration={0.5} delay={0.4}>
                  <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'hsl(var(--muted-text))' }}>
                    Your Circle of Trust. These trusted people can help your family access important information when needed.
                  </p>
                </FadeIn>
              </div>
              <FadeIn duration={0.5} delay={0.6}>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-md" size="lg">
                      <Icon name="add" className="w-5 h-5 mr-2" />
                      Add Guardian
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Guardian</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="guardian@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="relationship">Relationship</Label>
                          <Select value={formData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              {GUARDIAN_RELATIONSHIPS.map((rel) => (
                                <SelectItem key={rel.value} value={rel.value}>
                                  {rel.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Any additional information about this guardian..."
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Icon name="loader" className="w-4 h-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Icon name="add" className="w-4 h-4 mr-2" />
                              Add Guardian
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
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="loader" className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading guardians...</span>
            </div>
          ) : guardians.length === 0 ? (
            <FadeIn duration={0.5} delay={0.8}>
              <Card className="p-12 text-center">
                <Icon name="users" className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">No Guardians Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start building your Circle of Trust by adding your first guardian. These are the people who can help your family in emergencies.
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Icon name="add" className="w-4 h-4 mr-2" />
                  Add Your First Guardian
                </Button>
              </Card>
            </FadeIn>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guardians.map((guardian, index) => (
                <FadeIn key={guardian.id} duration={0.5} delay={0.8 + index * 0.1}>
                  <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="user" className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{guardian.name}</h3>
                          {guardian.relationship && (
                            <span className="text-sm text-muted-foreground capitalize">
                              {guardian.relationship.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled>
                          <Icon name="pencil" className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          <Icon name="trash" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Icon name="mail" className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{guardian.email}</span>
                      </div>
                      {guardian.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Icon name="phone" className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{guardian.phone}</span>
                        </div>
                      )}
                      {guardian.notes && (
                        <div className="pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground">{guardian.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(guardian.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          )}

          {/* Information Section */}
          {guardians.length > 0 && (
            <FadeIn duration={0.5} delay={1.2}>
              <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-4">
                  <Icon name="info" className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-primary mb-2">How Guardians Work</h4>
                    <p className="text-muted-foreground mb-4">
                      Your guardians are trusted people who can help your family access important information in emergencies. 
                      Currently, this serves as your contact list for trusted individuals.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Coming soon:</strong> Advanced permissions, document sharing, and emergency access features.
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
