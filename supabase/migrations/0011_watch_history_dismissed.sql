-- =====================================================================
-- SANDR — "Rimuovi da Continua a guardare": flag dismissed su watch_history.
-- La riga "Continua a guardare" filtra dismissed = false AND completed = false;
-- la cronologia completa (/dashboard/watch-history) mostra comunque tutto.
-- =====================================================================

alter table public.watch_history
  add column if not exists dismissed boolean not null default false;

comment on column public.watch_history.dismissed is
  'true se l''utente ha rimosso il video dalla riga "Continua a guardare". La cronologia completa lo mostra comunque.';
