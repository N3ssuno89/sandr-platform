// Dati per le home PRO/OPEN. Le PAGINE leggono SOLO da @/lib/data: qui
// componiamo i video reali del catalogo (Supabase/Cloudflare) e, SE il flag
// DEMO_CONTENT è acceso, i contenuti dimostrativi (dirette/interviste di prova
// riproducibili usando video VERI del catalogo). Con il flag spento non viene
// mostrato nulla di finto.

import 'server-only';
import { DEMO_CONTENT } from '@/config/features';
import { getReadClient } from '@/lib/supabase/guard';
import { getVideosForDisplay, getVideoForPlayer } from '@/lib/videos/actions';
import { checkVideoAccess } from '@/lib/access/server';
import type { Face } from '@/config/faces';
import type { ContentItem } from '@/types/tags';

// Etichetta audio language-agnostica (il testo è risolto nei componenti via i18n).
export type LiveAudio = 'commentary' | 'field';

export interface LiveCardVM {
  id: string; // id video reale da aprire su /live/[id] (o id mock se non riproducibile)
  title: string | null; // null → il componente usa un titolo generico i18n
  subtitle: string | null; // squadre/contesto
  audio: LiveAudio;
  free: boolean; // mostra "LIVE · GRATIS"
  demo: boolean; // mostra "Dati dimostrativi"
  playable: boolean; // ha un video reale dietro
  thumbnail?: string;
}

export interface InterviewCardVM {
  id: string; // id video da aprire su /vod/[id]
  title: string | null;
  demo: boolean;
  thumbnail?: string;
}

export interface NextEventVM {
  title: string;
  date: string;
  location: string;
}

export interface LivePlayableVM {
  title: string;
  subtitle: string | null;
  cloudflareUid: string | null; // null se non accessibile o inesistente
  allowed: boolean;
  demo: boolean;
  // Contesto partita (dal catalogo video, quando disponibile).
  teams: string | null;
  circuit: string | null;
  sport: string | null;
  event: string | null;
  access: 'free' | 'premium' | 'ppv';
}

// Card di una diretta correlata ("altri campi / altre dirette").
export interface RelatedLiveVM {
  id: string;
  title: string | null;
  subtitle: string | null;
  free: boolean;
  thumbnail?: string;
}

// Spec dei contenuti dimostrativi per volto (ordine = quello mostrato).
const DEMO_LIVE: Record<Face, Array<{ audio: LiveAudio; free: boolean }>> = {
  // ≥3 PRO: una con commento live, due con audio campo.
  pro: [
    { audio: 'commentary', free: false },
    { audio: 'field', free: false },
    { audio: 'field', free: false },
  ],
  // ≥2 OPEN: audio campo, gratis.
  open: [
    { audio: 'field', free: true },
    { audio: 'field', free: true },
  ],
};

// Pool di video reali per "foderare" i contenuti demo: preferisce i FREE così
// sono riproducibili senza aggirare il paywall (il gating resta attivo).
function backingPool(all: ContentItem[]): ContentItem[] {
  const free = all.filter((v) => (v.access ?? 'free') === 'free');
  return free.length > 0 ? free : all;
}

export async function getLiveCards(face: Face): Promise<LiveCardVM[]> {
  const all = await getVideosForDisplay();

  // Dirette REALI (type 'live') — sempre mostrate, mai demo.
  const realLive: LiveCardVM[] = all
    .filter((v) => v.type === 'live')
    .map((v) => ({
      id: v.id,
      title: v.title,
      subtitle: v.teams ?? null,
      audio: 'commentary',
      free: (v.access ?? 'free') === 'free',
      demo: false,
      playable: true,
      thumbnail: v.thumbnail,
    }));

  if (!DEMO_CONTENT) return realLive;

  // Contenuti dimostrativi: foderati con video reali (riproducibili).
  const pool = backingPool(all);
  const demo: LiveCardVM[] = DEMO_LIVE[face].map((spec, i) => {
    const v = pool.length > 0 ? pool[i % pool.length] : null;
    return {
      id: v ? v.id : `demo-live-${face}-${i}`,
      title: v ? v.title : null,
      subtitle: v?.teams ?? null,
      audio: spec.audio,
      free: spec.free,
      demo: true,
      playable: !!v,
      thumbnail: v?.thumbnail,
    };
  });

  return [...realLive, ...demo];
}

export async function getInterviewCards(): Promise<InterviewCardVM[]> {
  const all = await getVideosForDisplay();
  const real: InterviewCardVM[] = all
    .filter((v) => v.type === 'interview')
    .map((v) => ({ id: v.id, title: v.title, demo: false, thumbnail: v.thumbnail }));

  if (!DEMO_CONTENT) return real;
  if (real.length >= 4) return real;

  // Completa fino ad almeno 4 card con demo che aprono un video esistente.
  const pool = backingPool(all);
  const cards = [...real];
  for (let i = 0; cards.length < 4; i++) {
    const v = pool.length > 0 ? pool[i % pool.length] : null;
    cards.push({
      id: v ? v.id : `demo-int-${i}`,
      title: v ? v.title : null,
      demo: true,
      thumbnail: v?.thumbnail,
    });
    if (pool.length === 0 && cards.length >= 4) break; // evita loop se catalogo vuoto
  }
  return cards;
}

// Prossimo evento REALE dal catalogo (per lo stato vuoto a flag spento).
// Nessun fallback mock: a flag spento non si mostra nulla di finto.
export async function getNextEvent(): Promise<NextEventVM | null> {
  const db = getReadClient();
  if (!db) return null;
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await db
    .from('events')
    .select('title,location,start_date')
    .gte('start_date', today)
    .order('start_date', { ascending: true })
    .limit(1);
  const e = (data ?? [])[0];
  if (!e) return null;
  return { title: e.title, date: e.start_date ?? '', location: e.location ?? '' };
}

// Player semplice /live/[id]: risolve il video reale e applica il gating
// SERVER-SIDE (l'uid raggiunge il client solo se l'accesso è consentito).
export async function getLivePlayable(id: string): Promise<LivePlayableVM | null> {
  const pv = await getVideoForPlayer(id);
  if (!pv) return null;
  const access = await checkVideoAccess({ accessLevel: pv.accessLevel, type: pv.type }, id);

  // Contesto partita dal catalogo (teams/circuito/sport/evento), se presente.
  const all = await getVideosForDisplay();
  const item = all.find((v) => v.id === id) ?? null;

  return {
    title: pv.title,
    subtitle: item?.teams ?? null,
    cloudflareUid: access.allowed ? pv.cloudflareUid : null,
    allowed: access.allowed,
    demo: DEMO_CONTENT,
    teams: item?.teams ?? null,
    circuit: item?.circuit ?? null,
    sport: item?.sport ?? null,
    event: item?.event ?? null,
    access: (pv.accessLevel as 'free' | 'premium' | 'ppv') ?? 'free',
  };
}

// Altre dirette (per "altri campi"): dirette REALI del catalogo diverse da id.
// Se non ce ne sono e DEMO_CONTENT è acceso, usa le card demo del volto PRO.
export async function getRelatedLive(excludeId: string, face: Face = 'pro'): Promise<RelatedLiveVM[]> {
  const cards = await getLiveCards(face);
  return cards
    .filter((c) => c.id !== excludeId && c.playable)
    .slice(0, 6)
    .map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      free: c.free,
      thumbnail: c.thumbnail,
    }));
}
