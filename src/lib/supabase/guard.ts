import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient, isSupabaseConfiguredServer } from '@/lib/supabase/admin';

// Contesto admin per le scritture. AREA CRITICA (CLAUDE.md): verifica che il
// chiamante sia admin (ruolo dalla sessione) PRIMA di usare la service role
// (che bypassa la RLS). Build-safe: ok=false se non configurato/non autorizzato.
export type AdminContext =
  | { ok: true; admin: SupabaseClient<Database> }
  | { ok: false; error: string };

export async function getAdminContext(): Promise<AdminContext> {
  if (!isSupabaseConfiguredServer() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: 'not-configured' };
  }

  // Sessione utente (anon client, legge i cookie).
  const sb = createServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { ok: false, error: 'unauthorized' };

  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { ok: false, error: 'forbidden' };

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: 'not-configured' };
  return { ok: true, admin };
}

// Client di sola lettura: service role se disponibile (bypassa RLS per mostrare
// anche i contenuti premium/ppv come card bloccate), altrimenti anon, altrimenti
// null (fallback mock a monte).
export function getReadClient(): SupabaseClient<Database> | null {
  const admin = createAdminClient();
  if (admin) return admin;
  if (isSupabaseConfiguredServer()) return createServerClient();
  return null;
}
