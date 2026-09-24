import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Vite only exposes env vars prefixed with VITE_ to client-side code.
// Configure these in .env (copy from .env.example) with your Supabase
// project URL and anon/public key. The anon key is safe to ship in the
// bundle — it only ever acts under Row Level Security policies (see
// supabase/schema.sql), never with elevated privileges.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  console.warn(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — Supabase-backed features (contributed beatmaps, vault uploads) will be disabled.',
  );
}

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

// The storage bucket used for vault files — must match api/_lib/supabaseAdmin.ts.
export const VAULT_BUCKET = 'vault';
