-- =====================================================================
-- SANDR — Storage: bucket video-thumbnails + policy di SCRITTURA per admin
-- AREA CRITICA (CLAUDE.md): scrittura storage. I bucket sono pubblici in
-- LETTURA; la SCRITTURA (insert/update/delete) è consentita solo agli admin.
--
-- Perché serve: l'upload via service-role bypassa la RLS, ma se la service role
-- non è configurata l'app ricade sul client autenticato (sessione admin), che
-- scrive RISPETTANDO la RLS — quindi senza queste policy l'insert veniva
-- bloccato e il bucket restava vuoto. Queste policy sbloccano quel percorso.
-- =====================================================================

-- Bucket per le copertine video (mancava: senza, l'upload thumbnail falliva).
insert into storage.buckets (id, name, public) values
  ('video-thumbnails', 'video-thumbnails', true)
on conflict (id) do nothing;

-- Lettura pubblica del bucket video-thumbnails (come athlete-photos/federation-logos).
drop policy if exists "video-thumbnails public read" on storage.objects;
create policy "video-thumbnails public read"
  on storage.objects for select
  using (bucket_id = 'video-thumbnails');

-- Helper: l'utente loggato è admin?
-- (inline nelle policy per non introdurre funzioni extra).

-- INSERT: solo admin autenticati, sui tre bucket gestiti dal pannello.
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('athlete-photos', 'federation-logos', 'video-thumbnails')
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- UPDATE: solo admin (es. upsert della stessa copertina).
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('athlete-photos', 'federation-logos', 'video-thumbnails')
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- DELETE: solo admin.
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('athlete-photos', 'federation-logos', 'video-thumbnails')
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
