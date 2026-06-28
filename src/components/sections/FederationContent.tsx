'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';
import { AthleteCard } from '@/components/cards/AthleteCard';
import type { Athlete } from '@/types/athlete';
import type { ContentItem } from '@/types/tags';
import type { EventView } from '@/lib/public/queries';

const TABS = ['home', 'live', 'replay', 'interviews', 'athletes', 'highlights', 'events'] as const;
type Tab = (typeof TABS)[number];

// Presentazionale: riceve i contenuti già filtrati da Supabase (o mock) via props.
export function FederationContent({
  fedId,
  videos,
  athletes,
  events,
}: {
  fedId: string;
  videos: ContentItem[];
  athletes: Athlete[];
  events: EventView[];
}) {
  const t = useTranslations('Federation');
  const tLive = useTranslations('Live');
  const tc = useTranslations('Common');
  const [tab, setTab] = useState<Tab>('home');

  const itemsForTab = (): ContentItem[] => {
    switch (tab) {
      case 'live':
        return videos.filter((c) => c.type === 'live');
      case 'replay':
        return videos.filter((c) => c.type === 'replay');
      case 'interviews':
        return videos.filter((c) => c.type === 'interview');
      case 'highlights':
        return videos.filter((c) => c.type === 'highlights');
      case 'home':
        return videos;
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
      <Link key={item.id} href={`/vod/${item.id}`} className="block">
        <VodCard
          title={item.title}
          date={item.date ?? ''}
          duration={item.duration ?? ''}
          access={item.isPremium ? 'premium' : 'free'}
          cardWidth={260}
          thumbnailUrl={item.thumbnail}
        />
      </Link>
    );
  };

  return (
    <>
      {/* Tab bar */}
      <div className="sticky top-20 z-40 border-b border-white/[0.08] bg-[#1C1C1C]">
        <div className="no-scrollbar mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex gap-6 whitespace-nowrap">
            {TABS.map((tb) => (
              <button
                key={tb}
                type="button"
                onClick={() => setTab(tb)}
                className={`-mb-px border-b-2 py-3 font-condensed text-sm font-bold uppercase tracking-wide transition-colors ${
                  tab === tb ? 'border-sandr-orange text-white' : 'border-transparent text-sandr-muted hover:text-white'
                }`}
              >
                {tb === 'events' ? 'Calendario eventi' : t(`tabs.${tb}`)}
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
        ) : tab === 'events' ? (
          events.length > 0 ? (
            <ul className="space-y-3">
              {events.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#1C1C1C] p-4">
                  <div>
                    <p className="font-condensed text-[15px] font-bold uppercase tracking-wide text-white">{e.title}</p>
                    <p className="text-[13px] text-[#888888]">
                      {e.location} · {e.dateRange} · {e.stage}
                    </p>
                  </div>
                  <Link href={`/federations/${fedId}`} className="shrink-0 text-[13px] font-semibold uppercase tracking-wide text-sandr-orange hover:text-sandr-text">
                    Dettagli
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sandr-muted">Nessun evento in programma per questo circuito</p>
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
