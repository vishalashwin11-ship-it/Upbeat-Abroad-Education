import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from Vite environment variables or fallback to window.__ENV__ if injected
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (import.meta.env.SUPABASE_URL as string | undefined) ||
  '';

const supabasePublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.SUPABASE_ANON_KEY as string | undefined) ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublishableKey &&
    !supabaseUrl.includes('your-project') &&
    !supabasePublishableKey.includes('your-anon')
);

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}
