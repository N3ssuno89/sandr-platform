import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { VodCard } from '@/components/cards/VodCard';
import { listVideos, getThumbnailUrl } from '@/lib/cloudflare-stream';
import { mockContent } from '@/lib/mock-content';

// Pagina libreria VOD. Server component: prova a leggere i video reali da
// Cloudflare Stream (AREA CRITICA, CLAUDE.md). In assenza di configurazione
// o errore, fallback ai dati mock.
function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

type CardItem = {
  id: string;
  title: string;
  date: string;
  duration: string;
  access: 'free' | 'premium';
  thumbnailUrl?: string;
};

export default async function VodPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Vod');

  const videos = await listVideos();

  // Video reali se disponibili, altrimenti fallback ai mock.
  const items: CardItem[] =
    videos.length > 0
      ? videos.map((v) => ({
          id: v.uid,
          title: v.meta?.name ?? 'Video',
          date: formatDate(v.created),
          duration: formatDuration(v.duration),
          access: 'free',
          thumbnailUrl: getThumbnailUrl(v.uid),
        }))
      : mockContent
          .filter((c) => c.type !== 'live')
          .map((c) => ({
            id: c.id,
            title: c.title,
            date: c.date ?? '',
            duration: c.duration ?? '',
            access: (c.isPremium ? 'premium' : 'free') as 'free' | 'premium',
          }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-condensed text-4xl font-extrabold uppercase text-white">{t('title')}</h1>

      <div className="mt-8 flex flex-wrap gap-6">
        {items.map((item) => (
          <Link key={item.id} href={`/vod/${item.id}`} className="shrink-0">
            <VodCard
              title={item.title}
              date={item.date}
              duration={item.duration}
              access={item.access}
              thumbnailUrl={item.thumbnailUrl}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
