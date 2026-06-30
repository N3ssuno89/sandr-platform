-- =====================================================================
-- SANDR — Copertina hero MOBILE dedicata (stile Netflix: doppia cover)
-- thumbnail_featured_url  = hero DESKTOP (16:9)
-- thumbnail_mobile_url    = hero MOBILE (4:5, verticale)  ← NUOVO
-- Campo nullable: se assente, il frontend ricade sulla copertina desktop
-- ritagliata nel frame 4:5 (object-cover object-center).
-- =====================================================================

alter table videos
  add column if not exists thumbnail_mobile_url text;

comment on column videos.thumbnail_mobile_url is
  'Copertina hero per MOBILE (4:5, verticale). Nullable: fallback alla thumbnail_featured_url ritagliata.';
