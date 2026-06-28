-- =====================================================================
-- SANDR — Helper RPC per modifiche enum + nota storage bucket
-- AREA CRITICA (CLAUDE.md): queste funzioni MODIFICANO lo schema (enum) e sono
-- riservate agli admin. Richiedono review umana prima della produzione.
--
-- NOTA sullo schema reale (0001):
-- - `content_type` è un ENUM  → si estende con ALTER TYPE (questa RPC).
-- - gli SPORT sono una TABELLA `sports` → si aggiungono come RIGHE (no enum),
--   quindi non serve una RPC per gli sport (vedi createSport lato app).
-- =====================================================================

-- RPC: aggiunge un valore a un enum whitelisted (solo admin).
-- Da chiamare via supabase.rpc('admin_add_enum_value', { enum_name, new_value }).
create or replace function public.admin_add_enum_value(enum_name text, new_value text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Solo admin (controllo difensivo lato DB, oltre a quello applicativo).
  if not exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'forbidden: admin role required';
  end if;

  -- Whitelist degli enum modificabili (evita ALTER TYPE arbitrari).
  if enum_name not in ('content_type') then
    raise exception 'enum % not allowed', enum_name;
  end if;

  -- ADD VALUE IF NOT EXISTS: idempotente.
  execute format('alter type %I add value if not exists %L', enum_name, new_value);
end;
$$;

-- Permessi: eseguibile dagli utenti autenticati (il check admin è interno).
revoke all on function public.admin_add_enum_value(text, text) from public;
grant execute on function public.admin_add_enum_value(text, text) to authenticated;

-- =====================================================================
-- STORAGE — bucket pubblico per le copertine video
-- =====================================================================
-- Le copertine (card 16:9 + in evidenza 21:9) vivono in Supabase Storage,
-- NON più nei meta di Cloudflare. Creare un bucket PUBBLICO `video-thumbnails`.
--
-- Da eseguire una volta (idempotente):
insert into storage.buckets (id, name, public)
values ('video-thumbnails', 'video-thumbnails', true)
on conflict (id) do nothing;

-- Lettura pubblica degli oggetti del bucket (bucket pubblico).
-- L'upload avviene server-side con la service role (bypassa la RLS storage),
-- quindi non servono policy di insert per gli utenti.
drop policy if exists "video-thumbnails public read" on storage.objects;
create policy "video-thumbnails public read"
  on storage.objects for select
  using (bucket_id = 'video-thumbnails');
