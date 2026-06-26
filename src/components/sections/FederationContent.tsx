'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';
import { AthleteCard } from '@/components/cards/AthleteCard';
import { mockContent } from '@/lib/mock-content';
import { mockAthletes } from '@/lib/mock-athletes';
import type { Federation } from '@/types/federation';
import type { ContentItem } from '@/types/tags';

const TABS = ['home', 'live', 'replay', 'interviews', 'athletes', 'highlights'] as const;
type Tab = (typeof TABS)[number];

export function FederationContent({ federation }: { federation: Federation }) {
  const t = useTranslations('Federation');
  const tLive = useTranslations('Live');
  const tc = useTranslations('Common');
  const [tab, setTab] = useState<Tab>('home');

  // Filtro per circuito = shortName della federazione.
  const content = mockContent.filter((c) => c.circuit === federation.shortName);
  const athletes = mockAthletes.filter((a) => a.circuit === federation.shortName);

  const itemsForTab = (): ContentItem[] => {
    switch (tab) {
      case 'live':
        return content.filter((c) => c.type === 'live');
      case 'replay':
        return content.filter((c) => c.type === 'replay');
      case 'interviews':
        return content.filter((c) => c.type === 'interview');
      case 'highlights':
        return content.filter((c) => c.type === 'highlights');
      case 'home':
        return content;
      default:
        return [];
    }
  };

  const items = itemsForTab();

  const renderContentCard = (item: ContentItem) => {
    if (item.type === 'live') {
      const parts = (item.teams ?? '').split(' vs ');
      return (
        <LiveEventCard
          key={item.id}
          title={item.title}
          teamA={parts[0] ?? ''}
          teamB={parts[1] ?? ''}
          sport={item.sport}
          viewers={item.viewerCount ?? 0}
          viewersLabel={tLive('watching')}
          href={`/live/${item.id}`}
          ctaLabel={tc('watch')}
          cardWidth={300}
        />
      );
    }
    return (
      <VodCard
        key={item.id}
        title={item.title}
        date={item.date ?? ''}
        duration={item.duration ?? ''}
        access={item.isPremium ? 'premium' : 'free'}
        cardWidth={260}
      />
    );
  };

  return (
    <>
      {/* Tab bar (stile barra circuiti) */}
      <div className="sticky top-20 z-40 border-b border-white/[0.08] bg-[#1C1C1C]">
        <div className="no-scrollbar mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex gap-6 whitespace-nowrap">
            {TABS.map((tb) => (
              <button
                key={tb}
                type="button"
                onClick={() => setTab(tb)}
                className={`-mb-px border-b-2 py-3 font-condensed text-sm font-bold uppercase tracking-wide transition-colors ${
                  tab === tb
                    ? 'border-sandr-orange text-white'
                    : 'border-transparent text-sandr-muted hover:text-white'
                }`}
              >
                {t(`tabs.${tb}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenuto della tab attiva */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {tab === 'athletes' ? (
          athletes.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {athletes.map((a) => (
                <AthleteCard key={a.id} athlete={a} />
              ))}
            </div>
          ) : (
            <p className="text-sandr-muted">{t('empty')}</p>
          )
        ) : items.length > 0 ? (
          <div className="flex flex-wrap gap-5">{items.map((item) => renderContentCard(item))}</div>
        ) : (
          <p className="text-sandr-muted">{t('empty')}</p>
        )}
      </div>
    </>
  );
}
