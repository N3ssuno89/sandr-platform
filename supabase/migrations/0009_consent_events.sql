-- =====================================================================
-- SANDR — Infrastruttura privacy/GDPR: consensi al signup + tabella eventi
-- (analytics, creata ora e popolata in seguito) + quality_level sui video.
-- AREA CRITICA (CLAUDE.md): Supabase Auth + privacy. Review umana + legale.
-- =====================================================================

-- ----- 1) Consensi sul profilo --------------------------------------
-- Privacy e Termini sono OBBLIGATORI (consenso bloccante al signup). Marketing,
-- profilazione e condivisione con terzi sono OPZIONALI (default false). Per ogni
-- consenso si registra anche il timestamp di raccolta (accountability GDPR).
alter table public.profiles
  add column if not exists consent_privacy boolean not null default false,
  add column if not exists consent_privacy_at timestamptz,
  add column if not exists consent_marketing boolean not null default false,
  add column if not exists consent_marketing_at timestamptz,
  add column if not exists consent_profiling boolean not null default false,
  add column if not exists consent_profiling_at timestamptz,
  add column if not exists consent_third_party boolean not null default false,
  add column if not exists consent_third_party_at timestamptz,
  add column if not exists terms_accepted boolean not null default false,
  add column if not exists terms_accepted_at timestamptz;

-- ----- 2) Tabella eventi (analytics) --------------------------------
-- NB: la tabella `events` esiste già (tornei/competizioni). Per evitare la
-- collisione di nome, la tabella analitica si chiama `analytics_events`.
-- Append-only: fondamenta per analytics / raccomandazioni / payout creator.
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references public.profiles (id) on delete set null,
  session_id text,
  type text not null,
    -- play, progress, complete, pause, impression, click, search, favorite, share
  video_id uuid references public.videos (id) on delete set null,
  athlete_id uuid references public.athletes (id) on delete set null,
  federation_id uuid references public.federations (id) on delete set null,
  payload jsonb not null default '{}'::jsonb
    -- flessibile: watched_seconds, completion_percent, source, device, query, position…
);

create index if not exists analytics_events_user_id_idx on public.analytics_events (user_id);
create index if not exists analytics_events_video_id_idx on public.analytics_events (video_id);
create index if not exists analytics_events_type_idx on public.analytics_events (type);
create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at);

alter table public.analytics_events enable row level security;

-- Un utente può inserire SOLO eventi propri (user_id = sé stesso o null/anonimo).
drop policy if exists "analytics_events insert own" on public.analytics_events;
create policy "analytics_events insert own"
  on public.analytics_events for insert
  to authenticated
  with check (user_id = auth.uid() or user_id is null);

-- Lettura SOLO agli admin (analytics).
drop policy if exists "analytics_events admin read" on public.analytics_events;
create policy "analytics_events admin read"
  on public.analytics_events for select
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ----- 3) quality_level sui video -----------------------------------
-- Livello qualità editoriale impostato dall'admin (low/medium/high).
alter table public.videos
  add column if not exists quality_level text not null default 'medium'
    check (quality_level in ('low', 'medium', 'high'));

-- ----- 4) Trigger creazione profilo: persiste i consensi ------------
-- I consensi arrivano da raw_user_meta_data (passati in signUp options.data).
-- Il timestamp è now() solo se il relativo consenso è true.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  c_privacy boolean := coalesce((new.raw_user_meta_data ->> 'consent_privacy')::boolean, false);
  c_marketing boolean := coalesce((new.raw_user_meta_data ->> 'consent_marketing')::boolean, false);
  c_profiling boolean := coalesce((new.raw_user_meta_data ->> 'consent_profiling')::boolean, false);
  c_third boolean := coalesce((new.raw_user_meta_data ->> 'consent_third_party')::boolean, false);
  c_terms boolean := coalesce((new.raw_user_meta_data ->> 'terms_accepted')::boolean, false);
begin
  insert into public.profiles (
    id, email, full_name, avatar_url,
    consent_privacy, consent_privacy_at,
    consent_marketing, consent_marketing_at,
    consent_profiling, consent_profiling_at,
    consent_third_party, consent_third_party_at,
    terms_accepted, terms_accepted_at
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    c_privacy, case when c_privacy then now() end,
    c_marketing, case when c_marketing then now() end,
    c_profiling, case when c_profiling then now() end,
    c_third, case when c_third then now() end,
    c_terms, case when c_terms then now() end
  );
  return new;
end;
$$;
