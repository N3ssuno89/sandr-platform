'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { VodCard } from '@/components/cards/VodCard';

// Dati placeholder: nessun fetch reale. Da sostituire con query Supabase.
const replays = [
  { id: '1', title: 'BPT Challenge — Final', date: '12 Jun 2026', duration: '1:42:10', access: 'premium' as const, sportType: 'beach-volley', recent: true },
  { id: '2', title: 'King & Queen — Highlights', date: '08 Jun 2026', duration: '0:14:32', access: 'free' as const, sportType: 'beach-volley', recent: true },
  { id: '3', title: 'Campionato Italiano — Day 2', date: '01 Jun 2026', duration: '2:05:48', access: 'premium' as const, sportType: 'beach-volley', recent: false },
  { id: '4', title: 'SANDR Beach Tennis Open — Final', date: '28 May 2026', duration: '1:12:05', access: 'premium' as const, sportType: 'beach-tennis', recent: false },
  { id: '5', title: 'Marathon — Semifinal', date: '25 May 2026', duration: '1:18:22', access: 'free' as const, sportType: 'beach-volley', recent: false },
  { id: '6', title: 'Padel Pro — Final', date: '20 May 2026', duration: '1:33:40', access: 'premium' as const, sportType: 'padel', recent: false },
];

const filters = ['all', 'recent', 'beach-volley', 'beach-tennis', 'by-circuit'] as const;
type Filter = (typeof filters)[number];

// Card in evidenza (match recente, badge PREMIUM).
const featured = replays.find((r) => r.recent && r.access === 'premium') ?? replays[0];

export function VodBoard() {
  const t = useTranslations('Vod');
  const tc = useTranslations('Common');
  const [active, setActive] = useState<Filter>('all');

  // Filtri funzionanti su sport e recenti; "per circuito" è placeholder (mostra tutto).
  const visible = replays.filter((r) => {
    if (r.id === featured.id) return false;
    if (active === 'all' || active === 'by-circuit') return true;
    if (active === 'recent') return r.recent;
    return r.sportType === active;
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl uppercase text-sandr-text md:text-4xl">{t('title')}</h1>

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

      {/* Card in evidenza */}
      <article className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-sandr-surface">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video bg-gradient-to-br from-white/10 to-transparent">
            <span className="absolute left-3 top-3 rounded bg-sandr-orange px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sandr-text">
              Premium
            </span>
            <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs text-sandr-text">
              {featured.duration}
            </span>
          </div>
          <div className="flex flex-col justify-center p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-sandr-orange">
              {t('featured')}
            </span>
            <h2 className="mt-2 font-condensed text-2xl uppercase tracking-wide text-sandr-text">
              {featured.title}
            </h2>
            <p className="mt-1 text-sm text-sandr-muted">{featured.date}</p>
            <Link
              href={`/vod/${featured.id}`}
              className="mt-6 inline-block self-start rounded bg-sandr-orange px-6 py-2 font-condensed font-semibold uppercase tracking-wide text-sandr-text"
            >
              {tc('watch')}
            </Link>
          </div>
        </div>
      </article>

      {/* Griglia: 1 col mobile, 2 tablet, 3 desktop */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((v) => (
          <VodCard key={v.id} title={v.title} date={v.date} duration={v.duration} access={v.access} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sandr-muted">{t('empty')}</p>
      ) : null}
    </section>
  );
}
