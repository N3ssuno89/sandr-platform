import { listVideos, getThumbnailUrl } from '@/lib/cloudflare-stream';
import { getAdminContext } from '@/lib/supabase/guard';

// Lista i video dell'account Cloudflare Stream con lo stato di link su Supabase.
// AREA CRITICA (CLAUDE.md): Cloudflare token SOLO server-side; admin-only.
// Build-safe: { videos: [], error } se non configurato / non admin.
export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return Response.json({ videos: [], error: ctx.error });

  // Video reali da Cloudflare (token server-side).
  const cf = await listVideos();
  const uids = cf.map((v) => v.uid);

  // Quali uid sono già collegati su Supabase?
  const linked = new Set<string>();
  if (uids.length > 0) {
    const { data } = await ctx.admin.from('videos').select('cloudflare_uid').in('cloudflare_uid', uids);
    (data ?? []).forEach((r) => {
      if (r.cloudflare_uid) linked.add(r.cloudflare_uid);
    });
  }

  const videos = cf.map((v) => ({
    uid: v.uid,
    name: v.meta?.name ?? 'Video',
    thumbnail: getThumbnailUrl(v.uid),
    duration: v.duration,
    ready: v.readyToStream,
    isLinked: linked.has(v.uid),
  }));

  return Response.json({ videos });
}
