-- =====================================================================
-- SANDR — Schema completo (PostgreSQL / Supabase)
-- Ecosistema sportivo: utenti/ruoli, broadcaster + referral, federazioni,
-- atleti, eventi, video (Cloudflare Stream), match + scorekeeping live,
-- abbonamenti/PPV (Stripe), fantasy, watch history.
--
-- AREA CRITICA (CLAUDE.md): Auth, ruoli, accesso ai contenuti free/premium/ppv
-- e revenue share richiedono review umana obbligatoria prima della produzione.
--
-- Note:
-- - RLS abilitata su TUTTE le tabelle.
-- - Le scritture "di sistema" (webhook Stripe, scorekeeper via token) passano
--   dal service role, che bypassa la RLS: vedi commenti nelle policy.
-- =====================================================================

create extension if not exists pgcrypto;

-- =====================================================================
-- ENUM
-- =====================================================================
create type user_role as enum ('viewer', 'broadcaster', 'admin', 'organizer');
create type content_type as enum ('live', 'replay', 'interview', 'highlights', 'behind_scenes', 'documentary');
create type access_level as enum ('free', 'premium', 'ppv');
create type video_status as enum ('processing', 'ready', 'draft', 'archived');
create type subscription_plan as enum ('free', 'premium');
create type subscription_status as enum ('active', 'cancelled', 'expired', 'past_due');
create type match_status as enum ('scheduled', 'live', 'completed', 'cancelled');
create type score_event_type as enum ('point', 'ace', 'error', 'block', 'timeout', 'set_end', 'match_end');

-- =====================================================================
-- Funzione trigger: auto-aggiornamento updated_at
-- =====================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- TABELLE
-- L'ordine gestisce le dipendenze. profiles <-> broadcasters sono circolari:
-- la FK profiles.referred_by viene aggiunta dopo la creazione di broadcasters.
-- =====================================================================

-- ----- profiles (estende auth.users) --------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role user_role not null default 'viewer',
  preferred_language text not null default 'it',
  referred_by uuid,                 -- FK -> broadcasters (aggiunta sotto)
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----- sports --------------------------------------------------------
create table public.sports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon_url text,
  sort_order int not null default 0
);

-- ----- federations ---------------------------------------------------
create table public.federations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  slug text not null unique,
  sport_id uuid references public.sports (id) on delete set null,
  nation text,
  color text,
  logo_url text,
  description text,
  created_at timestamptz not null default now()
);

-- ----- broadcasters --------------------------------------------------
-- Un broadcaster può essere indipendente, una federazione o un organizzatore.
-- Può (opzionalmente) essere collegato a un account utente (profile_id).
create table public.broadcasters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,        -- per sandr.tv/ref/SLUG
  profile_id uuid references public.profiles (id) on delete set null,
  type text not null default 'independent'
    check (type in ('independent', 'federation', 'organizer')),
  logo_url text,
  description text,
  bio text,
  referral_enabled boolean not null default false,
  referral_code text unique,
  referral_percentage numeric not null default 0,
  referral_duration_months int not null default 12,
  content_revenue_share numeric not null default 0,
  ppv_revenue_share numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FK circolare: profiles.referred_by -> broadcasters.id
alter table public.profiles
  add constraint profiles_referred_by_fkey
  foreign key (referred_by) references public.broadcasters (id) on delete set null;

-- ----- broadcaster_federations (M:N) --------------------------------
create table public.broadcaster_federations (
  broadcaster_id uuid not null references public.broadcasters (id) on delete cascade,
  federation_id uuid not null references public.federations (id) on delete cascade,
  primary key (broadcaster_id, federation_id)
);

-- ----- athletes ------------------------------------------------------
create table public.athletes (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  nation text,
  nation_code text,                 -- codice testuale (no emoji, CLAUDE.md)
  photo_url text,
  sport_id uuid references public.sports (id) on delete set null,
  federation_id uuid references public.federations (id) on delete set null,
  profile_id uuid references public.profiles (id) on delete set null,
  bio text,
  ranking int,
  season_points int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----- events --------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  federation_id uuid references public.federations (id) on delete set null,
  sport_id uuid references public.sports (id) on delete set null,
  organizer_broadcaster_id uuid references public.broadcasters (id) on delete set null,
  location text,
  nation text,
  start_date date,
  end_date date,
  stage text,
  created_at timestamptz not null default now()
);

-- ----- videos --------------------------------------------------------
-- cloudflare_uid: id del video su Cloudflare Stream (AREA CRITICA).
-- Le thumbnail custom sono su Supabase Storage.
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  cloudflare_uid text unique,
  title text not null,
  description text,
  type content_type,
  sport_id uuid references public.sports (id) on delete set null,
  federation_id uuid references public.federations (id) on delete set null,
  event_id uuid references public.events (id) on delete set null,
  thumbnail_card_url text,
  thumbnail_featured_url text,
  duration_seconds int,
  access_level access_level not null default 'free',
  ppv_price numeric,
  is_featured boolean not null default false,
  is_live boolean not null default false,
  live_started_at timestamptz,
  published_at timestamptz,
  status video_status not null default 'draft',
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----- video_broadcasters (M:N — un video può avere più broadcaster) -
create table public.video_broadcasters (
  video_id uuid not null references public.videos (id) on delete cascade,
  broadcaster_id uuid not null references public.broadcasters (id) on delete cascade,
  is_primary boolean not null default false,
  primary key (video_id, broadcaster_id)
);

-- ----- video_athletes (M:N) -----------------------------------------
create table public.video_athletes (
  video_id uuid not null references public.videos (id) on delete cascade,
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  primary key (video_id, athlete_id)
);

-- ----- video_tags (tagging flessibile) ------------------------------
create table public.video_tags (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos (id) on delete cascade,
  tag text not null
);

-- ----- matches (scorekeeping live nell'evento) ----------------------
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events (id) on delete set null,
  video_id uuid references public.videos (id) on delete set null,
  team_a_name text,
  team_b_name text,
  score_a int not null default 0,
  score_b int not null default 0,
  sets_a int not null default 0,
  sets_b int not null default 0,
  status match_status not null default 'scheduled',
  scorekeeper_token uuid not null default gen_random_uuid() unique,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----- match_athletes (atleti del match, con squadra) ---------------
create table public.match_athletes (
  match_id uuid not null references public.matches (id) on delete cascade,
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  team char(1) not null check (team in ('A', 'B')),
  primary key (match_id, athlete_id)
);

-- ----- score_events (source of truth per stats + fantasy) -----------
create table public.score_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  team char(1) not null check (team in ('A', 'B')),
  athlete_id uuid references public.athletes (id) on delete set null,
  type score_event_type not null,
  set_number int,
  created_at timestamptz not null default now()
);

-- ----- subscriptions (Stripe) ---------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan subscription_plan not null,
  status subscription_status not null,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----- ppv_purchases (Stripe) ---------------------------------------
create table public.ppv_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  stripe_payment_id text,
  amount numeric,
  currency text not null default 'EUR',
  valid_until timestamptz,
  purchased_at timestamptz not null default now()
);

-- ----- referrals (attribuzione ricavi) ------------------------------
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  broadcaster_id uuid not null references public.broadcasters (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  commission_amount numeric not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- ----- reminders -----------------------------------------------------
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  video_id uuid references public.videos (id) on delete cascade,
  match_id uuid references public.matches (id) on delete cascade,
  remind_at timestamptz,
  sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----- watch_history -------------------------------------------------
create table public.watch_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  watched_seconds int not null default 0,
  completed boolean not null default false,
  last_watched_at timestamptz not null default now(),
  unique (user_id, video_id)
);

-- ----- platform_settings (formule configurabili, no deploy) ---------
create table public.platform_settings (
  key text primary key,
  value jsonb,
  description text,
  updated_at timestamptz not null default now()
);

-- ----- fantasy_teams -------------------------------------------------
create table public.fantasy_teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_id uuid references public.events (id) on delete cascade,
  name text,
  total_points int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----- fantasy_team_athletes (M:N) ----------------------------------
create table public.fantasy_team_athletes (
  fantasy_team_id uuid not null references public.fantasy_teams (id) on delete cascade,
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  primary key (fantasy_team_id, athlete_id)
);

-- =====================================================================
-- Helper per le policy (SECURITY DEFINER per evitare ricorsione su profiles)
-- =====================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

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
-- INDICI (foreign key + colonne filtrate di frequente)
-- =====================================================================
create index idx_profiles_referred_by on public.profiles (referred_by);

create index idx_federations_sport_id on public.federations (sport_id);

create index idx_broadcasters_profile_id on public.broadcasters (profile_id);

create index idx_broadcaster_federations_federation_id on public.broadcaster_federations (federation_id);

create index idx_athletes_sport_id on public.athletes (sport_id);
create index idx_athletes_federation_id on public.athletes (federation_id);
create index idx_athletes_profile_id on public.athletes (profile_id);

create index idx_events_federation_id on public.events (federation_id);
create index idx_events_sport_id on public.events (sport_id);
create index idx_events_organizer_broadcaster_id on public.events (organizer_broadcaster_id);

create index idx_videos_sport_id on public.videos (sport_id);
create index idx_videos_federation_id on public.videos (federation_id);
create index idx_videos_event_id on public.videos (event_id);
create index idx_videos_access_level on public.videos (access_level);
create index idx_videos_is_featured on public.videos (is_featured);
create index idx_videos_is_live on public.videos (is_live);
create index idx_videos_status on public.videos (status);

create index idx_video_broadcasters_broadcaster_id on public.video_broadcasters (broadcaster_id);
create index idx_video_athletes_athlete_id on public.video_athletes (athlete_id);
create index idx_video_tags_video_id on public.video_tags (video_id);
create index idx_video_tags_tag on public.video_tags (tag);

create index idx_matches_event_id on public.matches (event_id);
create index idx_matches_video_id on public.matches (video_id);
create index idx_matches_status on public.matches (status);

create index idx_match_athletes_athlete_id on public.match_athletes (athlete_id);

create index idx_score_events_match_id_created_at on public.score_events (match_id, created_at);
create index idx_score_events_athlete_id on public.score_events (athlete_id);

create index idx_subscriptions_user_id on public.subscriptions (user_id);
create index idx_subscriptions_status on public.subscriptions (status);

create index idx_ppv_purchases_user_id on public.ppv_purchases (user_id);
create index idx_ppv_purchases_video_id on public.ppv_purchases (video_id);

create index idx_referrals_user_id on public.referrals (user_id);
create index idx_referrals_broadcaster_id on public.referrals (broadcaster_id);
create index idx_referrals_subscription_id on public.referrals (subscription_id);

create index idx_reminders_user_id on public.reminders (user_id);
create index idx_reminders_video_id on public.reminders (video_id);
create index idx_reminders_match_id on public.reminders (match_id);

create index idx_watch_history_video_id on public.watch_history (video_id);

create index idx_fantasy_teams_user_id on public.fantasy_teams (user_id);
create index idx_fantasy_teams_event_id on public.fantasy_teams (event_id);

create index idx_fantasy_team_athletes_athlete_id on public.fantasy_team_athletes (athlete_id);

-- =====================================================================
-- ROW LEVEL SECURITY — abilitazione su tutte le tabelle
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.sports enable row level security;
alter table public.federations enable row level security;
alter table public.broadcasters enable row level security;
alter table public.broadcaster_federations enable row level security;
alter table public.athletes enable row level security;
alter table public.events enable row level security;
alter table public.videos enable row level security;
alter table public.video_broadcasters enable row level security;
alter table public.video_athletes enable row level security;
alter table public.video_tags enable row level security;
alter table public.matches enable row level security;
alter table public.match_athletes enable row level security;
alter table public.score_events enable row level security;
alter table public.subscriptions enable row level security;
alter table public.ppv_purchases enable row level security;
alter table public.referrals enable row level security;
alter table public.reminders enable row level security;
alter table public.watch_history enable row level security;
alter table public.platform_settings enable row level security;
alter table public.fantasy_teams enable row level security;
alter table public.fantasy_team_athletes enable row level security;

-- =====================================================================
-- POLICY
-- =====================================================================

-- ----- profiles ------------------------------------------------------
-- Ogni utente legge/aggiorna solo la propria riga; gli admin leggono tutto.
-- L'insert avviene via handle_new_user() (security definer, bypassa la RLS).
create policy "profiles: self read" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: admin read all" on public.profiles
  for select using (public.is_admin());
create policy "profiles: self update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: admin manage" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ----- anagrafiche pubbliche: lettura pubblica, scrittura admin ------
-- sports
create policy "sports: public read" on public.sports for select using (true);
create policy "sports: admin write" on public.sports
  for all using (public.is_admin()) with check (public.is_admin());
-- federations
create policy "federations: public read" on public.federations for select using (true);
create policy "federations: admin write" on public.federations
  for all using (public.is_admin()) with check (public.is_admin());
-- broadcasters
create policy "broadcasters: public read" on public.broadcasters for select using (true);
create policy "broadcasters: admin write" on public.broadcasters
  for all using (public.is_admin()) with check (public.is_admin());
-- broadcaster_federations
create policy "broadcaster_federations: public read" on public.broadcaster_federations for select using (true);
create policy "broadcaster_federations: admin write" on public.broadcaster_federations
  for all using (public.is_admin()) with check (public.is_admin());
-- athletes
create policy "athletes: public read" on public.athletes for select using (true);
create policy "athletes: admin write" on public.athletes
  for all using (public.is_admin()) with check (public.is_admin());
-- events
create policy "events: public read" on public.events for select using (true);
create policy "events: admin write" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

-- ----- videos --------------------------------------------------------
-- free+ready: pubblici. premium: abbonati premium attivi. ppv: chi ha un
-- acquisto valido. admin: tutto. broadcaster: gestisce i propri video
-- (collegati via video_broadcasters).
create policy "videos: public free read" on public.videos
  for select using (access_level = 'free' and status = 'ready');

create policy "videos: premium subscribers read" on public.videos
  for select using (
    status = 'ready'
    and access_level = 'premium'
    and exists (
      select 1 from public.subscriptions s
      where s.user_id = auth.uid()
        and s.plan = 'premium'
        and s.status = 'active'
        and (s.current_period_end is null or s.current_period_end > now())
    )
  );

create policy "videos: ppv buyers read" on public.videos
  for select using (
    status = 'ready'
    and access_level = 'ppv'
    and exists (
      select 1 from public.ppv_purchases p
      where p.user_id = auth.uid()
        and p.video_id = videos.id
        and (p.valid_until is null or p.valid_until > now())
    )
  );

create policy "videos: admin manage" on public.videos
  for all using (public.is_admin()) with check (public.is_admin());

create policy "videos: broadcaster manage own" on public.videos
  for all using (
    exists (
      select 1 from public.video_broadcasters vb
      join public.broadcasters b on b.id = vb.broadcaster_id
      where vb.video_id = videos.id and b.profile_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.video_broadcasters vb
      join public.broadcasters b on b.id = vb.broadcaster_id
      where vb.video_id = videos.id and b.profile_id = auth.uid()
    )
  );

-- ----- join table video_*: lettura pubblica, scrittura admin ---------
create policy "video_broadcasters: public read" on public.video_broadcasters for select using (true);
create policy "video_broadcasters: admin write" on public.video_broadcasters
  for all using (public.is_admin()) with check (public.is_admin());
create policy "video_athletes: public read" on public.video_athletes for select using (true);
create policy "video_athletes: admin write" on public.video_athletes
  for all using (public.is_admin()) with check (public.is_admin());
create policy "video_tags: public read" on public.video_tags for select using (true);
create policy "video_tags: admin write" on public.video_tags
  for all using (public.is_admin()) with check (public.is_admin());

-- ----- matches / score_events ---------------------------------------
-- Lettura pubblica. Le scritture dello scorekeeper avvengono via token
-- (sandr.tv/score/{token}) gestite a livello applicativo dal service role,
-- che bypassa la RLS. Gli admin possono comunque gestire da pannello.
create policy "matches: public read" on public.matches for select using (true);
create policy "matches: admin manage" on public.matches
  for all using (public.is_admin()) with check (public.is_admin());

create policy "match_athletes: public read" on public.match_athletes for select using (true);
create policy "match_athletes: admin write" on public.match_athletes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "score_events: public read" on public.score_events for select using (true);
create policy "score_events: admin manage" on public.score_events
  for all using (public.is_admin()) with check (public.is_admin());

-- ----- dati personali utente: solo le proprie righe -----------------
-- subscriptions e ppv_purchases sono scritti dai webhook Stripe (service role).
create policy "subscriptions: self read" on public.subscriptions
  for select using (auth.uid() = user_id);
create policy "ppv_purchases: self read" on public.ppv_purchases
  for select using (auth.uid() = user_id);

create policy "watch_history: self manage" on public.watch_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reminders: self manage" on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "fantasy_teams: self manage" on public.fantasy_teams
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- fantasy_team_athletes: gestibili dal proprietario del fantasy_team.
create policy "fantasy_team_athletes: owner manage" on public.fantasy_team_athletes
  for all using (
    exists (
      select 1 from public.fantasy_teams ft
      where ft.id = fantasy_team_athletes.fantasy_team_id and ft.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.fantasy_teams ft
      where ft.id = fantasy_team_athletes.fantasy_team_id and ft.user_id = auth.uid()
    )
  );

-- referrals: il referente (broadcaster collegato) e l'utente leggono; scrittura
-- dal service role. Esponiamo la lettura all'utente referenziato e all'admin.
create policy "referrals: self read" on public.referrals
  for select using (auth.uid() = user_id);
create policy "referrals: admin manage" on public.referrals
  for all using (public.is_admin()) with check (public.is_admin());

-- platform_settings: solo admin (formule revenue/PPV).
create policy "platform_settings: admin only" on public.platform_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- TRIGGER updated_at (tabelle con colonna updated_at)
-- =====================================================================
create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.broadcasters
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.athletes
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.videos
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.matches
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.platform_settings
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.fantasy_teams
  for each row execute function public.handle_updated_at();

-- =====================================================================
-- Trigger: alla creazione di un auth.users crea il profilo collegato
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- SEED — platform_settings (formule configurabili senza deploy)
-- =====================================================================
insert into public.platform_settings (key, value, description) values
  ('revenue_formula',
   '{"watchTime": 70, "views": 20, "engagement": 10}'::jsonb,
   'Pesi (%) per il calcolo della revenue share sui contenuti.'),
  ('ppv_default_split',
   '{"sandr": 30, "broadcaster": 70}'::jsonb,
   'Ripartizione di default (%) dei ricavi PPV tra SANDR e broadcaster.');
