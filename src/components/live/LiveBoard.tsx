'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LiveEventCard } from '@/components/cards/LiveEventCard';

// Dati placeholder: nessun fetch reale. Da sostituire con query Supabase.
const events = [
  { id: '1', title: 'BPT Elite — Quarterfinal', teamA: 'Mol / Sørum', teamB: 'Plavins / Tocs', sport: 'Beach Volley', sportType: 'beach-volley', viewers: 12840 },
  { id: '2', title: 'AIBVC Tour — Semifinal', teamA: 'Carambula / Cottafava', teamB: 'Åhman / Hellvig', sport: 'Beach Volley', sportType: 'beach-volley', viewers: 8210 },
  { id: '3', title: 'SANDR Beach Tennis Open', teamA: 'Gori / Cattaneo', teamB: 'Benede / Ramos', sport: 'Beach Tennis', sportType: 'beach-tennis', viewers: 3120 },
  { id: '4', title: 'Padel Pro — Round 2', teamA: 'Galán / Chingotto', teamB: 'Tapia / Coello', sport: 'Padel', sportType: 'padel', viewers: 9450 },
];

const filters = ['all', 'beach-volley', 'beach-tennis', 'padel'] as const;
type Filter = (typeof filters)[number];

export function LiveBoard() {
  const t = useTranslations('Live');
  const tc = useTranslations('Common');
  const [active, setActive] = useState<Filter>('all');

  const visible = active === 'all' ? events : events.filter((e) => e.sportType === active);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* Header con conteggio stream attivi */}
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl uppercase text-sandr-text md:text-4xl">{t('title')}</h1>
        <span className="rounded-full bg-sandr-orange/15 px-3 py-1 text-sm font-semibold text-sandr-orange">
          {events.length}
        </span>
      </header>

      {/* Barra filtri a pillole */}
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={`rounded-full px-4 py-2 font-condensed text-sm uppercase tracking-wide transition-colors ${
              active === f
                ? 'bg-sandr-orange text-sandr-text'
                : 'border border-white/15 text-sandr-muted hover:text-sandr-text'
            }`}
          >
            {t(`filters.${f}`)}
          </button>
        ))}
      </div>

      {/* Griglia: 1 colonna su mobile, 2 su desktop */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {visible.map((e) => (
          <LiveEventCard
            key={e.id}
            title={e.title}
            teamA={e.teamA}
            teamB={e.teamB}
            sport={e.sport}
            viewers={e.viewers}
            viewersLabel={t('watching')}
            href={`/live/${e.id}`}
            ctaLabel={tc('watch')}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sandr-muted">{t('empty')}</p>
      ) : null}
    </section>
  );
}
