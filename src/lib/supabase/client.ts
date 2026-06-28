import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { env } from '@/lib/env';

// Client Supabase per i Client Component (browser).
// AREA CRITICA (CLAUDE.md): Supabase Auth richiede review umana.
//
// NOTA tipi: riallineamento a `SupabaseClient<Database>` per lo skew di firma
// generica tra @supabase/ssr@0.5 e supabase-js@2.108 (vedi server.ts). Senza
// questo le query `.from(...)` risolverebbero lo schema a `never`.
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    env.supabase.url(),
    env.supabase.anonKey(),
  ) as unknown as SupabaseClient<Database>;
}

// Build-safe: in assenza di configurazione Supabase (es. demo, build senza
// env) l'UI evita di creare il client ed eseguire chiamate auth.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
