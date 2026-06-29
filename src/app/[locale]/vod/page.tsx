import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { VodCard } from '@/components/cards/VodCard';
import { getVideosForDisplay } from '@/lib/videos/actions';
import { mockContent } from '@/lib/mock-content';
import { badgeTier } from '@/lib/access/check';

// Dati sempre freschi: nessuna cache (la libreria deve riflettere subito le scritture).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Libreria VOD. I video arrivano da SUPABASE (getVideosForDisplay). MOCK
// FALLBACK: solo quando Supabase non ha video (dev mode).
type CardItem = {
  id: string;
  title: string;
  date: string;
  duration: string;
  access: 'free' | 'premium' | 'ppv';
  thumbnailUrl?: string;
};

export default async function VodPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Vod');

  const videos = await getVideosForDisplay();

  const items: CardItem[] =
    videos.length > 0
      ? videos
          .filter((v) => v.type !== 'live')
          .map((v) => ({
            id: v.id,
            title: v.title,
            date: v.date ?? '',
            duration: v.duration ?? '',
            access: badgeTier(v.access ?? (v.isPremium ? 'premium' : 'free'), v.type),
            thumbnailUrl: v.thumbnail,
          }))
      : // MOCK FALLBACK: shown only when Supabase has zero videos (dev mode)
        mockContent
          .filter((c) => c.type !== 'live')
          .map((c) => ({
            id: c.id,
            title: c.title,
            date: c.date ?? '',
            duration: c.duration ?? '',
            access: (c.isPremium ? 'premium' : 'free') as 'free' | 'premium',
            thumbnailUrl: c.thumbnail,
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
