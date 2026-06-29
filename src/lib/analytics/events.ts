// Events table ready. Tracking activation pending privacy policy go-live.
//
// La tabella analitica è `public.analytics_events` (rinominata da `events` per
// non collidere con la tabella tornei `events` già esistente). È append-only e
// costituisce le fondamenta per analytics / raccomandazioni / payout creator.
// NESSUNA logica di tracciamento è attiva: questi sono solo i tipi di supporto,
// l'attivazione avverrà dopo il go-live della privacy policy e con i consensi.

// Tipi di evento previsti (colonna `type`).
export type AnalyticsEventType =
  | 'play'
  | 'progress'
  | 'complete'
  | 'pause'
  | 'impression'
  | 'click'
  | 'search'
  | 'favorite'
  | 'share';

// Forma di un evento da inserire (riferimento per l'implementazione futura).
export type AnalyticsEventInput = {
  type: AnalyticsEventType;
  sessionId?: string;
  videoId?: string;
  athleteId?: string;
  federationId?: string;
  // payload flessibile: watched_seconds, completion_percent, source, device, query, position…
  payload?: Record<string, unknown>;
};
