import 'server-only';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';
import { canAccessVideo, hasFullAccessRole, type AccessVideo, type AccessResult } from './check';

// =====================================================================
// SANDR — Risoluzione accesso SERVER-SIDE (AREA CRITICA, CLAUDE.md).
// Carica utente + abbonamento + (eventuale) acquisto PPV dalla sessione e
// applica canAccessVideo(). MAI esposto al client: la pagina player chiama
// questa funzione e passa il cloudflare_uid SOLO se l'accesso è consentito.
// Build-safe: se Supabase non è configurato, in demo si mostra tutto (dev mode).
// =====================================================================
export async function checkVideoAccess(video: AccessVideo, videoId: string): Promise<AccessResult> {
  if (!isSupabaseConfiguredServer()) {
    // Dev mode (nessuna credenziale): nessun gating, si vede tutto.
    return { allowed: true, reason: 'free' };
  }

  // Free e highlights sono sempre accessibili: nessuna query di sessione/abbonamento.
  if (video.accessLevel === 'free' || video.type === 'highlights') {
    return { allowed: true, reason: 'free' };
  }

  const sb = createServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) return canAccessVideo(video, null, null, false);

  // Ruolo dell'utente: admin/broadcaster hanno accesso completo (bypass paywall).
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const role = profile?.role ?? null;
  if (hasFullAccessRole(role)) return canAccessVideo(video, { id: user.id, role }, null, false);

  // Abbonamento attivo dell'utente (premium se presente e attivo).
  const { data: sub } = await sb
    .from('subscriptions')
    .select('plan,status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  // Acquisto PPV valido per QUESTO video (solo se serve).
  let ppvPurchased = false;
  if (video.accessLevel === 'ppv') {
    const { data: purchase } = await sb
      .from('ppv_purchases')
      .select('id,valid_until')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .maybeSingle();
    ppvPurchased =
      !!purchase && (!purchase.valid_until || new Date(purchase.valid_until) > new Date());
  }

  return canAccessVideo(video, { id: user.id, role }, sub ?? null, ppvPurchased);
}
