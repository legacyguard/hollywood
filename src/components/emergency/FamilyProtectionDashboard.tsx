// Family Protection Dashboard - Comprehensive emergency management hub with Sofia integration
// Phase 3A: Family Shield System - Central command center for all family protection features

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { usePersonalityManager } from '@/components/sofia/SofiaContextProvider';
import { AnimationSystem } from '@/lib/animation-system';
import type { PersonalityMode } from '@/lib/sofia-types';

// Import our emergency components
import { DeadMansSwitchManager } from './DeadMansSwitchManager';
import { EmergencyContactSystem } from './EmergencyContactSystem';
import { GuardianNotificationCenter } from './GuardianNotificationCenter';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

// Icons
import {
  Shield,
  Heart,
  Users,
  Bell,
  AlertTriangle,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  MessageSquare,
  Settings,
  TrendingUp,
  Globe,
  Download,
  BookOpen,
} from 'lucide-react';

interface ProtectionStatus {
  switchStatus: 'active' | 'inactive' | 'pending' | 'triggered';
  contactsCount: number;
  primaryContactsCount: number;
  unreadNotifications: number;
  actionRequiredNotifications: number;
  lastActivity: Date | null;
  emergencyRulesActive: number;
  recentAlerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: Date;
  }>;
}

interface FamilyProtectionDashboardProps {
  className?: string;
  personalityMode?: PersonalityMode;
}

export const FamilyProtectionDashboard: React.FC<FamilyProtectionDashboardProps> = ({
  className = '',
  personalityMode,
}) => {
  const { userId: _userId } = useAuth();
  const personalityManager = usePersonalityManager();

  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [protectionStatus, setProtectionStatus] = useState<ProtectionStatus>({
    switchStatus: 'inactive',
    contactsCount: 0,
    primaryContactsCount: 0,
    unreadNotifications: 0,
    actionRequiredNotifications: 0,
    lastActivity: null,
    emergencyRulesActive: 0,
    recentAlerts: [],
  });

  // Get effective personality mode
  const detectedMode = personalityManager?.getCurrentStyle() || 'adaptive';
  const effectiveMode = personalityMode || (detectedMode === 'balanced' ? 'adaptive' : detectedMode);

  const shouldReduceMotion = AnimationSystem.shouldReduceMotion();
  const animConfig = AnimationSystem.getConfig(effectiveMode);

  // Callback handlers to update status from child components
  const _handleSwitchStatusChange = (status: ProtectionStatus['switchStatus']) => {
    setProtectionStatus(prev => ({ ...prev, switchStatus: status }));
  };

  const handleContactsUpdate = (total: number, primary: number) => {
    setProtectionStatus(prev => ({
      ...prev,
      contactsCount: total,
      primaryContactsCount: primary
    }));
  };

  const handleNotificationsUpdate = (unread: number, actionRequired: number) => {
    setProtectionStatus(prev => ({
      ...prev,
      unreadNotifications: unread,
      actionRequiredNotifications: actionRequired
    }));
  };

  const handleEmergencyTriggered = () => {
    setProtectionStatus(prev => ({
      ...prev,
      switchStatus: 'triggered',
      recentAlerts: [
        {
          id: Date.now().toString(),
          type: 'error',
          message: 'Emergency protocol activated',
          timestamp: new Date(),
        },
        ...prev.recentAlerts.slice(0, 4)
      ]
    }));
  };

  // Get personality-specific content
  const getPersonalityContent = () => {
    switch (effectiveMode) {
      case 'empathetic':
        return {
          title: '💚 Family Care Command Center',
          subtitle: 'Your loving hub for family protection and wellbeing',
          description: 'Everything you need to keep your family safe and cared for, all in one gentle place',
          overviewTitle: 'Circle of Love Overview',
          bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600',
          icon: Heart,
          tabs: {
            overview: 'Love Circle',
            switch: 'Care Shield',
            contacts: 'Trusted Friends',
            notifications: 'Loving Messages',
          },
        };
      case 'pragmatic':
        return {
          title: '🛡️ Family Protection Command Center',
          subtitle: 'Comprehensive emergency response and monitoring system',
          description: 'Central control hub for all family protection protocols and emergency procedures',
          overviewTitle: 'System Status Overview',
          bgGradient: 'from-blue-50 via-slate-50 to-cyan-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600',
          icon: Shield,
          tabs: {
            overview: 'System Status',
            switch: 'Emergency Protocol',
            contacts: 'Response Team',
            notifications: 'Alert System',
          },
        };
      default:
        return {
          title: '🏠 Family Protection Hub',
          subtitle: 'Complete family safety and support coordination center',
          description: 'Your central dashboard for managing family protection, emergency contacts, and communications',
          overviewTitle: 'Protection Overview',
          bgGradient: 'from-purple-50 via-indigo-50 to-blue-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          icon: Globe,
          tabs: {
            overview: 'Overview',
            switch: 'Protection Switch',
            contacts: 'Support Network',
            notifications: 'Communications',
          },
        };
    }
  };

  const personalityContent = getPersonalityContent();
  const IconComponent = personalityContent.icon;

  // Get status configuration
  const getStatusConfig = () => {
    switch (protectionStatus.switchStatus) {
      case 'active':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CheckCircle,
          message: effectiveMode === 'empathetic' ? 'Your family is lovingly protected' :
                   effectiveMode === 'pragmatic' ? 'All systems operational' :
                   'Family protection active',
        };
      case 'triggered':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: AlertTriangle,
          message: effectiveMode === 'empathetic' ? 'Emergency care activated' :
                   effectiveMode === 'pragmatic' ? 'Emergency protocol engaged' :
                   'Emergency response active',
        };
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: Clock,
          message: effectiveMode === 'empathetic' ? 'Checking on your wellbeing' :
                   effectiveMode === 'pragmatic' ? 'Verification required' :
                   'Status verification needed',
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: XCircle,
          message: effectiveMode === 'empathetic' ? 'Care system is resting' :
                   effectiveMode === 'pragmatic' ? 'System standby' :
                   'Protection inactive',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // Calculate health score
  const healthScore = useMemo(() => {
    let score = 0;
    if (protectionStatus.switchStatus === 'active') score += 30;
    if (protectionStatus.contactsCount >= 2) score += 25;
    if (protectionStatus.primaryContactsCount >= 1) score += 20;
    if (protectionStatus.emergencyRulesActive >= 2) score += 15;
    if (protectionStatus.actionRequiredNotifications === 0) score += 10;
    return Math.min(score, 100);
  }, [protectionStatus]);

  return (
    <div className={className}>
      {/* Header */}
      <motion.div
        className={`bg-gradient-to-br ${personalityContent.bgGradient} rounded-xl border ${personalityContent.borderColor} shadow-lg mb-6`}
        initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : undefined}
        animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
        transition={!shouldReduceMotion ? { duration: animConfig.duration, ease: animConfig.ease } : undefined}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <motion.div
                className={`p-3 rounded-xl bg-white/80 backdrop-blur-sm ${personalityContent.accentColor}`}
                whileHover={!shouldReduceMotion ? { scale: 1.05 } : undefined}
              >
                <IconComponent className="w-8 h-8" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {personalityContent.title}
                </h1>
                <p className="text-gray-600 mb-1">
                  {personalityContent.subtitle}
                </p>
                <p className="text-sm text-gray-500">
                  {personalityContent.description}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${statusConfig.bgColor} backdrop-blur-sm`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
              <span className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.message}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Health Score</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{healthScore}%</div>
              <div className="text-xs text-gray-500">
                {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Needs Attention'}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Guardians</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{protectionStatus.contactsCount}</div>
              <div className="text-xs text-gray-500">
                {protectionStatus.primaryContactsCount} primary
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Notifications</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{protectionStatus.unreadNotifications}</div>
              <div className="text-xs text-gray-500">
                {protectionStatus.actionRequiredNotifications} need action
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Last Check</span>
              </div>
              <div className="text-sm font-bold text-gray-800">
                {protectionStatus.lastActivity
                  ? protectionStatus.lastActivity.toLocaleDateString()
                  : 'Never'
                }
              </div>
              <div className="text-xs text-gray-500">
                {protectionStatus.lastActivity
                  ? protectionStatus.lastActivity.toLocaleTimeString()
                  : 'No recent activity'
                }
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          {protectionStatus.recentAlerts.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Alerts</h4>
              <div className="space-y-2">
                {protectionStatus.recentAlerts.slice(0, 2).map((alert) => (
                  <Alert key={alert.id} className={`${
                    alert.type === 'error' ? 'border-red-200 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>{alert.message}</span>
                      <span className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs Interface */}
      <motion.div
        initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : undefined}
        animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
        transition={!shouldReduceMotion ? { duration: animConfig.duration, delay: 0.1 } : undefined}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-max">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">{personalityContent.tabs.overview}</span>
            </TabsTrigger>
            <TabsTrigger value="switch" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">{personalityContent.tabs.switch}</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{personalityContent.tabs.contacts}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{personalityContent.tabs.notifications}</span>
              {protectionStatus.unreadNotifications > 0 && (
                <Badge variant="destructive" className="text-xs ml-1">
                  {protectionStatus.unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Dead Man's Switch Overview */}
              <DeadMansSwitchManager
                personalityMode={effectiveMode}
                onEmergencyTriggered={(_ruleId) => {
                  handleEmergencyTriggered();
                }}
                onHealthCheckMissed={(_checkId) => {
                  // Health check missed - could trigger additional monitoring
                }}
              />

              {/* Quick Actions */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6"
                initial={!shouldReduceMotion ? { opacity: 0, x: 20 } : undefined}
                animate={!shouldReduceMotion ? { opacity: 1, x: 0 } : undefined}
                transition={!shouldReduceMotion ? { delay: 0.2 } : undefined}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {effectiveMode === 'empathetic' ? '💫 Caring Actions' :
                   effectiveMode === 'pragmatic' ? '⚡ System Actions' :
                   '🚀 Quick Actions'}
                </h3>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('contacts')}
                  >
                    <Users className="w-4 h-4 mr-3" />
                    {effectiveMode === 'empathetic' ? 'Invite a caring friend' :
                     effectiveMode === 'pragmatic' ? 'Add emergency contact' :
                     'Add guardian'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <MessageSquare className="w-4 h-4 mr-3" />
                    {effectiveMode === 'empathetic' ? 'Send loving message' :
                     effectiveMode === 'pragmatic' ? 'Send status update' :
                     'Send notification'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('switch')}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    {effectiveMode === 'empathetic' ? 'Care settings' :
                     effectiveMode === 'pragmatic' ? 'Protocol settings' :
                     'Protection settings'}
                  </Button>

                  <Button
                    variant="default"
                    className="w-full justify-start bg-primary hover:bg-primary-hover"
                    onClick={async () => {
                      try {
                        // Get Supabase URL from environment or use the default
                        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || window.location.origin;
                        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
                        
                        // Call the Supabase Edge Function
                        const response = await fetch(`${supabaseUrl}/functions/v1/generate-survivor-manual`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${supabaseAnonKey}`,
                          },
                          body: JSON.stringify({
                            user_id: _userId,
                          }),
                          credentials: 'include',
                        });

                        if (!response.ok) {
                          throw new Error('Failed to generate manual');
                        }

                        // Get the PDF blob
                        const blob = await response.blob();
                        
                        // Create download link
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `family-manual-${new Date().toISOString().split('T')[0]}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        
                        // Show success message
                        if (window.toast) {
                          window.toast.success(
                            effectiveMode === 'empathetic' 
                              ? '💚 Your family manual has been lovingly prepared!' 
                              : effectiveMode === 'pragmatic'
                              ? 'Family manual generated successfully'
                              : 'Your family manual is ready!'
                          );
                        }
                      } catch (error) {
                        console.error('Error generating manual:', error);
                        if (window.toast) {
                          window.toast.error(
                            effectiveMode === 'empathetic'
                              ? 'Oh dear, something went wrong. Let\'s try again together.'
                              : effectiveMode === 'pragmatic'
                              ? 'Error: Failed to generate manual'
                              : 'Failed to generate family manual'
                          );
                        }
                      }
                    }}
                  >
                    <BookOpen className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">
                      {effectiveMode === 'empathetic' ? 'Create Family Love Letter' :
                       effectiveMode === 'pragmatic' ? 'Generate Emergency Manual' :
                       'Download Family Manual'}
                    </span>
                    <Download className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                      {effectiveMode === 'empathetic' ?
                        'Your family is surrounded by love and protection 💚' :
                        effectiveMode === 'pragmatic' ?
                        'All systems monitoring and ready for response' :
                        'Your family protection network is active and ready'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="switch">
            <DeadMansSwitchManager
              personalityMode={effectiveMode}
              onEmergencyTriggered={handleEmergencyTriggered}
              onHealthCheckMissed={(_checkId) => {
                // Health check missed - could trigger additional monitoring
              }}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <EmergencyContactSystem
              personalityMode={effectiveMode}
              onContactAdded={(contact) => {
                // Update counts
                handleContactsUpdate(protectionStatus.contactsCount + 1, protectionStatus.primaryContactsCount + (contact.can_trigger_emergency ? 1 : 0));
              }}
              onContactUpdated={(_contact) => {
                // Contact updated successfully
              }}
              onNotificationSent={(_notification) => {
                // Notification sent successfully
              }}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <GuardianNotificationCenter
              personalityMode={effectiveMode}
              onNotificationSent={(_notification) => {
                // Notification sent successfully
              }}
              onNotificationRead={(_notificationId) => {
                handleNotificationsUpdate(
                  Math.max(0, protectionStatus.unreadNotifications - 1),
                  protectionStatus.actionRequiredNotifications
                );
              }}
              onEmergencyTriggered={handleEmergencyTriggered}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default FamilyProtectionDashboard;
