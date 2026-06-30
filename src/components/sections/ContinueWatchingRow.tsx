import { getTranslations } from 'next-intl/server';
import { RowHeader, ScrollRow } from '@/components/ui/section-row';
import { ContinueWatchingCard } from '@/components/sections/ContinueWatchingCard';
import { getContinueWatching } from '@/lib/tracking/queries';
import { HERO_GUTTER } from '@/lib/layout';

// Riga "Continua a guardare": video non completati e non rimossi dell'utente
// (watch_history), con barra di avanzamento + X per rimuovere. Si nasconde se
// vuota. Server component.
export async function ContinueWatchingRow() {
  const items = await getContinueWatching();
  if (items.length === 0) return null;

  const t = await getTranslations('AuthHome');

  return (
    <section className={`${HERO_GUTTER} pt-12`}>
      <RowHeader title={t('continueWatching')} href="/vod" viewAll={t('viewAll')} />
      <ScrollRow>
        {items.map((item) => (
          <ContinueWatchingCard key={item.id} item={item} />
        ))}
      </ScrollRow>
    </section>
  );
}
