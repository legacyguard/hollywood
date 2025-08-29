import React from 'react';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon-library';
import {
  getAdaptiveMilestoneText,
  type SerenityMilestone,
} from '@/lib/path-of-serenity';
import {
  defaultUserPreferences,
} from '@/types/user-preferences';
import type { PersonalityMode } from '@/lib/sofia-types';

// Legacy component interface for backward compatibility
// Now implemented using toast system - no longer renders UI
interface MilestoneCelebrationProps {
  milestone: SerenityMilestone | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = () => {
  // This component is deprecated - use showMilestoneRecognition directly
  return null;
};

export function showMilestoneRecognition(
  milestone: SerenityMilestone,
  userId?: string,
  personalityMode?: PersonalityMode
) {
  // Load user preferences for communication style
  let userPreferences = defaultUserPreferences;
  if (userId) {
    const savedPrefs = localStorage.getItem(`preferences_${userId}`);
    if (savedPrefs) {
      try {
        userPreferences = JSON.parse(savedPrefs);
      } catch (error) {
        console.error('Error loading user preferences for milestone:', error);
      }
    }
  }

  // Get personality-aware styling and content
  const getPersonalityContent = (mode: PersonalityMode) => {
    switch (mode) {
      case 'empathetic':
        return {
          bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/90 dark:to-emerald-950/90',
          borderColor: 'border-green-200/50 dark:border-green-800/50',
          iconBg: 'from-green-400 to-emerald-500',
          textPrimary: 'text-green-900 dark:text-green-100',
          textSecondary: 'text-green-700 dark:text-green-300',
          textTertiary: 'text-green-600 dark:text-green-400',
          celebrationText: '💚 New Milestone of Love Achieved:',
          duration: 5000,
        };
      case 'pragmatic':
        return {
          bgGradient: 'from-blue-50 to-slate-50 dark:from-blue-950/90 dark:to-slate-950/90',
          borderColor: 'border-blue-200/50 dark:border-blue-800/50',
          iconBg: 'from-blue-500 to-slate-600',
          textPrimary: 'text-blue-900 dark:text-blue-100',
          textSecondary: 'text-blue-700 dark:text-blue-300',
          textTertiary: 'text-blue-600 dark:text-blue-400',
          celebrationText: '🛡️ System Milestone Completed:',
          duration: 3000,
        };
      default:
        return {
          bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/90 dark:to-pink-950/90',
          borderColor: 'border-purple-200/50 dark:border-purple-800/50',
          iconBg: 'from-purple-500 to-pink-500',
          textPrimary: 'text-purple-900 dark:text-purple-100',
          textSecondary: 'text-purple-700 dark:text-purple-300',
          textTertiary: 'text-purple-600 dark:text-purple-400',
          celebrationText: '🌟 Legacy Milestone Unlocked:',
          duration: 4000,
        };
    }
  };

  const personalityContent = getPersonalityContent(personalityMode || 'adaptive');

  // Trigger firefly celebration
  // Note: This is called from outside React component, so we'll use a global event
  window.dispatchEvent(
    new CustomEvent('milestoneUnlocked', {
      detail: { milestone, userId },
    })
  );

  // Get adaptive text for the milestone
  const adaptiveCompletedDescription = getAdaptiveMilestoneText(
    milestone,
    'completedDescription',
    userId,
    userPreferences.communication.style
  );

  const adaptiveName = getAdaptiveMilestoneText(
    milestone,
    'name',
    userId,
    userPreferences.communication.style
  );

  toast.custom(
    t => (
      <div className={`w-full max-w-4xl bg-gradient-to-r ${personalityContent.bgGradient} border ${personalityContent.borderColor} shadow-lg backdrop-blur-sm`}>
        <div className='flex items-center gap-4 p-4'>
          {/* Milestone Icon */}
          <div className='flex-shrink-0'>
            <div className={`w-12 h-12 bg-gradient-to-br ${personalityContent.iconBg} rounded-full flex items-center justify-center shadow-md`}>
              <Icon name={milestone.icon}
                className='w-6 h-6 text-white'
              />
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between'>
              <div>
                <p className={`font-medium ${personalityContent.textPrimary}`}>
                  {personalityContent.celebrationText}{' '}
                  <span className='font-semibold'>
                    {adaptiveName.replace(
                      /^[\u{1F5FF}\u{1F91D}\u{1F3DB}\u{23F0}\u{1F5FA}\u{1F4AB}\u{1F451}]\s/u,
                      ''
                    )}
                  </span>
                </p>
                <p className={`text-sm ${personalityContent.textSecondary} mt-1 leading-relaxed`}>
                  {adaptiveCompletedDescription}
                </p>
                {milestone.rewards && (
                  <p className={`text-xs ${personalityContent.textTertiary} mt-2 italic`}>
                    ✨ {milestone.rewards.title}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => toast.dismiss(t)}
                className={`flex-shrink-0 ml-4 p-1 ${personalityContent.textTertiary} hover:opacity-80 transition-colors`}
              >
                <Icon name="x" className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: personalityContent.duration,
      position: 'top-center',
      className: 'milestone-recognition-toast',
      unstyled: true,
    }
  );
}
