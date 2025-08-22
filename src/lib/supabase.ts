import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing from .env.local");
  // Create a dummy client for development without Supabase
  // This allows the app to run without Supabase configuration
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Type-safe wrapper for Supabase operations
export const supabaseClient = () => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables.");
  }
  return supabase;
};
