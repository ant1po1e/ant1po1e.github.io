import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The storage bucket that replaces the old @vercel/blob "v/" prefix. Create
// it (public) as part of the Supabase setup — see supabase/schema.sql.
export const VAULT_BUCKET = 'vault';

let cached: SupabaseClient | null = null;

// Server-only client, authenticated with the service role key so it can
// bypass Row Level Security. Never import this file from client code —
// SUPABASE_SERVICE_ROLE_KEY is deliberately NOT prefixed with VITE_ so Vite
// never bundles it into the browser build.
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables are not set. Add them in your Vercel project settings.',
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
