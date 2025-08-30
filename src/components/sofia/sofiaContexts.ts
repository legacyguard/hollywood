import React from 'react';
import { AdaptivePersonalityManager } from '@/lib/sofia-personality';

// Context for personality manager
export const PersonalityManagerContext = React.createContext<AdaptivePersonalityManager | null>(null);
