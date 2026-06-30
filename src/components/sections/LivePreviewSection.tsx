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

// Anteprime contenuti sulla landing PUBBLICA. Video/interviste/highlights REALI
// da Supabase (stessa query della home post-login). Modello DAZN: si naviga
// liberamente, il paywall scatta sulla pagina del contenuto. MOCK FALLBACK solo
// se Supabase non è configurato (dev mode), chiaramente commentato.
export async function LivePreviewSection() {
  const t = await getTranslations('Landing');
  const tc = await getTranslations('Common');

  const real = await getVideosForDisplay();
  const usingMock = !supabaseReadable(); // dev mode: nessuna credenziale Supabase
  const source: ContentItem[] = usingMock ? mockContent : real;

  const liveItems = source.filter((c) => c.type === 'live').slice(0, 6);
  const interviewItems = source.filter((c) => c.type === 'interview').slice(0, 6);
  const highlightItems = source.filter((c) => c.type === 'highlights').slice(0, 6);
  // "In evidenza": video featured (is_featured) o, se nessuno, i più recenti
  // (la query è già ordinata per data desc), escludendo i live.
  const featuredFlagged = source.filter((c) => c.tags.includes('featured') && c.type !== 'live');
  const featuredItems = (featuredFlagged.length > 0
    ? featuredFlagged
    : source.filter((c) => c.type !== 'live')
  ).slice(0, 6);

  // Card VOD pubblica: navigazione libera verso /vod/[id] (paywall lì).
  const vodCard = (item: ContentItem) => (
    <Link key={item.id} href={`/vod/${item.id}`} className="block shrink-0 snap-start">
      <VodCard
        title={item.title}
        date={item.date ?? ''}
        duration={item.duration ?? ''}
        access={badgeTier(item.access ?? (item.isPremium ? 'premium' : 'free'), item.type)}
        cardWidth={300}
        thumbnailUrl={item.thumbnail}
        isMock={usingMock}
      />
    </Link>
  );

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

      {/* In evidenza / Novità — VOD reali (featured o più recenti) */}
      {featuredItems.length > 0 ? (
        <section className="bg-[#141414] px-4 pb-12">
          <div className="mx-auto max-w-6xl">
            <RowHeader title={t('featured')} href="/vod" viewAll={t('viewAllVod')} />
            <ScrollRow>{featuredItems.map(vodCard)}</ScrollRow>
          </div>
        </section>
      ) : null}

      {/* Interviste — solo se ci sono contenuti (niente più card mock) */}
      {interviewItems.length > 0 ? (
        <section className="bg-[#141414] px-4 pb-12">
          <div className="mx-auto max-w-6xl">
            <RowHeader title={t('interviews')} href="/vod" viewAll={t('viewAllVod')} />
            <ScrollRow>{interviewItems.map(vodCard)}</ScrollRow>
          </div>
        </section>
      ) : null}

      {/* Highlights — solo se ci sono contenuti */}
      {highlightItems.length > 0 ? (
        <section className="bg-[#141414] px-4 pb-20">
          <div className="mx-auto max-w-6xl">
            <RowHeader title={t('highlights')} href="/vod" viewAll={t('viewAllVod')} />
            <ScrollRow>{highlightItems.map(vodCard)}</ScrollRow>
          </div>
        </section>
      ) : null}
    </>
  );
}
