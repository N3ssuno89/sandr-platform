'use client';

import { useState } from 'react';

// Card VOD/replay (presentazionale). Nessun fetch dati: riceve tutto via props.
export interface VodCardProps {
  title: string;
  date: string;
  duration: string;
  // Accesso al contenuto: determina il badge FREE / PREMIUM / PPV.
  access: 'free' | 'premium' | 'ppv';
  // Avanzamento di visione 0..1: se presente mostra la barra "continua a guardare".
  progress?: number;
  // Larghezza fissa della card (px). Default 220.
  cardWidth?: number;
  // Thumbnail reale (es. Cloudflare Stream). Se assente: placeholder scuro.
  thumbnailUrl?: string;
  // Dato di esempio (mock fallback): mostra una pill "MOCK".
  isMock?: boolean;
}

// Badge accesso: FREE verde, PREMIUM arancione SANDR, PPV oro. Sempre visibile
// così l'utente conosce il livello prima di cliccare (TASK 4b).
const ACCESS_BADGE: Record<VodCardProps['access'], { label: string; cls: string }> = {
  free: { label: 'Free', cls: 'bg-emerald-500/90 text-black' },
  premium: { label: 'Premium', cls: 'bg-sandr-orange text-black' },
  ppv: { label: 'PPV', cls: 'bg-[#F0A800] text-black' },
};

export function VodCard({ title, date, duration, access, progress, cardWidth, thumbnailUrl, isMock }: VodCardProps) {
  const badge = ACCESS_BADGE[access] ?? ACCESS_BADGE.free;
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  // Mostra la thumbnail solo se disponibile e non in errore; altrimenti
  // resta il placeholder scuro del contenitore.
  const showThumb = !!thumbnailUrl && !errored;

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-sandr-surface transition-colors hover:border-sandr-orange/50"
      style={{ width: cardWidth ?? 220 }}
    >
      {/* Thumbnail 16:9 (paddingBottom 56.25% su contenitore relative) */}
      <div className="relative w-full bg-gradient-to-br from-white/10 to-transparent" style={{ paddingBottom: '56.25%' }}>
        {/* Thumbnail reale: fade-in al load, fallback silenzioso su errore */}
        {showThumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            style={{ opacity: loaded ? 1 : 0 }}
          />
        ) : null}
        {/* Pill MOCK (dati di esempio) in alto a sinistra */}
        {isMock ? (
          <span className="absolute left-3 top-3 rounded bg-[#F04E00]/90 px-2 py-0.5 font-condensed text-[9px] font-bold uppercase text-black">
            Mock
          </span>
        ) : null}
        {/* Badge accesso (scende sotto la pill MOCK quando presente) */}
        <span
          className={`absolute left-3 rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
            isMock ? 'top-10' : 'top-3'
          } ${badge.cls}`}
        >
          {badge.label}
        </span>
        {/* Badge durata */}
        <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs text-sandr-text">
          {duration}
        </span>
        {/* Barra di avanzamento (continua a guardare) */}
        {typeof progress === 'number' ? (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
            <div
              className="h-full bg-[#F04E00]"
              style={{ width: `${Math.round(Math.min(Math.max(progress, 0), 1) * 100)}%` }}
            />
          </div>
        ) : null}
      </div>

      {/* Area contenuto ad altezza costante: titolo su MAX 2 righe (line-clamp)
          con altezza minima riservata, così card con titoli corti/lunghi nella
          stessa riga restano della stessa altezza (BUG 4). */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.8rem] font-condensed text-lg uppercase leading-tight tracking-wide text-sandr-text">
          {title}
        </h3>
        <p className="mt-1 text-sm text-sandr-muted">{date}</p>
      </div>
    </article>
  );
}
