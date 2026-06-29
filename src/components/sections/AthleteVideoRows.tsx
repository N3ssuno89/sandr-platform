import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ScrollRow } from '@/components/ui/section-row';
import { VodCard } from '@/components/cards/VodCard';
import { badgeTier } from '@/lib/access/check';
import type { ContentItem } from '@/types/tags';

// Video in cui l'atleta è taggato, organizzati in righe per tipo (come la home).
// Solo righe non vuote; ogni card rispetta il gating accesso (badge + paywall al
// click su /vod/[id]). Server component: nessuno stato client necessario.
export async function AthleteVideoRows({ videos }: { videos: ContentItem[] }) {
  const t = await getTranslations('Athlete');

  if (videos.length === 0) {
    return <p className="mt-4 text-sm text-[#888888]">{t('noVideos')}</p>;
  }

  // "Video recenti" = tutti (già ordinati per pubblicazione desc), poi per tipo.
  const rows = [
    { key: 'recent', title: t('videosTitle'), items: videos },
    { key: 'highlights', title: t('videosHighlights'), items: videos.filter((v) => v.type === 'highlights') },
    { key: 'interview', title: t('videosInterviews'), items: videos.filter((v) => v.type === 'interview') },
    { key: 'replay', title: t('videosReplay'), items: videos.filter((v) => v.type === 'replay') },
    { key: 'behind', title: t('videosBehind'), items: videos.filter((v) => v.type === 'behind-the-scenes') },
  ].filter((r) => r.items.length > 0);

  return (
    <div className="space-y-10">
      {rows.map((row) => (
        <section key={row.key}>
          <h2 className="mb-4 font-condensed text-2xl font-bold uppercase tracking-wide text-white">
            {row.title}
          </h2>
          <ScrollRow>
            {row.items.map((item) => (
              <div key={`${row.key}-${item.id}`} className="shrink-0 snap-start">
                <Link href={`/vod/${item.id}`} className="block">
                  <VodCard
                    title={item.title}
                    date={item.date ?? ''}
                    duration={item.duration ?? ''}
                    access={badgeTier(item.access ?? (item.isPremium ? 'premium' : 'free'), item.type)}
                    cardWidth={260}
                    thumbnailUrl={item.thumbnail}
                  />
                </Link>
              </div>
            ))}
          </ScrollRow>
        </section>
      ))}
    </div>
  );
}
