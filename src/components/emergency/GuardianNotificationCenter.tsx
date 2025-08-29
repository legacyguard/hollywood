// Guardian Notification Center - Advanced notification management with Sofia personality integration
// Phase 3A: Family Shield System - Comprehensive notification and response coordination system

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { usePersonalityManager } from '@/components/sofia/SofiaContextProvider';
import { AnimationSystem } from '@/lib/animation-system';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import type { PersonalityMode } from '@/lib/sofia-types';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Icons
import {
  Bell,
  AlertTriangle,
  Heart,
  Shield,
  Clock,
  Send,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Settings,
  Users,
  Zap,
  Sparkles,
  Filter,
  RefreshCw,
  Archive,
  Star,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface GuardianNotification {
  id: string;
  guardian_id: string;
  user_id: string;
  notification_type: 'activation_request' | 'verification_needed' | 'shield_activated' | 'status_update';
  title: string;
  message: string;
  action_required: boolean;
  action_url?: string;
  verification_token?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  delivery_method: 'email' | 'sms' | 'push' | 'all';
  sent_at: string | null;
  read_at: string | null;
  responded_at: string | null;
  expires_at: string | null;
  delivery_error?: string;
  attempted_at: string | null;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed';
  created_at: string;
  guardian_name?: string;
  guardian_email?: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: GuardianNotification['notification_type'];
  title_template: string;
  message_template: string;
  priority: GuardianNotification['priority'];
  delivery_method: GuardianNotification['delivery_method'];
  personality_variants: {
    empathetic: { title: string; message: string };
    pragmatic: { title: string; message: string };
    adaptive: { title: string; message: string };
  };
}

interface GuardianNotificationCenterProps {
  className?: string;
  personalityMode?: PersonalityMode;
  onNotificationSent?: (notification: GuardianNotification) => void;
  onNotificationRead?: (notificationId: string) => void;
  onEmergencyTriggered?: () => void;
}

export const GuardianNotificationCenter: React.FC<GuardianNotificationCenterProps> = ({
  className = '',
  personalityMode,
  onNotificationSent,
  onNotificationRead,
  onEmergencyTriggered,
}) => {
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseWithClerk();
  const personalityManager = usePersonalityManager();

  // State
  const [notifications, setNotifications] = useState<GuardianNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'action_required'>('all');
  const [guardians, setGuardians] = useState<Array<{ id: string; name: string; email: string }>>([]);

  // Get effective personality mode
  const detectedMode = personalityManager?.getCurrentStyle() || 'adaptive';
  const effectiveMode = personalityMode || (detectedMode === 'balanced' ? 'adaptive' : detectedMode);

  const shouldReduceMotion = AnimationSystem.shouldReduceMotion();
  const animConfig = AnimationSystem.getConfig(effectiveMode);

  // Notification templates with personality variants
  const notificationTemplates: NotificationTemplate[] = useMemo(() => [
    {
      id: 'wellness_check',
      name: 'Wellness Check',
      type: 'status_update',
      title_template: 'Wellness Check Request',
      message_template: 'A wellness check has been requested. Please respond when you can.',
      priority: 'medium',
      delivery_method: 'email',
      personality_variants: {
        empathetic: {
          title: '💚 Gentle Check-In Request',
          message: 'Hello dear friend! I hope this finds you well. Could you please let me know you\'re okay? Your caring presence means so much to our family. No rush - just when you have a moment to share that you\'re safe and sound. With love and gratitude. 💚'
        },
        pragmatic: {
          title: '🛡️ System Status Verification',
          message: 'Wellness verification request initiated. Please confirm your status at your earliest convenience. This is part of our family protection protocol. Response required within 48 hours for system continuity.'
        },
        adaptive: {
          title: '🤝 Wellness Check Request',
          message: 'Hope you\'re doing well! We\'d appreciate a quick check-in to let us know you\'re okay. This helps us keep our family protection network strong and connected. Thanks for being such an important part of our support system!'
        }
      }
    },
    {
      id: 'emergency_alert',
      name: 'Emergency Alert',
      type: 'activation_request',
      title_template: 'Emergency Activation Request',
      message_template: 'Emergency protocols may need activation. Your immediate attention is required.',
      priority: 'urgent',
      delivery_method: 'all',
      personality_variants: {
        empathetic: {
          title: '💔 Urgent Family Care Needed',
          message: 'My dear friend, I need your help. Something may have happened and our family needs the loving support of our trusted circle. Please respond as soon as you can - your caring heart and quick action could make all the difference right now. Thank you for being someone we can count on. 🙏'
        },
        pragmatic: {
          title: '🚨 EMERGENCY PROTOCOL ACTIVATION',
          message: 'URGENT: Emergency detection system has triggered. Family Shield Protocol requires immediate guardian response. Please access the emergency dashboard immediately to review situation and take appropriate action. Time-sensitive response required.'
        },
        adaptive: {
          title: '⚠️ Emergency Support Needed',
          message: 'This is an emergency notification. We need your immediate help with a family situation. Please respond as soon as possible and access our emergency support system. Your quick response is crucial for our family\'s wellbeing.'
        }
      }
    },
    {
      id: 'activation_confirmation',
      name: 'Activation Confirmation',
      type: 'verification_needed',
      title_template: 'Confirm Emergency Activation',
      message_template: 'Please confirm if emergency protocols should be activated.',
      priority: 'high',
      delivery_method: 'email',
      personality_variants: {
        empathetic: {
          title: '💚 Please Confirm: Family Needs Care',
          message: 'Dear guardian, our family protection system needs your loving confirmation. We believe there might be a situation where care is needed. Please take a moment to review and confirm whether our emergency care should be activated. Your thoughtful decision helps protect our loved ones. With trust and appreciation.'
        },
        pragmatic: {
          title: '🔐 VERIFICATION REQUIRED: Activation Pending',
          message: 'Guardian verification required for emergency protocol activation. System has detected potential emergency condition. Please review situation data and provide authorization for Family Shield activation within next 24 hours. Your confirmation enables emergency response procedures.'
        },
        adaptive: {
          title: '🤝 Confirmation Needed: Emergency Support',
          message: 'We need your confirmation before activating emergency support protocols. Please review the situation and let us know if you think we should proceed with emergency measures. Your judgment is valued and important for making the right decision for our family.'
        }
      }
    },
    {
      id: 'status_update',
      name: 'General Update',
      type: 'status_update',
      title_template: 'Family Protection Update',
      message_template: 'An update about the family protection status.',
      priority: 'low',
      delivery_method: 'email',
      personality_variants: {
        empathetic: {
          title: '💫 Loving Update from Your Family',
          message: 'Hello wonderful guardian! Just wanted to share a gentle update about our family\'s wellbeing and protection. Everything is going smoothly, and we wanted you to know how grateful we are for your continued care and support. Your presence in our lives brings such peace of mind. 💚'
        },
        pragmatic: {
          title: '📊 System Status Report',
          message: 'Family Protection System status update. All systems operational. No action required. This is a scheduled status report to maintain guardian awareness of system health and family security status. Next automated update scheduled in 30 days.'
        },
        adaptive: {
          title: '🏠 Family Protection Update',
          message: 'Hi there! Just sending a quick update on our family protection status. Everything is running smoothly and we wanted to keep you in the loop. Thanks for being such a reliable part of our support network!'
        }
      }
    }
  ], []);

  // Load notifications and guardians
  const loadNotificationData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const supabase = await createSupabaseClient();

      // Load guardian notifications
      const { data: notificationData, error: notificationError } = await supabase
        .from('guardian_notifications')
        .select(`
          *,
          guardians!inner(name, email)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (notificationError) throw notificationError;

      // Load guardians for sending new notifications
      const { data: guardianData, error: guardianError } = await supabase
        .from('guardians')
        .select('id, name, email')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (guardianError) throw guardianError;

      // Transform notification data
      const transformedNotifications: GuardianNotification[] = (notificationData || []).map(n => ({
        ...n,
        guardian_name: n.guardians?.name,
        guardian_email: n.guardians?.email,
      }));

      setNotifications(transformedNotifications);
      setGuardians(guardianData || []);
      setError(null);
    } catch (err) {
      console.error('Error loading notification data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [userId, createSupabaseClient]);

  // Send notification to guardians
  const sendNotification = useCallback(async () => {
    if (!userId || selectedGuardians.length === 0) return;

    try {
      const supabase = await createSupabaseClient();
      const template = notificationTemplates.find(t => t.id === selectedTemplate);
      if (!template) return;

      const personalityContent = template.personality_variants[effectiveMode];
      const title = customMessage ? 'Custom Message' : personalityContent.title;
      const message = customMessage || personalityContent.message;

      const notifications = selectedGuardians.map(guardianId => ({
        guardian_id: guardianId,
        user_id: userId,
        notification_type: template.type,
        title,
        message,
        action_required: template.type === 'activation_request' || template.type === 'verification_needed',
        priority: template.priority,
        delivery_method: template.delivery_method,
        verification_token: template.type === 'verification_needed' ? crypto.randomUUID() : null,
        expires_at: template.type === 'verification_needed' 
          ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
          : null,
      }));

      const { error } = await supabase
        .from('guardian_notifications')
        .insert(notifications);

      if (error) throw error;

      toast.success(effectiveMode === 'empathetic' 
        ? `💚 ${notifications.length} loving messages sent to your guardians`
        : effectiveMode === 'pragmatic'
        ? `🛡️ ${notifications.length} notifications dispatched successfully`
        : `✅ Sent notifications to ${notifications.length} guardians`);

      // Reset form and close dialog
      setSelectedTemplate('');
      setCustomMessage('');
      setSelectedGuardians([]);
      setShowSendDialog(false);

      // Reload notifications
      await loadNotificationData();

      // Trigger callback
      notifications.forEach(n => onNotificationSent?.(n as GuardianNotification));

    } catch (err) {
      console.error('Error sending notification:', err);
      toast.error('Failed to send notifications. Please try again.');
    }
  }, [userId, createSupabaseClient, selectedGuardians, selectedTemplate, customMessage, notificationTemplates, effectiveMode, loadNotificationData, onNotificationSent]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const supabase = await createSupabaseClient();
      
      const { error } = await supabase
        .from('guardian_notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
      ));

      onNotificationRead?.(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [createSupabaseClient, onNotificationRead]);

  // Archive notification
  const archiveNotification = useCallback(async (notificationId: string) => {
    try {
      const supabase = await createSupabaseClient();
      
      // In a real implementation, you might add an archived_at column
      // For now, we'll just remove it from the UI
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      toast.success('Notification archived');
    } catch (err) {
      console.error('Error archiving notification:', err);
      toast.error('Failed to archive notification');
    }
  }, [createSupabaseClient]);

  // Initialize data loading
  useEffect(() => {
    loadNotificationData();
  }, [loadNotificationData]);

  // Get personality-specific content
  const getPersonalityContent = () => {
    switch (effectiveMode) {
      case 'empathetic':
        return {
          title: '💚 Guardian Message Center',
          subtitle: 'Send loving messages to your circle of care',
          sendButtonText: 'Send with Love',
          emptyMessage: 'No messages yet - your guardians are here when you need them',
          bgGradient: 'from-emerald-50 to-green-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600',
          icon: Heart,
        };
      case 'pragmatic':
        return {
          title: '🛡️ Guardian Communication Hub',
          subtitle: 'Emergency notification and response coordination',
          sendButtonText: 'Dispatch Notification',
          emptyMessage: 'No active notifications - system ready for emergency communications',
          bgGradient: 'from-blue-50 to-slate-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600',
          icon: Shield,
        };
      default:
        return {
          title: '📢 Guardian Notifications',
          subtitle: 'Communicate with your trusted support network',
          sendButtonText: 'Send Notification',
          emptyMessage: 'No notifications yet - stay connected with your guardians',
          bgGradient: 'from-purple-50 to-indigo-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          icon: Bell,
        };
    }
  };

  const personalityContent = getPersonalityContent();
  const IconComponent = personalityContent.icon;

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    switch (filterStatus) {
      case 'unread':
        return notifications.filter(n => !n.read_at);
      case 'action_required':
        return notifications.filter(n => n.action_required && !n.responded_at);
      default:
        return notifications;
    }
  }, [notifications, filterStatus]);

  // Get notification statistics
  const stats = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter(n => !n.read_at).length,
    actionRequired: notifications.filter(n => n.action_required && !n.responded_at).length,
    sent: notifications.filter(n => n.delivery_status === 'sent' || n.delivery_status === 'delivered').length,
  }), [notifications]);

  if (loading) {
    return (
      <div className={`bg-gradient-to-br ${personalityContent.bgGradient} rounded-xl border ${personalityContent.borderColor} p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <motion.div
            animate={!shouldReduceMotion ? { rotate: 360 } : undefined}
            transition={!shouldReduceMotion ? { duration: 2, repeat: Infinity, ease: 'linear' } : undefined}
          >
            <Bell className="w-8 h-8 text-gray-400" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${personalityContent.bgGradient} rounded-xl border ${personalityContent.borderColor} shadow-sm ${className}`}
      initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : undefined}
      animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
      transition={!shouldReduceMotion ? { duration: animConfig.duration, ease: animConfig.ease } : undefined}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <motion.div
              className={`p-2 rounded-lg bg-white/80 backdrop-blur-sm ${personalityContent.accentColor}`}
              whileHover={!shouldReduceMotion ? { scale: 1.05 } : undefined}
            >
              <IconComponent className="w-6 h-6" />
            </motion.div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {personalityContent.title}
              </h3>
              <p className="text-sm text-gray-600">
                {personalityContent.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadNotificationData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-white/90 backdrop-blur-sm">
                  <Send className="w-4 h-4 mr-2" />
                  {personalityContent.sendButtonText}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{personalityContent.sendButtonText}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guardians">Select Guardians</Label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                      {guardians.map(guardian => (
                        <div key={guardian.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={guardian.id}
                            checked={selectedGuardians.includes(guardian.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGuardians(prev => [...prev, guardian.id]);
                              } else {
                                setSelectedGuardians(prev => prev.filter(id => id !== guardian.id));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={guardian.id} className="text-sm">
                            {guardian.name} ({guardian.email})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="template">Message Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template or write custom message" />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTemplate && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {notificationTemplates.find(t => t.id === selectedTemplate)?.personality_variants[effectiveMode]?.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {notificationTemplates.find(t => t.id === selectedTemplate)?.personality_variants[effectiveMode]?.message}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="custom-message">Custom Message (Optional)</Label>
                    <Textarea
                      id="custom-message"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Write a custom message to override the template..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={sendNotification} 
                      className="flex-1" 
                      disabled={selectedGuardians.length === 0 || (!selectedTemplate && !customMessage)}
                    >
                      {personalityContent.sendButtonText}
                    </Button>
                    <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <Alert className="mb-4">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-blue-600">{stats.unread}</div>
            <div className="text-xs text-gray-600">Unread</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-orange-600">{stats.actionRequired}</div>
            <div className="text-xs text-gray-600">Action Required</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-green-600">{stats.sent}</div>
            <div className="text-xs text-gray-600">Delivered</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-48 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="action_required">Action Required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{personalityContent.emptyMessage}</p>
            <Button onClick={() => setShowSendDialog(true)}>
              <Send className="w-4 h-4 mr-2" />
              {personalityContent.sendButtonText}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 border-l-4 ${
                  notification.priority === 'urgent' ? 'border-red-500' :
                  notification.priority === 'high' ? 'border-orange-500' :
                  notification.priority === 'medium' ? 'border-blue-500' :
                  'border-gray-300'
                } ${!notification.read_at ? 'bg-blue-50/80' : ''}`}
                initial={!shouldReduceMotion ? { opacity: 0, y: 10 } : undefined}
                animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
                transition={!shouldReduceMotion ? { delay: index * 0.05 } : undefined}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        notification.delivery_status === 'delivered' ? 'bg-green-500' :
                        notification.delivery_status === 'sent' ? 'bg-blue-500' :
                        notification.delivery_status === 'failed' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      <h5 className="font-medium text-gray-800">{notification.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {notification.priority}
                      </Badge>
                      {notification.action_required && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Action Required
                        </Badge>
                      )}
                      {!notification.read_at && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        To: {notification.guardian_name || 'Guardian'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                      </div>
                      {notification.expires_at && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertTriangle className="w-3 h-3" />
                          Expires: {new Date(notification.expires_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read_at && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => archiveNotification(notification.id)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GuardianNotificationCenter;