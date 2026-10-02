// Scelta della sorgente dati per entità — UNICO punto di configurazione.
// 'supabase' = legge da Supabase e adatta ai tipi gerarchia (con fallback a mock
//              se Supabase non è leggibile o non ha righe);
// 'mock'     = usa src/lib/mock-hierarchy.
//
// Oggi hanno una tabella Supabase reale solo: federazioni, atleti, eventi
// (→ edizioni, via adattatore). Il resto della gerarchia (circuiti, serie,
// campi, coppie, partite, postazioni, assegnazioni, speaker, dirette) NON ha
// ancora tabella: resta 'mock' finché il backend definitivo non sarà deciso.
//
// NOTA (interim Opzione B): quando le entità "supabase" hanno dati reali, i loro
// id non coincidono con quelli mock, quindi i join tra una parte reale e una
// mock non si allineano finché il modello non sarà unificato nel backend. In
// demo (Supabase non configurato) tutto ricade su mock ed è coerente.

export type EntityKey =
  | 'federations'
  | 'circuits'
  | 'series'
  | 'editions'
  | 'courts'
  | 'athletes'
  | 'pairs'
  | 'matches'
  | 'stations'
  | 'assignments'
  | 'speakers'
  | 'liveStreams';

export type DataSourceMode = 'supabase' | 'mock';

export const dataSourceConfig: Record<EntityKey, DataSourceMode> = {
  federations: 'supabase',
  athletes: 'supabase',
  editions: 'supabase',
  circuits: 'mock',
  series: 'mock',
  courts: 'mock',
  pairs: 'mock',
  matches: 'mock',
  stations: 'mock',
  assignments: 'mock',
  speakers: 'mock',
  liveStreams: 'mock',
};
