'use client';

import { useTranslations } from 'next-intl';
import { RowHeader, ScrollRow } from '@/components/ui/section-row';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';
import { AthleteCard } from '@/components/cards/AthleteCard';
import { FederationCard } from '@/components/cards/FederationCard';
import { mockContent } from '@/lib/mock-content';
import { mockAthletes } from '@/lib/mock-athletes';
import { mockFederations } from '@/lib/mock-federations';
import type { CircuitTag, ContentItem } from '@/types/tags';

type Row = {
  id: string;
  title: string;
  kind: 'live' | 'vod';
  live?: boolean;
  cardWidth: number;
  items: ContentItem[];
};

export function DashboardContent({ realVideos }: { realVideos?: ContentItem[] }) {
  const t = useTranslations('AuthHome');
  const tc = useTranslations('Common');
  const tLive = useTranslations('Live');
  const tA = useTranslations('Athlete');
  const tFed = useTranslations('Federation');

  // Sorgente contenuti: video reali da Cloudflare Stream se presenti, altrimenti
  // i dati mock di fallback.
  const source = realVideos ?? mockContent;

  // Nessun filtro circuito: tutte le righe sono sempre visibili.
  const circuitRow = (circuit: CircuitTag) => source.filter((c) => c.circuit === circuit);
  const typeRow = (type: ContentItem['type']) => source.filter((c) => c.type === type);

  const liveItems = typeRow('live');

  // Righe per circuito + tipo (dopo atleti e federazioni).
  const contentRows: Row[] = [
    { id: 'fipav', title: 'FIPAV — Campionato Italiano', kind: 'vod', cardWidth: 280, items: circuitRow('FIPAV') },
    { id: 'aibvc', title: 'AIBVC Tour', kind: 'vod', cardWidth: 240, items: circuitRow('AIBVC') },
    { id: 'avp', title: 'AVP America', kind: 'vod', cardWidth: 300, items: circuitRow('AVP') },
    { id: 'bpt', title: 'Beach Pro Tour — FIVB', kind: 'vod', cardWidth: 260, items: circuitRow('BPT') },
    { id: 'interview', title: t('interviews'), kind: 'vod', cardWidth: 360, items: typeRow('interview') },
    { id: 'bts', title: t('behindScenes'), kind: 'vod', cardWidth: 220, items: typeRow('behind-the-scenes') },
    { id: 'highlights', title: t('highlights'), kind: 'vod', cardWidth: 240, items: typeRow('highlights') },
  ];

  const renderCard = (item: ContentItem, kind: 'live' | 'vod', cardWidth: number) => {
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
          cardWidth={cardWidth}
        />
      );
    }
    return (
      <VodCard
        title={item.title}
        date={item.date ?? ''}
        duration={item.duration ?? ''}
        access={item.isPremium ? 'premium' : 'free'}
        cardWidth={cardWidth}
        thumbnailUrl={item.thumbnail}
      />
    );
  };

  return (
    <>
      <div className="space-y-12 py-12">
        {/* 1 — In diretta ora */}
        {liveItems.length > 0 ? (
          <section className="mx-auto max-w-6xl px-4">
            <RowHeader title={t('liveNow')} href="/live" viewAll={t('viewAll')} live />
            <ScrollRow>
              {liveItems.map((item) => (
                <div key={item.id} className="shrink-0 snap-start">
                  {renderCard(item, 'live', 320)}
                </div>
              ))}
            </ScrollRow>
          </section>
        ) : null}

        {/* 2 — Atleti in evidenza */}
        <section className="mx-auto max-w-6xl px-4">
          <RowHeader title={tA('featuredRow')} href="/athletes" viewAll={t('viewAll')} />
          <ScrollRow>
            {mockAthletes.map((a) => (
              <div key={a.id} className="shrink-0 snap-start">
                <AthleteCard athlete={a} cardWidth={160} />
              </div>
            ))}
          </ScrollRow>
        </section>

        {/* 3 — I circuiti */}
        <section className="mx-auto max-w-6xl px-4">
          <RowHeader title={tFed('indexTitle')} href="/federations" viewAll={t('viewAll')} />
          <ScrollRow>
            {mockFederations.map((f) => (
              <div key={f.id} className="shrink-0 snap-start">
                <FederationCard federation={f} />
              </div>
            ))}
          </ScrollRow>
        </section>

        {/* 4 — Righe contenuti */}
        {contentRows.map((row) => {
          if (row.items.length === 0) return null;
          return (
            <section key={row.id} className="mx-auto max-w-6xl px-4">
              <RowHeader title={row.title} href="/live" viewAll={t('viewAll')} live={row.live} />
              <ScrollRow>
                {row.items.map((item) => (
                  <div key={item.id} className="shrink-0 snap-start">
                    {renderCard(item, row.kind, row.cardWidth)}
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
