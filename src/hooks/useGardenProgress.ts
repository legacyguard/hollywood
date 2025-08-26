import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import type {
  SerenityMilestone} from '@/lib/path-of-serenity';
import {
  getSerenityMilestones,
} from '@/lib/path-of-serenity';

export interface GardenProgressData {
  overallProgress: number; // 0-100 percentage
  documentsCount: number;
  guardiansCount: number;
  completedMilestones: number;
  totalMilestones: number;
  activeMilestones: SerenityMilestone[];
  timeCapsules: number;
  willProgress: number;
  seedState: 'dormant' | 'sprouting' | 'growing' | 'flourishing' | 'blooming';
  gardenElements: {
    roots: number; // Documents (foundation)
    branches: number; // Guardians (protection)
    leaves: number; // Active features
    flowers: number; // Milestones achieved
    fruits: number; // Time capsules / legacy items
  };
}

export const useGardenProgress = () => {
  const { userId } = useAuth();
  const createSupabaseClient = useSupabaseWithClerk();
  const [progress, setProgress] = useState<GardenProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = await createSupabaseClient();

      // Get all data in parallel
      const [
        { data: documents, error: docError },
        { data: guardians, error: guardianError },
        { data: timeCapsules, error: capsulesError },
        { data: wills, error: willsError },
      ] = await Promise.all([
        supabase.from('documents').select('*').eq('user_id', userId),
        supabase
          .from('guardians')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true),
        supabase.from('time_capsules').select('*').eq('user_id', userId),
        supabase.from('wills').select('*').eq('user_id', userId),
      ]);

      if (docError) throw docError;
      if (guardianError) throw guardianError;
      if (capsulesError) throw capsulesError;
      if (willsError) throw willsError;

      // Calculate milestones progress
      const milestones = getSerenityMilestones();
      const activeMilestones: SerenityMilestone[] = [];
      const completedCount = milestones.reduce((count, milestone) => {
        const isActive = checkMilestoneActive(milestone, {
          documents: documents || [],
          guardians: guardians || [],
          timeCapsules: timeCapsules || [],
          wills: wills || [],
        });

        if (isActive) {
          activeMilestones.push(milestone);
          return count + 1;
        }
        return count;
      }, 0);

      // Calculate component counts
      const documentsCount = documents?.length || 0;
      const guardiansCount = guardians?.length || 0;
      const timeCapsulesCount = timeCapsules?.length || 0;

      // Calculate will progress (0-100)
      const willProgress =
        wills && wills.length > 0
          ? Math.min((wills[0].completion_percentage || 0) * 100, 100)
          : 0;

      // Calculate overall progress with weighted components
      const weights = {
        documents: 0.25, // 25% - Foundation (documents)
        guardians: 0.25, // 25% - Protection (guardians)
        milestones: 0.3, // 30% - Growth (milestones)
        timeCapsules: 0.1, // 10% - Legacy (time capsules)
        will: 0.1, // 10% - Legal foundation
      };

      const normalizedScores = {
        documents: Math.min(documentsCount / 10, 1) * 100, // Normalize to 10 docs max
        guardians: Math.min(guardiansCount / 5, 1) * 100, // Normalize to 5 guardians max
        milestones: (completedCount / milestones.length) * 100,
        timeCapsules: Math.min(timeCapsulesCount / 3, 1) * 100, // Normalize to 3 capsules max
        will: willProgress,
      };

      const overallProgress = Object.entries(weights).reduce(
        (total, [key, weight]) => {
          return (
            total +
            normalizedScores[key as keyof typeof normalizedScores] * weight
          );
        },
        0
      );

      // Determine seed state based on overall progress
      const getSeedState = (
        progress: number
      ): GardenProgressData['seedState'] => {
        if (progress === 0) return 'dormant';
        if (progress < 20) return 'sprouting';
        if (progress < 50) return 'growing';
        if (progress < 80) return 'flourishing';
        return 'blooming';
      };

      // Calculate garden elements (visual representation)
      const gardenElements = {
        roots: Math.min(documentsCount, 10), // Documents as roots
        branches: guardiansCount, // Guardians as branches
        leaves: Math.floor(overallProgress / 10), // General progress indicators
        flowers: completedCount, // Milestones as flowers
        fruits: timeCapsulesCount, // Time capsules as fruits
      };

      const progressData: GardenProgressData = {
        overallProgress: Math.round(overallProgress),
        documentsCount,
        guardiansCount,
        completedMilestones: completedCount,
        totalMilestones: milestones.length,
        activeMilestones,
        timeCapsules: timeCapsulesCount,
        willProgress: Math.round(willProgress),
        seedState: getSeedState(overallProgress),
        gardenElements,
      };

      setProgress(progressData);
      setError(null);
    } catch (err) {
      console.error('Error calculating garden progress:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to calculate progress'
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if milestone is active
  const checkMilestoneActive = (
    milestone: SerenityMilestone,
    data: {
      documents: any[];
      guardians: any[];
      timeCapsules: any[];
      wills: any[];
    }
  ): boolean => {
    switch (milestone.id) {
      case 'foundation_stone':
        return data.documents.length >= 1;
      case 'trust_circle':
        return data.guardians.length >= 1;
      case 'digital_legacy':
        return data.timeCapsules.length >= 1;
      case 'will_creation':
        return (
          data.wills.length >= 1 &&
          (data.wills[0].completion_percentage || 0) >= 0.8
        );
      case 'guardian_network':
        return data.guardians.length >= 3;
      case 'document_vault':
        return data.documents.length >= 5;
      case 'time_capsule_collection':
        return data.timeCapsules.length >= 3;
      case 'family_shield':
        return data.guardians.some(g => g.can_trigger_emergency);
      default:
        return false;
    }
  };

  // Refresh progress when user data changes
  useEffect(() => {
    calculateProgress();
  }, [userId]);

  // Listen for document/guardian updates
  useEffect(() => {
    const handleDataUpdate = () => {
      calculateProgress();
    };

    window.addEventListener('documentUploaded', handleDataUpdate);
    window.addEventListener('guardianAdded', handleDataUpdate);
    window.addEventListener('milestoneUnlocked', handleDataUpdate);
    window.addEventListener('willUpdated', handleDataUpdate);
    window.addEventListener('timeCapsuleCreated', handleDataUpdate);

    return () => {
      window.removeEventListener('documentUploaded', handleDataUpdate);
      window.removeEventListener('guardianAdded', handleDataUpdate);
      window.removeEventListener('milestoneUnlocked', handleDataUpdate);
      window.removeEventListener('willUpdated', handleDataUpdate);
      window.removeEventListener('timeCapsuleCreated', handleDataUpdate);
    };
  }, []);

  return {
    progress,
    loading,
    error,
    refresh: calculateProgress,
  };
};

export default useGardenProgress;
