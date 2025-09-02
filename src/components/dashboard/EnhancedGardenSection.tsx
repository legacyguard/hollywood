// Enhanced Garden Section - Dashboard integration component for legacy garden
// Phase 2B: Dashboard Integration - Smart garden display with personality adaptation

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePersonalityManager } from '@/components/sofia/SofiaContextProvider';
import { GardenOrchestrator, useGardenProgress } from '@/components/garden';
import { AnimationSystem } from '@/lib/animation-system';
import { showMilestoneRecognition } from '@/components/dashboard/milestoneUtils';
import type { PersonalityMode } from '@/lib/sofia-types';
import type { SerenityMilestone } from '@/lib/path-of-serenity';

// Icons
import {
  Heart,
  Shield,
  Sparkles,
  TrendingUp,
  ExternalLink,
  Settings,
  TreePine,
  Target
} from 'lucide-react';

interface EnhancedGardenSectionProps {
  showHeader?: boolean;
  showProgress?: boolean;
  showQuickActions?: boolean;
  size?: 'compact' | 'medium' | 'large';
  variant?: 'minimal' | 'standard' | 'premium';
  personalityMode?: PersonalityMode;
  className?: string;
}

export const EnhancedGardenSection: React.FC<EnhancedGardenSectionProps> = ({
  showHeader = true,
  showProgress = true,
  showQuickActions = true,
  size = 'medium',
  variant = 'standard',
  personalityMode,
  className = '',
}) => {
  const navigate = useNavigate();
  const personalityManager = usePersonalityManager();
  const { progress: gardenProgress, loading: gardenLoading, error } = useGardenProgress();

  // Get effective personality mode
  const detectedMode = personalityManager?.getCurrentStyle() || 'adaptive';
  const effectiveMode = personalityMode || (detectedMode === 'balanced' ? 'adaptive' : detectedMode);

  const shouldReduceMotion = AnimationSystem.shouldReduceMotion();
  const animConfig = AnimationSystem.getConfig(effectiveMode);

  // State
  const [showMilestoneDetails, setShowMilestoneDetails] = useState(false);
  const [lastViewedMilestone, setLastViewedMilestone] = useState<string | null>(null);

  // Handle milestone celebrations
  const handleMilestoneClick = useCallback((milestone: string) => {
    setLastViewedMilestone(milestone);

    // Show personality-aware milestone celebration
    if (gardenProgress?.activeMilestones) {
      const milestoneData = gardenProgress.activeMilestones.find(m => m.id === milestone);
      if (milestoneData) {
        showMilestoneRecognition(milestoneData as SerenityMilestone, undefined, effectiveMode);
      }
    }

    // Navigate to detailed view after celebration
    setTimeout(() => {
      navigate('/legacy', { state: { milestone } });
    }, 1500);
  }, [navigate, gardenProgress, effectiveMode]);

  // Handle view changes
  const handleViewChange = useCallback((view: string) => {
    // Garden view changed - could trigger analytics or state updates here
    void view; // Acknowledge parameter
  }, []);

  // Get personality-specific content
  const getPersonalityContent = () => {
    switch (effectiveMode) {
      case 'empathetic':
        return {
          title: '💚 Your Garden of Love',
          subtitle: 'Watch your loving protection bloom and grow',
          icon: Heart,
          bgGradient: 'from-green-50 to-emerald-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600',
          progressLabel: 'Love & Protection Growing',
        };
      case 'pragmatic':
        return {
          title: '🛡️ Protection System Status',
          subtitle: 'Monitor security metrics and system performance',
          icon: Shield,
          bgGradient: 'from-blue-50 to-slate-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600',
          progressLabel: 'System Efficiency',
        };
      default:
        return {
          title: '🌟 Your Legacy Garden',
          subtitle: 'Track your comprehensive legacy protection journey',
          icon: Sparkles,
          bgGradient: 'from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          progressLabel: 'Legacy Progress',
        };
    }
  };

  const personalityContent = getPersonalityContent();
  const IconComponent = personalityContent.icon;

  // Quick actions based on personality and progress
  const getQuickActions = () => {
    if (!gardenProgress) return [];

    const actions = [];

    if (gardenProgress.documentsCount < 5) {
      actions.push({
        label: effectiveMode === 'empathetic' ? 'Add Precious Documents' : 'Upload Documents',
        icon: TrendingUp,
        onClick: () => navigate('/vault'),
        color: 'text-blue-600',
        description: effectiveMode === 'empathetic' ? 'Preserve what matters most' : 'Secure important files',
      });
    }

    if (gardenProgress.guardiansCount < 2) {
      actions.push({
        label: effectiveMode === 'empathetic' ? 'Invite Trusted Friends' : 'Add Guardians',
        icon: effectiveMode === 'empathetic' ? Heart : Shield,
        onClick: () => navigate('/guardians'),
        color: effectiveMode === 'empathetic' ? 'text-pink-500' : 'text-green-600',
        description: effectiveMode === 'empathetic' ? 'Share the care with loved ones' : 'Enhance security redundancy',
      });
    }

    if (gardenProgress.completedMilestones < 3) {
      actions.push({
        label: 'Complete Milestones',
        icon: Target,
        onClick: () => navigate('/legacy'),
        color: 'text-purple-600',
        description: 'Achieve your next protection goals',
      });
    }

    actions.push({
      label: 'Garden Settings',
      icon: Settings,
      onClick: () => navigate('/settings'),
      color: 'text-gray-600',
      description: 'Customize your garden experience',
    });

    return actions.slice(0, 3); // Limit to 3 actions
  };

  const quickActions = getQuickActions();

  if (error) {
    return (
      <div className={`bg-card rounded-xl border border-card-border p-6 ${className}`}>
        <div className="text-center py-8">
          <TreePine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Garden Unavailable</h3>
          <p className="text-sm text-muted-foreground">
            Unable to load your legacy garden. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${personalityContent.bgGradient} rounded-xl border ${personalityContent.borderColor} shadow-sm overflow-hidden ${className}`}
      initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : undefined}
      animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
      transition={!shouldReduceMotion ? {
        duration: animConfig.duration,
        ease: animConfig.ease as any
      } : undefined}
    >
      {/* Header */}
      {showHeader && (
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <motion.div
                className={`p-2 rounded-lg bg-white/80 backdrop-blur-sm ${personalityContent.accentColor}`}
                whileHover={!shouldReduceMotion ? { scale: 1.05 } : undefined}
              >
                <IconComponent className="w-5 h-5" />
              </motion.div>

              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-1">
                  {personalityContent.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {personalityContent.subtitle}
                </p>
              </div>
            </div>

            <motion.button
              onClick={() => navigate('/legacy')}
              className="flex items-center gap-1 text-xs px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white/90 transition-colors"
              whileHover={!shouldReduceMotion ? { scale: 1.05 } : undefined}
              whileTap={!shouldReduceMotion ? { scale: 0.95 } : undefined}
            >
              View Details
              <ExternalLink className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      {showProgress && gardenProgress && (
        <div className="px-6 pb-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                {personalityContent.progressLabel}
              </span>
              <span className="text-sm font-bold text-gray-800">
                {gardenProgress.overallProgress}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <motion.div
                className={`h-2 rounded-full ${
                  effectiveMode === 'empathetic' ? 'bg-emerald-500' :
                  effectiveMode === 'pragmatic' ? 'bg-blue-600' : 'bg-purple-500'
                }`}
                initial={!shouldReduceMotion ? { width: 0 } : undefined}
                animate={!shouldReduceMotion ? { width: `${gardenProgress.overallProgress}%` } : undefined}
                transition={!shouldReduceMotion ? { duration: 1, delay: 0.5 } : undefined}
                style={shouldReduceMotion ? { width: `${gardenProgress.overallProgress}%` } : undefined}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
              <div className="text-center">
                <div className="font-semibold text-gray-800">{gardenProgress.documentsCount}</div>
                <div>Documents</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">{gardenProgress.guardiansCount}</div>
                <div>Guardians</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">{gardenProgress.completedMilestones}</div>
                <div>Milestones</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Garden Visualization */}
      <div className="px-6 pb-4">
        {!gardenLoading && gardenProgress ? (
          <GardenOrchestrator
            personalityMode={effectiveMode}
            size={size}
            variant={variant}
            allowViewSwitching={variant !== 'minimal'}
            showControls={variant === 'premium'}
            interactive={true}
            enableCelebrations={true}
            onMilestoneClick={handleMilestoneClick}
            onViewChange={handleViewChange}
            className="w-full"
          />
        ) : (
          <div className="flex items-center justify-center h-48 bg-white/40 backdrop-blur-sm rounded-lg">
            <motion.div
              animate={!shouldReduceMotion ? { rotate: 360 } : undefined}
              transition={!shouldReduceMotion ? { duration: 2, repeat: Infinity, ease: 'linear' } : undefined}
            >
              <TreePine className="w-8 h-8 text-gray-500" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {showQuickActions && quickActions.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {effectiveMode === 'empathetic' ? 'Suggested Acts of Love' :
               effectiveMode === 'pragmatic' ? 'Recommended Actions' : 'Quick Actions'}
            </h4>

            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 p-3 bg-white/80 rounded-lg hover:bg-white/90 transition-colors text-left"
                  whileHover={!shouldReduceMotion ? { scale: 1.02, x: 4 } : undefined}
                  whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
                  initial={!shouldReduceMotion ? { opacity: 0, x: -10 } : undefined}
                  animate={!shouldReduceMotion ? { opacity: 1, x: 0 } : undefined}
                  transition={!shouldReduceMotion ? { delay: index * 0.1 + 0.3 } : undefined}
                >
                  <action.icon className={`w-4 h-4 ${action.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{action.label}</div>
                    <div className="text-xs text-gray-600 truncate">{action.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Milestone Details Modal */}
      <AnimatePresence>
        {showMilestoneDetails && lastViewedMilestone && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMilestoneDetails(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Milestone Achieved!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {lastViewedMilestone}
                </p>
                <button
                  onClick={() => {
                    setShowMilestoneDetails(false);
                    navigate('/legacy');
                  }}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View in Legacy Garden
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedGardenSection;
