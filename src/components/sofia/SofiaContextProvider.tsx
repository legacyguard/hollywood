import React, { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useSofiaStore } from '@/stores/sofiaStore';
import { SofiaContext } from '@/lib/sofia-ai';
import { useLocation } from 'react-router-dom';

interface SofiaContextProviderProps {
  children: React.ReactNode;
}

/**
 * Sofia Context Provider
 * 
 * This component automatically tracks user context and updates Sofia's
 * understanding of the user's situation, progress, and needs.
 */
const SofiaContextProvider: React.FC<SofiaContextProviderProps> = ({ children }) => {
  const { userId } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const { setContext, updateContext } = useSofiaStore();

  // Initialize Sofia context when user data is available
  useEffect(() => {
    if (!userId || !user) return;

    // Get stored user progress data
    const documentsKey = `documents_${userId}`;
    const guardiansKey = `guardians_${userId}`;
    
    const storedDocs = localStorage.getItem(documentsKey);
    const storedGuardians = localStorage.getItem(guardiansKey);
    
    const documentCount = storedDocs ? JSON.parse(storedDocs).length : 0;
    const guardianCount = storedGuardians ? JSON.parse(storedGuardians).length : 0;

    // Calculate completion percentage based on key milestones
    let completionPercentage = 0;
    
    // Documents: 0-40%
    completionPercentage += Math.min(documentCount * 8, 40); // Max 40% for 5+ docs
    
    // Guardians: 0-30%
    completionPercentage += Math.min(guardianCount * 15, 30); // Max 30% for 2+ guardians
    
    // Other milestones (will, video messages, etc.) - to be implemented
    // This leaves 30% for future features
    
    // Get recent activity
    const recentActivity: string[] = [];
    if (documentCount > 0) {
      recentActivity.push(`${documentCount} documents uploaded`);
    }
    if (guardianCount > 0) {
      recentActivity.push(`${guardianCount} guardians added`);
    }

    // Determine family status from user metadata or onboarding data
    const onboardingData = localStorage.getItem(`onboarding_${userId}`);
    let familyStatus: SofiaContext['familyStatus'] = 'single';
    
    if (onboardingData) {
      const parsed = JSON.parse(onboardingData);
      familyStatus = parsed.familyStatus || 'single';
    }

    // Create comprehensive context
    const context: SofiaContext = {
      userId,
      userName: user.firstName || user.fullName || undefined,
      documentCount,
      guardianCount,
      completionPercentage: Math.min(completionPercentage, 100),
      recentActivity,
      familyStatus,
      language: 'en', // TODO: Get from user preferences or browser
    };

    setContext(context);

  }, [userId, user, setContext]);

  // Update context when location changes (for contextual help)
  useEffect(() => {
    if (!userId) return;

    const currentPage = location.pathname.split('/')[1] || 'dashboard';
    updateContext({ 
      // We could add currentPage to context if needed for more specific help
    });

  }, [location, userId, updateContext]);

  // Listen for document uploads and other events to update context
  useEffect(() => {
    const handleDocumentUploaded = () => {
      if (!userId) return;
      
      // Refetch document count
      const documentsKey = `documents_${userId}`;
      const storedDocs = localStorage.getItem(documentsKey);
      const documentCount = storedDocs ? JSON.parse(storedDocs).length : 0;
      
      // Recalculate completion percentage
      const guardiansKey = `guardians_${userId}`;
      const storedGuardians = localStorage.getItem(guardiansKey);
      const guardianCount = storedGuardians ? JSON.parse(storedGuardians).length : 0;
      
      let completionPercentage = 0;
      completionPercentage += Math.min(documentCount * 8, 40);
      completionPercentage += Math.min(guardianCount * 15, 30);
      
      updateContext({ 
        documentCount,
        completionPercentage: Math.min(completionPercentage, 100),
        recentActivity: [
          `${documentCount} documents uploaded`,
          guardianCount > 0 ? `${guardianCount} guardians added` : ''
        ].filter(Boolean)
      });
    };

    const handleGuardianAdded = () => {
      if (!userId) return;
      
      // Similar logic for guardian updates
      const guardiansKey = `guardians_${userId}`;
      const storedGuardians = localStorage.getItem(guardiansKey);
      const guardianCount = storedGuardians ? JSON.parse(storedGuardians).length : 0;
      
      const documentsKey = `documents_${userId}`;
      const storedDocs = localStorage.getItem(documentsKey);
      const documentCount = storedDocs ? JSON.parse(storedDocs).length : 0;
      
      let completionPercentage = 0;
      completionPercentage += Math.min(documentCount * 8, 40);
      completionPercentage += Math.min(guardianCount * 15, 30);
      
      updateContext({ 
        guardianCount,
        completionPercentage: Math.min(completionPercentage, 100),
        recentActivity: [
          documentCount > 0 ? `${documentCount} documents uploaded` : '',
          `${guardianCount} guardians added`
        ].filter(Boolean)
      });
    };

    // Listen for custom events
    window.addEventListener('documentUploaded', handleDocumentUploaded);
    window.addEventListener('guardianAdded', handleGuardianAdded);
    
    return () => {
      window.removeEventListener('documentUploaded', handleDocumentUploaded);
      window.removeEventListener('guardianAdded', handleGuardianAdded);
    };
  }, [userId, updateContext]);

  return <>{children}</>;
};

export default SofiaContextProvider;