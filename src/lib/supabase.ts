import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing from .env.local");
}

// Legacy export pre komponenty, ktoré ho ešte používajú
// POZOR: Tento klient nevie o Clerk tokenoch!
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// SPRÁVNY PRÍSTUP: Hook pre Supabase klienta s Clerk autentifikáciou
export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  const createClerkSupabaseClient = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration is missing. Please check your environment variables.");
    }

    try {
      // Získame JWT token od Clerku s template pre Supabase
      const supabaseToken = await getToken({ template: 'supabase' });
      
      if (!supabaseToken) {
        throw new Error("Failed to get authentication token from Clerk");
      }

      // Vytvoríme Supabase klienta s Clerk tokenom
      const supabaseClient = createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          global: {
            headers: {
              Authorization: `Bearer ${supabaseToken}`,
            },
          },
        }
      );
      
      return supabaseClient;
    } catch (error) {
      console.error('Error creating Supabase client with Clerk token:', error);
      throw error;
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
