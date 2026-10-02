// Adattatore unico di lettura del catalogo SANDR.
// Le PAGINE importano SOLO da qui: mai da mock-hierarchy, mai da database.ts.
// Ogni funzione restituisce esclusivamente i tipi di src/types/hierarchy.ts.
// La sorgente (supabase | mock) per ciascuna entità è decisa in ./config.

import 'server-only';
import { getReadClient } from '@/lib/supabase/guard';
import { mockHierarchy } from '@/lib/mock-hierarchy';
import type { AthleteFull, FederationFull } from '@/lib/reference/types';
import type { EventRow } from '@/lib/events/types';
import type {
  Assignment,
  Athlete,
  Circuit,
  Club,
  Court,
  Edition,
  Federation,
  LiveStream,
  Match,
  Pair,
  Series,
  Speaker,
  Station,
} from '@/types/hierarchy';
import { dataSourceConfig } from './config';
import { athleteFromRow, editionFromEventRow, federationFromRow } from './adapters';

// View-model e letture per le home PRO/OPEN (dirette, interviste, prossimo evento).
export * from './home';

const FED_COLS = 'id,name,short_name,slug,sport_id,nation,color,logo_url,description';
const ATHLETE_COLS =
  'id,full_name,nation,nation_code,photo_url,sport_id,federation_id,bio,ranking,season_points,is_featured,birth_date';
const EVENT_COLS = 'id,title,slug,federation_id,sport_id,location,nation,start_date,end_date,stage';

// =====================================================================
// Getter base per entità (una per tabella/concetto della gerarchia)
// =====================================================================

export async function getFederations(): Promise<Federation[]> {
  if (dataSourceConfig.federations === 'supabase') {
    const db = getReadClient();
    if (db) {
      const [{ data: feds }, { data: sports }] = await Promise.all([
        db.from('federations').select(FED_COLS).order('name'),
        db.from('sports').select('id,name'),
      ]);
      const rows = (feds as FederationFull[] | null) ?? [];
      if (rows.length > 0) {
        const sportName = new Map((sports ?? []).map((s) => [s.id, s.name]));
        return rows.map((f) => federationFromRow(f, sportName.get(f.sport_id ?? '') ?? 'Beach Volley'));
      }
    }
  }
  return mockHierarchy.federations;
}

export async function getAthletes(): Promise<Athlete[]> {
  if (dataSourceConfig.athletes === 'supabase') {
    const db = getReadClient();
    if (db) {
      const { data } = await db.from('athletes').select(ATHLETE_COLS).order('ranking', { ascending: true });
      const rows = (data as AthleteFull[] | null) ?? [];
      if (rows.length > 0) return rows.map(athleteFromRow);
    }
  }
  return mockHierarchy.athletes;
}

export async function getEditions(): Promise<Edition[]> {
  if (dataSourceConfig.editions === 'supabase') {
    const db = getReadClient();
    if (db) {
      const { data } = await db.from('events').select(EVENT_COLS).order('start_date', { ascending: false });
      const rows = (data as EventRow[] | null) ?? [];
      if (rows.length > 0) return rows.map(editionFromEventRow);
    }
  }
  return mockHierarchy.editions;
}

// Entità senza tabella Supabase: sempre da mock finché il backend non è deciso.
export async function getCircuits(): Promise<Circuit[]> {
  return mockHierarchy.circuits;
}
export async function getSeries(): Promise<Series[]> {
  return mockHierarchy.series;
}
export async function getCourts(): Promise<Court[]> {
  return mockHierarchy.courts;
}
export async function getPairs(): Promise<Pair[]> {
  return mockHierarchy.pairs;
}
export async function getMatches(): Promise<Match[]> {
  return mockHierarchy.matches;
}
export async function getStations(): Promise<Station[]> {
  return mockHierarchy.stations;
}
export async function getAssignments(): Promise<Assignment[]> {
  return mockHierarchy.assignments;
}
export async function getSpeakers(): Promise<Speaker[]> {
  return mockHierarchy.speakers;
}
export async function getLiveStreams(): Promise<LiveStream[]> {
  return mockHierarchy.liveStreams;
}
export async function getClubs(): Promise<Club[]> {
  return mockHierarchy.clubs;
}
export async function getClubById(id: string): Promise<Club | null> {
  return (await getClubs()).find((c) => c.id === id) ?? null;
}

// =====================================================================
// Helper relazionali (navigano la gerarchia componendo i getter base)
// =====================================================================

export async function getCircuitsByFederation(federationId: string): Promise<Circuit[]> {
  return (await getCircuits()).filter((c) => c.federationId === federationId);
}

export async function getSeriesByCircuit(circuitId: string): Promise<Series[]> {
  return (await getSeries()).filter((s) => s.circuitId === circuitId);
}

export async function getEditionsBySeries(seriesId: string): Promise<Edition[]> {
  return (await getEditions()).filter((e) => e.seriesId === seriesId);
}

export async function getCourtsByEdition(editionId: string): Promise<Court[]> {
  return (await getCourts()).filter((c) => c.editionId === editionId);
}

export async function getMatchesByEdition(editionId: string): Promise<Match[]> {
  return (await getMatches()).filter((m) => m.editionId === editionId);
}

// Partite in diretta ora (per la home/"Live ora").
export async function getLiveMatches(): Promise<Match[]> {
  return (await getMatches()).filter((m) => m.status === 'live');
}

// Diretta associata a una partita (null se l'edizione è "solo risultati").
export async function getLiveStreamForMatch(matchId: string): Promise<LiveStream | null> {
  return (await getLiveStreams()).find((l) => l.matchId === matchId) ?? null;
}

// Speaker di una partita (max 2 per vincolo applicativo).
export async function getSpeakersForMatch(matchId: string): Promise<Speaker[]> {
  const [speakers, links] = await Promise.all([getSpeakers(), Promise.resolve(mockHierarchy.matchSpeakers)]);
  const ids = new Set(links.filter((ms) => ms.matchId === matchId).map((ms) => ms.speakerId));
  return speakers.filter((s) => ids.has(s.id));
}

export async function getPairById(id: string): Promise<Pair | null> {
  return (await getPairs()).find((p) => p.id === id) ?? null;
}

export async function getAthleteById(id: string): Promise<Athlete | null> {
  return (await getAthletes()).find((a) => a.id === id) ?? null;
}

// =====================================================================
// View-model: Console speaker (staff/admin)
// =====================================================================
export interface SpeakerConsoleVM {
  matchId: string;
  title: string; // "Coppia A vs Coppia B"
  editionName: string;
  courtName: string;
  status: string;
  scheduledAt: string;
  speakers: { name: string; location: string }[];
  stream: { status: string; audio: string; hasCommentary: boolean } | null;
}

export async function getSpeakerConsole(matchId: string): Promise<SpeakerConsoleVM | null> {
  const matches = await getMatches();
  const m = matches.find((x) => x.id === matchId);
  if (!m) return null;

  const [pairs, editions, courts, speakers, stream] = await Promise.all([
    getPairs(),
    getEditions(),
    getCourts(),
    getSpeakersForMatch(matchId),
    getLiveStreamForMatch(matchId),
  ]);
  const pairName = new Map(pairs.map((p) => [p.id, p.name]));
  const edName = new Map(editions.map((e) => [e.id, e.name]));
  const courtName = new Map(courts.map((c) => [c.id, c.name]));

  return {
    matchId: m.id,
    title: `${pairName.get(m.pairAId) ?? '—'} vs ${pairName.get(m.pairBId) ?? '—'}`,
    editionName: edName.get(m.editionId) ?? '',
    courtName: courtName.get(m.courtId) ?? '',
    status: m.status,
    scheduledAt: m.scheduledAt,
    speakers: speakers.map((s) => ({ name: s.name, location: s.location })),
    stream: stream
      ? { status: stream.status, audio: stream.audio, hasCommentary: stream.hasCommentary }
      : null,
  };
}

// =====================================================================
// View-model: Tornei (catalogo) e Profilo atleta
// =====================================================================

export interface TournamentEditionVM {
  id: string;
  name: string;
  dates: string; // "YYYY-MM-DD – YYYY-MM-DD"
  location: string;
  face: 'pro' | 'open';
  resultsOnly: boolean;
  registration: 'individual' | 'club';
  liveCount: number; // partite in diretta ora
  scheduledCount: number; // partite in programma
}

export interface TournamentGroupVM {
  circuitId: string;
  circuitName: string;
  federation: string;
  editions: TournamentEditionVM[];
}

// Tornei raggruppati per circuito (federazione → circuito → serie → edizione).
// Nota interim: le edizioni importate senza serie (seriesId null) non hanno un
// circuito e non compaiono qui finché il modello non sarà collegato nel backend.
export async function getTournaments(): Promise<TournamentGroupVM[]> {
  const [feds, circuits, series, editions, matches] = await Promise.all([
    getFederations(),
    getCircuits(),
    getSeries(),
    getEditions(),
    getMatches(),
  ]);
  const fedShort = new Map(feds.map((f) => [f.id, f.shortName]));
  const seriesById = new Map(series.map((s) => [s.id, s]));
  // Conteggi partite (live/in programma) per edizione.
  const liveByEd = new Map<string, number>();
  const schedByEd = new Map<string, number>();
  for (const m of matches) {
    if (m.status === 'live') liveByEd.set(m.editionId, (liveByEd.get(m.editionId) ?? 0) + 1);
    if (m.status === 'scheduled') schedByEd.set(m.editionId, (schedByEd.get(m.editionId) ?? 0) + 1);
  }

  return circuits
    .map((c) => ({
      circuitId: c.id,
      circuitName: c.name,
      federation: fedShort.get(c.federationId) ?? '',
      editions: editions
        .filter((e) => {
          const s = e.seriesId ? seriesById.get(e.seriesId) : null;
          return s?.circuitId === c.id;
        })
        .map((e) => ({
          id: e.id,
          name: e.name,
          dates: `${e.startDate} – ${e.endDate}`,
          location: e.location,
          face: e.face,
          resultsOnly: e.rights.resultsOnly,
          registration: e.registration,
          liveCount: liveByEd.get(e.id) ?? 0,
          scheduledCount: schedByEd.get(e.id) ?? 0,
        })),
    }))
    .filter((g) => g.editions.length > 0);
}

// =====================================================================
// View-model: Dettaglio torneo (edizione) con partite raggruppate
// =====================================================================
export interface TournamentMatchVM {
  id: string;
  title: string; // "Coppia A vs Coppia B"
  teamA: string;
  teamB: string;
  courtName: string;
  time: string; // orario (HH:MM) o data
  score: string; // "21-18  19-21" o ''
  hasLiveStream: boolean;
}

export interface TournamentDetailVM {
  id: string;
  name: string;
  circuitName: string;
  federation: string;
  dates: string;
  location: string;
  face: 'pro' | 'open';
  registration: 'individual' | 'club';
  resultsOnly: boolean;
  live: TournamentMatchVM[];
  scheduled: TournamentMatchVM[];
  results: TournamentMatchVM[];
}

// Dettaglio di un'edizione: anagrafica + partite raggruppate per stato
// (in diretta / in programma / risultati). Dati SOLO da @/lib/data.
export async function getTournamentDetail(editionId: string): Promise<TournamentDetailVM | null> {
  const [editions, circuits, series, feds, matches, pairs, courts, liveStreams] = await Promise.all([
    getEditions(),
    getCircuits(),
    getSeries(),
    getFederations(),
    getMatchesByEdition(editionId),
    getPairs(),
    getCourtsByEdition(editionId),
    getLiveStreams(),
  ]);
  const ed = editions.find((e) => e.id === editionId);
  if (!ed) return null;

  const s = ed.seriesId ? series.find((x) => x.id === ed.seriesId) ?? null : null;
  const circuit = s ? circuits.find((c) => c.id === s.circuitId) ?? null : null;
  const fedShort = circuit ? feds.find((f) => f.id === circuit.federationId)?.shortName ?? '' : '';
  const pairName = new Map(pairs.map((p) => [p.id, p.name]));
  const courtName = new Map(courts.map((c) => [c.id, c.name]));
  const liveMatchIds = new Set(liveStreams.map((l) => l.matchId).filter(Boolean) as string[]);

  const toVM = (m: Match): TournamentMatchVM => ({
    id: m.id,
    title: `${pairName.get(m.pairAId) ?? '—'} vs ${pairName.get(m.pairBId) ?? '—'}`,
    teamA: pairName.get(m.pairAId) ?? '—',
    teamB: pairName.get(m.pairBId) ?? '—',
    courtName: courtName.get(m.courtId) ?? '',
    time: m.scheduledAt.length >= 16 ? m.scheduledAt.slice(11, 16) : m.scheduledAt.slice(0, 10),
    score: m.sets.map((x) => `${x.a}-${x.b}`).join('  '),
    hasLiveStream: liveMatchIds.has(m.id),
  });

  return {
    id: ed.id,
    name: ed.name,
    circuitName: circuit?.name ?? '',
    federation: fedShort,
    dates: `${ed.startDate} – ${ed.endDate}`,
    location: ed.location,
    face: ed.face,
    registration: ed.registration,
    resultsOnly: ed.rights.resultsOnly,
    live: matches.filter((m) => m.status === 'live').map(toVM),
    scheduled: matches.filter((m) => m.status === 'scheduled').map(toVM),
    results: matches.filter((m) => m.status === 'completed').map(toVM),
  };
}

export interface AthleteMatchVM {
  id: string;
  opponent: string;
  editionName: string;
  date: string;
  status: string;
  score: string;
  won: boolean | null; // null se non conclusa
}

export interface AthleteProfileVM {
  athlete: Athlete;
  currentPairName: string | null;
  matches: AthleteMatchVM[];
}

// Profilo atleta: anagrafica + coppia attuale + match recenti (risolti da coppie/
// edizioni). I match compaiono quando atleta e coppie sono nella stessa sorgente
// dati (oggi: mock/demo); per gli atleti reali senza coppie collegate la lista
// resta vuota finché il modello non sarà unificato.
export async function getAthleteProfile(id: string): Promise<AthleteProfileVM | null> {
  const athlete = await getAthleteById(id);
  if (!athlete) return null;

  const [pairs, matches, editions] = await Promise.all([getPairs(), getMatches(), getEditions()]);
  const myPairs = pairs.filter((p) => p.athlete1Id === id || p.athlete2Id === id);
  const myPairIds = new Set(myPairs.map((p) => p.id));
  const current = myPairs.find((p) => p.validTo === null) ?? myPairs[0] ?? null;

  const edName = new Map(editions.map((e) => [e.id, e.name]));
  const pairName = new Map(pairs.map((p) => [p.id, p.name]));

  const vms: AthleteMatchVM[] = matches
    .filter((m) => myPairIds.has(m.pairAId) || myPairIds.has(m.pairBId))
    .map((m) => {
      const mineIsA = myPairIds.has(m.pairAId);
      const oppId = mineIsA ? m.pairBId : m.pairAId;
      const setsA = m.sets.filter((s) => s.a > s.b).length;
      const setsB = m.sets.filter((s) => s.b > s.a).length;
      const won =
        m.status === 'completed' ? (mineIsA ? setsA > setsB : setsB > setsA) : null;
      return {
        id: m.id,
        opponent: pairName.get(oppId) ?? '—',
        editionName: edName.get(m.editionId) ?? '',
        date: m.scheduledAt.slice(0, 10),
        status: m.status,
        score: m.sets.map((s) => `${s.a}-${s.b}`).join('  '),
        won,
      };
    });

  return { athlete, currentPairName: current?.name ?? null, matches: vms };
}
