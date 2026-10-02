import { getTranslations } from 'next-intl/server';
import { getLiveCards, getNextEvent } from '@/lib/data';
import { LiveRow, EmptyLive } from '@/components/home/HomeSections';

// Home OPEN (visibile anche senza login). Il tema CHIARO e l'header/footer del
// volto Open sono forniti dalla chrome globale (SiteChrome). Dati SOLO da
// @/lib/data. Include tornei di club/Open (anche Under 18).
export async function OpenHome() {
  const t = await getTranslations('Homes');
  const [live, nextEvent] = await Promise.all([getLiveCards('open'), getNextEvent()]);

  return (
    <div className="mx-auto max-w-[1360px] space-y-10 px-4 py-10 md:px-10">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-tight">{t('openTitle')}</h1>
        <p className="mt-1 font-barlow text-sm text-[color:var(--face-muted)]">{t('openSubtitle')}</p>
      </div>

      {live.length > 0 ? (
        <LiveRow title={t('liveNow')} items={live} light />
      ) : (
        <section>
          <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{t('liveNow')}</h2>
          <EmptyLive nextEvent={nextEvent} light />
        </section>
      )}
    </div>
  );
}
