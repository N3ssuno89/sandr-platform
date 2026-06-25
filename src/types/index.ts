// Tipi di dominio condivisi SANDR.

// Ruoli utente — applicati via Supabase RLS.
export type UserRole = 'viewer' | 'broadcaster' | 'admin';

// Tipi di accesso ai contenuti (vedi CLAUDE.md).
export type AccessType = 'free' | 'premium' | 'ppv';

// Stato di un match.
export type MatchStatus = 'scheduled' | 'live' | 'ended' | 'archived';

// Tier di abbonamento.
export type SubscriptionTier = 'free' | 'premium';

// Circuiti gestiti da SANDR.
export type Circuit =
  | 'BPT Futures'
  | 'BPT Challenge'
  | 'BPT Elite'
  | 'AIBVC Tour'
  | 'FIPAV'
  | 'Campionato Italiano'
  | 'Marathon'
  | 'King & Queen';
