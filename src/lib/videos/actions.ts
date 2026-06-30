'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getThumbnailUrl } from '@/lib/cloudflare-stream';
import { getAdminContext, getReadClient } from '@/lib/supabase/guard';
import type { CircuitTag, ContentItem, ContentType, SportTag } from '@/types/tags';
import type { ActionResult } from '@/lib/reference/types';
import type {
  VideoFormPayload,
  VideoEditResult,
  VideoEditFailReason,
  PlayerVideo,
  VideoAthlete,
  AdminVideoRow,
  AdminDashboard,
} from './types';

type ContentTypeEnum = Database['public']['Enums']['content_type'];

// Invalida la cache di tutte le rotte che mostrano i video dopo una scrittura.
// I percorsi usano la forma letterale '/[locale]/...' con type 'page' così da
// invalidare ogni variante locale (it/en) della stessa rotta dinamica.
function revalidateVideoPaths() {
  revalidatePath('/[locale]/dashboard/admin/videos', 'page');
  revalidatePath('/[locale]/dashboard/admin', 'page');
  revalidatePath('/[locale]/dashboard/home', 'page');
  revalidatePath('/[locale]/vod', 'page');
  // Landing pubblica: anteprime live/in evidenza/interviste/highlights reali.
  revalidatePath('/[locale]', 'page');
}

// content_type (enum DB) -> ContentType interno (frontend).
function mapType(t: string | null): ContentType {
  switch (t) {
    case 'live':
      return 'live';
    case 'replay':
      return 'replay';
    case 'interview':
      return 'interview';
    case 'highlights':
      return 'highlights';
    case 'behind_scenes':
      return 'behind-the-scenes';
    case 'documentary':
      return 'replay';
    default:
      return 'replay';
  }
}

function fmtDuration(seconds: number | null): string {
  if (!seconds || seconds < 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// =====================================================================
// READ — display (sito) e admin
// =====================================================================

// Righe video (con sports/federations embedded) → ContentItem[]. Recupera tag e
// atleti per gli id passati e costruisce le card. Helper condiviso tra la lista
// generale e i video per atleta (mantiene la mappatura in un solo punto).
async function buildContentItems(
  db: SupabaseClient<Database>,
  vids: Array<Record<string, unknown>>,
): Promise<ContentItem[]> {
  if (!vids || vids.length === 0) return [];
  const ids = vids.map((v) => v.id as string);
  const { data: tagRows } = await db.from('video_tags').select('video_id,tag').in('video_id', ids);
  const { data: vaRows } = await db
    .from('video_athletes')
    .select('video_id, athletes(full_name)')
    .in('video_id', ids);

  const tagsByVideo = new Map<string, string[]>();
  (tagRows ?? []).forEach((r) => {
    const arr = tagsByVideo.get(r.video_id) ?? [];
    arr.push(r.tag);
    tagsByVideo.set(r.video_id, arr);
  });
  const athletesByVideo = new Map<string, string[]>();
  (vaRows ?? []).forEach((r) => {
    const name = r.athletes?.full_name;
    if (name) {
      const arr = athletesByVideo.get(r.video_id) ?? [];
      arr.push(name);
      athletesByVideo.set(r.video_id, arr);
    }
  });

  return vids.map((raw) => {
    const v = raw as {
      id: string;
      title: string;
      type: string | null;
      sports: { name: string } | null;
      federations: { short_name: string | null } | null;
      thumbnail_card_url: string | null;
      thumbnail_featured_url: string | null;
      cloudflare_uid: string | null;
      duration_seconds: number | null;
      access_level: 'free' | 'premium' | 'ppv';
      is_live: boolean;
      is_featured: boolean;
      published_at: string | null;
      created_at: string;
    };
    const circuit = (v.federations?.short_name ?? undefined) as CircuitTag | undefined;
    const sport = (v.sports?.name ?? 'Beach Volley') as SportTag;
    const type = mapType(v.type);
    const athleteNames = athletesByVideo.get(v.id) ?? [];
    const extraTags = tagsByVideo.get(v.id) ?? [];
    return {
      id: v.id,
      title: v.title,
      teams: athleteNames.length ? athleteNames.join(' vs ') : undefined,
      circuit,
      sport,
      type,
      nations: [],
      thumbnail:
        v.thumbnail_card_url || (v.cloudflare_uid ? getThumbnailUrl(v.cloudflare_uid) : undefined),
      thumbnailFeatured: v.thumbnail_featured_url ?? undefined,
      duration: fmtDuration(v.duration_seconds),
      isPremium: v.access_level === 'premium',
      access: v.access_level,
      isLive: v.is_live,
      date: fmtDate(v.published_at ?? v.created_at),
      tags: [
        type,
        sport,
        ...(circuit ? [circuit] : []),
        ...extraTags,
        ...(v.is_featured ? ['featured'] : []),
      ],
    } satisfies ContentItem;
  });
}

// Tutti i video 'ready' in formato ContentItem per il frontend. Tag/circuito/
// tipo arrivano dal DB (source of truth), non più dai meta Cloudflare.
export async function getVideosForDisplay(): Promise<ContentItem[]> {
  const db = getReadClient();
  if (!db) return [];

  const { data: vids } = await db
    .from('videos')
    .select('*, sports(name), federations(short_name)')
    .eq('status', 'ready')
    .order('created_at', { ascending: false });
  return buildContentItems(db, vids ?? []);
}

// Video in cui un atleta è taggato (via video_athletes), in formato ContentItem.
// Ordinati per pubblicazione più recente. Per il profilo atleta (righe per tipo).
export async function getAthleteVideos(athleteId: string): Promise<ContentItem[]> {
  const db = getReadClient();
  if (!db) return [];

  const { data: links } = await db
    .from('video_athletes')
    .select('video_id')
    .eq('athlete_id', athleteId);
  const ids = (links ?? []).map((r) => r.video_id);
  if (ids.length === 0) return [];

  const { data: vids } = await db
    .from('videos')
    .select('*, sports(name), federations(short_name)')
    .in('id', ids)
    .eq('status', 'ready')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  return buildContentItems(db, vids ?? []);
}

export async function getVideoForPlayer(id: string): Promise<PlayerVideo | null> {
  const db = getReadClient();
  if (!db) return null;
  const { data: v } = await db.from('videos').select('*').eq('id', id).maybeSingle();
  if (!v) return null;
  return {
    id: v.id,
    cloudflareUid: v.cloudflare_uid,
    title: v.title,
    description: v.description,
    durationSeconds: v.duration_seconds,
    publishedAt: v.published_at,
    createdAt: v.created_at,
    thumbnailCardUrl: v.thumbnail_card_url,
    accessLevel: v.access_level,
    type: v.type,
    ppvPrice: v.ppv_price,
  };
}

// Atleti taggati su un video (via video_athletes). Per la tab "Atleti" del
// player: solo quelli linkati a QUESTO video, non tutti.
export async function getVideoAthletes(videoId: string): Promise<VideoAthlete[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db
    .from('video_athletes')
    .select('athletes(id,full_name,nation,photo_url)')
    .eq('video_id', videoId);
  return (data ?? [])
    .map((r) => r.athletes)
    .filter((a): a is NonNullable<typeof a> => !!a)
    .map((a) => ({ id: a.id, name: a.full_name, nation: a.nation, photo: a.photo_url }));
}

// Lista per il pannello admin (tutti i video, anche draft).
export async function getVideosForAdmin(): Promise<AdminVideoRow[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db
    .from('videos')
    .select('*, sports(name), federations(short_name)')
    .order('created_at', { ascending: false });
  return (data ?? []).map((v) => ({
    uid: v.id,
    name: v.title,
    thumb: v.thumbnail_card_url || (v.cloudflare_uid ? getThumbnailUrl(v.cloudflare_uid) : ''),
    circuit: v.federations?.short_name ?? undefined,
    type: v.type ?? undefined,
    sport: v.sports?.name ?? undefined,
    ready: v.status === 'ready',
    date: fmtDate(v.created_at),
  }));
}

// Dati per pre-compilare il form in modifica (admin). Restituisce un esito
// discriminato così che la pagina distingua "non configurato" / "non admin" /
// "video inesistente" e mostri il messaggio giusto. Log server-side per capire
// quale condizione scatta (diagnosi del falso "Video non trovato").
// IMPORTANTE: il lookup è per `videos.id` (UUID Supabase), NON cloudflare_uid.
export async function getVideoForEdit(id: string): Promise<VideoEditResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) {
    console.error(`[getVideoForEdit] admin context KO (${ctx.error}) per video ${id}`);
    // ctx.error è 'not-configured' | 'unauthorized' | 'forbidden' (sottoinsieme).
    return { ok: false, reason: ctx.error as VideoEditFailReason };
  }
  const { data: v, error } = await ctx.admin
    .from('videos')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error(`[getVideoForEdit] query KO per video ${id}: ${error.message}`);
    return { ok: false, reason: 'not-found' };
  }
  if (!v) {
    console.warn(`[getVideoForEdit] nessuna riga videos per id ${id}`);
    return { ok: false, reason: 'not-found' };
  }
  const { data: vaRows } = await ctx.admin
    .from('video_athletes')
    .select('athlete_id')
    .eq('video_id', id);
  const { data: tagRows } = await ctx.admin.from('video_tags').select('tag').eq('video_id', id);
  return {
    ok: true,
    data: {
      id: v.id,
      cloudflareUid: v.cloudflare_uid,
      title: v.title,
      description: v.description,
      type: v.type,
      sportId: v.sport_id,
      federationId: v.federation_id,
      thumbnailCardUrl: v.thumbnail_card_url,
      thumbnailFeaturedUrl: v.thumbnail_featured_url,
      accessLevel: v.access_level,
      isFeatured: v.is_featured,
      isLive: v.is_live,
      qualityLevel: v.quality_level,
      athleteIds: (vaRows ?? []).map((r) => r.athlete_id),
      tags: (tagRows ?? []).map((r) => r.tag),
    },
  };
}

// Dati per la dashboard admin: tutto da SUPABASE (source of truth), non più dai
// meta Cloudflare. Title prende il fallback "(senza titolo)" se vuoto.
export async function getAdminDashboard(): Promise<AdminDashboard> {
  const db = getReadClient();
  if (!db) {
    return { total: 0, usersCount: 0, activeSubscriptions: 0, catalogHours: 0, recent: [], videos: [] };
  }
  const { data } = await db
    .from('videos')
    .select('*, federations(short_name)')
    .order('created_at', { ascending: false });
  const rows = data ?? [];

  // Conteggi REALI da Supabase (head:true → solo il count, nessuna riga).
  const [{ count: usersCount }, { count: activeSubscriptions }] = await Promise.all([
    db.from('profiles').select('id', { count: 'exact', head: true }),
    db.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ]);
  // Ore di catalogo: somma delle durate dei video / 3600.
  const catalogSeconds = rows.reduce((acc, v) => acc + (v.duration_seconds ?? 0), 0);

  const thumbOf = (v: (typeof rows)[number]) =>
    v.thumbnail_card_url || (v.cloudflare_uid ? getThumbnailUrl(v.cloudflare_uid) : '');
  return {
    total: rows.length,
    usersCount: usersCount ?? 0,
    activeSubscriptions: activeSubscriptions ?? 0,
    catalogHours: Math.round(catalogSeconds / 3600),
    recent: rows.slice(0, 5).map((v) => ({
      id: v.id,
      title: v.title || '(senza titolo)',
      thumb: thumbOf(v),
      ready: v.status === 'ready',
    })),
    videos: rows.map((v) => ({
      id: v.id,
      title: v.title || '(senza titolo)',
      circuit: v.federations?.short_name ?? '—',
      thumb: thumbOf(v),
      featured: v.is_featured,
    })),
  };
}

// =====================================================================
// WRITE (admin) — tutte verificano il ruolo admin via getAdminContext()
// =====================================================================

// Salvataggio completo dal form: create/update video + atleti + tag.
export async function saveVideo(payload: VideoFormPayload): Promise<ActionResult<{ id: string }>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const admin = ctx.admin;

  const row = {
    cloudflare_uid: payload.cloudflareUid || null,
    title: payload.title,
    description: payload.description || null,
    type: payload.type ? (payload.type as ContentTypeEnum) : null,
    sport_id: payload.sportId || null,
    federation_id: payload.federationId || null,
    event_id: payload.eventId || null,
    thumbnail_card_url: payload.thumbnailCardUrl || null,
    thumbnail_featured_url: payload.thumbnailFeaturedUrl || null,
    duration_seconds: payload.durationSeconds ?? null,
    access_level: payload.accessLevel,
    ppv_price: payload.ppvPrice ?? null,
    is_featured: payload.isFeatured,
    is_live: payload.isLive,
    quality_level: payload.qualityLevel ?? 'medium',
    status: 'ready' as const,
  };

  console.log('saving video with thumbnails:', {
    card: row.thumbnail_card_url,
    featured: row.thumbnail_featured_url,
  });

  let videoId: string;
  if (payload.id) {
    const { error } = await admin.from('videos').update(row).eq('id', payload.id);
    if (error) return { ok: false, error: error.message };
    videoId = payload.id;
  } else {
    const { data, error } = await admin
      .from('videos')
      .insert({ ...row, published_at: new Date().toISOString() })
      .select('id')
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? 'insert-failed' };
    videoId = data.id;
  }

  await linkAthletes(admin, videoId, payload.athleteIds);
  await replaceTags(admin, videoId, payload.tags);

  // Invalida la cache: la lista admin, la dashboard, la home e la VOD devono
  // riflettere subito titolo/tag/featured aggiornati (no dati stale).
  revalidateVideoPaths();

  return { ok: true, data: { id: videoId } };
}

// API granulari richieste dalla specifica (oltre a saveVideo).
export async function createVideo(
  payload: Omit<VideoFormPayload, 'id'>,
): Promise<ActionResult<{ id: string }>> {
  return saveVideo({ ...payload, id: undefined });
}

export async function updateVideo(
  id: string,
  payload: Omit<VideoFormPayload, 'id'>,
): Promise<ActionResult<{ id: string }>> {
  return saveVideo({ ...payload, id });
}

export async function deleteVideo(id: string): Promise<ActionResult<null>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  // video_athletes / video_tags hanno ON DELETE CASCADE.
  const { error } = await ctx.admin.from('videos').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateVideoPaths();
  return { ok: true, data: null };
}

// Toggle "in evidenza": scrive is_featured su Supabase e invalida subito la
// cache di home (hero) e dashboard admin. AREA CRITICA: admin-gated.
export async function setVideoFeatured(id: string, value: boolean): Promise<ActionResult<null>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const { error } = await ctx.admin.from('videos').update({ is_featured: value }).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateVideoPaths();
  return { ok: true, data: null };
}

export async function linkVideoAthletes(
  videoId: string,
  athleteIds: string[],
): Promise<ActionResult<null>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  await linkAthletes(ctx.admin, videoId, athleteIds);
  return { ok: true, data: null };
}

export async function addVideoTags(videoId: string, tags: string[]): Promise<ActionResult<null>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  await replaceTags(ctx.admin, videoId, tags);
  return { ok: true, data: null };
}

// ----- helper interni (riusano il client admin già autorizzato) -----
async function linkAthletes(admin: SupabaseClient<Database>, videoId: string, athleteIds: string[]) {
  await admin.from('video_athletes').delete().eq('video_id', videoId);
  if (athleteIds.length) {
    await admin
      .from('video_athletes')
      .insert(athleteIds.map((athlete_id) => ({ video_id: videoId, athlete_id })));
  }
}

async function replaceTags(admin: SupabaseClient<Database>, videoId: string, tags: string[]) {
  await admin.from('video_tags').delete().eq('video_id', videoId);
  const clean = Array.from(new Set(tags.map((t) => t.trim()).filter(Boolean)));
  if (clean.length) {
    await admin.from('video_tags').insert(clean.map((tag) => ({ video_id: videoId, tag })));
  }
}
