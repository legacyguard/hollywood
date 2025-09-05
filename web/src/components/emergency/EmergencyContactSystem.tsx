
// Emergency Contact System - Personality-aware emergency contact management
// Phase 3A: Family Shield System - Enhanced emergency contact and guardian notification system

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { usePersonalityManager } from '@/components/sofia/SofiaContextProvider';
import { AnimationSystem } from '@/lib/animation-system';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import type { PersonalityMode } from '@/lib/sofia-types';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Icons
import {
  AlertTriangle,
  Edit3,
  Heart,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  Shield,
  Trash2,
  Users,
  Zap,
} from 'lucide-react';

interface EmergencyContact {
  can_help_with: string[];
  can_trigger_emergency: boolean;
  created_at: string;
  email: string;
  emergency_contact_priority: number;
  id: string;
  is_guardian: boolean;
  name: string;
  notes?: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  phone?: string;
  priority: number;
  relationship: string;
  updated_at: string;
}

interface GuardianNotification {
  action_required: boolean;
  action_url?: string;
  created_at: string;
  delivery_status: 'delivered' | 'failed' | 'pending' | 'sent';
  expires_at: null | string;
  id: string;
  message: string;
  notification_type:
    | 'activation_request'
    | 'shield_activated'
    | 'status_update'
    | 'verification_needed';
  priority: 'high' | 'low' | 'medium' | 'urgent';
  read_at: null | string;
  sent_at: null | string;
  title: string;
}

interface EmergencyContactSystemProps {
  className?: string;
  onContactAdded?: (contact: EmergencyContact) => void;
  onContactUpdated?: (contact: EmergencyContact) => void;
  onNotificationSent?: (notification: GuardianNotification) => void;
  personalityMode?: PersonalityMode;
}

export const EmergencyContactSystem: React.FC<EmergencyContactSystemProps> = ({
  className = '',
  personalityMode,
  // _onContactAdded, // Not used
  // _onContactUpdated, // Not used
  // _onNotificationSent, // Not used
}) => {
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseWithClerk();
  const personalityManager = usePersonalityManager();

  // State
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [notifications, setNotifications] = useState<GuardianNotification[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(
    null
  );

  // Form state
  const [contactForm, setContactForm] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    can_help_with: [] as string[],
    priority: 1,
    can_trigger_emergency: false,
    notes: '',
    notification_preferences: {
      email: true,
      sms: false,
      push: false,
    },
  });

  // Get effective personality mode
  const detectedMode = personalityManager?.getCurrentStyle() || 'adaptive';
  const effectiveMode =
    personalityMode ||
    (detectedMode === 'balanced' ? 'adaptive' : detectedMode);

  const shouldReduceMotion = AnimationSystem.shouldReduceMotion();
  const animConfig = AnimationSystem.getConfig(effectiveMode);

  // Load emergency contacts and recent notifications
  const loadEmergencyData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const supabase = await createSupabaseClient();

      // Load guardians as emergency contacts
      const { data: guardians, error: guardiansError } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', userId)
        .order('emergency_contact_priority', { ascending: true });

      if (guardiansError) throw guardiansError;

      // Load recent guardian notifications
      const { data: notificationData, error: notificationsError } =
        await supabase
          .from('guardian_notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

      if (notificationsError) throw notificationsError;

      // Transform guardians to emergency contacts format
      const emergencyContacts: EmergencyContact[] = (guardians || []).map(
        guardian => ({
          id: guardian.id,
          name: guardian.name,
          relationship: guardian.relationship || 'Guardian',
          email: guardian.email,
          phone: guardian.phone || '',
          can_help_with: (guardian as any).can_help_with || [],
          priority: guardian.emergency_contact_priority || 1,
          is_guardian: true,
          can_trigger_emergency:
            (guardian as any).can_trigger_emergency || false,
          emergency_contact_priority: guardian.emergency_contact_priority || 1,
          notes: guardian.notes || '',
          notification_preferences: {
            email: true,
            sms: !!guardian.phone,
            push: false,
          },
          created_at: guardian.created_at,
          updated_at: guardian.updated_at || guardian.created_at,
        })
      );

      setContacts(emergencyContacts);
      setNotifications((notificationData as any) || []);
      setError(null);
    } catch (err) {
      console.error('Error loading emergency data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load emergency contacts'
      );
    } finally {
      setLoading(false);
    }
  }, [userId, createSupabaseClient]);

  // Save emergency contact
  const saveContact = useCallback(async () => {
    if (!userId) return;

    try {
      const supabase = await createSupabaseClient();

      const contactData = {
        user_id: userId,
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone || null,
        relationship: contactForm.relationship,
        can_help_with: contactForm.can_help_with,
        can_trigger_emergency: contactForm.can_trigger_emergency,
        emergency_contact_priority: contactForm.priority,
        notes: contactForm.notes || null,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (editingContact) {
        // Update existing contact
        result = await supabase
          .from('guardians')
          .update(contactData)
          .eq('id', editingContact.id)
          .select()
          .single();
      } else {
        // Add new contact
        result = await supabase
          .from('guardians')
          .insert(contactData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Transform and update local state
      const newContact: EmergencyContact = {
        id: result.data.id,
        name: result.data.name,
        relationship: result.data.relationship || '',
        email: result.data.email,
        phone: result.data.phone || '',
        can_help_with: (result.data as any).can_help_with || [],
        priority: result.data.emergency_contact_priority || 1,
        is_guardian: true,
        can_trigger_emergency: (result.data as any).can_trigger_emergency,
        emergency_contact_priority: result.data.emergency_contact_priority || 1,
        notes: result.data.notes || '',
        notification_preferences: {
          email: true,
          sms: !!result.data.phone,
          push: false,
        },
        created_at: result.data.created_at,
        updated_at: result.data.updated_at || result.data.created_at,
      };

      if (editingContact) {
        setContacts(prev =>
          prev.map(c => (c.id === editingContact.id ? newContact : c))
        );
        // _onContactUpdated?.(newContact); // Not available
        toast.success(
          effectiveMode === 'empathetic'
            ? '💚 Your trusted contact has been updated with love'
            : effectiveMode === 'pragmatic'
              ? '🛡️ Emergency contact updated successfully'
              : '✅ Contact updated and ready to help'
        );
      } else {
        setContacts(prev => [...prev, newContact]);
        // _onContactAdded?.(newContact); // Not available
        toast.success(
          effectiveMode === 'empathetic'
            ? '💚 Another loving guardian added to your circle of care'
            : effectiveMode === 'pragmatic'
              ? '🛡️ Emergency contact added to protection network'
              : '✅ New emergency contact added'
        );
      }

      // Reset form
      setContactForm({
        name: '',
        relationship: '',
        email: '',
        phone: '',
        can_help_with: [],
        priority: 1,
        can_trigger_emergency: false,
        notes: '',
        notification_preferences: {
          email: true,
          sms: false,
          push: false,
        },
      });
      setEditingContact(null);
      setShowAddDialog(false);
    } catch (err) {
      console.error('Error saving contact:', err);
      toast.error('Failed to save emergency contact. Please try again.');
    }
  }, [
    userId,
    createSupabaseClient,
    contactForm,
    editingContact,
    effectiveMode,
  ]);

  // Send test notification
  const sendTestNotification = useCallback(
    async (contactId: string) => {
      if (!userId) return;

      try {
        const supabase = await createSupabaseClient();
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        const notificationData = {
          guardian_id: contactId,
          user_id: userId,
          notification_type: 'status_update' as const,
          title:
            effectiveMode === 'empathetic'
              ? 'Test of Love - Family Care System'
              : effectiveMode === 'pragmatic'
                ? 'Emergency System Test'
                : 'Family Protection Test',
          message:
            effectiveMode === 'empathetic'
              ? `Hello ${contact.name}! This is a gentle test to make sure you can receive messages about your loved one's wellbeing. Everything is fine - just making sure our circle of care works perfectly. ❤️`
              : effectiveMode === 'pragmatic'
                ? `System test for ${contact.name}. Verifying emergency notification delivery capability. No action required - this is a scheduled test of the emergency contact system.`
                : `Hi ${contact.name}! This is a test message from your loved one's Family Protection system. All is well - we're just making sure you'll receive important updates when needed.`,
          priority: 'low' as const,
          delivery_method: 'email' as const,
        };

        const { error } = await supabase
          .from('guardian_notifications')
          .insert(notificationData);

        if (error) throw error;

        toast.success(`Test notification sent to ${contact.name}`);
        await loadEmergencyData(); // Refresh to show new notification
      } catch (err) {
        console.error('Error sending test notification:', err);
        toast.error('Failed to send test notification');
      }
    },
    [userId, createSupabaseClient, contacts, effectiveMode, loadEmergencyData]
  );

  // Delete contact
  const deleteContact = useCallback(
    async (contactId: string) => {
      if (!userId) return;

      try {
        const supabase = await createSupabaseClient();

        const { error } = await supabase
          .from('guardians')
          .delete()
          .eq('id', contactId);

        if (error) throw error;

        setContacts(prev => prev.filter(c => c.id !== contactId));
        toast.success('Emergency contact removed');
      } catch (err) {
        console.error('Error deleting contact:', err);
        toast.error('Failed to remove contact');
      }
    },
    [userId, createSupabaseClient]
  );

  // Initialize data loading
  useEffect(() => {
    loadEmergencyData();
  }, [loadEmergencyData]);

  // Get personality-specific content
  const getPersonalityContent = () => {
    switch (effectiveMode) {
      case 'empathetic':
        return {
          title: '💚 Circle of Care',
          subtitle: 'Your loving network of trusted friends and family',
          addButtonText: 'Add a Caring Guardian',
          emptyMessage:
            'Build your circle of care by adding trusted friends and family who can help in times of need',
          bgGradient: 'from-emerald-50 to-green-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600',
          icon: Heart,
        };
      case 'pragmatic':
        return {
          title: '🛡️ Emergency Contact Network',
          subtitle: 'Structured emergency response and notification system',
          addButtonText: 'Add Emergency Contact',
          emptyMessage:
            'Configure emergency contacts for optimal family protection response',
          bgGradient: 'from-blue-50 to-slate-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600',
          icon: Shield,
        };
      default:
        return {
          title: '🤝 Your Support Network',
          subtitle: 'Trusted people who can help protect your family',
          addButtonText: 'Add Trusted Contact',
          emptyMessage:
            'Add people you trust to help protect and support your family when needed',
          bgGradient: 'from-purple-50 to-indigo-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          icon: Users,
        };
    }
  };

  const personalityContent = getPersonalityContent();
  const IconComponent = personalityContent.icon;

  // Memoized contact categories
  const contactCategories = useMemo(() => {
    const primary = contacts.filter(
      c => c.priority === 1 && c.can_trigger_emergency
    );
    const secondary = contacts.filter(
      c => c.priority > 1 || !c.can_trigger_emergency
    );
    return { primary, secondary };
  }, [contacts]);

  if (loading) {
    return (
      <div
        className={`bg-gradient-to-br ${personalityContent.bgGradient} rounded-xl border ${personalityContent.borderColor} p-6 ${className}`}
      >
        <div className='flex items-center justify-center h-32'>
          <motion.div
            {...(!shouldReduceMotion
              ? {
                  animate: { rotate: 360 },
                  transition: { duration: 2, repeat: Infinity, ease: 'linear' },
                }
              : {})}
            
          >
            <Users className='w-8 h-8 text-gray-400' />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main Contact System */}
      <motion.div
        className={`bg-gradient-to-br ${personalityContent.bgGradient} rounded-xl border ${personalityContent.borderColor} shadow-sm`}
        {...(!shouldReduceMotion
          ? {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: animConfig.duration, ease: animConfig.ease as any },
            }
          : {})}
      >
        {/* Header */}
        <div className='p-6 pb-4'>
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-start gap-3'>
              <motion.div
                className={`p-2 rounded-lg bg-white/80 backdrop-blur-sm ${personalityContent.accentColor}`}
                {...(!shouldReduceMotion ? { whileHover: { scale: 1.05 } } : {})}
              >
                <IconComponent className='w-6 h-6' />
              </motion.div>

              <div>
                <h3 className='text-lg font-semibold text-gray-800 mb-1'>
                  {personalityContent.title}
                </h3>
                <p className='text-sm text-gray-600'>
                  {personalityContent.subtitle}
                </p>
              </div>
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='bg-white/90 backdrop-blur-sm'
                  onClick={() => {
                    setEditingContact(null);
                    setContactForm({
                      name: '',
                      relationship: '',
                      email: '',
                      phone: '',
                      can_help_with: [],
                      priority: 1,
                      can_trigger_emergency: false,
                      notes: '',
                      notification_preferences: {
                        email: true,
                        sms: false,
                        push: false,
                      },
                    });
                  }}
                >
                  <Plus className='w-4 h-4 mr-2' />
                  {personalityContent.addButtonText}
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>
                    {editingContact
                      ? 'Edit Contact'
                      : personalityContent.addButtonText}
                  </DialogTitle>
                </DialogHeader>

                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                      id='name'
                      value={contactForm.name}
                      onChange={e =>
                        setContactForm(prev => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder='Enter full name'
                    />
                  </div>

                  <div>
                    <Label htmlFor='relationship'>Relationship</Label>
                    <Select
                      value={contactForm.relationship}
                      onValueChange={value =>
                        setContactForm(prev => ({
                          ...prev,
                          relationship: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select relationship' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Spouse'>Spouse/Partner</SelectItem>
                        <SelectItem value='Parent'>Parent</SelectItem>
                        <SelectItem value='Child'>Adult Child</SelectItem>
                        <SelectItem value='Sibling'>Sibling</SelectItem>
                        <SelectItem value='Friend'>Close Friend</SelectItem>
                        <SelectItem value='Relative'>Other Relative</SelectItem>
                        <SelectItem value='Professional'>
                          Professional Contact
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      value={contactForm.email}
                      onChange={e =>
                        setContactForm(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder='Enter email address'
                    />
                  </div>

                  <div>
                    <Label htmlFor='phone'>Phone (Optional)</Label>
                    <Input
                      id='phone'
                      type='tel'
                      value={contactForm.phone}
                      onChange={e =>
                        setContactForm(prev => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder='Enter phone number'
                    />
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='can-trigger'
                      checked={contactForm.can_trigger_emergency}
                      onCheckedChange={checked =>
                        setContactForm(prev => ({
                          ...prev,
                          can_trigger_emergency: checked,
                        }))
                      }
                    />
                    <Label htmlFor='can-trigger' className='text-sm'>
                      {effectiveMode === 'empathetic'
                        ? 'Can activate family care in emergencies'
                        : effectiveMode === 'pragmatic'
                          ? 'Emergency activation permissions'
                          : 'Allow emergency activation'}
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor='notes'>Notes (Optional)</Label>
                    <Textarea
                      id='notes'
                      value={contactForm.notes}
                      onChange={e =>
                        setContactForm(prev => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder='Special instructions or notes...'
                      rows={2}
                    />
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      onClick={saveContact}
                      className='flex-1'
                      disabled={!contactForm.name || !contactForm.email}
                    >
                      {editingContact ? 'Update Contact' : 'Add Contact'}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => setShowAddDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {error && (
            <Alert className='mb-4'>
              <AlertTriangle className='w-4 h-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Statistics */}
          <div className='grid grid-cols-3 gap-4 mb-6'>
            <div className='bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center'>
              <div className='text-lg font-semibold text-gray-800'>
                {contacts.length}
              </div>
              <div className='text-xs text-gray-600'>Total Contacts</div>
            </div>
            <div className='bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center'>
              <div className='text-lg font-semibold text-gray-800'>
                {contactCategories.primary.length}
              </div>
              <div className='text-xs text-gray-600'>Primary</div>
            </div>
            <div className='bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center'>
              <div className='text-lg font-semibold text-gray-800'>
                {notifications.filter(n => n.delivery_status === 'sent').length}
              </div>
              <div className='text-xs text-gray-600'>Recent Messages</div>
            </div>
          </div>

          {/* Contact List */}
          {contacts.length === 0 ? (
            <div className='bg-white/60 backdrop-blur-sm rounded-lg p-8 text-center'>
              <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-600 mb-4'>
                {personalityContent.emptyMessage}
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className='w-4 h-4 mr-2' />
                {personalityContent.addButtonText}
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {/* Primary Contacts */}
              {contactCategories.primary.length > 0 && (
                <div>
                  <h4 className='text-sm font-medium text-gray-700 mb-3'>
                    {effectiveMode === 'empathetic'
                      ? 'Primary Caregivers'
                      : effectiveMode === 'pragmatic'
                        ? 'Primary Response Team'
                        : 'Primary Contacts'}
                  </h4>
                  <div className='space-y-2'>
                    {contactCategories.primary.map((contact, index) => (
                      <motion.div
                        key={contact.id}
                        className='bg-white/80 backdrop-blur-sm rounded-lg p-4'
                        {...(!shouldReduceMotion
                          ? {
                              initial: { opacity: 0, y: 10 },
                              animate: { opacity: 1, y: 0 },
                              transition: { delay: index * 0.1 },
                            }
                          : {})}
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold'>
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <div className='flex items-center gap-2'>
                                <h5 className='font-medium text-gray-800'>
                                  {contact.name}
                                </h5>
                                {contact.can_trigger_emergency && (
                                  <Badge
                                    variant='secondary'
                                    className='text-xs'
                                  >
                                    <Zap className='w-3 h-3 mr-1' />
                                    Emergency
                                  </Badge>
                                )}
                              </div>
                              <p className='text-sm text-gray-600'>
                                {contact.relationship}
                              </p>
                              <div className='flex items-center gap-4 mt-1'>
                                <div className='flex items-center gap-1 text-xs text-gray-500'>
                                  <Mail className='w-3 h-3' />
                                  {contact.email}
                                </div>
                                {contact.phone && (
                                  <div className='flex items-center gap-1 text-xs text-gray-500'>
                                    <Phone className='w-3 h-3' />
                                    {contact.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className='flex items-center gap-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => sendTestNotification(contact.id)}
                              className='text-blue-600 hover:text-blue-700'
                            >
                              <Send className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                setEditingContact(contact);
                                setContactForm({
                                  name: contact.name,
                                  relationship: contact.relationship,
                                  email: contact.email,
                                  phone: contact.phone || '',
                                  can_help_with: contact.can_help_with,
                                  priority: contact.priority,
                                  can_trigger_emergency:
                                    contact.can_trigger_emergency,
                                  notes: contact.notes || '',
                                  notification_preferences:
                                    contact.notification_preferences,
                                });
                                setShowAddDialog(true);
                              }}
                            >
                              <Edit3 className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => deleteContact(contact.id)}
                              className='text-red-600 hover:text-red-700'
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>

                        {contact.notes && (
                          <p className='text-xs text-gray-600 mt-2 pl-13'>
                            {contact.notes}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary Contacts */}
              {contactCategories.secondary.length > 0 && (
                <div>
                  <h4 className='text-sm font-medium text-gray-700 mb-3'>
                    {effectiveMode === 'empathetic'
                      ? 'Support Circle'
                      : effectiveMode === 'pragmatic'
                        ? 'Secondary Contacts'
                        : 'Additional Contacts'}
                  </h4>
                  <div className='grid gap-2'>
                    {contactCategories.secondary.map((contact, index) => (
                      <motion.div
                        key={contact.id}
                        className='bg-white/60 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between'
                        {...(!shouldReduceMotion
                          ? {
                              initial: { opacity: 0, x: -10 },
                              animate: { opacity: 1, x: 0 },
                              transition: { delay: index * 0.05 },
                            }
                          : {})}
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium'>
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <div className='font-medium text-gray-800 text-sm'>
                              {contact.name}
                            </div>
                            <div className='text-xs text-gray-600'>
                              {contact.relationship}
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => sendTestNotification(contact.id)}
                          >
                            <MessageSquare className='w-3 h-3' />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <motion.div
          className='mt-6 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm'
          {...(!shouldReduceMotion && {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: animConfig.duration, delay: 0.2 }
          })}
        >
          <div className='p-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-3'>
              Recent Notifications
            </h4>
            <div className='space-y-2'>
              {notifications.slice(0, 3).map(notification => (
                <div
                  key={notification.id}
                  className='flex items-start gap-3 p-2 bg-gray-50 rounded-lg'
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.delivery_status === 'delivered'
                        ? 'bg-green-400'
                        : notification.delivery_status === 'sent'
                          ? 'bg-blue-400'
                          : notification.delivery_status === 'failed'
                            ? 'bg-red-400'
                            : 'bg-yellow-400'
                    }`}
                  />
                  <div className='flex-1'>
                    <div className='text-sm font-medium text-gray-800'>
                      {notification.title}
                    </div>
                    <div className='text-xs text-gray-600 line-clamp-2'>
                      {notification.message}
                    </div>
                    <div className='flex items-center gap-2 mt-1'>
                      <Badge variant='outline' className='text-xs'>
                        {notification.priority}
                      </Badge>
                      <span className='text-xs text-gray-500'>
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EmergencyContactSystem;
