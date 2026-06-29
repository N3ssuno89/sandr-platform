'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';

// =====================================================================
// SANDR — Tracking visione (watch_history + analytics_events).
// AREA CRITICA (CLAUDE.md): Supabase Auth + privacy.
// REGOLE:
//  - Il tracking NON deve MAI rompere la riproduzione → ogni funzione è
//    completamente in try/catch e non lancia mai (fail silently).
//  - Solo utenti loggati vengono tracciati.
//  - watch_history è "necessario al servizio" (sempre, per i loggati).
//  - analytics_events (analytics dettagliato) è subordinato a consent_profiling.
//  - view_count è un contatore aggregato (non personale): si incrementa al play.
// =====================================================================

type EventInput = {
  type: 'play' | 'progress' | 'complete' | 'pause' | 'impression' | 'click' | 'search' | 'favorite' | 'share';
  videoId?: string;
  sessionId?: string;
  payload?: Record<string, unknown>;
};

// Salva/aggiorna il progresso di visione (service-necessary, sempre per i loggati).
export async function recordWatchProgress(
  videoId: string,
  watchedSeconds: number,
  durationSeconds: number,
): Promise<void> {
  try {
    if (!isSupabaseConfiguredServer()) return;
    const sb = createServerClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return; // solo loggati

    const watched = Math.max(0, Math.floor(watchedSeconds));
    const duration = Math.max(0, Math.floor(durationSeconds));
    const completed = duration > 0 && watched / duration >= 0.9;

    await sb.from('watch_history').upsert(
      {
        user_id: user.id,
        video_id: videoId,
        watched_seconds: watched,
        completed,
        last_watched_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,video_id' },
    );
  } catch {
    // Fail silently: il tracking non deve mai impattare la riproduzione.
  }
}

// Registra un evento analitico. Al 'play' incrementa view_count (aggregato).
// L'inserimento in analytics_events avviene SOLO con consent_profiling = true.
export async function recordEvent({ type, videoId, sessionId, payload }: EventInput): Promise<void> {
  try {
    if (!isSupabaseConfiguredServer()) return;
    const sb = createServerClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return; // solo loggati

    // Contatore visualizzazioni (non personale): incremento atomico al play.
    if (type === 'play' && videoId) {
      await sb.rpc('increment_video_view', { p_video_id: videoId });
    }

    // Analytics dettagliato: solo se l'utente ha acconsentito alla profilazione.
    const { data: profile } = await sb
      .from('profiles')
      .select('consent_profiling')
      .eq('id', user.id)
      .maybeSingle();
    if (!profile?.consent_profiling) return;

    await sb.from('analytics_events').insert({
      type,
      video_id: videoId ?? null,
      user_id: user.id,
      session_id: sessionId ?? null,
      payload: (payload ?? {}) as never,
    });
  } catch {
    // Fail silently.
  }
}
