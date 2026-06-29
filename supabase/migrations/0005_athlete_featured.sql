-- =====================================================================
-- SANDR — Atleti "in evidenza" (flag manuale, come per i video)
-- Aggiunge athletes.is_featured: gli atleti con is_featured = true vengono
-- mostrati nella riga "Atleti in evidenza" (home autenticata + landing).
-- =====================================================================

alter table athletes
  add column if not exists is_featured boolean not null default false;

-- Indice parziale: la query "atleti in evidenza" filtra solo i true.
create index if not exists athletes_is_featured_idx
  on athletes (is_featured)
  where is_featured = true;
