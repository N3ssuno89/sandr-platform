-- =====================================================================
-- SANDR — Storage buckets pubblici per foto atleti e loghi federazioni
-- AREA CRITICA (CLAUDE.md): upload server-side via service role.
-- =====================================================================

insert into storage.buckets (id, name, public) values
  ('athlete-photos', 'athlete-photos', true),
  ('federation-logos', 'federation-logos', true)
on conflict (id) do nothing;

-- Lettura pubblica (bucket pubblici). Upload solo server-side (service role).
drop policy if exists "athlete-photos public read" on storage.objects;
create policy "athlete-photos public read"
  on storage.objects for select
  using (bucket_id = 'athlete-photos');

drop policy if exists "federation-logos public read" on storage.objects;
create policy "federation-logos public read"
  on storage.objects for select
  using (bucket_id = 'federation-logos');
