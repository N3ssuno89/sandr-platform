import { Link } from '@/i18n/routing';

// Intestazione di riga: titolo (con pallino live opzionale) + link "vedi tutti".
export function RowHeader({
  title,
  href,
  viewAll,
  live = false,
}: {
  title: string;
  href: string;
  viewAll: string;
  live?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-3 font-condensed text-2xl font-bold uppercase tracking-wide text-sandr-text">
        {live ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
        ) : null}
        {title}
      </h2>
      <Link
        href={href}
        className="shrink-0 font-condensed text-sm uppercase tracking-wide text-[#F04E00] hover:text-sandr-text"
      >
        {viewAll} →
      </Link>
    </div>
  );
}

// Riga a scroll orizzontale con snap. Scrollbar nascosta (.no-scrollbar).
export function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
      {children}
    </div>
  );
}
