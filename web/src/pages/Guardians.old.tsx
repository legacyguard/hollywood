
import React, { useCallback, useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import {
  type CreateGuardianRequest,
  type Guardian,
  GUARDIAN_RELATIONSHIPS,
} from '@/types/guardian';

export default function GuardiansPage() {
  const { t } = useTranslation('ui/guardians');
  usePageTitle(t('header.title'));
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

      const mappedGuardians = (data || []).map(guardian => ({
        ...guardian,
        can_access_financial_docs: (guardian as any).can_access_financial_docs ?? false,
        can_access_health_docs: (guardian as any).can_access_health_docs ?? false,
        can_trigger_emergency: (guardian as any).can_trigger_emergency ?? false,
        is_child_guardian: (guardian as any).is_child_guardian ?? false,
        is_will_executor: (guardian as any).is_will_executor ?? false,
        emergency_contact_priority: guardian.emergency_contact_priority ?? 1,
      }));
      setGuardians(mappedGuardians as Guardian[]);
    } catch (error) {
      console.error('Error fetching guardians:', error);
      toast.error(t('toasts.loadFailed'));
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
      toast.error(t('toasts.validation'));
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
      const newGuardian = {
        ...data,
        can_access_financial_docs: (data as any).can_access_financial_docs ?? false,
        can_access_health_docs: (data as any).can_access_health_docs ?? false,
        can_trigger_emergency: (data as any).can_trigger_emergency ?? false,
        is_child_guardian: (data as any).is_child_guardian ?? false,
        is_will_executor: (data as any).is_will_executor ?? false,
        emergency_contact_priority: data.emergency_contact_priority ?? 1,
      } as Guardian;
      setGuardians(prev => [newGuardian, ...prev]);

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
      toast.success(t('toasts.added', { name: formData.name }));
    } catch (error) {
      console.error('Error adding guardian:', error);
      toast.error(t('toasts.addFailed'));
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
                    {t('header.title')}
                  </h1>
                </FadeIn>
                <FadeIn duration={0.5} delay={0.4}>
                  <p
                    className='text-lg leading-relaxed max-w-2xl mb-4'
                    style={{ color: 'hsl(var(--muted-text))' }}
                  >
                    {t('header.lead')}
                  </p>
                  <p className='text-sm text-muted-foreground/80 max-w-2xl italic'>
                    {t('header.note')}
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
                      <Icon name={'add' as any} className='w-5 h-5 mr-2' />
                      {t('header.addButton')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[600px]'>
                    <DialogHeader>
                      <DialogTitle>{t('header.dialog.title')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='name'>{t('header.dialog.form.name.label')}</Label>
                          <Input
                            id='name'
                            value={formData.name}
                            onChange={e =>
                              handleInputChange('name', e.target.value)
                            }
                            placeholder={t('header.dialog.form.name.placeholder')}
                            required
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='email'>{t('header.dialog.form.email.label')}</Label>
                          <Input
                            id='email'
                            type='email'
                            value={formData.email}
                            onChange={e =>
                              handleInputChange('email', e.target.value)
                            }
                            placeholder={t('header.dialog.form.email.placeholder')}
                            required
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='phone'>{t('header.dialog.form.phone.label')}</Label>
                          <Input
                            id='phone'
                            type='tel'
                            value={formData.phone}
                            onChange={e =>
                              handleInputChange('phone', e.target.value)
                            }
                            placeholder={t('header.dialog.form.phone.placeholder')}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='relationship'>{t('header.dialog.form.relationship.label')}</Label>
                          <Select
                            value={formData.relationship}
                            onValueChange={value =>
                              handleInputChange('relationship', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('header.dialog.form.relationship.placeholder')} />
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
                        <Label htmlFor='notes'>{t('header.dialog.form.notes.label')}</Label>
                        <Textarea
                          id='notes'
                          value={formData.notes}
                          onChange={e =>
                            handleInputChange('notes', e.target.value)
                          }
                          placeholder={t('header.dialog.form.notes.placeholder')}
                          rows={3}
                        />
                      </div>

                      {/* Family Shield Protocol Permissions */}
                      <div className='space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5'>
                        <div className='flex items-center gap-2 mb-4'>
                          <Icon
                            name={'shield-check' as any}
                            className='w-5 h-5 text-primary'
                          />
                          <h3 className='text-lg font-semibold text-primary'>
                            {t('header.dialog.permissions.title')}
                          </h3>
                        </div>
                        <p className='text-sm text-muted-foreground mb-4'>
                          {t('header.dialog.permissions.description')}
                        </p>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='flex items-center justify-between space-x-2'>
                            <div className='space-y-0.5'>
                              <Label
                                htmlFor='can_trigger_emergency'
                                className='text-sm font-medium'
                              >
                                {t('header.dialog.permissions.canTrigger.label')}
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                {t('header.dialog.permissions.canTrigger.desc')}
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
                                {t('header.dialog.permissions.healthAccess.label')}
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                {t('header.dialog.permissions.healthAccess.desc')}
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
                                {t('header.dialog.permissions.financialAccess.label')}
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                {t('header.dialog.permissions.financialAccess.desc')}
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
                                {t('header.dialog.permissions.childGuardian.label')}
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                {t('header.dialog.permissions.childGuardian.desc')}
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
                                {t('header.dialog.permissions.willExecutor.label')}
                              </Label>
                              <p className='text-xs text-muted-foreground'>
                                {t('header.dialog.permissions.willExecutor.desc')}
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
                              {t('header.dialog.permissions.priority.label')}
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
                              placeholder={t('header.dialog.permissions.priority.placeholder')}
                            />
                            <p className='text-xs text-muted-foreground'>
                              {t('header.dialog.permissions.priority.help')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-end gap-3 pt-4'>
                        <Button
                          type='button'
                          variant={'outline' as any}
                          onClick={() => setIsDialogOpen(false)}
                        >
                          {t('header.dialog.actions.cancel')}
                        </Button>
                        <Button type='submit' disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Icon
                                name={'loader' as any}
                                className='w-4 h-4 mr-2 animate-spin'
                              />
                              {t('header.dialog.actions.adding')}
                            </>
                          ) : (
                            <>
                              <Icon
                                name={'add' as any}
                                className='w-4 h-4 mr-2'
                              />
                              {t('header.dialog.actions.add')}
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
                name={'loader' as any}
                className='w-8 h-8 animate-spin text-primary'
              />
              <span className='ml-3 text-muted-foreground'>
                {t('load.loading')}
              </span>
            </div>
          ) : guardians.length === 0 ? (
            <FadeIn duration={0.5} delay={0.8}>
              <Card className='p-16 text-center bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20'>
                <div className='relative mb-8'>
                  {/* Decorative background circle */}
                  <div className='w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center relative'>
                    <div className='w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center'>
                      <Icon
                        name={'users' as any}
                        className='w-8 h-8 text-primary'
                      />
                    </div>
                    {/* Small decorative dots */}
                    <div className='absolute -top-2 -right-2 w-4 h-4 bg-primary/30 rounded-full'></div>
                    <div className='absolute -bottom-2 -left-2 w-3 h-3 bg-primary/20 rounded-full'></div>
                  </div>
                </div>

                <h3 className='text-2xl font-bold mb-4 text-card-foreground'>
                  {t('empty.title')}
                </h3>
                <p className='text-muted-foreground mb-6 max-w-lg mx-auto text-lg leading-relaxed'>
                  {t('empty.lead')}
                </p>
                <div className='bg-primary/10 rounded-lg p-4 mb-8 max-w-2xl mx-auto border border-primary/20'>
                  <p className='text-sm text-primary/80 italic leading-relaxed'>
                    {t('empty.tip')}
                  </p>
                </div>

                {/* Benefits list */}
                <div className='flex flex-col sm:flex-row gap-6 mb-10 max-w-2xl mx-auto'>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0'>
                      <Icon
                        name={'shield-check' as any}
                        className='w-4 h-4 text-green-600'
                      />
                    </div>
                    <span className='text-muted-foreground'>
                      {t('empty.benefits.trusted')}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0'>
                      <Icon
                        name={'heart' as any}
                        className='w-4 h-4 text-blue-600'
                      />
                    </div>
                    <span className='text-muted-foreground'>
                      {t('empty.benefits.peace')}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0'>
                      <Icon
                        name={'clock' as any}
                        className='w-4 h-4 text-purple-600'
                      />
                    </div>
                    <span className='text-muted-foreground'>
                      {t('empty.benefits.available')}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsDialogOpen(true)}
                  size='lg'
                  className='bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200'
                >
                  <Icon name={'add' as any} className='w-5 h-5 mr-2' />
                  {t('empty.cta')}
                </Button>

                <p className='text-xs text-muted-foreground mt-6 max-w-md mx-auto'>
                  {t('empty.footnote')}
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
                          <Icon
                            name={'user' as any}
                            className='w-6 h-6 text-primary'
                          />
                          {guardian.can_trigger_emergency && (
                            <div className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center'>
                              <Icon
                                name={'shield-check' as any}
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
                                  {t('card.priority', { priority: guardian.emergency_contact_priority })}
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
                        <Button size='sm' variant={'outline' as any} disabled>
                          <Icon name={'pencil' as any} className='w-4 h-4' />
                        </Button>
                        <Button size='sm' variant={'outline' as any} disabled>
                          <Icon name={'trash' as any} className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center gap-3 text-sm'>
                        <Icon
                          name={'mail' as any}
                          className='w-4 h-4 text-muted-foreground'
                        />
                        <span className='text-muted-foreground'>
                          {guardian.email}
                        </span>
                      </div>
                      {guardian.phone && (
                        <div className='flex items-center gap-3 text-sm'>
                          <Icon
                            name={'phone' as any}
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
                          <Icon
                            name={'shield-check' as any}
                            className='w-4 h-4'
                          />
                          {t('card.shieldPermissions')}
                        </h4>
                        <div className='flex flex-wrap gap-1'>
                          {guardian.can_trigger_emergency && (
                            <span className='px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full'>
                              {t('card.badges.emergency')}
                            </span>
                          )}
                          {guardian.can_access_health_docs && (
                            <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full'>
                              {t('card.badges.health')}
                            </span>
                          )}
                          {guardian.can_access_financial_docs && (
                            <span className='px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full'>
                              {t('card.badges.financial')}
                            </span>
                          )}
                          {guardian.is_child_guardian && (
                            <span className='px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full'>
                              {t('card.badges.child')}
                            </span>
                          )}
                          {guardian.is_will_executor && (
                            <span className='px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full'>
                              {t('card.badges.executor')}
                            </span>
                          )}
                          {!guardian.can_trigger_emergency &&
                            !guardian.can_access_health_docs &&
                            !guardian.can_access_financial_docs &&
                            !guardian.is_child_guardian &&
                            !guardian.is_will_executor && (
                              <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'>
                                {t('card.badges.basicOnly')}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className='mt-4 pt-4 border-t border-border'>
                      <p className='text-xs text-muted-foreground'>
                        {t('card.added', { date: new Date(guardian.created_at).toLocaleDateString() })}
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
                    name={'info' as any}
                    className='w-6 h-6 text-primary flex-shrink-0 mt-1'
                  />
                  <div>
                    <h4 className='font-semibold text-primary mb-2'>
                      {t('info.title')}
                    </h4>
                    <p className='text-muted-foreground mb-4'>
                      {t('info.description')}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      <strong>{t('info.soon')}</strong> {t('info.soonFeatures')}
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
