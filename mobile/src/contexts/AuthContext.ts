import { createContext } from 'react';

export interface AuthContextType {
  user: unknown;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);