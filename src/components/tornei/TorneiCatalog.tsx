import { getTranslations } from 'next-intl/server';
import { getTournaments } from '@/lib/data';
import type { Face } from '@/config/faces';

// Catalogo tornei condiviso dai due volti. Mostra SOLO le edizioni del volto
// richiesto (face), così il menu resta coerente: in OPEN si vedono i tornei
// Open, in PRO quelli Pro. Tematizzato via variabili CSS del volto (--face-*),
// quindi rende correttamente sia su sfondo scuro (PRO) che chiaro (OPEN).
// Dati SOLO da @/lib/data.
export async function TorneiCatalog({ face }: { face: Face }) {
  const t = await getTranslations('Tournaments');
  const all = await getTournaments();

  // Tieni solo le edizioni del volto corrente; scarta i circuiti rimasti vuoti.
  const groups = all
    .map((g) => ({ ...g, editions: g.editions.filter((e) => e.face === face) }))
    .filter((g) => g.editions.length > 0);

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 md:px-10">
      <h1 className="font-display text-4xl uppercase tracking-tight">{t('title')}</h1>

      {groups.length === 0 ? (
        <p className="mt-6 font-barlow text-[color:var(--face-muted)]">{t('empty')}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((g) => (
            <section key={g.circuitId}>
              <div className="mb-4 flex items-baseline gap-2">
                <h2 className="font-narrow text-[26px] font-bold uppercase tracking-wide">{g.circuitName}</h2>
                {g.federation ? (
                  <span className="font-barlow text-xs uppercase tracking-wide text-[color:var(--face-muted)]">
                    {g.federation}
                  </span>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.editions.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl border p-5"
                    style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-[color:var(--face-accent)] px-2 py-0.5 font-barlow text-[10px] font-bold uppercase tracking-wide text-white">
                        {e.face === 'open' ? t('faceOpen') : t('facePro')}
                      </span>
                      {e.resultsOnly ? (
                        <span
                          className="rounded px-2 py-0.5 font-barlow text-[10px] font-bold uppercase tracking-wide text-[color:var(--face-muted)]"
                          style={{ backgroundColor: 'var(--face-chip)' }}
                        >
                          {t('resultsOnly')}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 font-narrow text-lg font-bold uppercase tracking-wide">{e.name}</h3>
                    <p className="mt-1 font-barlow text-sm text-[color:var(--face-muted)]">{e.dates}</p>
                    {e.location ? (
                      <p className="font-barlow text-sm text-[color:var(--face-muted)]">{e.location}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
