import { setRequestLocale } from 'next-intl/server';
import { listVideos, getThumbnailUrl } from '@/lib/cloudflare-stream';
import { VideoManager, type VideoRow } from '@/components/admin/VideoManager';

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function AdminVideosPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const videos = await listVideos();

  const rows: VideoRow[] = videos.map((v) => {
    // I metadati custom (circuito/tipo/sport) vivono in meta su Cloudflare Stream.
    const meta = v.meta as Record<string, string | undefined>;
    return {
      uid: v.uid,
      name: v.meta?.name ?? 'Video',
      thumb: getThumbnailUrl(v.uid),
      circuit: meta?.circuit,
      type: meta?.type,
      sport: meta?.sport,
      ready: v.readyToStream,
      date: fmtDate(v.created),
    };
  });

  return <VideoManager videos={rows} />;
}
