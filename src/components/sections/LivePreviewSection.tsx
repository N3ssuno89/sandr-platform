'use client';

import type { KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';
import { RowHeader, ScrollRow } from '@/components/ui/section-row';
import { mockContent } from '@/lib/mock-content';

// Anteprima contenuti pre-login. Ogni card è cliccabile e porta a /login:
// sulla landing nessun contenuto si apre direttamente.
const liveItems = mockContent.filter((c) => c.type === 'live').slice(0, 3);
const interviewItems = mockContent.filter((c) => c.type === 'interview').slice(0, 3);

export function LivePreviewSection() {
  const t = useTranslations('Landing');
  const tc = useTranslations('Common');
  const tLive = useTranslations('Live');
  const router = useRouter();

  const goLogin = () => router.push('/login');
  const clickable = {
    role: 'button' as const,
    tabIndex: 0,
    onClick: goLogin,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goLogin();
      }
    },
  };

  return (
    <>
      {/* Live ora */}
      <section className="bg-[#141414] px-4 pb-12">
        <div className="mx-auto max-w-6xl">
          <RowHeader title={t('livePreview.title')} href="/login" viewAll={t('livePreview.viewAll')} live />
          <ScrollRow>
            {liveItems.map((item) => {
              const [teamA, teamB] = (item.teams ?? '').split(' vs ');
              return (
                <div
                  key={item.id}
                  {...clickable}
                  className="min-w-[82%] shrink-0 cursor-pointer snap-start sm:min-w-[320px]"
                >
                  <LiveEventCard
                    title={item.title}
                    teamA={teamA ?? ''}
                    teamB={teamB ?? ''}
                    sport={item.sport}
                    viewers={item.viewerCount ?? 0}
                    viewersLabel={tLive('watching')}
                  />
                </div>
              );
            })}
          </ScrollRow>

          {/* Gate: invito ad accedere per la diretta */}
          <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-[#C0BDB8]">{t('livePreview.gate')}</p>
            <button
              type="button"
              onClick={goLogin}
              className="shrink-0 rounded-lg bg-sandr-orange px-6 py-3 font-condensed font-bold uppercase tracking-wide text-black"
            >
              {tc('signIn')}
            </button>
          </div>
        </div>
      </section>

      {/* Interviste */}
      <section className="bg-[#141414] px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <RowHeader title={t('interviews')} href="/login" viewAll={t('livePreview.viewAll')} />
          <ScrollRow>
            {interviewItems.map((item) => (
              <div
                key={item.id}
                {...clickable}
                className="min-w-[70%] shrink-0 cursor-pointer snap-start sm:min-w-[260px]"
              >
                <VodCard
                  title={item.title}
                  date={item.date ?? ''}
                  duration={item.duration ?? ''}
                  access={item.isPremium ? 'premium' : 'free'}
                />
              </div>
            ))}
          </ScrollRow>
        </div>
      </section>
    </>
  );
}
