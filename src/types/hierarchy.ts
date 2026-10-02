// Modello gerarchico SANDR — OPZIONE B: solo tipi TypeScript + mock, nessuna
// tabella Supabase (le tabelle verranno create quando il backend sarà deciso).
// Le interfacce rispecchiano la gerarchia decisa e sono pensate per mappare 1:1
// su future tabelle:
//   Federazione → Circuito → Serie → Edizione → Campo
//   Edizione → Partita (Coppia vs Coppia) → Set/Punteggio
//   Atleta, Coppia (le coppie cambiano nel tempo)
//   Dirette: Postazione → Assegnazione (campo + finestra oraria), Speaker
//
// Convenzione: tutti gli id sono string (uuid in produzione, slug leggibili nei
// mock). Le relazioni usano riferimenti per id, come farebbe una FK.

// Origine del dato. Serve perché il calendario internazionale arriverà da
// fivbeach.com: ogni entità importabile porta con sé la provenienza e l'id
// esterno (es. id FIVB VIS), così l'import è idempotente.
export type DataSource = 'sandr' | 'fivbeach' | 'organizzatore';

export interface ExternalOrigin {
  source: DataSource;
  // Id nel sistema esterno (es. "VIS-123456"). null se l'entità nasce su SANDR.
  externalId: string | null;
  // Sistema esterno di provenienza (es. "fivb-vis"). Opzionale.
  externalSystem?: string | null;
}

// ----- Federazione (FIPAV, AIBVC, FIVB…) -----------------------------
export interface Federation extends ExternalOrigin {
  id: string;
  name: string; // nome esteso
  shortName: string; // sigla (es. "FIVB")
  nation: string | null; // null = internazionale
  sport: string; // es. "Beach Volley"
}

// ----- Circuito (tour o categoria di una federazione) ----------------
export interface Circuit extends ExternalOrigin {
  id: string;
  federationId: string;
  name: string; // es. "Beach Pro Tour"
  category: string | null; // es. "Elite16" | "Challenge" | "Futures"
}

// ----- Serie = evento ricorrente (es. "Tappa di Bibione") ------------
export interface Series extends ExternalOrigin {
  id: string;
  circuitId: string;
  name: string;
}

// Volto dell'edizione: "pro" (evento di alto livello) o "open" (amatoriale).
export type EditionFace = 'pro' | 'open';

// Profilo qualità video dell'edizione (bitrate/risoluzione target).
export type QualityProfile = 'low' | 'medium' | 'high';

export interface GeoPoint {
  lat: number;
  lng: number;
}

// Regole di diritti/visibilità a livello edizione. Il default d'accesso guida
// i contenuti dell'edizione (può essere sovrascritto sul singolo video);
// geoblock è una lista di codici nazione bloccati (null = nessun blocco).
// resultsOnly: edizione per cui abbiamo solo i risultati (nessuna diretta,
// nessun video) — es. tornei FIVB/Beach Pro Tour.
export interface EditionRights {
  defaultAccess: 'free' | 'premium' | 'ppv';
  visibility: 'public' | 'unlisted' | 'private';
  geoblock: string[] | null;
  resultsOnly: boolean;
}

// ----- Edizione = singola occorrenza di una serie --------------------
export interface Edition extends ExternalOrigin {
  id: string;
  // Serie di appartenenza. null per edizioni importate da fonti esterne non
  // ancora collegate a una serie (es. riga `events` reale senza serie).
  seriesId: string | null;
  name: string; // es. "Bibione 2025"
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate: string; // ISO date
  location: string; // città/località
  nation: string;
  coordinates: GeoPoint | null; // GPS del luogo
  face: EditionFace;
  qualityProfile: QualityProfile;
  rights: EditionRights;
}

// ----- Campo di gioco dell'edizione ----------------------------------
export interface Court {
  id: string;
  editionId: string;
  name: string; // es. "Campo Centrale"
}

// ----- Atleta --------------------------------------------------------
export interface Athlete extends ExternalOrigin {
  id: string;
  fullName: string;
  nation: string | null;
  nationCode: string | null; // codice testuale (no emoji, CLAUDE.md)
  photoUrl: string | null;
  ranking: number | null;
}

// ----- Coppia (le coppie cambiano nel tempo) -------------------------
// Entità temporale: due atleti con una finestra di validità. Una coppia
// sciolta ha validTo valorizzato; una attiva ha validTo = null.
export interface Pair extends ExternalOrigin {
  id: string;
  athlete1Id: string;
  athlete2Id: string;
  name: string; // es. "Lupo / Nicolai"
  validFrom: string; // ISO date
  validTo: string | null;
}

// ----- Partita = coppia vs coppia ------------------------------------
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface SetScore {
  a: number;
  b: number;
}

export interface Match extends ExternalOrigin {
  id: string;
  editionId: string;
  courtId: string;
  pairAId: string;
  pairBId: string;
  status: MatchStatus;
  scheduledAt: string; // orario previsto (ISO datetime)
  startedAt: string | null; // inizio effettivo
  endedAt: string | null; // fine effettiva
  sets: SetScore[]; // set giocati con punteggio
}

// ----- Postazione = telefono app o regia esterna ---------------------
// SICUREZZA (CLAUDE.md): nessuna chiave di trasmissione nel frontend. Le chiavi
// (RTMP/SRT) esistono SOLO nel backend delle dirette. Il frontend conosce solo
// identità, tipo, etichetta e stato operativo della postazione.
export type StationType = 'phone_app' | 'external_rtmp_srt';
export type StationStatus = 'online' | 'in onda' | 'in riconnessione' | 'offline';

export interface Station {
  id: string;
  label: string;
  type: StationType;
  status: StationStatus;
}

// ----- Assegnazione = postazione su un campo per una finestra oraria --
// È così che una diretta si ricollega a campo e partita: l'operatore sceglie
// il CAMPO (mai la partita), la partita si deduce dalla finestra oraria.
export interface Assignment {
  id: string;
  stationId: string;
  courtId: string;
  startsAt: string; // ISO datetime
  endsAt: string; // ISO datetime
}

// ----- Speaker = commentatore assegnato a una partita (max 2) --------
export type SpeakerLocation = 'onsite' | 'remote';

export interface Speaker {
  id: string;
  name: string;
  location: SpeakerLocation;
}

// Assegnazione speaker→partita. Vincolo applicativo: max 2 speaker per partita.
export interface MatchSpeaker {
  matchId: string;
  speakerId: string;
}

// ----- LiveStream = diretta di una partita/campo ---------------------
// Lato spettatore: cosa serve per riprodurre e descrivere una diretta. L'url
// HLS è di delivery (pubblico/firmato a monte), mai una chiave di ingest.
export type LiveStreamStatus = 'programmata' | 'in onda' | 'terminata';
// Traccia audio: "commento" (con speaker) o "campo" (solo suono ambientale).
export type LiveStreamAudio = 'commento' | 'campo';

export interface LiveStream {
  id: string;
  // Una diretta è legata a una partita; prima che la partita sia nota può
  // essere legata solo al campo (l'operatore sceglie il campo). Uno dei due.
  matchId: string | null;
  courtId: string | null;
  hlsUrl: string; // url di delivery HLS
  status: LiveStreamStatus;
  audio: LiveStreamAudio;
  estimatedLatencySeconds: number; // latenza stimata
  hasCommentary: boolean; // true se c'è commento (speaker)
}

// Raccolta tipizzata dell'intero dataset gerarchico (shape del mock).
export interface HierarchyData {
  federations: Federation[];
  circuits: Circuit[];
  series: Series[];
  editions: Edition[];
  courts: Court[];
  athletes: Athlete[];
  pairs: Pair[];
  matches: Match[];
  stations: Station[];
  assignments: Assignment[];
  speakers: Speaker[];
  matchSpeakers: MatchSpeaker[];
  liveStreams: LiveStream[];
}
