// Card VOD/replay (presentazionale). Nessun fetch dati: riceve tutto via props.
export interface VodCardProps {
  title: string;
  date: string;
  duration: string;
  // Accesso al contenuto: determina il badge PREMIUM / FREE.
  access: 'free' | 'premium';
}

export function VodCard({ title, date, duration, access }: VodCardProps) {
  const isPremium = access === 'premium';

  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-sandr-surface transition-colors hover:border-sandr-orange/50">
      {/* Thumbnail placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-white/10 to-transparent">
        {/* Badge accesso */}
        <span
          className={`absolute left-3 top-3 rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
            isPremium ? 'bg-sandr-orange text-sandr-text' : 'bg-white/10 text-sandr-text'
          }`}
        >
          {isPremium ? 'Premium' : 'Free'}
        </span>
        {/* Badge durata */}
        <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs text-sandr-text">
          {duration}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-condensed text-lg uppercase tracking-wide text-sandr-text">
          {title}
        </h3>
        <p className="mt-1 text-sm text-sandr-muted">{date}</p>
      </div>
    </article>
  );
}
