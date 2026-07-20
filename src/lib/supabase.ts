import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function looksConfigured(v: string | undefined): boolean {
  return !!v && !v.includes('REPLACE') && !v.includes('your-') && v.length > 10;
}

export const isSupabaseConfigured = looksConfigured(url) && looksConfigured(anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;

export const HOTEL_SLUG = 'grand-hotel';
