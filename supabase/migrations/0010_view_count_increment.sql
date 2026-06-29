-- =====================================================================
-- SANDR — Incremento atomico del contatore visualizzazioni video.
-- NB: la colonna videos.view_count ESISTE GIÀ (migration 0001, int default 0):
--     qui non si aggiunge la colonna, si crea solo la funzione di incremento.
-- security definer: aggiorna view_count anche se la RLS su videos limita l'UPDATE
-- ai soli admin. Espone solo l'incremento del contatore (nessun altro campo).
-- =====================================================================

create or replace function public.increment_video_view(p_video_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.videos set view_count = view_count + 1 where id = p_video_id;
$$;

grant execute on function public.increment_video_view(uuid) to anon, authenticated;
