-- =====================================================================
-- SANDR — Seed dati di base (sport, federazioni, atleti)
-- Idempotente: rieseguibile in sicurezza.
-- - sports/federations: ON CONFLICT (slug) DO NOTHING (slug è unique).
-- - athletes: WHERE NOT EXISTS su full_name (nessun vincolo unique in 0001).
-- I sport_id / federation_id sono risolti via subquery sugli slug.
-- =====================================================================

-- ----- Sports --------------------------------------------------------
insert into public.sports (name, slug, sort_order) values
  ('Beach Volley', 'beach-volley', 1),
  ('Beach Tennis', 'beach-tennis', 2),
  ('Padel', 'padel', 3),
  ('Snow Volley', 'snow-volley', 4)
on conflict (slug) do nothing;

-- ----- Federations (tutte Beach Volley) ------------------------------
insert into public.federations (name, short_name, slug, sport_id, nation, color, description)
select
  v.name,
  v.short_name,
  v.slug,
  (select id from public.sports where slug = 'beach-volley'),
  v.nation,
  v.color,
  v.name
from (values
  ('Federazione Italiana Pallavolo',          'FIPAV', 'fipav',      'Italia',        '#0066CC'),
  ('AIBVC Italian Tour',                       'AIBVC', 'aibvc',      'Italia',        '#F04E00'),
  ('Association of Volleyball Professionals',  'AVP',   'avp',        'USA',           '#C8102E'),
  ('Beach Pro Tour FIVB',                      'BPT',   'bpt',        'International',  '#00A651'),
  ('Confédération Européenne de Volleyball',   'CEV',   'cev',        'Europe',        '#003087'),
  ('King & Queen of the Court',                'K&Q',   'king-queen', 'Italia',        '#F0A800'),
  ('Marathon Beach Volley Tour',               'MAR',   'marathon',   'Italia',        '#7B2D8B')
) as v(name, short_name, slug, nation, color)
on conflict (slug) do nothing;

-- ----- Athletes (Beach Volley + federazione via slug) ----------------
insert into public.athletes (full_name, nation, nation_code, sport_id, federation_id, ranking, season_points)
select
  v.full_name,
  v.nation,
  v.nation_code,
  (select id from public.sports where slug = 'beach-volley'),
  (select id from public.federations where slug = v.fed_slug),
  v.ranking,
  v.season_points
from (values
  ('Daniele Lupo',     'Italia',    'IT',  'fipav', 12, 3800),
  ('Paolo Nicolai',    'Italia',    'IT',  'fipav',  6, 4200),
  ('Adrian Carambula', 'Italia',    'IT',  'aibvc', 11, 3650),
  ('Enrico Rossi',     'Italia',    'IT',  'aibvc', 24, 2900),
  ('Taylor Crabb',     'USA',       'USA', 'avp',    4, 4500),
  ('Trevor Crabb',     'USA',       'USA', 'avp',    9, 3950),
  ('Anders Mol',       'Norvegia',  'NO',  'bpt',    1, 5600),
  ('Christian Sørum',  'Norvegia',  'NO',  'bpt',    2, 5400)
) as v(full_name, nation, nation_code, fed_slug, ranking, season_points)
where not exists (
  select 1 from public.athletes a where a.full_name = v.full_name
);
