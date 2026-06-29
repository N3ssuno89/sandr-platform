-- =====================================================================
-- SANDR — Data di nascita atleti (per calcolare l'età sul profilo pubblico)
-- Campo nullable: l'età viene mostrata solo se valorizzata.
-- =====================================================================

alter table athletes
  add column if not exists birth_date date;

comment on column athletes.birth_date is
  'Data di nascita dell''atleta (nullable). Usata per mostrare l''età sul profilo.';
