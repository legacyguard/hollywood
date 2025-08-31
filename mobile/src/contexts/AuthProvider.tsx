// src/contexts/AuthProvider.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthenticationService } from '@/services/AuthenticationService';
import { useUser } from '@clerk/clerk-expo'; // Use Clerk's hook to track state

interface AuthContextType {
  // Clerk already manages user state, so we don't need to hold it here
  user: any; // Temporary placeholder
  isLoggedIn: boolean;
  isLoading: boolean;
  // We no longer need login/logout functions directly here,
  // as Clerk handles this globally. We'll keep logout for convenience.
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  const logout = async () => {
    await AuthenticationService.logout();
  };

  const value = {
    user: null, // Temporary placeholder
    isLoggedIn: !!isSignedIn,
    isLoading: !isLoaded,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
