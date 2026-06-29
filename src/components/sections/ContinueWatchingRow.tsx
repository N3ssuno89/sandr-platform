import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { RowHeader, ScrollRow } from '@/components/ui/section-row';
import { VodCard } from '@/components/cards/VodCard';
import { getContinueWatching } from '@/lib/tracking/queries';

// Riga "Continua a guardare": video non completati dell'utente (watch_history),
// con barra di avanzamento sulla card. Server component: si nasconde se vuota.
export async function ContinueWatchingRow() {
  const items = await getContinueWatching();
  if (items.length === 0) return null;

  const t = await getTranslations('AuthHome');

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12">
      <RowHeader title={t('continueWatching')} href="/vod" viewAll={t('viewAll')} />
      <ScrollRow>
        {items.map((item) => (
          <div key={item.id} className="shrink-0 snap-start">
            <Link href={`/vod/${item.id}`} className="block">
              <VodCard
                title={item.title}
                date=""
                duration=""
                access={item.access}
                cardWidth={240}
                thumbnailUrl={item.thumbnail}
                progress={item.progress}
              />
            </Link>
          </div>
        ))}
      </ScrollRow>
    </section>
  );
}
