import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { env } from '@/lib/env';

// Client Supabase per i Client Component (browser).
// AREA CRITICA (CLAUDE.md): Supabase Auth richiede review umana.
export function createClient() {
  return createBrowserClient<Database>(env.supabase.url(), env.supabase.anonKey());
}

// Build-safe: in assenza di configurazione Supabase (es. demo, build senza
// env) l'UI evita di creare il client ed eseguire chiamate auth.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
