import { Link } from '@/i18n/routing';

// Card evento live (presentazionale). Nessun fetch dati: riceve tutto via props.
export interface LiveEventCardProps {
  title: string;
  teamA: string;
  teamB: string;
  sport: string;
  viewers: number;
  // Etichetta tradotta passata dal parent (es. "spettatori" / "watching").
  viewersLabel?: string;
  // Se presenti, mostra una CTA che porta allo stream.
  href?: string;
  ctaLabel?: string;
  // Larghezza fissa della card (px). Default 220.
  cardWidth?: number;
}

export function LiveEventCard({
  title,
  teamA,
  teamB,
  sport,
  viewers,
  viewersLabel = 'watching',
  href,
  ctaLabel,
  cardWidth,
}: LiveEventCardProps) {
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-sandr-surface transition-colors hover:border-sandr-orange/50"
      style={{ width: cardWidth ?? 220 }}
    >
      {/* Thumbnail 16:9 (paddingBottom 56.25% su contenitore relative) */}
      <div className="relative w-full bg-gradient-to-br from-white/10 to-transparent" style={{ paddingBottom: '56.25%' }}>
        {/* Badge LIVE con pallino rosso pulsante */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sandr-text">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Live
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Tipo di sport */}
        <span className="text-xs font-semibold uppercase tracking-wide text-sandr-orange">
          {sport}
        </span>
        <h3 className="mt-1 font-condensed text-lg uppercase tracking-wide text-sandr-text">
          {title}
        </h3>
        <p className="mt-1 text-sm text-sandr-muted">
          <span className="text-sandr-text">{teamA}</span> vs{' '}
          <span className="text-sandr-text">{teamB}</span>
        </p>

        <div className="mt-auto pt-4">
          <p className="flex items-center gap-2 text-xs text-sandr-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-sandr-orange" />
            {viewers.toLocaleString()} {viewersLabel}
          </p>
          {href && ctaLabel ? (
            <Link
              href={href}
              className="mt-3 block rounded bg-sandr-orange px-4 py-2 text-center font-condensed font-semibold uppercase tracking-wide text-sandr-text"
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
