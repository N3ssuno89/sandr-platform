'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getAdminContext, getCurrentUserRole } from '@/lib/supabase/guard';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';
import type { ActionResult } from '@/lib/reference/types';

// Bucket pubblici gestiti dal pannello admin (whitelist).
const ALLOWED = ['athlete-photos', 'federation-logos', 'video-thumbnails'] as const;
type Bucket = (typeof ALLOWED)[number];

// =====================================================================
// SANDR — Upload su Supabase Storage via SERVER ACTION (admin-gated).
// AREA CRITICA (CLAUDE.md): scrittura storage. Strategia:
//   1) se la service role è configurata → la usa (bypassa la RLS, sempre OK);
//   2) altrimenti ricade sulla sessione admin autenticata, che scrive
//      rispettando la RLS (richiede le policy della migration 0007).
// Restituisce l'errore REALE (niente più fallimenti silenziosi).
// =====================================================================
export async function uploadToBucket(formData: FormData): Promise<ActionResult<{ url: string }>> {
  const bucket = String(formData.get('bucket') ?? '');
  const file = formData.get('file');
  // Prefisso opzionale di sottocartella (es. 'card' | 'featured' per le copertine).
  const prefixRaw = String(formData.get('prefix') ?? '').replace(/[^a-z0-9/_-]/gi, '');
  const prefix = prefixRaw ? `${prefixRaw.replace(/\/+$/, '')}/` : '';

  if (!ALLOWED.includes(bucket as Bucket)) return { ok: false, error: 'bucket-not-allowed' };
  if (!(file instanceof File)) return { ok: false, error: 'bad-file' };
  if (file.size === 0) return { ok: false, error: 'empty-file' };

  // Sceglie il client di scrittura (service role o sessione admin).
  let writer: SupabaseClient<Database>;
  const ctx = await getAdminContext();
  if (ctx.ok) {
    writer = ctx.admin;
  } else if (ctx.error === 'not-configured' && isSupabaseConfiguredServer()) {
    // Niente service role: prova con la sessione (deve essere admin + policy 0007).
    const role = await getCurrentUserRole();
    if (role !== 'admin') return { ok: false, error: role ? 'forbidden' : 'unauthorized' };
    writer = createServerClient();
  } else {
    // not-configured (Supabase assente), unauthorized o forbidden.
    return { ok: false, error: ctx.error };
  }

  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${prefix}${crypto.randomUUID()}.${ext || 'jpg'}`;
    const { error } = await writer.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type || 'image/jpeg', upsert: true });
    if (error) return { ok: false, error: error.message };

    const { data } = writer.storage.from(bucket).getPublicUrl(path);
    return { ok: true, data: { url: data.publicUrl } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'upload-failed' };
  }
}
