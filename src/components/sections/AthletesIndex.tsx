'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AthleteCard } from '@/components/cards/AthleteCard';
import { mockAthletes } from '@/lib/mock-athletes';

const SPORTS = ['all', 'Beach Volley', 'Beach Tennis', 'Padel'] as const;
type SportFilter = (typeof SPORTS)[number];

export function AthletesIndex() {
  const t = useTranslations('Athlete');
  const [sport, setSport] = useState<SportFilter>('all');

  const list = sport === 'all' ? mockAthletes : mockAthletes.filter((a) => a.sport === sport);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-condensed text-4xl font-extrabold uppercase text-white">{t('featuredLabel')}</h1>

      {/* Filtri per sport */}
      <div className="mt-6 flex flex-wrap gap-2">
        {SPORTS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSport(s)}
            className={`rounded-full px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wide transition-colors ${
              sport === s
                ? 'bg-sandr-orange text-black'
                : 'border border-white/15 text-sandr-muted hover:text-white'
            }`}
          >
            {s === 'all' ? t('filterAll') : s}
          </button>
        ))}
      </div>

      {/* Griglia atleti */}
      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {list.map((a) => (
          <AthleteCard key={a.id} athlete={a} />
        ))}
      </div>
    </div>
  );
}
