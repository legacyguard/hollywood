import React from 'react';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon-library';
import { getAdaptiveMilestoneText, type SerenityMilestone } from '@/lib/path-of-serenity';
import { UserPreferences, defaultUserPreferences } from '@/types/user-preferences';

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

export function showMilestoneRecognition(milestone: SerenityMilestone, userId?: string) {
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
    (t) => (
      <div className="w-full max-w-4xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/90 dark:to-emerald-950/90 border border-green-200/50 dark:border-green-800/50 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-4 p-4">
          {/* Milestone Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <Icon name={milestone.icon as never} className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  New Milestone of Peace Unlocked: <span className="font-semibold">{adaptiveName.replace(/^[\u{1F5FF}\u{1F91D}\u{1F3DB}\u{23F0}\u{1F5FA}\u{1F4AB}\u{1F451}]\s/u, '')}</span>
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1 leading-relaxed">
                  {adaptiveCompletedDescription}
                </p>
                {milestone.rewards && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 italic">
                    ✨ {milestone.rewards.title}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => toast.dismiss(t)}
                className="flex-shrink-0 ml-4 p-1 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                <Icon name="x" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: 4000,
      position: 'top-center',
      className: 'milestone-recognition-toast',
      unstyled: true,
    }
  );
}
