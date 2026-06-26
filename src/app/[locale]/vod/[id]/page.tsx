import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getVideo, listVideos } from '@/lib/cloudflare-stream';
import { VodPlayerView } from '@/components/player/VodPlayerView';

// Pagina VOD player. Server component: legge il video reale da Cloudflare
// Stream (AREA CRITICA, CLAUDE.md). Rotta dinamica (nessun pre-render).
export default async function VodDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);

  const video = await getVideo(params.id);

  if (!video) {
    const t = await getTranslations('Vod');
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#0a0a0a] px-4 text-center">
        <p className="font-condensed text-2xl uppercase text-sandr-muted">{t('player.notAvailable')}</p>
      </div>
    );
  }

  const others = (await listVideos()).filter((v) => v.uid !== video.uid).slice(0, 6);

  return <VodPlayerView video={video} others={others} />;
}
