// Card evento live (presentazionale). Nessun fetch dati: riceve tutto via props.
export interface LiveEventCardProps {
  title: string;
  teamA: string;
  teamB: string;
  sport: string;
  viewers: number;
  // Etichetta tradotta passata dal parent (es. "spettatori" / "watching").
  viewersLabel?: string;
}

export function LiveEventCard({
  title,
  teamA,
  teamB,
  sport,
  viewers,
  viewersLabel = 'watching',
}: LiveEventCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-sandr-surface transition-colors hover:border-sandr-orange/50">
      {/* Thumbnail placeholder dello sport */}
      <div className="relative aspect-video bg-gradient-to-br from-white/10 to-transparent">
        {/* Badge LIVE con pallino rosso pulsante */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sandr-text">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Live
        </span>
        <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs text-sandr-muted">
          {sport}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-condensed text-lg uppercase tracking-wide text-sandr-text">
          {title}
        </h3>
        <p className="mt-1 text-sm text-sandr-muted">
          <span className="text-sandr-text">{teamA}</span> vs{' '}
          <span className="text-sandr-text">{teamB}</span>
        </p>
        <p className="mt-3 flex items-center gap-2 text-xs text-sandr-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-sandr-orange" />
          {viewers.toLocaleString()} {viewersLabel}
        </p>
      </div>
    </article>
  );
}
