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
import { badgeTier } from '@/lib/access/check';
import type { CircuitTag, ContentItem } from '@/types/tags';
import type { Athlete } from '@/types/athlete';
import type { Federation } from '@/types/federation';

type Row = {
  id: string;
  title: string;
  kind: 'live' | 'vod';
  live?: boolean;
  cardWidth: number;
  href: string;
  items: ContentItem[];
};

export function DashboardContent({
  realVideos,
  athletes,
  federations,
}: {
  realVideos?: ContentItem[];
  athletes?: Athlete[];
  federations?: Federation[];
}) {
  const t = useTranslations('AuthHome');
  const tc = useTranslations('Common');
  const tLive = useTranslations('Live');
  const tA = useTranslations('Athlete');
  const tFed = useTranslations('Federation');

  // Atleti/federazioni: reali da Supabase se presenti, altrimenti mock.
  const athleteList = athletes && athletes.length > 0 ? athletes : mockAthletes;
  const federationList = federations && federations.length > 0 ? federations : mockFederations;

  const real = realVideos ?? [];
  const hasRealVideos = real.length > 0;
  // MOCK FALLBACK: shown only when no real videos exist (dev mode)
  const isMock = !hasRealVideos;
  const source: ContentItem[] = hasRealVideos ? real : mockContent;

  // Righe per federazione = SOLO le partite (type 'replay', etichettato "Partite"
  // nella UI) di quel circuito. Interviste/highlights restano nelle righe
  // tematiche dedicate, quindi non vengono duplicati qui.
  const circuitRow = (circuit: CircuitTag) =>
    source.filter((c) => c.circuit === circuit && c.type === 'replay');
  const typeRow = (type: ContentItem['type']) => source.filter((c) => c.type === type);

  // Righe video (definite singolarmente per poterle disporre nell'ordine
  // richiesto, intercalate alle sezioni Circuiti/Atleti).
  const liveRow: Row = { id: 'live', title: t('liveNow'), kind: 'live', live: true, cardWidth: 320, href: '/live', items: typeRow('live') };
  const highlightsRow: Row = { id: 'highlights', title: t('highlights'), kind: 'vod', cardWidth: 240, href: '/vod', items: typeRow('highlights') };
  const fipavRow: Row = { id: 'fipav', title: 'FIPAV — Campionato Italiano', kind: 'vod', cardWidth: 280, href: '/vod', items: circuitRow('FIPAV') };
  const aibvcRow: Row = { id: 'aibvc', title: 'AIBVC Tour', kind: 'vod', cardWidth: 240, href: '/vod', items: circuitRow('AIBVC') };
  const avpRow: Row = { id: 'avp', title: 'AVP America', kind: 'vod', cardWidth: 300, href: '/vod', items: circuitRow('AVP') };
  const bptRow: Row = { id: 'bpt', title: 'Beach Pro Tour — FIVB', kind: 'vod', cardWidth: 260, href: '/vod', items: circuitRow('BPT') };
  const interviewRow: Row = { id: 'interview', title: t('interviews'), kind: 'vod', cardWidth: 360, href: '/vod', items: typeRow('interview') };
  const btsRow: Row = { id: 'bts', title: t('behindScenes'), kind: 'vod', cardWidth: 220, href: '/vod', items: typeRow('behind-the-scenes') };

  // Card: live -> LiveEventCard (href interno). vod -> VodCard avvolta in Link.
  // isMock propaga l'etichetta "MOCK" sui dati di esempio.
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
          isMock={isMock}
        />
      );
    }
    return (
      <Link href={`/vod/${item.id}`} className="block">
        <VodCard
          title={item.title}
          date={item.date ?? ''}
          duration={item.duration ?? ''}
          access={badgeTier(item.access ?? (item.isPremium ? 'premium' : 'free'), item.type)}
          cardWidth={cardWidth}
          thumbnailUrl={item.thumbnail}
          isMock={isMock}
        />
      </Link>
    );
  };

  // Sezione video: card o messaggio (solo in modalità dati reali se vuota).
  const renderVideoRow = (row: Row) => (
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
        <p className="py-8 text-center text-sm text-[#888888]">Nessun video disponibile in questa sezione</p>
      )}
    </section>
  );

  return (
    <div className="space-y-12 py-12">
      {/* Banner modalità demo (mock fallback) */}
      {isMock ? (
        <div className="mx-auto max-w-6xl px-4">
          <p className="rounded-lg border border-[#F04E00]/30 bg-[#F04E00]/10 py-2 text-center text-[13px] text-[#F04E00]">
            Modalità demo — stai vedendo contenuti di esempio. Carica video reali dal pannello admin.
          </p>
        </div>
      ) : null}

      {/* 1 — In diretta ora */}
      {renderVideoRow(liveRow)}

      {/* 2 — I circuiti (federazioni) */}
      <section className="mx-auto max-w-6xl px-4">
        <RowHeader title={tFed('indexTitle')} href="/federations" viewAll={t('viewAll')} />
        <ScrollRow>
          {federationList.map((f) => (
            <div key={f.id} className="shrink-0 snap-start">
              <FederationCard federation={f} />
            </div>
          ))}
        </ScrollRow>
      </section>

      {/* 3 — Highlights */}
      {renderVideoRow(highlightsRow)}

      {/* 4 — Atleti in evidenza */}
      <section className="mx-auto max-w-6xl px-4">
        <RowHeader title={tA('featuredRow')} href="/athletes" viewAll={t('viewAll')} />
        <ScrollRow>
          {athleteList.map((a) => (
            <div key={a.id} className="shrink-0 snap-start">
              <AthleteCard athlete={a} cardWidth={160} />
            </div>
          ))}
        </ScrollRow>
      </section>

      {/* 5 — Righe per circuito + tipo */}
      {renderVideoRow(fipavRow)}
      {renderVideoRow(aibvcRow)}
      {renderVideoRow(avpRow)}
      {renderVideoRow(bptRow)}
      {renderVideoRow(interviewRow)}
      {renderVideoRow(btsRow)}
    </div>
  );
}
