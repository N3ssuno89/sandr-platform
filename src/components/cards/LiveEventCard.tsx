'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Card evento live (presentazionale). Nessun fetch dati: riceve tutto via props.
export interface LiveEventCardProps {
  title: string;
  teamA: string;
  teamB: string;
  sport: string;
  // Mantenuti per compatibilità con i parent, non più mostrati (vedi task).
  viewers?: number;
  viewersLabel?: string;
  // Se presente, l'intera card naviga a questo URL (player live).
  href?: string;
  ctaLabel?: string;
  // Larghezza fissa della card (px). Default 220.
  cardWidth?: number;
}

export function LiveEventCard({ title, teamA, teamB, sport, href, ctaLabel, cardWidth }: LiveEventCardProps) {
  const t = useTranslations('Athlete');
  const [reminderOn, setReminderOn] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const toggleReminder = () => {
    setReminderOn((v) => !v);
    if (!reminderOn) {
      setTooltip(true);
      setTimeout(() => setTooltip(false), 2000);
    }
  };

  const cardClass =
    'group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-sandr-surface transition-colors hover:border-sandr-orange/50';

  const body = (
    <>
      {/* Thumbnail 16:9 (paddingBottom 56.25% su contenitore relative) */}
      <div className="relative w-full bg-gradient-to-br from-white/10 to-transparent" style={{ paddingBottom: '56.25%' }}>
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sandr-text">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Live
        </span>
      </div>

      {/* Altezza costante: sport (1 riga), titolo MAX 2 righe con min-height,
          squadre 1 riga (line-clamp) → tutte le card della riga uguali (BUG 4). */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-sandr-orange">{sport}</span>
        <h3 className="mt-1 line-clamp-2 min-h-[2.8rem] font-condensed text-lg uppercase leading-tight tracking-wide text-sandr-text">
          {title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-sandr-muted">
          <span className="text-sandr-text">{teamA}</span> vs{' '}
          <span className="text-sandr-text">{teamB}</span>
        </p>
        {ctaLabel ? (
          <span className="mt-auto block rounded bg-sandr-orange px-4 py-2 text-center font-condensed font-semibold uppercase tracking-wide text-sandr-text">
            {ctaLabel}
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="relative h-full" style={{ width: cardWidth ?? 220 }}>
      {href ? (
        <Link href={href} className={cardClass}>
          {body}
        </Link>
      ) : (
        <div className={cardClass}>{body}</div>
      )}

      {/* Pulsante reminder: overlay (fuori dal Link, così non naviga) */}
      <button
        type="button"
        aria-label="Reminder"
        aria-pressed={reminderOn}
        onClick={toggleReminder}
        className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 font-condensed text-[11px] font-bold ${
          reminderOn ? 'border border-sandr-orange text-sandr-orange' : 'border border-white/[0.15] text-white'
        }`}
      >
        R
      </button>
      <span
        className={`pointer-events-none absolute right-3 top-11 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white transition-opacity duration-500 ${
          tooltip ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {t('reminderSet')}
      </span>
    </div>
  );
}
