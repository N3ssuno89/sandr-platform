-- =====================================================================
-- SANDR — Schema iniziale
-- Tabelle principali + ruoli utente (viewer / broadcaster / admin) via RLS.
-- AREA CRITICA: Auth, ruoli e accesso ai contenuti richiedono review umana.
-- =====================================================================

-- ----- Enum ----------------------------------------------------------
create type user_role as enum ('viewer', 'broadcaster', 'admin');
create type access_type as enum ('free', 'premium', 'ppv');
create type match_status as enum ('scheduled', 'live', 'ended', 'archived');
create type subscription_tier as enum ('free', 'premium');

-- ----- profiles ------------------------------------------------------
-- Estende auth.users con ruolo e dati di abbonamento.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role user_role not null default 'viewer',
  subscription_tier subscription_tier not null default 'free',
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

-- ----- athletes ------------------------------------------------------
create table public.athletes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  fivb_ranking integer,
  current_partner text
);

-- ----- tournaments ---------------------------------------------------
create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  circuit text not null,
  category text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz
);

-- ----- matches -------------------------------------------------------
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public.tournaments (id) on delete set null,
  athlete1_id uuid references public.athletes (id) on delete set null,
  athlete2_id uuid references public.athletes (id) on delete set null,
  status match_status not null default 'scheduled',
  stream_key text,
  access_type access_type not null default 'free',
  scheduled_at timestamptz
);

-- ----- stats ---------------------------------------------------------
create table public.stats (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  aces integer not null default 0,
  blocks integer not null default 0,
  errors integer not null default 0,
  points integer not null default 0
);

-- ----- subscriptions -------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan subscription_tier not null,
  status text not null,
  expires_at timestamptz
);

-- =====================================================================
-- Helper: ruolo dell'utente corrente (usato nelle policy RLS)
-- =====================================================================
create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.athletes enable row level security;
alter table public.tournaments enable row level security;
alter table public.matches enable row level security;
alter table public.stats enable row level security;
alter table public.subscriptions enable row level security;

-- ----- profiles ------------------------------------------------------
-- Ogni utente legge/aggiorna il proprio profilo; gli admin leggono tutto.
create policy "profiles: self read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: self update" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles: admin read all" on public.profiles
  for select using (public.current_user_role() = 'admin');

-- ----- contenuti pubblici (metadati leggibili da utenti autenticati) -
-- viewer/broadcaster/admin possono leggere atleti, tornei e match.
create policy "athletes: authenticated read" on public.athletes
  for select using (auth.role() = 'authenticated');

create policy "tournaments: authenticated read" on public.tournaments
  for select using (auth.role() = 'authenticated');

create policy "matches: authenticated read" on public.matches
  for select using (auth.role() = 'authenticated');

create policy "stats: authenticated read" on public.stats
  for select using (auth.role() = 'authenticated');

-- ----- broadcaster: gestione match/stats -----------------------------
-- I broadcaster (e gli admin) possono creare/aggiornare match e statistiche.
create policy "matches: broadcaster write" on public.matches
  for all using (public.current_user_role() in ('broadcaster', 'admin'))
  with check (public.current_user_role() in ('broadcaster', 'admin'));

create policy "stats: broadcaster write" on public.stats
  for all using (public.current_user_role() in ('broadcaster', 'admin'))
  with check (public.current_user_role() in ('broadcaster', 'admin'));

-- ----- admin: gestione anagrafiche -----------------------------------
create policy "athletes: admin write" on public.athletes
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy "tournaments: admin write" on public.tournaments
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ----- subscriptions -------------------------------------------------
-- L'utente legge i propri abbonamenti; la scrittura passa dal service role
-- (webhook Stripe lato server), che bypassa la RLS.
create policy "subscriptions: self read" on public.subscriptions
  for select using (auth.uid() = user_id);
