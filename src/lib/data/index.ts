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
// View-model: Tornei (catalogo) e Profilo atleta
// =====================================================================

export interface TournamentEditionVM {
  id: string;
  name: string;
  dates: string; // "YYYY-MM-DD – YYYY-MM-DD"
  location: string;
  face: 'pro' | 'open';
  resultsOnly: boolean;
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
  const [feds, circuits, series, editions] = await Promise.all([
    getFederations(),
    getCircuits(),
    getSeries(),
    getEditions(),
  ]);
  const fedShort = new Map(feds.map((f) => [f.id, f.shortName]));
  const seriesById = new Map(series.map((s) => [s.id, s]));

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
        })),
    }))
    .filter((g) => g.editions.length > 0);
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
