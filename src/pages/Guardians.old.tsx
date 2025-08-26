import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import type { Guardian, CreateGuardianRequest } from '@/types/guardian';
import { GUARDIAN_RELATIONSHIPS } from '@/types/guardian';

export default function GuardiansPage() {
  usePageTitle('My Guardians');
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseWithClerk();

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
    notes: '',
    // Family Shield Protocol permissions - default to false
    can_trigger_emergency: false,
    can_access_health_docs: false,
    can_access_financial_docs: false,
    is_child_guardian: false,
    is_will_executor: false,
    emergency_contact_priority: 1,
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
          notes: formData.notes?.trim() || null,
          // Family Shield Protocol permissions
          can_trigger_emergency: formData.can_trigger_emergency || false,
          can_access_health_docs: formData.can_access_health_docs || false,
          can_access_financial_docs:
            formData.can_access_financial_docs || false,
          is_child_guardian: formData.is_child_guardian || false,
          is_will_executor: formData.is_will_executor || false,
          emergency_contact_priority: formData.emergency_contact_priority || 1,
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
        notes: '',
        // Family Shield Protocol permissions - reset to defaults
        can_trigger_emergency: false,
        can_access_health_docs: false,
        can_access_financial_docs: false,
        is_child_guardian: false,
        is_will_executor: false,
        emergency_contact_priority: 1,
      });

      setIsDialogOpen(false);
      toast.success(`Guardian ${formData.name} was successfully added!`);
    } catch (error) {
      console.error('Error adding guardian:', error);
      toast.error('Failed to add guardian. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  // Handle form input changes
  const handleInputChange = <K extends keyof CreateGuardianRequest>(
    field: K,
    value: CreateGuardianRequest[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <DashboardLayout>
      <div className='min-h-screen bg-background'>
        {/* Header */}
        <header className='bg-card border-b border-card-border'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-8'>
            <div className='flex items-start justify-between'>
              <div>
                <FadeIn duration={0.5} delay={0.2}>
                  <h1 className='text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3'>
                    My Guardians
                  </h1>
                </FadeIn>
                <FadeIn duration={0.5} delay={0.4}>
                  <p
                    className='text-lg leading-relaxed max-w-2xl mb-4'
                    style={{ color: 'hsl(var(--muted-text))' }}
                  >
                    Your Circle of Trust. These trusted people can help your
                    family access important information when needed.
                  </p>
                  <p className='text-sm text-muted-foreground/80 max-w-2xl italic'>
                    💙 Just like the key you engraved during onboarding, these
                    guardians represent the people you trust most completely -
                    those who understand your heart and will honor your wishes.
                  </p>
                </FadeIn>
              </div>
              <FadeIn duration={0.5} delay={0.6}>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className='bg-primary hover:bg-primary-hover text-primary-foreground shadow-md'
                      size='lg'
                    >
                      <Icon name='add' className='w-5 h-5 mr-2' />
                      Add Guardian
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[600px]'>
                    <DialogHeader>
                      <DialogTitle>Add New Guardian</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='name'>Full Name *</Label>
                          <Input
                            id='name'
                            value={formData.name}
                            onChange={e =>
                              handleInputChange('name', e.target.value)
                            }
                            placeholder='Enter full name'
                            required
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='email'>Email Address *</Label>
                          <Input
                            id='email'
                            type='email'
                            value={formData.email}
                            onChange={e =>
                              handleInputChange('email', e.target.value)
                            }
                            placeholder='guardian@example.com'
                            required
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='phone'>Phone Number</Label>
                          <Input
                            id='phone'
                            type='tel'
                            value={formData.phone}
                            onChange={e =>
                              handleInputChange('phone', e.target.value)
                            }
                            placeholder='+1 (555) 123-4567'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='relationship'>Relationship</Label>
                          <Select
                            value={formData.relationship}
                            onValueChange={value =>
                              handleInputChange('relationship', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select relationship' />
                            </SelectTrigger>
                            <SelectContent>
                              {GUARDIAN_RELATIONSHIPS.map(rel => (
                                <SelectItem key={rel.value} value={rel.value}>
                                  {rel.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='notes'>Notes (Optional)</Label>
                        <Textarea
                          id='notes'
                          value={formData.notes}
                          onChange={e =>
                            handleInputChange('notes', e.target.value)
                          }
                          placeholder='Any additional information about this guardian...'
                          rows={3}
                        />
                      </div>

                      {/* Family Shield Protocol Permissions */}
                      <div className='space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5'>
                        <div className='flex items-center gap-2 mb-4'>
                          <Icon
                            name='shield-check'
                            className='w-5 h-5 text-primary'
                          />
                          <h3 className='text-lg font-semibold text-primary'>
                            Family Shield Protocol Permissions
                          </h3>
                        </div>
                        <p className='text-sm text-muted-foreground mb-4'>
                          Configure what this Guardian can access and do in
                          emergency situations.
                        </p>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='flex items-center justify-between space-x-2'>
                            <div className='space-y-0.5'>
                              <Label
                                htmlFor='can_trigger_emergency'
                                className='text-sm font-medium'
                              >
                                Can Trigger Emergency Protocol
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                This person can activate the Family Shield
                                Protocol
                              </p>
                            </div>
                            <Switch
                              id='can_trigger_emergency'
                              checked={formData.can_trigger_emergency || false}
                              onCheckedChange={value =>
                                handleInputChange(
                                  'can_trigger_emergency',
                                  value
                                )
                              }
                            />
                          </div>

                          <div className='flex items-center justify-between space-x-2'>
                            <div className='space-y-0.5'>
                              <Label
                                htmlFor='can_access_health_docs'
                                className='text-sm font-medium'
                              >
                                Health Information Access
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                Access to medical records and health documents
                              </p>
                            </div>
                            <Switch
                              id='can_access_health_docs'
                              checked={formData.can_access_health_docs || false}
                              onCheckedChange={value =>
                                handleInputChange(
                                  'can_access_health_docs',
                                  value
                                )
                              }
                            />
                          </div>

                          <div className='flex items-center justify-between space-x-2'>
                            <div className='space-y-0.5'>
                              <Label
                                htmlFor='can_access_financial_docs'
                                className='text-sm font-medium'
                              >
                                Financial Information Access
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                Access to bank accounts and financial documents
                              </p>
                            </div>
                            <Switch
                              id='can_access_financial_docs'
                              checked={
                                formData.can_access_financial_docs || false
                              }
                              onCheckedChange={value =>
                                handleInputChange(
                                  'can_access_financial_docs',
                                  value
                                )
                              }
                            />
                          </div>

                          <div className='flex items-center justify-between space-x-2'>
                            <div className='space-y-0.5'>
                              <Label
                                htmlFor='is_child_guardian'
                                className='text-sm font-medium'
                              >
                                Child Guardian
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                Can care for and make decisions for children
                              </p>
                            </div>
                            <Switch
                              id='is_child_guardian'
                              checked={formData.is_child_guardian || false}
                              onCheckedChange={value =>
                                handleInputChange('is_child_guardian', value)
                              }
                            />
                          </div>

                          <div className='flex items-center justify-between space-x-2'>
                            <div className='space-y-0.5'>
                              <Label
                                htmlFor='is_will_executor'
                                className='text-sm font-medium'
                              >
                                Will Executor
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                Responsible for executing the last will
                              </p>
                            </div>
                            <Switch
                              id='is_will_executor'
                              checked={formData.is_will_executor || false}
                              onCheckedChange={value =>
                                handleInputChange('is_will_executor', value)
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='emergency_contact_priority'>
                              Emergency Contact Priority
                            </Label>
                            <Input
                              id='emergency_contact_priority'
                              type='number'
                              min='1'
                              max='10'
                              value={formData.emergency_contact_priority}
                              onChange={e =>
                                handleInputChange(
                                  'emergency_contact_priority',
                                  parseInt(e.target.value) || 1
                                )
                              }
                              placeholder='1 = highest priority'
                            />
                            <p className='text-xs text-muted-foreground'>
                              1 = highest priority, higher numbers = lower
                              priority
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-end gap-3 pt-4'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type='submit' disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Icon
                                name='loader'
                                className='w-4 h-4 mr-2 animate-spin'
                              />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Icon name='add' className='w-4 h-4 mr-2' />
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
        <main className='max-w-7xl mx-auto px-6 lg:px-8 py-12'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Icon
                name='loader'
                className='w-8 h-8 animate-spin text-primary'
              />
              <span className='ml-3 text-muted-foreground'>
                Loading guardians...
              </span>
            </div>
          ) : guardians.length === 0 ? (
            <FadeIn duration={0.5} delay={0.8}>
              <Card className='p-16 text-center bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20'>
                <div className='relative mb-8'>
                  {/* Decorative background circle */}
                  <div className='w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center relative'>
                    <div className='w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center'>
                      <Icon name='users' className='w-8 h-8 text-primary' />
                    </div>
                    {/* Small decorative dots */}
                    <div className='absolute -top-2 -right-2 w-4 h-4 bg-primary/30 rounded-full'></div>
                    <div className='absolute -bottom-2 -left-2 w-3 h-3 bg-primary/20 rounded-full'></div>
                  </div>
                </div>

                <h3 className='text-2xl font-bold mb-4 text-card-foreground'>
                  You don't have any guardians yet
                </h3>
                <p className='text-muted-foreground mb-6 max-w-lg mx-auto text-lg leading-relaxed'>
                  A guardian is a trusted person who can help your loved ones
                  when they need it most. Let's add your first guardian to start
                  building your Circle of Trust.
                </p>
                <div className='bg-primary/10 rounded-lg p-4 mb-8 max-w-2xl mx-auto border border-primary/20'>
                  <p className='text-sm text-primary/80 italic leading-relaxed'>
                    🤗 Think of someone who knows your values and would act with
                    the same care you would. This could be a family member,
                    close friend, or trusted advisor who has always been there
                    for you. Your guardians become your family's guides when you
                    cannot be there yourself.
                  </p>
                </div>

                {/* Benefits list */}
                <div className='flex flex-col sm:flex-row gap-6 mb-10 max-w-2xl mx-auto'>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0'>
                      <Icon
                        name='shield-check'
                        className='w-4 h-4 text-green-600'
                      />
                    </div>
                    <span className='text-muted-foreground'>
                      Trusted emergency contacts
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0'>
                      <Icon name='heart' className='w-4 h-4 text-blue-600' />
                    </div>
                    <span className='text-muted-foreground'>
                      Peace of mind for family
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0'>
                      <Icon name='clock' className='w-4 h-4 text-purple-600' />
                    </div>
                    <span className='text-muted-foreground'>
                      Always available help
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsDialogOpen(true)}
                  size='lg'
                  className='bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200'
                >
                  <Icon name='add' className='w-5 h-5 mr-2' />
                  Add Your First Guardian
                </Button>

                <p className='text-xs text-muted-foreground mt-6 max-w-md mx-auto'>
                  Don't worry, you can always add more guardians later and edit
                  their information anytime.
                </p>
              </Card>
            </FadeIn>
          ) : (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {guardians.map((guardian, index) => (
                <FadeIn
                  key={guardian.id}
                  duration={0.5}
                  delay={0.8 + index * 0.1}
                >
                  <Card className='p-6 hover:shadow-md transition-shadow duration-200'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center relative'>
                          <Icon name='user' className='w-6 h-6 text-primary' />
                          {guardian.can_trigger_emergency && (
                            <div className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center'>
                              <Icon
                                name='shield-check'
                                className='w-2.5 h-2.5 text-white'
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <h3 className='font-semibold text-lg'>
                              {guardian.name}
                            </h3>
                            {guardian.emergency_contact_priority &&
                              guardian.emergency_contact_priority <= 3 && (
                                <span className='px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium'>
                                  Priority {guardian.emergency_contact_priority}
                                </span>
                              )}
                          </div>
                          {guardian.relationship && (
                            <span className='text-sm text-muted-foreground capitalize'>
                              {guardian.relationship.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' disabled>
                          <Icon name='pencil' className='w-4 h-4' />
                        </Button>
                        <Button size='sm' variant='outline' disabled>
                          <Icon name='trash' className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center gap-3 text-sm'>
                        <Icon
                          name='mail'
                          className='w-4 h-4 text-muted-foreground'
                        />
                        <span className='text-muted-foreground'>
                          {guardian.email}
                        </span>
                      </div>
                      {guardian.phone && (
                        <div className='flex items-center gap-3 text-sm'>
                          <Icon
                            name='phone'
                            className='w-4 h-4 text-muted-foreground'
                          />
                          <span className='text-muted-foreground'>
                            {guardian.phone}
                          </span>
                        </div>
                      )}
                      {guardian.notes && (
                        <div className='pt-3 border-t border-border'>
                          <p className='text-sm text-muted-foreground'>
                            {guardian.notes}
                          </p>
                        </div>
                      )}

                      {/* Family Shield Protocol Permissions */}
                      <div className='pt-3 border-t border-border'>
                        <h4 className='text-sm font-medium text-primary mb-2 flex items-center gap-1'>
                          <Icon name='shield-check' className='w-4 h-4' />
                          Shield Permissions
                        </h4>
                        <div className='flex flex-wrap gap-1'>
                          {guardian.can_trigger_emergency && (
                            <span className='px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full'>
                              Emergency Trigger
                            </span>
                          )}
                          {guardian.can_access_health_docs && (
                            <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full'>
                              Health Access
                            </span>
                          )}
                          {guardian.can_access_financial_docs && (
                            <span className='px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full'>
                              Financial Access
                            </span>
                          )}
                          {guardian.is_child_guardian && (
                            <span className='px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full'>
                              Child Guardian
                            </span>
                          )}
                          {guardian.is_will_executor && (
                            <span className='px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full'>
                              Will Executor
                            </span>
                          )}
                          {!guardian.can_trigger_emergency &&
                            !guardian.can_access_health_docs &&
                            !guardian.can_access_financial_docs &&
                            !guardian.is_child_guardian &&
                            !guardian.is_will_executor && (
                              <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'>
                                Basic Contact Only
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className='mt-4 pt-4 border-t border-border'>
                      <p className='text-xs text-muted-foreground'>
                        Added{' '}
                        {new Date(guardian.created_at).toLocaleDateString()}
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
              <Card className='mt-12 p-8 bg-primary/5 border-primary/20'>
                <div className='flex items-start gap-4'>
                  <Icon
                    name='info'
                    className='w-6 h-6 text-primary flex-shrink-0 mt-1'
                  />
                  <div>
                    <h4 className='font-semibold text-primary mb-2'>
                      The Trust Behind Your Guardians
                    </h4>
                    <p className='text-muted-foreground mb-4'>
                      Your guardians represent the deepest level of trust -
                      people who would protect your family's interests just as
                      you would. They're not just emergency contacts; they're
                      the extension of your care and wisdom when your loved ones
                      need guidance most.
                    </p>
                    <p className='text-sm text-muted-foreground/80 italic mb-3'>
                      ✨ Every guardian you add strengthens your family's safety
                      net, giving you peace of mind that someone who truly
                      understands your values will be there to help.
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      <strong>Coming soon:</strong> Advanced permissions,
                      document sharing, and emergency access features.
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
