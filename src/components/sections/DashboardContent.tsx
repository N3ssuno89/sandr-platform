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
  href: string;
  items: ContentItem[];
};

export function DashboardContent({ realVideos }: { realVideos?: ContentItem[] }) {
  const t = useTranslations('AuthHome');
  const tc = useTranslations('Common');
  const tLive = useTranslations('Live');
  const tA = useTranslations('Athlete');
  const tFed = useTranslations('Federation');

  const real = realVideos ?? [];
  // hasRealVideos: ci sono video reali da Cloudflare Stream?
  const hasRealVideos = real.length > 0;

  // Sorgente dei video. Con video reali si usano SOLO quelli (le righe vuote
  // mostrano un messaggio, non card finte). Senza alcun video reale (account
  // Cloudflare vuoto / niente credenziali) si mostra il mock ovunque.
  // MOCK FALLBACK: shown only when no real videos exist (dev mode)
  const source: ContentItem[] = hasRealVideos ? real : mockContent;

  const circuitRow = (circuit: CircuitTag) => source.filter((c) => c.circuit === circuit);
  const typeRow = (type: ContentItem['type']) => source.filter((c) => c.type === type);

  // Ordine sezioni video (BUG 2): In diretta, Highlights, poi circuiti, poi
  // Interviste e Dietro le quinte. (Novità rimossa — BUG 3.)
  const rows: Row[] = [
    { id: 'live', title: t('liveNow'), kind: 'live', live: true, cardWidth: 320, href: '/live', items: typeRow('live') },
    { id: 'highlights', title: t('highlights'), kind: 'vod', cardWidth: 240, href: '/vod', items: typeRow('highlights') },
    { id: 'fipav', title: 'FIPAV — Campionato Italiano', kind: 'vod', cardWidth: 280, href: '/vod', items: circuitRow('FIPAV') },
    { id: 'aibvc', title: 'AIBVC Tour', kind: 'vod', cardWidth: 240, href: '/vod', items: circuitRow('AIBVC') },
    { id: 'avp', title: 'AVP America', kind: 'vod', cardWidth: 300, href: '/vod', items: circuitRow('AVP') },
    { id: 'bpt', title: 'Beach Pro Tour — FIVB', kind: 'vod', cardWidth: 260, href: '/vod', items: circuitRow('BPT') },
    { id: 'interview', title: t('interviews'), kind: 'vod', cardWidth: 360, href: '/vod', items: typeRow('interview') },
    { id: 'bts', title: t('behindScenes'), kind: 'vod', cardWidth: 220, href: '/vod', items: typeRow('behind-the-scenes') },
  ];

  // Card: live -> LiveEventCard (href interno). vod -> VodCard avvolta in Link.
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
    <div className="space-y-12 py-12">
      {/* 1 — Atleti in evidenza (dati mock: profili atleti) */}
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

      {/* 2 — I circuiti (dati mock: federazioni) */}
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

      {/* 3+ — Righe video (ordine BUG 2). Con video reali una riga vuota mostra
          un messaggio invece di card finte (BUG 5). */}
      {rows.map((row) => (
        <section key={row.id} className="mx-auto max-w-6xl px-4">
          <RowHeader title={row.title} href={row.href} viewAll={t('viewAll')} live={row.live} />
          {row.items.length > 0 ? (
            <ScrollRow>
              {row.items.map((item) => (
                <div key={`${row.id}-${item.id}`} className="shrink-0 snap-start">
                  {renderCard(item, row.kind, row.cardWidth)}
                </div>
              ))}
            </ScrollRow>
          ) : (
            // Solo in modalità dati reali: categoria senza video → messaggio.
            <p className="py-8 text-center text-sm text-[#888888]">
              Nessun video disponibile in questa sezione
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
