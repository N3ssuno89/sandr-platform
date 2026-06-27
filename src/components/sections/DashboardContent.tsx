'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
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

// Circuiti con una riga dedicata in home.
const DISPLAYED_CIRCUITS: CircuitTag[] = ['FIPAV', 'AIBVC', 'AVP', 'BPT'];

export function DashboardContent({ realVideos }: { realVideos?: ContentItem[] }) {
  const t = useTranslations('AuthHome');
  const tc = useTranslations('Common');
  const tLive = useTranslations('Live');
  const tA = useTranslations('Athlete');
  const tFed = useTranslations('Federation');

  const real = realVideos ?? [];

  // Riga per circuito/tipo: usa i video REALI della categoria; se quella
  // categoria non ha video reali, fallback ai MOCK così la home non è MAI
  // vuota in questa fase (placeholder). In demo (nessun reale) usa sempre mock.
  const circuitRow = (circuit: CircuitTag): ContentItem[] => {
    const r = real.filter((c) => c.circuit === circuit);
    return r.length ? r : mockContent.filter((c) => c.circuit === circuit);
  };
  const typeRow = (type: ContentItem['type']): ContentItem[] => {
    const r = real.filter((c) => c.type === type);
    return r.length ? r : mockContent.filter((c) => c.type === type);
  };

  // Video reali senza un circuito tra quelli mostrati (o senza circuito):
  // vanno nella riga "Novità" invece di sparire o finire tutti su BPT.
  const novita = real.filter((c) => !c.circuit || !DISPLAYED_CIRCUITS.includes(c.circuit));

  const liveItems = typeRow('live');

  const contentRows: Row[] = [
    ...(novita.length > 0
      ? [{ id: 'novita', title: t('newest'), kind: 'vod' as const, cardWidth: 260, items: novita }]
      : []),
    { id: 'fipav', title: 'FIPAV — Campionato Italiano', kind: 'vod', cardWidth: 280, items: circuitRow('FIPAV') },
    { id: 'aibvc', title: 'AIBVC Tour', kind: 'vod', cardWidth: 240, items: circuitRow('AIBVC') },
    { id: 'avp', title: 'AVP America', kind: 'vod', cardWidth: 300, items: circuitRow('AVP') },
    { id: 'bpt', title: 'Beach Pro Tour — FIVB', kind: 'vod', cardWidth: 260, items: circuitRow('BPT') },
    { id: 'interview', title: t('interviews'), kind: 'vod', cardWidth: 360, items: typeRow('interview') },
    { id: 'bts', title: t('behindScenes'), kind: 'vod', cardWidth: 220, items: typeRow('behind-the-scenes') },
    { id: 'highlights', title: t('highlights'), kind: 'vod', cardWidth: 240, items: typeRow('highlights') },
  ];

  // Card: live -> LiveEventCard (href interno). vod -> VodCard SEMPRE avvolta
  // in un Link verso /vod/[id] (così OGNI card è cliccabile in OGNI riga).
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
      <Link href={`/vod/${item.id}`} className="block">
        <VodCard
          title={item.title}
          date={item.date ?? ''}
          duration={item.duration ?? ''}
          access={item.isPremium ? 'premium' : 'free'}
          cardWidth={cardWidth}
          thumbnailUrl={item.thumbnail}
        />
      </Link>
    );
  };

  return (
    <>
      <div className="space-y-12 py-12">
        {/* 1 — Atleti in evidenza */}
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

        {/* 2 — I circuiti */}
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

        {/* 3 — In diretta ora (con fallback mock, riga sempre presente) */}
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

        {/* 4 — Righe contenuti (Novità + circuiti + tipi) */}
        {contentRows.map((row) => {
          if (row.items.length === 0) return null;
          return (
            <section key={row.id} className="mx-auto max-w-6xl px-4">
              <RowHeader title={row.title} href="/vod" viewAll={t('viewAll')} live={row.live} />
              <ScrollRow>
                {row.items.map((item) => (
                  <div key={`${row.id}-${item.id}`} className="shrink-0 snap-start">
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
