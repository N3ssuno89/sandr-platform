// Skeleton di caricamento per le pagine a griglia (tornei, ricerca). Usa la
// classe .skeleton (shimmer) e i token del volto, così si adatta a PRO/OPEN.
export function CatalogSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 md:px-10">
      <div className="skeleton h-10 w-56 rounded-lg" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-5"
            style={{ borderColor: 'var(--face-border)' }}
          >
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton mt-3 h-6 w-3/4 rounded" />
            <div className="skeleton mt-2 h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
