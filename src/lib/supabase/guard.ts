import 'server-only';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient, isSupabaseConfiguredServer } from '@/lib/supabase/admin';

// Ruolo dell'utente loggato (null se non loggato / non configurato).
export async function getCurrentUserRole(): Promise<string | null> {
  if (!isSupabaseConfiguredServer()) return null;
  const sb = createServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from('profiles').select('role').eq('id', user.id).single();
  return data?.role ?? null;
}

// Gating pagine admin: redirect a /dashboard/home se non admin.
// AREA CRITICA (CLAUDE.md): Supabase Auth + ruolo admin.
// In demo (Supabase non configurato) non blocca (le rotte /dashboard sono
// comunque protette dal middleware quando l'auth è attiva).
export async function requireAdminPage(locale: string): Promise<void> {
  if (!isSupabaseConfiguredServer()) return;
  const role = await getCurrentUserRole();
  if (role !== 'admin') redirect(`/${locale}/dashboard/home`);
}

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
