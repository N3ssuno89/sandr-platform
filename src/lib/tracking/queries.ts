import 'server-only';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';
import { getThumbnailUrl } from '@/lib/cloudflare-stream';
import { badgeTier } from '@/lib/access/check';

// Letture per il tracking visione (scoping all'utente via sessione + RLS
// "self manage" su watch_history). AREA CRITICA (CLAUDE.md): dati personali.

export type ContinueItem = {
  id: string;
  title: string;
  thumbnail?: string;
  progress: number; // 0..1
  access: 'free' | 'premium' | 'ppv';
};

function fmtDuration(seconds: number | null): string {
  if (!seconds || seconds < 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

// "Continua a guardare": video non completati dell'utente, più recenti prima.
export async function getContinueWatching(limit = 12): Promise<ContinueItem[]> {
  if (!isSupabaseConfiguredServer()) return [];
  try {
    const sb = createServerClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return [];

    const { data } = await sb
      .from('watch_history')
      .select(
        'watched_seconds, videos(id,title,thumbnail_card_url,cloudflare_uid,duration_seconds,status,access_level,type)',
      )
      .eq('user_id', user.id)
      .eq('completed', false)
      .eq('dismissed', false)
      .order('last_watched_at', { ascending: false })
      .limit(limit);

    const items: ContinueItem[] = [];
    for (const r of data ?? []) {
      const v = r.videos;
      if (!v || v.status !== 'ready') continue;
      const dur = v.duration_seconds ?? 0;
      const progress = dur > 0 ? Math.min(1, Math.max(0, r.watched_seconds / dur)) : 0;
      items.push({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail_card_url || (v.cloudflare_uid ? getThumbnailUrl(v.cloudflare_uid) : undefined),
        progress,
        access: badgeTier(v.access_level, v.type),
      });
    }
    return items;
  } catch {
    return [];
  }
}

// Stato di visione per la pagina player: se loggato e dove riprendere.
export async function getViewerWatchState(
  videoId: string,
): Promise<{ loggedIn: boolean; resumeSeconds: number }> {
  if (!isSupabaseConfiguredServer()) return { loggedIn: false, resumeSeconds: 0 };
  try {
    const sb = createServerClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return { loggedIn: false, resumeSeconds: 0 };

    const { data } = await sb
      .from('watch_history')
      .select('watched_seconds,completed')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .maybeSingle();
    // Non riprendere se completato (riparti da capo).
    const resumeSeconds = data && !data.completed ? data.watched_seconds ?? 0 : 0;
    return { loggedIn: true, resumeSeconds };
  } catch {
    return { loggedIn: false, resumeSeconds: 0 };
  }
}

// fmtDuration esportata per riuso eventuale.
export { fmtDuration };
