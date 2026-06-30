import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';
import { RowHeader, ScrollRow } from '@/components/ui/section-row';
import { getVideosForDisplay } from '@/lib/videos/actions';
import { supabaseReadable } from '@/lib/public/queries';
import { badgeTier } from '@/lib/access/check';
import { mockContent } from '@/lib/mock-content';
import type { ContentItem } from '@/types/tags';

// Anteprima contenuti pubblica (pre-login). Video/interviste REALI da Supabase
// (stessa query della home post-login). Modello DAZN: si naviga liberamente, il
// paywall scatta sulla pagina del contenuto. MOCK FALLBACK solo se Supabase non
// è configurato (dev mode), chiaramente segnalato.
export async function LivePreviewSection() {
  const t = await getTranslations('Landing');
  const tc = await getTranslations('Common');

  const real = await getVideosForDisplay();
  const usingMock = !supabaseReadable(); // dev mode: nessuna credenziale Supabase
  const source: ContentItem[] = usingMock ? mockContent : real;

  const liveItems = source.filter((c) => c.type === 'live').slice(0, 6);
  const interviewItems = source.filter((c) => c.type === 'interview').slice(0, 6);

  return (
    <>
      {/* Live ora */}
      <section className="bg-[#141414] px-4 pb-12">
        <div className="mx-auto max-w-6xl">
          <RowHeader title={t('livePreview.title')} href="/live" viewAll={t('livePreview.viewAll')} live />
          {liveItems.length > 0 ? (
            <ScrollRow>
              {liveItems.map((item) => {
                const [teamA, teamB] = (item.teams ?? '').split(' vs ');
                return (
                  <div key={item.id} className="shrink-0 snap-start">
                    {/* Pubblico in demo: la card porta al player live (paywall lì). */}
                    <LiveEventCard
                      title={item.title}
                      teamA={teamA ?? ''}
                      teamB={teamB ?? ''}
                      sport={item.sport}
                      href={`/live/${item.id}`}
                      ctaLabel={tc('watch')}
                      cardWidth={320}
                      isMock={usingMock}
                    />
                  </div>
                );
              })}
            </ScrollRow>
          ) : (
            <p className="py-8 text-sm text-[#888888]">{t('livePreview.empty')}</p>
          )}

          {/* Gate: invito ad accedere (CTA di conversione, non contenuto video) */}
          <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-[#C0BDB8]">{t('livePreview.gate')}</p>
            <Link
              href="/login"
              className="shrink-0 rounded-lg bg-sandr-orange px-6 py-3 font-condensed font-bold uppercase tracking-wide text-black"
            >
              {tc('signIn')}
            </Link>
          </div>
        </div>
      </section>

      {/* Interviste — mostrate solo se ci sono contenuti (niente più card mock) */}
      {interviewItems.length > 0 ? (
        <section className="bg-[#141414] px-4 pb-20">
          <div className="mx-auto max-w-6xl">
            <RowHeader title={t('interviews')} href="/vod" viewAll={t('livePreview.viewAllVod')} />
            <ScrollRow>
              {interviewItems.map((item) => (
                <Link key={item.id} href={`/vod/${item.id}`} className="block shrink-0 snap-start">
                  {/* Navigazione libera: il paywall scatta su /vod/[id]. */}
                  <VodCard
                    title={item.title}
                    date={item.date ?? ''}
                    duration={item.duration ?? ''}
                    access={badgeTier(item.access ?? (item.isPremium ? 'premium' : 'free'), item.type)}
                    cardWidth={360}
                    thumbnailUrl={item.thumbnail}
                    isMock={usingMock}
                  />
                </Link>
              ))}
            </ScrollRow>
          </div>
        </section>
      ) : null}
    </>
  );
}
