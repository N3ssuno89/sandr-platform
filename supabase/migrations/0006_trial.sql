-- =====================================================================
-- SANDR — Prova gratuita 24h (predisposizione schema, NO logica pagamenti)
-- AREA CRITICA (CLAUDE.md): Stripe / abbonamenti → review umana obbligatoria.
--
-- Logica trial (da implementare con l'integrazione Stripe, ANCORA PENDENTE):
--   quando un utente avvia Premium, impostare is_trial = true e
--   trial_ends_at = now() + interval '24 hours'. Allo scadere del trial,
--   Stripe effettua l'addebito. L'integrazione pagamenti è rimandata.
-- =====================================================================

alter table subscriptions
  add column if not exists trial_ends_at timestamptz,
  add column if not exists is_trial boolean not null default false;

comment on column subscriptions.trial_ends_at is
  'Fine della prova gratuita 24h (UTC). Allo scadere, Stripe addebita. Integrazione pagamenti pendente.';
comment on column subscriptions.is_trial is
  'true mentre l''abbonamento è in prova gratuita 24h. Vedi trial_ends_at.';
