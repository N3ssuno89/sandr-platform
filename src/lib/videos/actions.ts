'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getThumbnailUrl } from '@/lib/cloudflare-stream';
import { getAdminContext, getReadClient } from '@/lib/supabase/guard';
import type { CircuitTag, ContentItem, ContentType, SportTag } from '@/types/tags';
import type { ActionResult } from '@/lib/reference/types';
import type { VideoFormPayload, VideoEditData, PlayerVideo, AdminVideoRow } from './types';

type ContentTypeEnum = Database['public']['Enums']['content_type'];

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
  if (!vids || vids.length === 0) return [];

  const ids = vids.map((v) => v.id);
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

  return vids.map((v) => {
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
  };
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

// Dati per pre-compilare il form in modifica (admin).
export async function getVideoForEdit(id: string): Promise<VideoEditData | null> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;
  const { data: v } = await ctx.admin.from('videos').select('*').eq('id', id).maybeSingle();
  if (!v) return null;
  const { data: vaRows } = await ctx.admin
    .from('video_athletes')
    .select('athlete_id')
    .eq('video_id', id);
  const { data: tagRows } = await ctx.admin.from('video_tags').select('tag').eq('video_id', id);
  return {
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
    athleteIds: (vaRows ?? []).map((r) => r.athlete_id),
    tags: (tagRows ?? []).map((r) => r.tag),
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
    status: 'ready' as const,
  };

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
