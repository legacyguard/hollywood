// Dead Man's Switch Manager - Core emergency detection system with Sofia personality integration
// Phase 3A: Family Shield System - Advanced inactivity detection and emergency protocols

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { usePersonalityManager } from '@/components/sofia/SofiaContextProvider';
import { AnimationSystem } from '@/lib/animation-system';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import type { PersonalityMode } from '@/lib/sofia-types';
import { toast } from 'sonner';

// Icons
import {
  Shield,
  Heart,
  AlertTriangle,
  Clock,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  Settings,
  Bell,
  Phone,
  Mail,
  User,
  Calendar,
  Zap,
} from 'lucide-react';

interface EmergencyRule {
  id: string;
  rule_name: string;
  description: string;
  rule_type: 'inactivity' | 'health_check' | 'guardian_manual' | 'suspicious_activity';
  is_enabled: boolean;
  trigger_conditions: Array<{
    type: string;
    threshold_value: number;
    threshold_unit: string;
    comparison_operator: string;
  }>;
  response_actions: Array<{
    type: string;
    priority: number;
    delay_minutes: number;
  }>;
  last_triggered_at: string | null;
  trigger_count: number;
}

interface HealthCheckStatus {
  id: string;
  check_type: 'login' | 'document_access' | 'api_ping' | 'manual_confirmation';
  status: 'responded' | 'missed' | 'pending';
  scheduled_at: string;
  responded_at: string | null;
  response_method: string | null;
}

interface DeadMansSwitchProps {
  className?: string;
  personalityMode?: PersonalityMode;
  onEmergencyTriggered?: (ruleId: string) => void;
  onHealthCheckMissed?: (checkId: string) => void;
}

export const DeadMansSwitchManager: React.FC<DeadMansSwitchProps> = ({
  className = '',
  personalityMode,
  onEmergencyTriggered,
  onHealthCheckMissed,
}) => {
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseWithClerk();
  const personalityManager = usePersonalityManager();

  // State
  const [emergencyRules, setEmergencyRules] = useState<EmergencyRule[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheckStatus[]>([]);
  const [switchStatus, setSwitchStatus] = useState<'active' | 'inactive' | 'pending' | 'triggered'>('inactive');
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get effective personality mode
  const detectedMode = personalityManager?.getCurrentStyle() || 'adaptive';
  const effectiveMode = personalityMode || (detectedMode === 'balanced' ? 'adaptive' : detectedMode);

  const shouldReduceMotion = AnimationSystem.shouldReduceMotion();
  const animConfig = AnimationSystem.getConfig(effectiveMode);

  // Load emergency rules and health check status
  const loadSwitchStatus = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const supabase = await createSupabaseClient();

      // Load emergency detection rules
      const { data: rules, error: rulesError } = await supabase
        .from('emergency_detection_rules')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: true });

      if (rulesError) throw rulesError;

      // Load recent health checks
      const { data: checks, error: checksError } = await supabase
        .from('user_health_checks')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_at', { ascending: false })
        .limit(10);

      if (checksError) throw checksError;

      // Check current switch status from family shield settings
      const { data: shieldSettings, error: shieldError } = await supabase
        .from('family_shield_settings')
        .select('shield_status, last_activity_check, is_shield_enabled')
        .eq('user_id', userId)
        .single();

      if (shieldError && shieldError.code !== 'PGRST116') {
        console.error('Error loading shield settings:', shieldError);
      }

      setEmergencyRules(rules || []);
      setHealthChecks(checks || []);
      setSwitchStatus(shieldSettings?.shield_status || 'inactive');
      setLastActivity(shieldSettings?.last_activity_check ? new Date(shieldSettings.last_activity_check) : null);
      setError(null);
    } catch (err) {
      console.error('Error loading Dead Man\'s Switch status:', err);
      setError(err instanceof Error ? err.message : 'Failed to load switch status');
    } finally {
      setLoading(false);
    }
  }, [userId, createSupabaseClient]);

  // Record activity to reset the switch
  const recordActivity = useCallback(async (activityType: string = 'manual_confirmation') => {
    if (!userId) return;

    try {
      const supabase = await createSupabaseClient();

      // Record health check response
      const { error: healthCheckError } = await supabase
        .from('user_health_checks')
        .insert({
          user_id: userId,
          check_type: activityType,
          status: 'responded',
          responded_at: new Date().toISOString(),
          response_method: 'dashboard',
          metadata: { source: 'dead_mans_switch_manager' }
        });

      if (healthCheckError) throw healthCheckError;

      // Update last activity
      setLastActivity(new Date());
      setSwitchStatus('active');

      // Show personality-aware success message
      const message = effectiveMode === 'empathetic'
        ? '💚 Thank you for letting us know you\'re safe! Your family\'s protection is updated.'
        : effectiveMode === 'pragmatic'
        ? '🛡️ Activity confirmed. Protection protocols updated.'
        : '✅ Activity recorded. Your legacy protection is active.';

      toast.success(message);

    } catch (err) {
      console.error('Error recording activity:', err);
      toast.error('Failed to record activity. Please try again.');
    }
  }, [userId, createSupabaseClient, effectiveMode]);

  // Toggle emergency rule
  const toggleRule = useCallback(async (ruleId: string, enabled: boolean) => {
    try {
      const supabase = await createSupabaseClient();

      const { error } = await supabase
        .from('emergency_detection_rules')
        .update({ is_enabled: enabled, updated_at: new Date().toISOString() })
        .eq('id', ruleId);

      if (error) throw error;

      setEmergencyRules(prev => prev.map(rule =>
        rule.id === ruleId ? { ...rule, is_enabled: enabled } : rule
      ));

      toast.success(`Emergency rule ${enabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      console.error('Error toggling rule:', err);
      toast.error('Failed to update rule settings');
    }
  }, [createSupabaseClient]);

  // Initialize default rules if none exist
  const initializeDefaultRules = useCallback(async () => {
    if (!userId || emergencyRules.length > 0) return;

    try {
      const supabase = await createSupabaseClient();

      const { error } = await supabase.rpc('initialize_default_emergency_rules', {
        target_user_id: userId
      });

      if (error) throw error;

      await loadSwitchStatus(); // Reload to get new rules
    } catch (err) {
      console.error('Error initializing default rules:', err);
    }
  }, [userId, createSupabaseClient, emergencyRules.length, loadSwitchStatus]);

  // Load initial data
  useEffect(() => {
    loadSwitchStatus();
  }, [loadSwitchStatus]);

  // Initialize default rules if needed
  useEffect(() => {
    if (!loading && emergencyRules.length === 0) {
      initializeDefaultRules();
    }
  }, [loading, emergencyRules.length, initializeDefaultRules]);

  // Get personality-specific content
  const getPersonalityContent = () => {
    switch (effectiveMode) {
      case 'empathetic':
        return {
          title: '💚 Family Care Shield',
          subtitle: 'Loving protection that watches over your family when you can\'t',
          statusActive: 'Your loving protection is active',
          statusInactive: 'Care shield is paused',
          statusPending: 'Checking on your wellbeing',
          statusTriggered: 'Emergency care activated',
          activityButton: 'Let your family know you\'re safe',
          bgGradient: 'from-emerald-50 to-green-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600',
          icon: Heart,
        };
      case 'pragmatic':
        return {
          title: '🛡️ Dead Man\'s Switch Protocol',
          subtitle: 'Automated emergency detection and response system',
          statusActive: 'System operational - monitoring active',
          statusInactive: 'Protocol disabled',
          statusPending: 'Verification required',
          statusTriggered: 'Emergency protocol activated',
          activityButton: 'Confirm system status',
          bgGradient: 'from-blue-50 to-slate-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600',
          icon: Shield,
        };
      default:
        return {
          title: '🔐 Family Protection Switch',
          subtitle: 'Intelligent guardian system that protects your legacy',
          statusActive: 'Protection system active',
          statusInactive: 'System standby',
          statusPending: 'Status verification needed',
          statusTriggered: 'Emergency protection engaged',
          activityButton: 'Update protection status',
          bgGradient: 'from-purple-50 to-indigo-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          icon: Zap,
        };
    }
  };

  const personalityContent = getPersonalityContent();
  const IconComponent = personalityContent.icon;

  // Get status color and message
  const getStatusConfig = () => {
    switch (switchStatus) {
      case 'active':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CheckCircle,
          message: personalityContent.statusActive,
        };
      case 'inactive':
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: XCircle,
          message: personalityContent.statusInactive,
        };
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: Clock,
          message: personalityContent.statusPending,
        };
      case 'triggered':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: AlertTriangle,
          message: personalityContent.statusTriggered,
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: XCircle,
          message: 'Status unknown',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  if (loading) {
    return (
      <div className={`bg-gradient-to-br ${personalityContent.bgGradient} rounded-xl border ${personalityContent.borderColor} p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <motion.div
            animate={!shouldReduceMotion ? { rotate: 360 } : undefined}
            transition={!shouldReduceMotion ? { duration: 2, repeat: Infinity, ease: 'linear' } : undefined}
          >
            <Shield className="w-8 h-8 text-gray-400" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 p-6 ${className}`}>
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">System Error</h3>
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={loadSwitchStatus}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
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
        <div className="flex items-start justify-between mb-4">
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

          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor}`}>
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className={`text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.message}
            </span>
          </div>
        </div>

        {/* Last Activity */}
        {lastActivity && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Clock className="w-3 h-3" />
            <span>Last activity: {lastActivity.toLocaleDateString()} at {lastActivity.toLocaleTimeString()}</span>
          </div>
        )}

        {/* Activity Confirmation Button */}
        <motion.button
          onClick={() => recordActivity()}
          className={`w-full bg-white/90 backdrop-blur-sm border border-white/20 text-gray-700 px-4 py-3 rounded-lg hover:bg-white transition-colors text-sm font-medium`}
          whileHover={!shouldReduceMotion ? { scale: 1.02 } : undefined}
          whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          {personalityContent.activityButton}
        </motion.button>
      </div>

      {/* Emergency Rules Status */}
      <div className="px-6 pb-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              {effectiveMode === 'empathetic' ? 'Care Protocols' :
               effectiveMode === 'pragmatic' ? 'Detection Rules' : 'Protection Rules'}
            </h4>
            <span className="text-xs text-gray-500">
              {emergencyRules.filter(r => r.is_enabled).length}/{emergencyRules.length} active
            </span>
          </div>

          <div className="space-y-2">
            {emergencyRules.slice(0, 3).map((rule) => (
              <motion.div
                key={rule.id}
                className="flex items-center justify-between p-2 bg-white/80 rounded-lg"
                initial={!shouldReduceMotion ? { opacity: 0, x: -10 } : undefined}
                animate={!shouldReduceMotion ? { opacity: 1, x: 0 } : undefined}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${rule.is_enabled ? 'bg-green-400' : 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-700">{rule.rule_name}</span>
                </div>
                <button
                  onClick={() => toggleRule(rule.id, !rule.is_enabled)}
                  className={`text-xs px-2 py-1 rounded ${
                    rule.is_enabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {rule.is_enabled ? 'ON' : 'OFF'}
                </button>
              </motion.div>
            ))}
          </div>

          {emergencyRules.length > 3 && (
            <button className="text-xs text-gray-500 hover:text-gray-700 mt-2">
              View all {emergencyRules.length} rules →
            </button>
          )}
        </div>
      </div>

      {/* Recent Health Checks */}
      {healthChecks.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {healthChecks.slice(0, 3).map((check) => (
                <div key={check.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    check.status === 'responded' ? 'bg-green-400' :
                    check.status === 'missed' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                  <span className="text-gray-600 capitalize">{check.check_type.replace('_', ' ')}</span>
                  <span className="text-gray-500">
                    {new Date(check.scheduled_at).toLocaleDateString()}
                  </span>
                  <span className={`ml-auto ${
                    check.status === 'responded' ? 'text-green-600' :
                    check.status === 'missed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DeadMansSwitchManager;
