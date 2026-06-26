'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CircuitFilter, type CircuitSelection } from '@/components/sections/CircuitFilter';
import { RowHeader, ScrollRow } from '@/components/ui/section-row';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';
import { mockContent } from '@/lib/mock-content';
import type { CircuitTag, ContentItem } from '@/types/tags';

type Row = {
  id: string;
  title: string;
  kind: 'live' | 'vod';
  live?: boolean;
  items: ContentItem[];
};

export function DashboardContent() {
  const t = useTranslations('AuthHome');
  const tc = useTranslations('Common');
  const tLive = useTranslations('Live');
  const [selected, setSelected] = useState<CircuitSelection>('all');

  // Righe per circuito: filtrate dalla selezione (se non combacia -> vuote).
  const circuitRow = (circuit: CircuitTag) =>
    mockContent.filter((c) => c.circuit === circuit && (selected === 'all' || selected === circuit));
  // Righe per tipo: NON filtrate dal circuito.
  const typeRow = (type: ContentItem['type']) => mockContent.filter((c) => c.type === type);

  const rows: Row[] = [
    { id: 'live', title: t('liveNow'), kind: 'live', live: true, items: typeRow('live') },
    { id: 'fipav', title: 'FIPAV — Campionato Italiano', kind: 'vod', items: circuitRow('FIPAV') },
    { id: 'aibvc', title: 'AIBVC Tour', kind: 'vod', items: circuitRow('AIBVC') },
    { id: 'avp', title: 'AVP America', kind: 'vod', items: circuitRow('AVP') },
    { id: 'bpt', title: 'Beach Pro Tour — FIVB', kind: 'vod', items: circuitRow('BPT') },
    { id: 'interview', title: t('interviews'), kind: 'vod', items: typeRow('interview') },
    { id: 'bts', title: t('behindScenes'), kind: 'vod', items: typeRow('behind-the-scenes') },
    { id: 'highlights', title: t('highlights'), kind: 'vod', items: typeRow('highlights') },
  ];

  const renderCard = (item: ContentItem, kind: 'live' | 'vod') => {
    if (kind === 'live') {
      const parts = (item.teams ?? '').split(' vs ');
      return (
        <LiveEventCard
          title={item.title}
          teamA={parts[0] ?? ''}
          teamB={parts[1] ?? ''}
          sport={item.sport}
          viewers={item.viewerCount ?? 0}
          viewersLabel={tLive('watching')}
          href={`/live/${item.id}`}
          ctaLabel={tc('watch')}
        />
      );
    }
    return (
      <VodCard
        title={item.title}
        date={item.date ?? ''}
        duration={item.duration ?? ''}
        access={item.isPremium ? 'premium' : 'free'}
      />
    );
  };

  return (
    <>
      {/* Sezione B — filtro circuiti */}
      <CircuitFilter selected={selected} onSelect={setSelected} />

      {/* Sezioni C–J */}
      <div className="space-y-12 py-12">
        {rows.map((row, i) => {
          // Righe vuote dopo il filtro: nascoste.
          if (row.items.length === 0) return null;
          // Task 7: alterna card larghe (300px) e standard (220px).
          const large = i % 2 === 0;
          const width = large ? 'min-w-[85%] sm:min-w-[300px]' : 'min-w-[72%] sm:min-w-[220px]';

          return (
            <section key={row.id} className="mx-auto max-w-6xl px-4">
              <RowHeader title={row.title} href="/live" viewAll={t('viewAll')} live={row.live} />
              <ScrollRow>
                {row.items.map((item) => (
                  <div key={item.id} className={`${width} shrink-0 snap-start`}>
                    {renderCard(item, row.kind)}
                  </div>
                ))}
              </ScrollRow>
            </section>
          );
        })}
      </div>
    </>
  );
}
