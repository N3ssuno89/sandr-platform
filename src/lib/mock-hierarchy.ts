// Dati mock del modello gerarchico SANDR (OPZIONE B: nessuna tabella DB).
// Dataset piccolo ma coerente, pensato per prototipare la UI del catalogo e
// verificare che le relazioni della gerarchia si risolvano. I valori sono
// placeholder: nessuna chiave di trasmissione reale, nessun id FIVB reale.
//
// Quando il backend sarà deciso, questi array verranno sostituiti da query
// (Supabase o altro) mantenendo le stesse shape definite in types/hierarchy.ts.

import type {
  Assignment,
  Athlete,
  Circuit,
  Court,
  Edition,
  Federation,
  HierarchyData,
  Match,
  MatchSpeaker,
  Pair,
  Series,
  Speaker,
  Station,
} from '@/types/hierarchy';

// ----- Federazioni ---------------------------------------------------
const federations: Federation[] = [
  { id: 'fed-fivb', name: 'Fédération Internationale de Volleyball', shortName: 'FIVB', nation: null, sport: 'Beach Volley', source: 'fivbeach', externalId: 'VIS-FED-1', externalSystem: 'fivb-vis' },
  { id: 'fed-fipav', name: 'Federazione Italiana Pallavolo', shortName: 'FIPAV', nation: 'Italia', sport: 'Beach Volley', source: 'sandr', externalId: null },
  { id: 'fed-aibvc', name: 'Associazione Italiana Beach Volley Club', shortName: 'AIBVC', nation: 'Italia', sport: 'Beach Volley', source: 'sandr', externalId: null },
];

// ----- Circuiti (tour/categoria di una federazione) ------------------
const circuits: Circuit[] = [
  { id: 'cir-bpt', federationId: 'fed-fivb', name: 'Beach Pro Tour', category: 'Elite16', source: 'fivbeach', externalId: 'VIS-CIR-BPT', externalSystem: 'fivb-vis' },
  { id: 'cir-ita', federationId: 'fed-fipav', name: 'Campionato Italiano Assoluto', category: null, source: 'sandr', externalId: null },
  { id: 'cir-aibvc', federationId: 'fed-aibvc', name: 'AIBVC Tour', category: null, source: 'sandr', externalId: null },
];

// ----- Serie = evento ricorrente -------------------------------------
const series: Series[] = [
  { id: 'ser-elite-roma', circuitId: 'cir-bpt', name: 'Elite16 Roma', source: 'fivbeach', externalId: 'VIS-SER-ROMA', externalSystem: 'fivb-vis' },
  { id: 'ser-finale-ita', circuitId: 'cir-ita', name: 'Finale Nazionale', source: 'sandr', externalId: null },
  { id: 'ser-bibione', circuitId: 'cir-aibvc', name: 'Tappa di Bibione', source: 'sandr', externalId: null },
];

// ----- Edizioni = occorrenze singole ---------------------------------
const editions: Edition[] = [
  {
    id: 'ed-elite-roma-2025',
    seriesId: 'ser-elite-roma',
    name: 'Elite16 Roma 2025',
    startDate: '2025-06-10',
    endDate: '2025-06-15',
    location: 'Roma — Foro Italico',
    nation: 'Italia',
    coordinates: { lat: 41.9281, lng: 12.4573 },
    face: 'pro',
    qualityProfile: 'high',
    rights: { defaultAccess: 'premium', visibility: 'public', geoblock: null },
    source: 'fivbeach',
    externalId: 'VIS-ED-ROMA-2025',
    externalSystem: 'fivb-vis',
  },
  {
    id: 'ed-finale-ita-2025',
    seriesId: 'ser-finale-ita',
    name: 'Finale Nazionale Roma 2025',
    startDate: '2025-09-05',
    endDate: '2025-09-07',
    location: 'Roma',
    nation: 'Italia',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    face: 'pro',
    qualityProfile: 'high',
    rights: { defaultAccess: 'free', visibility: 'public', geoblock: null },
    source: 'sandr',
    externalId: null,
  },
  {
    id: 'ed-bibione-2025',
    seriesId: 'ser-bibione',
    name: 'Bibione 2025',
    startDate: '2025-07-18',
    endDate: '2025-07-20',
    location: 'Bibione (VE)',
    nation: 'Italia',
    coordinates: { lat: 45.6366, lng: 13.0486 },
    face: 'open',
    qualityProfile: 'medium',
    rights: { defaultAccess: 'free', visibility: 'public', geoblock: null },
    source: 'sandr',
    externalId: null,
  },
];

// ----- Campi di gioco ------------------------------------------------
const courts: Court[] = [
  { id: 'court-roma-central', editionId: 'ed-elite-roma-2025', name: 'Campo Centrale' },
  { id: 'court-roma-1', editionId: 'ed-elite-roma-2025', name: 'Campo 1' },
  { id: 'court-finale-central', editionId: 'ed-finale-ita-2025', name: 'Campo Centrale' },
  { id: 'court-bibione-central', editionId: 'ed-bibione-2025', name: 'Campo Centrale' },
];

// ----- Atleti --------------------------------------------------------
const athletes: Athlete[] = [
  { id: 'ath-lupo', fullName: 'Daniele Lupo', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 18, source: 'sandr', externalId: null },
  { id: 'ath-nicolai', fullName: 'Paolo Nicolai', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 15, source: 'sandr', externalId: null },
  { id: 'ath-carambula', fullName: 'Enrico Rossi Carambula', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 24, source: 'sandr', externalId: null },
  { id: 'ath-cottafava', fullName: 'Samuele Cottafava', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 12, source: 'sandr', externalId: null },
  { id: 'ath-mol', fullName: 'Anders Mol', nation: 'Norvegia', nationCode: 'NOR', photoUrl: null, ranking: 1, source: 'fivbeach', externalId: 'VIS-ATH-MOL', externalSystem: 'fivb-vis' },
  { id: 'ath-sorum', fullName: 'Christian Sørum', nation: 'Norvegia', nationCode: 'NOR', photoUrl: null, ranking: 1, source: 'fivbeach', externalId: 'VIS-ATH-SORUM', externalSystem: 'fivb-vis' },
];

// ----- Coppie (temporali: validFrom/validTo) -------------------------
const pairs: Pair[] = [
  { id: 'pair-mol-sorum', athlete1Id: 'ath-mol', athlete2Id: 'ath-sorum', name: 'Mol / Sørum', validFrom: '2018-01-01', validTo: null, source: 'fivbeach', externalId: 'VIS-TEAM-MOLSORUM', externalSystem: 'fivb-vis' },
  { id: 'pair-lupo-cottafava', athlete1Id: 'ath-lupo', athlete2Id: 'ath-cottafava', name: 'Lupo / Cottafava', validFrom: '2024-01-01', validTo: null, source: 'sandr', externalId: null },
  // Coppia storica sciolta: dimostra il modello temporale (validTo valorizzato).
  { id: 'pair-lupo-nicolai', athlete1Id: 'ath-lupo', athlete2Id: 'ath-nicolai', name: 'Lupo / Nicolai', validFrom: '2015-01-01', validTo: '2021-09-01', source: 'sandr', externalId: null },
  { id: 'pair-carambula-rossi', athlete1Id: 'ath-carambula', athlete2Id: 'ath-nicolai', name: 'Carambula / Nicolai', validFrom: '2023-01-01', validTo: null, source: 'sandr', externalId: null },
];

// ----- Partite -------------------------------------------------------
const matches: Match[] = [
  {
    id: 'match-roma-final',
    editionId: 'ed-elite-roma-2025',
    courtId: 'court-roma-central',
    pairAId: 'pair-mol-sorum',
    pairBId: 'pair-lupo-cottafava',
    status: 'completed',
    scheduledAt: '2025-06-15T18:00:00Z',
    startedAt: '2025-06-15T18:03:00Z',
    endedAt: '2025-06-15T18:52:00Z',
    sets: [
      { a: 21, b: 18 },
      { a: 19, b: 21 },
      { a: 15, b: 12 },
    ],
    source: 'fivbeach',
    externalId: 'VIS-MATCH-ROMA-F',
    externalSystem: 'fivb-vis',
  },
  {
    id: 'match-bibione-sf',
    editionId: 'ed-bibione-2025',
    courtId: 'court-bibione-central',
    pairAId: 'pair-carambula-rossi',
    pairBId: 'pair-lupo-cottafava',
    status: 'scheduled',
    scheduledAt: '2025-07-20T10:00:00Z',
    startedAt: null,
    endedAt: null,
    sets: [],
    source: 'sandr',
    externalId: null,
  },
];

// ----- Postazioni (AREA CRITICA: streamKey è placeholder mock) -------
const stations: Station[] = [
  { id: 'stn-phone-01', label: 'iPhone campo centrale', type: 'phone_app', streamKey: 'mock-phone-key-0001' },
  { id: 'stn-rtmp-01', label: 'Regia esterna Roma', type: 'external_rtmp_srt', streamKey: 'mock-rtmp-key-0001' },
];

// ----- Assegnazioni (postazione → campo, per finestra oraria) --------
const assignments: Assignment[] = [
  { id: 'asg-roma-central', stationId: 'stn-rtmp-01', courtId: 'court-roma-central', startsAt: '2025-06-15T17:30:00Z', endsAt: '2025-06-15T20:00:00Z' },
  { id: 'asg-bibione-central', stationId: 'stn-phone-01', courtId: 'court-bibione-central', startsAt: '2025-07-20T09:30:00Z', endsAt: '2025-07-20T13:00:00Z' },
];

// ----- Speaker -------------------------------------------------------
const speakers: Speaker[] = [
  { id: 'spk-01', name: 'Marco Fabbri', location: 'onsite' },
  { id: 'spk-02', name: 'Giulia Bianchi', location: 'remote' },
  { id: 'spk-03', name: 'Luca Verdi', location: 'onsite' },
];

// Assegnazione speaker→partita (max 2 per partita).
const matchSpeakers: MatchSpeaker[] = [
  { matchId: 'match-roma-final', speakerId: 'spk-01' },
  { matchId: 'match-roma-final', speakerId: 'spk-02' },
  { matchId: 'match-bibione-sf', speakerId: 'spk-03' },
];

// Dataset completo.
export const mockHierarchy: HierarchyData = {
  federations,
  circuits,
  series,
  editions,
  courts,
  athletes,
  pairs,
  matches,
  stations,
  assignments,
  speakers,
  matchSpeakers,
};

// ----- Helper di navigazione della gerarchia (risolvono le relazioni) -
export const getCircuitsByFederation = (federationId: string) =>
  circuits.filter((c) => c.federationId === federationId);

export const getSeriesByCircuit = (circuitId: string) =>
  series.filter((s) => s.circuitId === circuitId);

export const getEditionsBySeries = (seriesId: string) =>
  editions.filter((e) => e.seriesId === seriesId);

export const getCourtsByEdition = (editionId: string) =>
  courts.filter((c) => c.editionId === editionId);

export const getMatchesByEdition = (editionId: string) =>
  matches.filter((m) => m.editionId === editionId);

export const getAthleteById = (athleteId: string) =>
  athletes.find((a) => a.id === athleteId) ?? null;

export const getPairById = (pairId: string) => pairs.find((p) => p.id === pairId) ?? null;

export const getSpeakersForMatch = (matchId: string) =>
  matchSpeakers
    .filter((ms) => ms.matchId === matchId)
    .map((ms) => speakers.find((s) => s.id === ms.speakerId))
    .filter((s): s is Speaker => s !== undefined);
