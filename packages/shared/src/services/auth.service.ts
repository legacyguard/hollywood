/**
 * Authentication Service
 * Handles user authentication and session management
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthSession> {
    // Implementation would connect to actual auth backend
    // This is a placeholder
    const mockSession: AuthSession = {
      user: {
        id: '123',
        email: credentials.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'mock-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    
    this.currentSession = mockSession;
    return mockSession;
  }

  async signOut(): Promise<void> {
    this.currentSession = null;
  }

  async signUp(credentials: AuthCredentials & { name?: string }): Promise<AuthSession> {
    // Implementation would connect to actual auth backend
    return this.signIn(credentials);
  }

  async refreshSession(): Promise<AuthSession | null> {
    if (!this.currentSession?.refreshToken) {
      return null;
    }
    
    // Implementation would refresh the token
    return this.currentSession;
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return !!this.currentSession && this.currentSession.expiresAt > new Date();
  }

  async resetPassword(email: string): Promise<void> {
    // Implementation would send reset email
    console.log('Password reset email sent to:', email);
  }

  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    // Implementation would update password
    console.log('Password updated successfully');
  }
}

export const authService = AuthService.getInstance();
