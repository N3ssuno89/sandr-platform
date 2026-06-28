import 'server-only';
import { getReadClient } from '@/lib/supabase/guard';
import { getThumbnailUrl } from '@/lib/cloudflare-stream';
import type { AthleteFull, FederationFull, SportRef } from '@/lib/reference/types';
import type { ContentItem, CircuitTag, ContentType, SportTag } from '@/types/tags';

const ATHLETE_COLS = 'id,full_name,nation,nation_code,photo_url,sport_id,federation_id,bio,ranking,season_points';
const FED_COLS = 'id,name,short_name,slug,sport_id,nation,color,logo_url,description';

// true se Supabase è leggibile (per decidere mock fallback a monte).
export function supabaseReadable(): boolean {
  return getReadClient() !== null;
}

export async function getSportsMap(): Promise<Map<string, string>> {
  const db = getReadClient();
  if (!db) return new Map();
  const { data } = await db.from('sports').select('id,name');
  return new Map((data ?? []).map((s) => [s.id, s.name]));
}

export async function getSportsList(): Promise<SportRef[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db.from('sports').select('id,name,slug').order('sort_order');
  return data ?? [];
}

export async function getPublicAthletes(): Promise<AthleteFull[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db.from('athletes').select(ATHLETE_COLS).order('ranking', { ascending: true });
  return (data as AthleteFull[] | null) ?? [];
}

export async function getPublicAthlete(id: string): Promise<AthleteFull | null> {
  const db = getReadClient();
  if (!db) return null;
  const { data } = await db.from('athletes').select(ATHLETE_COLS).eq('id', id).maybeSingle();
  return (data as AthleteFull | null) ?? null;
}

export async function getOtherAthletes(excludeId: string, limit = 6): Promise<AthleteFull[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db.from('athletes').select(ATHLETE_COLS).neq('id', excludeId).limit(limit);
  return (data as AthleteFull[] | null) ?? [];
}

export async function getPublicFederations(): Promise<FederationFull[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db.from('federations').select(FED_COLS).order('name');
  return (data as FederationFull[] | null) ?? [];
}

export async function getPublicFederation(id: string): Promise<FederationFull | null> {
  const db = getReadClient();
  if (!db) return null;
  const { data } = await db.from('federations').select(FED_COLS).eq('id', id).maybeSingle();
  return (data as FederationFull | null) ?? null;
}

export async function getFederationAthletes(federationId: string): Promise<AthleteFull[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db.from('athletes').select(ATHLETE_COLS).eq('federation_id', federationId).order('full_name');
  return (data as AthleteFull[] | null) ?? [];
}

// ----- Eventi -------------------------------------------------------
export type EventView = {
  id: string;
  title: string;
  location: string;
  dateRange: string;
  stage: string;
};

function fmtDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export async function getFederationEvents(federationId: string): Promise<EventView[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db
    .from('events')
    .select('id,title,location,start_date,end_date,stage')
    .eq('federation_id', federationId)
    .order('start_date', { ascending: true });
  return (data ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    location: e.location ?? '—',
    dateRange: e.end_date && e.end_date !== e.start_date ? `${fmtDate(e.start_date)} – ${fmtDate(e.end_date)}` : fmtDate(e.start_date),
    stage: e.stage ?? '—',
  }));
}

// Prossimi eventi della federazione dell'atleta (date future). Vedi TASK 3:
// "OR events of the athlete's federation with future dates".
export async function getAthleteUpcomingEvents(federationId: string | null): Promise<EventView[]> {
  if (!federationId) return [];
  const db = getReadClient();
  if (!db) return [];
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await db
    .from('events')
    .select('id,title,location,start_date,end_date,stage')
    .eq('federation_id', federationId)
    .or(`start_date.gte.${today},start_date.is.null`)
    .order('start_date', { ascending: true })
    .limit(8);
  return (data ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    location: e.location ?? '—',
    dateRange: fmtDate(e.start_date),
    stage: e.stage ?? '—',
  }));
}

// ----- Match recenti dell'atleta ------------------------------------
export type MatchView = {
  id: string;
  teamA: string;
  teamB: string;
  result: 'W' | 'L';
  date: string;
  videoId: string | null;
};

export async function getAthleteRecentMatches(athleteId: string): Promise<MatchView[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db
    .from('match_athletes')
    .select('team, matches(id,team_a_name,team_b_name,sets_a,sets_b,status,ended_at,video_id)')
    .eq('athlete_id', athleteId);
  return (data ?? [])
    .filter((r) => r.matches && r.matches.status === 'completed')
    .map((r) => {
      const m = r.matches!;
      const winner = (m.sets_a ?? 0) >= (m.sets_b ?? 0) ? 'A' : 'B';
      return {
        id: m.id,
        teamA: m.team_a_name ?? 'Team A',
        teamB: m.team_b_name ?? 'Team B',
        result: (r.team === winner ? 'W' : 'L') as 'W' | 'L',
        date: fmtDate(m.ended_at),
        videoId: m.video_id,
      };
    });
}

// ----- Video di una federazione (per le tab federazione) -------------
function mapVideoType(t: string | null): ContentType {
  switch (t) {
    case 'live': return 'live';
    case 'replay': return 'replay';
    case 'interview': return 'interview';
    case 'highlights': return 'highlights';
    case 'behind_scenes': return 'behind-the-scenes';
    default: return 'replay';
  }
}

export async function getFederationVideos(federationId: string, fedShort: string, sportName: string): Promise<ContentItem[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db
    .from('videos')
    .select('*')
    .eq('federation_id', federationId)
    .eq('status', 'ready')
    .order('created_at', { ascending: false });
  return (data ?? []).map((v) => {
    const type = mapVideoType(v.type);
    return {
      id: v.id,
      title: v.title,
      circuit: (fedShort || undefined) as CircuitTag | undefined,
      sport: (sportName || 'Beach Volley') as SportTag,
      type,
      nations: [],
      thumbnail: v.thumbnail_card_url || (v.cloudflare_uid ? getThumbnailUrl(v.cloudflare_uid) : undefined),
      duration: v.duration_seconds ? String(v.duration_seconds) : '',
      isPremium: v.access_level === 'premium',
      date: fmtDate(v.published_at ?? v.created_at),
      tags: [type, sportName],
    } satisfies ContentItem;
  });
}
