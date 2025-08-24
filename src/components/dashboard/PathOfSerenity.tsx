import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon-library';
import { useAuth } from '@clerk/clerk-react';
import { useSupabaseClient } from '@/integrations/supabase/client';
import { 
  SerenityMilestone, 
  FiveMinuteChallenge,
  SERENITY_MILESTONES,
  calculateUnlockedMilestones,
  getNextChallenge,
  generateSerenityMessage,
  MilestoneCalculationResult
} from '@/lib/path-of-serenity';
import { MilestoneCelebration } from './MilestoneCelebration';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PathOfSerenityProps {
  className?: string;
}

interface UserStats {
  documentsCount: number;
  guardiansCount: number;
  categoriesWithDocuments: string[];
  hasExpiryTracking: boolean;
  legacyItemsCount: number;
}

export const PathOfSerenity: React.FC<PathOfSerenityProps> = ({ className = '' }) => {
  const [milestones, setMilestones] = useState<SerenityMilestone[]>(SERENITY_MILESTONES);
  const [nextChallenge, setNextChallenge] = useState<FiveMinuteChallenge | null>(null);
  const [serenityMessage, setSerenityMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<SerenityMilestone | null>(null);
  const [celebrationMilestone, setCelebrationMilestone] = useState<SerenityMilestone | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    documentsCount: 0,
    guardiansCount: 0,
    categoriesWithDocuments: [],
    hasExpiryTracking: false,
    legacyItemsCount: 0
  });

  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseClient();
  const navigate = useNavigate();

  // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      if (!userId) return;

      try {
        const supabase = createSupabaseClient();
        
        // Count documents
        const { data: documents } = await supabase
          .from('documents')
          .select('category, expires_at')
          .eq('user_id', userId);

        // Count guardians (simulated - we'll implement this when guardians feature is ready)
        const { data: guardians } = await supabase
          .from('guardians')
          .select('id')
          .eq('user_id', userId)
          .limit(1);

        const documentsCount = documents?.length || 0;
        const guardiansCount = guardians?.length || 0;
        const categoriesWithDocuments = [...new Set(documents?.map(d => d.category).filter(Boolean) || [])];
        const hasExpiryTracking = documents?.some(d => d.expires_at) || false;
        const legacyItemsCount = 0; // Will be implemented with legacy features

        const stats: UserStats = {
          documentsCount,
          guardiansCount,
          categoriesWithDocuments,
          hasExpiryTracking,
          legacyItemsCount
        };

        setUserStats(stats);

        // Calculate unlocked milestones with celebration detection
        const result = calculateUnlockedMilestones(stats, milestones);
        setMilestones(result.milestones);

        // Show celebration for newly unlocked milestones
        if (result.newlyUnlocked.length > 0) {
          // Show celebration for the first newly unlocked milestone
          const milestoneTocelebrate = result.newlyUnlocked[0];
          setCelebrationMilestone(milestoneTocelebrate);
          setIsCelebrationOpen(true);
          
          // Toast for additional milestones
          if (result.newlyUnlocked.length > 1) {
            toast.success(`🌟 You unlocked ${result.newlyUnlocked.length} new milestones!`);
          }
        }

        // Get next challenge
        const challenge = getNextChallenge(result.milestones, stats);
        setNextChallenge(challenge);

        // Generate serenity message
        const message = generateSerenityMessage(result.milestones);
        setSerenityMessage(message);

      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStats();
  }, [userId, createSupabaseClient, milestones]);

  const handleChallengeClick = () => {
    if (nextChallenge) {
      navigate(nextChallenge.navigationTarget);
      toast.success('Spustili ste novú výzvu! Sofia vás povedie krok za krokom.');
    }
  };

  const handleMilestoneClick = (milestone: SerenityMilestone) => {
    setSelectedMilestone(milestone);
  };

  const handleCelebrationClose = () => {
    setIsCelebrationOpen(false);
    setCelebrationMilestone(null);
  };

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Icon name="loader" className="w-6 h-6 animate-spin text-primary" />
            <span className="text-lg text-muted-foreground">Načítavanie vašej Cesty Pokoja...</span>
          </div>
        </div>
      </Card>
    );
  }

  const unlockedCount = milestones.filter(m => m.isUnlocked).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Serenity Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Icon name="sparkles" className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Cesta Pokoja
              </h2>
              <Icon name="sparkles" className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-blue-700 dark:text-blue-200 text-lg leading-relaxed max-w-2xl mx-auto">
              {serenityMessage}
            </p>
            {unlockedCount > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <Icon name="check-circle" className="w-4 h-4" />
                <span>Odomknuté míľniky: {unlockedCount} z {milestones.length}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* The Sacred Path Visualization */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-80 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                  <pattern id="serenityPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="currentColor" className="text-blue-300" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#serenityPattern)" />
              </svg>
            </div>

            {/* Path Line */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <path
                d="M 60 340 Q 150 280 200 240 T 300 200 T 400 160 T 500 120 T 600 100"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeDasharray="5,5"
                className="opacity-60"
              />
            </svg>

            {/* Milestone Points */}
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${milestone.visualPosition.x}%`,
                  top: `${milestone.visualPosition.y}%`,
                  zIndex: 10
                }}
                onClick={() => handleMilestoneClick(milestone)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 0.2, type: "spring", stiffness: 200 }
                }}
              >
                <div className={`
                  relative w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-300
                  ${milestone.isUnlocked 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 shadow-green-200' 
                    : 'bg-gradient-to-br from-slate-200 to-slate-300 border-slate-300 shadow-slate-200'
                  }
                `}>
                  {milestone.isUnlocked ? (
                    <>
                      <Icon name={milestone.icon as never} className="w-7 h-7 text-white" />
                      <motion.div
                        className="absolute -inset-1 rounded-full bg-green-300 opacity-30"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </>
                  ) : (
                    <Icon name="lock" className="w-7 h-7 text-slate-500" />
                  )}
                </div>

                {/* Milestone Label */}
                <div className={`
                  absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-center whitespace-nowrap
                  ${milestone.isUnlocked 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }
                `}>
                  {milestone.name.replace(/^[\u{1F5FF}\u{1F91D}\u{1F3DB}\u{23F0}\u{1F5FA}\u{1F4AB}\u{1F451}]\s/u, '')}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5-Minute Challenge Section */}
      {nextChallenge && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Icon name="clock" className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="flex-grow space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                    Vaša ďalšia {nextChallenge.estimatedTime}-minútová cesta k pokoju
                  </h3>
                  <h4 className="text-xl font-bold text-amber-800 dark:text-amber-200 mt-1">
                    {nextChallenge.title}
                  </h4>
                </div>
                <p className="text-amber-700 dark:text-amber-200 leading-relaxed">
                  {nextChallenge.description}
                </p>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleChallengeClick}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-lg shadow-md"
                  >
                    <Icon name="play" className="w-4 h-4 mr-2" />
                    Začať {nextChallenge.estimatedTime}-minútovú výzvu
                  </Button>
                  <div className="text-xs text-amber-600 dark:text-amber-300 flex items-center gap-1">
                    <Icon name="zap" className="w-3 h-3" />
                    Sofia vás povedie krok za krokom
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestone Detail Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className={`
                  w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center
                  ${selectedMilestone.isUnlocked 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300' 
                    : 'bg-gradient-to-br from-slate-200 to-slate-300 border-slate-300'
                  }
                `}>
                  <Icon 
                    name={selectedMilestone.isUnlocked ? selectedMilestone.icon as never : 'lock'} 
                    className={`w-8 h-8 ${selectedMilestone.isUnlocked ? 'text-white' : 'text-slate-500'}`} 
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedMilestone.name}
                  </h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                    selectedMilestone.isUnlocked 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {selectedMilestone.isUnlocked ? 'Odomknuté' : 'Čaká na odomknutie'}
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedMilestone.isUnlocked 
                    ? selectedMilestone.completedDescription 
                    : selectedMilestone.description
                  }
                </p>

                {selectedMilestone.isUnlocked && selectedMilestone.rewards && (
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      🎉 {selectedMilestone.rewards.title}
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {selectedMilestone.rewards.description}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => setSelectedMilestone(null)}
                  variant="outline"
                  className="mt-4"
                >
                  Zavrieť
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Celebration Modal */}
      <MilestoneCelebration
        milestone={celebrationMilestone}
        isOpen={isCelebrationOpen}
        onClose={handleCelebrationClose}
      />
    </div>
  );
};