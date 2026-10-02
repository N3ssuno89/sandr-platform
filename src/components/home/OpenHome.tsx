import { getTranslations } from 'next-intl/server';
import { getLiveCards, getNextEvent } from '@/lib/data';
import { faceMeta } from '@/config/faces';
import { LiveRow, EmptyLive } from '@/components/home/HomeSections';
import { FaceSwitcher } from '@/components/faces/FaceSwitcher';
import { OpenBadge } from '@/components/faces/OpenBadge';

// Home OPEN (visibile anche senza login). Tema CHIARO del volto Open. Dati SOLO
// da @/lib/data. Include tornei di club/Open (anche Under 18).
export async function OpenHome() {
  const t = await getTranslations('Homes');
  const [live, nextEvent] = await Promise.all([getLiveCards('open'), getNextEvent()]);
  const meta = faceMeta.open;

  return (
    <div
      data-face="open"
      style={{ backgroundColor: meta.bg, color: meta.fg, ['--face-accent']: meta.accent } as React.CSSProperties}
      className="min-h-screen"
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        <header className="flex items-center gap-3">
          <OpenBadge />
          <div className="ml-auto">
            <FaceSwitcher current="open" />
          </div>
        </header>

        <div>
          <h1 className="font-condensed text-3xl font-extrabold uppercase tracking-wide">{t('openTitle')}</h1>
          <p className="mt-1 text-sm text-black/60">{t('openSubtitle')}</p>
        </div>

        {live.length > 0 ? (
          <LiveRow title={t('liveNow')} items={live} light />
        ) : (
          <section>
            <h2 className="mb-4 font-condensed text-xl font-bold uppercase tracking-wide">{t('liveNow')}</h2>
            <EmptyLive nextEvent={nextEvent} light />
          </section>
        )}
      </div>
    </div>
  );
}
