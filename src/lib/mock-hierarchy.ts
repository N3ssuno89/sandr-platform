// Dati mock del modello gerarchico SANDR (OPZIONE B: nessuna tabella DB).
// Dataset coerente per prototipare catalogo, palinsesto e dirette. Valori
// placeholder: NESSUNA chiave di trasmissione (vivono solo nel backend dirette),
// id FIVB fittizi. "Oggi" di riferimento del dataset: 2026-10-02.
//
// Quando il backend sarà deciso, questi array verranno sostituiti da query
// mantenendo le shape di types/hierarchy.ts. Le pagine NON importano questo file
// direttamente: passano sempre da src/lib/data.

import type {
  Assignment,
  Athlete,
  Circuit,
  Club,
  Court,
  Edition,
  Federation,
  HierarchyData,
  LiveStream,
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
  { id: 'cir-aibvc-winter', federationId: 'fed-aibvc', name: 'AIBVC Winter Tour', category: 'Winter', source: 'sandr', externalId: null },
  // Circuito amatoriale (volto OPEN), a iscrizione per club.
  { id: 'cir-amatori', federationId: 'fed-aibvc', name: 'Lega Amatori Beach', category: 'Amatori', source: 'sandr', externalId: null },
];

// ----- Serie = evento ricorrente -------------------------------------
const series: Series[] = [
  { id: 'ser-elite-roma', circuitId: 'cir-bpt', name: 'Elite16 Roma', source: 'fivbeach', externalId: 'VIS-SER-ROMA', externalSystem: 'fivb-vis' },
  { id: 'ser-elite-gstaad', circuitId: 'cir-bpt', name: 'Elite16 Gstaad', source: 'fivbeach', externalId: 'VIS-SER-GSTAAD', externalSystem: 'fivb-vis' },
  { id: 'ser-finale-ita', circuitId: 'cir-ita', name: 'Finale Nazionale', source: 'sandr', externalId: null },
  { id: 'ser-challenge-napoli', circuitId: 'cir-ita', name: 'Challenge Napoli', source: 'sandr', externalId: null },
  { id: 'ser-genova', circuitId: 'cir-ita', name: 'Tappa di Genova', source: 'sandr', externalId: null },
  { id: 'ser-bibione', circuitId: 'cir-aibvc', name: 'Tappa di Bibione', source: 'sandr', externalId: null },
  { id: 'ser-roma-open', circuitId: 'cir-aibvc', name: 'Roma Club Open', source: 'sandr', externalId: null },
  { id: 'ser-winter-milano', circuitId: 'cir-aibvc-winter', name: 'Winter Tour Milano', source: 'sandr', externalId: null },
  // Edizione OPEN dentro un circuito PRO (Campionato Italiano): amatori a squadre.
  { id: 'ser-ita-amatori', circuitId: 'cir-ita', name: 'Campionato Amatori', source: 'sandr', externalId: null },
  // Circuito amatoriale dedicato.
  { id: 'ser-amatori-roma', circuitId: 'cir-amatori', name: 'Amatori Roma', source: 'sandr', externalId: null },
];

// Diritti di comodo riutilizzati sotto.
const rightsFree = { defaultAccess: 'free', visibility: 'public', geoblock: null, resultsOnly: false } as const;
const rightsPremium = { defaultAccess: 'premium', visibility: 'public', geoblock: null, resultsOnly: false } as const;
// FIVB/Beach Pro Tour: solo risultati, nessuna diretta, nessun video.
const rightsResultsOnly = { defaultAccess: 'free', visibility: 'public', geoblock: null, resultsOnly: true } as const;

// ----- Edizioni = occorrenze singole ---------------------------------
const editions: Edition[] = [
  // FIVB / BPT — SOLO RISULTATI (nessun LiveStream, nessun video).
  {
    id: 'ed-elite-roma-2025', seriesId: 'ser-elite-roma', name: 'Elite16 Roma 2025',
    registration: 'individual',
    startDate: '2025-06-10', endDate: '2025-06-15', location: 'Roma — Foro Italico', nation: 'Italia',
    coordinates: { lat: 41.9281, lng: 12.4573 }, face: 'pro', qualityProfile: 'high',
    rights: { ...rightsResultsOnly }, source: 'fivbeach', externalId: 'VIS-ED-ROMA-2025', externalSystem: 'fivb-vis',
  },
  {
    id: 'ed-elite-gstaad-2026', seriesId: 'ser-elite-gstaad', name: 'Elite16 Gstaad 2026',
    registration: 'individual',
    startDate: '2026-07-07', endDate: '2026-07-12', location: 'Gstaad', nation: 'Svizzera',
    coordinates: { lat: 46.4757, lng: 7.2861 }, face: 'pro', qualityProfile: 'high',
    rights: { ...rightsResultsOnly }, source: 'fivbeach', externalId: 'VIS-ED-GSTAAD-2026', externalSystem: 'fivb-vis',
  },
  // FIPAV — storica (passata).
  {
    id: 'ed-finale-ita-2025', seriesId: 'ser-finale-ita', name: 'Finale Nazionale Roma 2025',
    registration: 'individual',
    startDate: '2025-09-05', endDate: '2025-09-07', location: 'Roma', nation: 'Italia',
    coordinates: { lat: 41.9028, lng: 12.4964 }, face: 'pro', qualityProfile: 'high',
    rights: { ...rightsFree }, source: 'sandr', externalId: null,
  },
  // FIPAV — IN CORSO OGGI (2026-10-02): partite live + speaker.
  {
    id: 'ed-napoli-2026', seriesId: 'ser-challenge-napoli', name: 'Challenge Napoli 2026',
    registration: 'individual',
    startDate: '2026-10-01', endDate: '2026-10-04', location: 'Napoli — Lungomare Caracciolo', nation: 'Italia',
    coordinates: { lat: 40.8296, lng: 14.2322 }, face: 'pro', qualityProfile: 'high',
    rights: { ...rightsPremium }, source: 'sandr', externalId: null,
  },
  // FIPAV — PROSSIMI GIORNI (palinsesto).
  {
    id: 'ed-genova-2026', seriesId: 'ser-genova', name: 'Tappa di Genova 2026',
    registration: 'individual',
    startDate: '2026-10-10', endDate: '2026-10-12', location: 'Genova — Corso Italia', nation: 'Italia',
    coordinates: { lat: 44.3889, lng: 8.9739 }, face: 'pro', qualityProfile: 'medium',
    rights: { ...rightsPremium }, source: 'sandr', externalId: null,
  },
  // AIBVC — storica (passata).
  {
    id: 'ed-bibione-2025', seriesId: 'ser-bibione', name: 'Bibione 2025',
    registration: 'individual',
    startDate: '2025-07-18', endDate: '2025-07-20', location: 'Bibione (VE)', nation: 'Italia',
    coordinates: { lat: 45.6366, lng: 13.0486 }, face: 'open', qualityProfile: 'medium',
    rights: { ...rightsFree }, source: 'sandr', externalId: null,
  },
  // AIBVC — VOLTO OPEN (torneo di club): audio campo, senza speaker.
  {
    id: 'ed-roma-open-2026', seriesId: 'ser-roma-open', name: 'Roma Club Open 2026',
    registration: 'club',
    startDate: '2026-10-18', endDate: '2026-10-19', location: 'Roma — Beach Village', nation: 'Italia',
    coordinates: { lat: 41.8592, lng: 12.4686 }, face: 'open', qualityProfile: 'low',
    rights: { ...rightsFree }, source: 'organizzatore', externalId: 'ORG-ROMAOPEN-26', externalSystem: 'organizer-portal',
  },
  // AIBVC Winter Tour — futura (2027).
  {
    id: 'ed-winter-milano-2027', seriesId: 'ser-winter-milano', name: 'Winter Tour Milano 2027',
    registration: 'individual',
    startDate: '2027-01-16', endDate: '2027-01-18', location: 'Milano — Palasport', nation: 'Italia',
    coordinates: { lat: 45.4642, lng: 9.19 }, face: 'pro', qualityProfile: 'medium',
    rights: { ...rightsPremium }, source: 'sandr', externalId: null,
  },
  // OPEN dentro circuito PRO (Campionato Italiano) — AMATORI a squadre, IN CORSO OGGI.
  {
    id: 'ed-ita-amatori-2026', seriesId: 'ser-ita-amatori', name: 'Campionato Amatori Roma 2026',
    registration: 'club',
    startDate: '2026-10-01', endDate: '2026-10-04', location: 'Roma — Beach Stadium', nation: 'Italia',
    coordinates: { lat: 41.9028, lng: 12.4964 }, face: 'open', qualityProfile: 'low',
    rights: { ...rightsFree }, source: 'sandr', externalId: null,
  },
  // Circuito amatoriale dedicato — futura, iscrizione per club.
  {
    id: 'ed-amatori-roma-2026', seriesId: 'ser-amatori-roma', name: 'Amatori Roma 2026',
    registration: 'club',
    startDate: '2026-10-24', endDate: '2026-10-26', location: 'Roma — Beach Village', nation: 'Italia',
    coordinates: { lat: 41.8592, lng: 12.4686 }, face: 'open', qualityProfile: 'low',
    rights: { ...rightsFree }, source: 'sandr', externalId: null,
  },
];

// ----- Campi di gioco ------------------------------------------------
const courts: Court[] = [
  { id: 'court-roma-central', editionId: 'ed-elite-roma-2025', name: 'Campo Centrale' },
  { id: 'court-gstaad-central', editionId: 'ed-elite-gstaad-2026', name: 'Campo Centrale' },
  { id: 'court-finale-central', editionId: 'ed-finale-ita-2025', name: 'Campo Centrale' },
  { id: 'court-napoli-central', editionId: 'ed-napoli-2026', name: 'Campo Centrale' },
  { id: 'court-napoli-1', editionId: 'ed-napoli-2026', name: 'Campo 1' },
  { id: 'court-genova-central', editionId: 'ed-genova-2026', name: 'Campo Centrale' },
  { id: 'court-bibione-central', editionId: 'ed-bibione-2025', name: 'Campo Centrale' },
  { id: 'court-romaopen-1', editionId: 'ed-roma-open-2026', name: 'Campo 1' },
  { id: 'court-winter-central', editionId: 'ed-winter-milano-2027', name: 'Campo Centrale' },
  { id: 'court-itaamatori-1', editionId: 'ed-ita-amatori-2026', name: 'Campo 1' },
  { id: 'court-itaamatori-2', editionId: 'ed-ita-amatori-2026', name: 'Campo 2' },
  { id: 'court-amatoriroma-1', editionId: 'ed-amatori-roma-2026', name: 'Campo 1' },
];

// ----- Club (tesseramento atleti, iscrizioni a squadre) --------------
const clubs: Club[] = [
  { id: 'club-roma', name: 'Beach Volley Roma', city: 'Roma', nation: 'Italia' },
  { id: 'club-lignano', name: 'Lignano Beach Team', city: 'Lignano', nation: 'Italia' },
  { id: 'club-napoli', name: 'Napoli Sand Club', city: 'Napoli', nation: 'Italia' },
  { id: 'club-oslo', name: 'Strandklubb Oslo', city: 'Oslo', nation: 'Norvegia' },
  { id: 'club-milano', name: 'Milano Beach Arena', city: 'Milano', nation: 'Italia' },
];

// ----- Atleti --------------------------------------------------------
const athletes: Athlete[] = [
  { id: 'ath-lupo', fullName: 'Daniele Lupo', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 18, clubId: 'club-roma', source: 'sandr', externalId: null },
  { id: 'ath-nicolai', fullName: 'Paolo Nicolai', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 15, clubId: 'club-roma', source: 'sandr', externalId: null },
  { id: 'ath-carambula', fullName: 'Enrico Rossi Carambula', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 24, clubId: 'club-lignano', source: 'sandr', externalId: null },
  { id: 'ath-cottafava', fullName: 'Samuele Cottafava', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 12, clubId: 'club-napoli', source: 'sandr', externalId: null },
  { id: 'ath-ranghieri', fullName: 'Marco Ranghieri', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 31, clubId: 'club-lignano', source: 'sandr', externalId: null },
  { id: 'ath-caminati', fullName: 'Alex Caminati', nation: 'Italia', nationCode: 'ITA', photoUrl: null, ranking: 29, clubId: 'club-napoli', source: 'sandr', externalId: null },
  { id: 'ath-mol', fullName: 'Anders Mol', nation: 'Norvegia', nationCode: 'NOR', photoUrl: null, ranking: 1, clubId: 'club-oslo', source: 'fivbeach', externalId: 'VIS-ATH-MOL', externalSystem: 'fivb-vis' },
  { id: 'ath-sorum', fullName: 'Christian Sørum', nation: 'Norvegia', nationCode: 'NOR', photoUrl: null, ranking: 1, clubId: 'club-oslo', source: 'fivbeach', externalId: 'VIS-ATH-SORUM', externalSystem: 'fivb-vis' },
];

// ----- Coppie (temporali: validFrom/validTo) -------------------------
const pairs: Pair[] = [
  { id: 'pair-mol-sorum', athlete1Id: 'ath-mol', athlete2Id: 'ath-sorum', name: 'Mol / Sørum', validFrom: '2018-01-01', validTo: null, source: 'fivbeach', externalId: 'VIS-TEAM-MOLSORUM', externalSystem: 'fivb-vis' },
  { id: 'pair-lupo-cottafava', athlete1Id: 'ath-lupo', athlete2Id: 'ath-cottafava', name: 'Lupo / Cottafava', validFrom: '2024-01-01', validTo: null, source: 'sandr', externalId: null },
  // Coppia storica sciolta: dimostra il modello temporale (validTo valorizzato).
  { id: 'pair-lupo-nicolai', athlete1Id: 'ath-lupo', athlete2Id: 'ath-nicolai', name: 'Lupo / Nicolai', validFrom: '2015-01-01', validTo: '2021-09-01', source: 'sandr', externalId: null },
  { id: 'pair-carambula-nicolai', athlete1Id: 'ath-carambula', athlete2Id: 'ath-nicolai', name: 'Carambula / Nicolai', validFrom: '2023-01-01', validTo: null, source: 'sandr', externalId: null },
  { id: 'pair-ranghieri-caminati', athlete1Id: 'ath-ranghieri', athlete2Id: 'ath-caminati', name: 'Ranghieri / Caminati', validFrom: '2022-01-01', validTo: null, source: 'sandr', externalId: null },
];

// ----- Partite -------------------------------------------------------
const matches: Match[] = [
  // BPT 2025 — risultato (results only): nessuna diretta/video associati.
  {
    id: 'match-roma-final', editionId: 'ed-elite-roma-2025', courtId: 'court-roma-central',
    pairAId: 'pair-mol-sorum', pairBId: 'pair-lupo-cottafava', status: 'completed',
    scheduledAt: '2025-06-15T18:00:00Z', startedAt: '2025-06-15T18:03:00Z', endedAt: '2025-06-15T18:52:00Z',
    sets: [{ a: 21, b: 18 }, { a: 19, b: 21 }, { a: 15, b: 12 }],
    source: 'fivbeach', externalId: 'VIS-MATCH-ROMA-F', externalSystem: 'fivb-vis',
  },
  // BPT 2026 — risultato.
  {
    id: 'match-gstaad-final', editionId: 'ed-elite-gstaad-2026', courtId: 'court-gstaad-central',
    pairAId: 'pair-mol-sorum', pairBId: 'pair-lupo-cottafava', status: 'completed',
    scheduledAt: '2026-07-12T15:00:00Z', startedAt: '2026-07-12T15:02:00Z', endedAt: '2026-07-12T15:49:00Z',
    sets: [{ a: 21, b: 17 }, { a: 21, b: 19 }],
    source: 'fivbeach', externalId: 'VIS-MATCH-GSTAAD-F', externalSystem: 'fivb-vis',
  },
  // Napoli 2026 — IN CORSO OGGI.
  {
    id: 'match-napoli-qf', editionId: 'ed-napoli-2026', courtId: 'court-napoli-central',
    pairAId: 'pair-lupo-cottafava', pairBId: 'pair-carambula-nicolai', status: 'completed',
    scheduledAt: '2026-10-02T09:00:00Z', startedAt: '2026-10-02T09:01:00Z', endedAt: '2026-10-02T09:44:00Z',
    sets: [{ a: 21, b: 14 }, { a: 21, b: 18 }],
    source: 'sandr', externalId: null,
  },
  {
    id: 'match-napoli-sf1', editionId: 'ed-napoli-2026', courtId: 'court-napoli-central',
    pairAId: 'pair-lupo-cottafava', pairBId: 'pair-ranghieri-caminati', status: 'live',
    scheduledAt: '2026-10-02T13:00:00Z', startedAt: '2026-10-02T13:04:00Z', endedAt: null,
    sets: [{ a: 21, b: 19 }, { a: 11, b: 14 }],
    source: 'sandr', externalId: null,
  },
  {
    id: 'match-napoli-sf2', editionId: 'ed-napoli-2026', courtId: 'court-napoli-1', status: 'scheduled',
    pairAId: 'pair-mol-sorum', pairBId: 'pair-carambula-nicolai',
    scheduledAt: '2026-10-02T15:30:00Z', startedAt: null, endedAt: null, sets: [],
    source: 'sandr', externalId: null,
  },
  // Genova 2026 — palinsesto (prossimi giorni).
  {
    id: 'match-genova-r1', editionId: 'ed-genova-2026', courtId: 'court-genova-central', status: 'scheduled',
    pairAId: 'pair-lupo-cottafava', pairBId: 'pair-ranghieri-caminati',
    scheduledAt: '2026-10-10T10:00:00Z', startedAt: null, endedAt: null, sets: [],
    source: 'sandr', externalId: null,
  },
  // Roma Club Open 2026 — volto open (audio campo, nessuno speaker).
  {
    id: 'match-romaopen-1', editionId: 'ed-roma-open-2026', courtId: 'court-romaopen-1', status: 'scheduled',
    pairAId: 'pair-ranghieri-caminati', pairBId: 'pair-carambula-nicolai',
    scheduledAt: '2026-10-18T09:30:00Z', startedAt: null, endedAt: null, sets: [],
    source: 'organizzatore', externalId: 'ORG-ROMAOPEN-M1', externalSystem: 'organizer-portal',
  },
  // Winter Tour Milano 2027 — futura.
  {
    id: 'match-winter-1', editionId: 'ed-winter-milano-2027', courtId: 'court-winter-central', status: 'scheduled',
    pairAId: 'pair-lupo-cottafava', pairBId: 'pair-mol-sorum',
    scheduledAt: '2027-01-16T17:00:00Z', startedAt: null, endedAt: null, sets: [],
    source: 'sandr', externalId: null,
  },
  // Napoli — finale in programma (completa il tabellone dell'edizione in corso).
  {
    id: 'match-napoli-final', editionId: 'ed-napoli-2026', courtId: 'court-napoli-central', status: 'scheduled',
    pairAId: 'pair-mol-sorum', pairBId: 'pair-lupo-cottafava',
    scheduledAt: '2026-10-02T18:00:00Z', startedAt: null, endedAt: null, sets: [],
    source: 'sandr', externalId: null,
  },
  // Campionato Amatori Roma 2026 — IN CORSO OGGI (volto open, a squadre).
  {
    id: 'match-itaamatori-r1', editionId: 'ed-ita-amatori-2026', courtId: 'court-itaamatori-1', status: 'completed',
    pairAId: 'pair-ranghieri-caminati', pairBId: 'pair-carambula-nicolai',
    scheduledAt: '2026-10-02T10:00:00Z', startedAt: '2026-10-02T10:02:00Z', endedAt: '2026-10-02T10:41:00Z',
    sets: [{ a: 21, b: 16 }, { a: 21, b: 19 }],
    source: 'sandr', externalId: null,
  },
  {
    id: 'match-itaamatori-sf', editionId: 'ed-ita-amatori-2026', courtId: 'court-itaamatori-1', status: 'live',
    pairAId: 'pair-lupo-cottafava', pairBId: 'pair-ranghieri-caminati',
    scheduledAt: '2026-10-02T14:00:00Z', startedAt: '2026-10-02T14:03:00Z', endedAt: null,
    sets: [{ a: 18, b: 21 }, { a: 12, b: 9 }],
    source: 'sandr', externalId: null,
  },
  {
    id: 'match-itaamatori-final', editionId: 'ed-ita-amatori-2026', courtId: 'court-itaamatori-2', status: 'scheduled',
    pairAId: 'pair-carambula-nicolai', pairBId: 'pair-mol-sorum',
    scheduledAt: '2026-10-02T17:30:00Z', startedAt: null, endedAt: null, sets: [],
    source: 'sandr', externalId: null,
  },
  // Amatori Roma 2026 — futura.
  {
    id: 'match-amatoriroma-1', editionId: 'ed-amatori-roma-2026', courtId: 'court-amatoriroma-1', status: 'scheduled',
    pairAId: 'pair-ranghieri-caminati', pairBId: 'pair-lupo-cottafava',
    scheduledAt: '2026-10-24T10:00:00Z', startedAt: null, endedAt: null, sets: [],
    source: 'sandr', externalId: null,
  },
];

// ----- Postazioni (SICUREZZA: nessuna chiave, solo stato operativo) --
const stations: Station[] = [
  { id: 'stn-phone-01', label: 'iPhone Campo Centrale Napoli', type: 'phone_app', status: 'in onda' },
  { id: 'stn-rtmp-01', label: 'Regia esterna Napoli', type: 'external_rtmp_srt', status: 'online' },
  { id: 'stn-phone-02', label: 'iPhone Campo 1 Napoli', type: 'phone_app', status: 'in riconnessione' },
  { id: 'stn-rtmp-02', label: 'Regia esterna Genova', type: 'external_rtmp_srt', status: 'offline' },
];

// ----- Assegnazioni (postazione → campo, per finestra oraria) --------
const assignments: Assignment[] = [
  { id: 'asg-napoli-central', stationId: 'stn-phone-01', courtId: 'court-napoli-central', startsAt: '2026-10-02T08:30:00Z', endsAt: '2026-10-02T19:00:00Z' },
  { id: 'asg-napoli-1', stationId: 'stn-phone-02', courtId: 'court-napoli-1', startsAt: '2026-10-02T12:00:00Z', endsAt: '2026-10-02T19:00:00Z' },
  { id: 'asg-genova-central', stationId: 'stn-rtmp-02', courtId: 'court-genova-central', startsAt: '2026-10-10T09:00:00Z', endsAt: '2026-10-10T20:00:00Z' },
];

// ----- Speaker -------------------------------------------------------
const speakers: Speaker[] = [
  { id: 'spk-01', name: 'Marco Fabbri', location: 'onsite' },
  { id: 'spk-02', name: 'Giulia Bianchi', location: 'remote' },
  { id: 'spk-03', name: 'Luca Verdi', location: 'onsite' },
];

// Assegnazione speaker→partita (max 2 per partita). Il volto "open" (Roma Club
// Open) NON ha speaker: audio solo di campo.
const matchSpeakers: MatchSpeaker[] = [
  { matchId: 'match-napoli-sf1', speakerId: 'spk-01' },
  { matchId: 'match-napoli-sf1', speakerId: 'spk-02' },
  { matchId: 'match-napoli-sf2', speakerId: 'spk-03' },
  { matchId: 'match-genova-r1', speakerId: 'spk-01' },
];

// ----- Dirette (LiveStream) ------------------------------------------
// NESSUNA diretta per le edizioni FIVB/BPT (results only). Roma Club Open ha
// audio di campo senza commento.
const liveStreams: LiveStream[] = [
  {
    id: 'ls-napoli-sf1', matchId: 'match-napoli-sf1', courtId: 'court-napoli-central',
    hlsUrl: 'https://delivery.example/hls/napoli-central/index.m3u8', status: 'in onda',
    audio: 'commento', estimatedLatencySeconds: 8, hasCommentary: true,
  },
  {
    id: 'ls-napoli-sf2', matchId: 'match-napoli-sf2', courtId: 'court-napoli-1',
    hlsUrl: 'https://delivery.example/hls/napoli-1/index.m3u8', status: 'programmata',
    audio: 'commento', estimatedLatencySeconds: 10, hasCommentary: true,
  },
  {
    id: 'ls-genova-r1', matchId: 'match-genova-r1', courtId: 'court-genova-central',
    hlsUrl: 'https://delivery.example/hls/genova-central/index.m3u8', status: 'programmata',
    audio: 'commento', estimatedLatencySeconds: 12, hasCommentary: true,
  },
  {
    id: 'ls-romaopen-1', matchId: 'match-romaopen-1', courtId: 'court-romaopen-1',
    hlsUrl: 'https://delivery.example/hls/romaopen-1/index.m3u8', status: 'programmata',
    audio: 'campo', estimatedLatencySeconds: 6, hasCommentary: false,
  },
  {
    id: 'ls-winter-1', matchId: 'match-winter-1', courtId: 'court-winter-central',
    hlsUrl: 'https://delivery.example/hls/winter-central/index.m3u8', status: 'programmata',
    audio: 'commento', estimatedLatencySeconds: 9, hasCommentary: true,
  },
  // Amatori (volto open): audio di campo, nessuno speaker.
  {
    id: 'ls-itaamatori-sf', matchId: 'match-itaamatori-sf', courtId: 'court-itaamatori-1',
    hlsUrl: 'https://delivery.example/hls/itaamatori-1/index.m3u8', status: 'in onda',
    audio: 'campo', estimatedLatencySeconds: 7, hasCommentary: false,
  },
];

// Dataset completo (usato solo da src/lib/data, mai dalle pagine).
export const mockHierarchy: HierarchyData = {
  federations,
  circuits,
  series,
  editions,
  courts,
  clubs,
  athletes,
  pairs,
  matches,
  stations,
  assignments,
  speakers,
  matchSpeakers,
  liveStreams,
};
