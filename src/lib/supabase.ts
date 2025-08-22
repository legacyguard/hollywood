import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing from .env.local");
}

// Standard Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Hook pre Supabase klienta - DOČASNÉ RIEŠENIE
// Použijeme štandardný Supabase klient s custom user_id
// Toto funguje bez potreby Clerk JWT template konfigurácie
export const useSupabaseClient = () => {
  const { userId } = useAuth();

  const createClerkSupabaseClient = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration is missing. Please check your environment variables.");
    }

    try {
      // Pre development - použijeme štandardný klient
      // V produkcii by sme mali použiť Clerk JWT template
      const supabaseClient = createClient(
        supabaseUrl,
        supabaseAnonKey
      );
      
      // Môžeme pridať custom header s Clerk user ID pre debugging
      if (userId) {
        // Toto je len pre identifikáciu, nie pre autentifikáciu
        supabaseClient.auth.setSession({
          access_token: supabaseAnonKey,
          refresh_token: '',
          user: {
            id: userId,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }
        } as any);
      }
      
      return supabaseClient;
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      // Fallback na štandardný klient
      return supabase!;
    }
  };

  return createClerkSupabaseClient;
};

// Type-safe wrapper pre starší kód (deprecated)
export const supabaseClient = () => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables.");
  }
  return supabase;
};
