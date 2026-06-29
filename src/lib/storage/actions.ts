'use server';

import { randomUUID } from 'node:crypto';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getCurrentUserRole } from '@/lib/supabase/guard';
import { createClient as createServerClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/lib/reference/types';
import { MAX_UPLOAD_BYTES } from './limits';

// Bucket pubblici gestiti dal pannello admin (whitelist).
const ALLOWED = ['athlete-photos', 'federation-logos', 'video-thumbnails'] as const;
type Bucket = (typeof ALLOWED)[number];

// =====================================================================
// SANDR — Upload su Supabase Storage via SERVER ACTION (admin-gated).
// AREA CRITICA (CLAUDE.md): scrittura storage. Strategia:
//   1) se la service role è configurata → la usa (bypassa la RLS, sempre OK);
//   2) altrimenti ricade sulla sessione admin autenticata, che scrive
//      rispettando la RLS (richiede le policy della migration 0007).
//
// L'INTERO corpo è in try/catch: qualunque errore (env mancante, auth, client,
// upload) viene LOGGATO (console.error → log Netlify) e restituito come messaggio
// leggibile. Non lancia MAI: niente più 500 opachi verso il client.
// =====================================================================
export async function uploadToBucket(formData: FormData): Promise<ActionResult<{ url: string }>> {
  try {
    const bucket = String(formData.get('bucket') ?? '');
    const file = formData.get('file');
    // Prefisso opzionale di sottocartella (es. 'card' | 'featured' per le copertine).
    const prefixRaw = String(formData.get('prefix') ?? '').replace(/[^a-z0-9/_-]/gi, '');
    const prefix = prefixRaw ? `${prefixRaw.replace(/\/+$/, '')}/` : '';

    if (!ALLOWED.includes(bucket as Bucket)) return { ok: false, error: 'bucket-not-allowed' };
    if (!(file instanceof File)) return { ok: false, error: 'bad-file' };
    if (file.size === 0) return { ok: false, error: 'empty-file' };
    if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: 'file-too-large' };

    // Gating admin (ruolo dalla sessione) PRIMA di usare la service role.
    const role = await getCurrentUserRole();
    if (role !== 'admin') return { ok: false, error: role ? 'forbidden' : 'unauthorized' };

    // Client di scrittura: service role (bypassa RLS) se configurata, altrimenti
    // sessione admin autenticata (richiede policy 0007).
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let writer: SupabaseClient<Database>;
    if (url && serviceKey) {
      writer = createSupabaseClient<Database>(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    } else if (url) {
      writer = createServerClient();
    } else {
      console.error('uploadToBucket error: NEXT_PUBLIC_SUPABASE_URL non definita');
      return { ok: false, error: 'not-configured' };
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `${prefix}${randomUUID()}.${ext}`;

    const { error: uploadError } = await writer.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type || 'image/jpeg', upsert: true });
    if (uploadError) {
      console.error('uploadToBucket storage error:', uploadError);
      return { ok: false, error: uploadError.message };
    }

    const { data } = writer.storage.from(bucket).getPublicUrl(path);
    return { ok: true, data: { url: data.publicUrl } };
  } catch (error) {
    // Qualunque eccezione → log + errore leggibile (mai un 500 opaco).
    console.error('uploadToBucket error:', error);
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
