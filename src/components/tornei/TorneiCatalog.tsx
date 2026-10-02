import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getTournaments } from '@/lib/data';
import { LiveBadge } from '@/components/ui/Badges';
import type { Face } from '@/config/faces';

// Catalogo tornei condiviso dai due volti. Mostra SOLO le edizioni del volto
// richiesto (face), così il menu resta coerente: in OPEN si vedono i tornei
// Open, in PRO quelli Pro. Ogni edizione è un link al dettaglio (partite in
// diretta / in programma / risultati). Tematizzato via variabili CSS del volto.
// Dati SOLO da @/lib/data.
export async function TorneiCatalog({ face }: { face: Face }) {
  const t = await getTranslations('Tournaments');
  const all = await getTournaments();
  const base = face === 'open' ? '/open/tornei' : '/tornei';

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
                  <Link
                    key={e.id}
                    href={`${base}/${e.id}`}
                    className="block rounded-xl border p-5 transition-colors hover:border-[color:var(--face-accent)]"
                    style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {e.liveCount > 0 ? <LiveBadge label={t('liveNow')} /> : null}
                      <span className="rounded bg-[color:var(--face-accent)] px-2 py-0.5 font-barlow text-[10px] font-bold uppercase tracking-wide text-white">
                        {e.face === 'open' ? t('faceOpen') : t('facePro')}
                      </span>
                      {e.registration === 'club' ? (
                        <span
                          className="rounded px-2 py-0.5 font-barlow text-[10px] font-bold uppercase tracking-wide text-[color:var(--face-muted)]"
                          style={{ backgroundColor: 'var(--face-chip)' }}
                        >
                          {t('regClub')}
                        </span>
                      ) : null}
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
                    {/* Riepilogo partite */}
                    <p className="mt-3 font-barlow text-xs text-[color:var(--face-muted)]">
                      {e.liveCount > 0 ? `${e.liveCount} ${t('liveShort')} · ` : ''}
                      {e.scheduledCount > 0 ? `${e.scheduledCount} ${t('scheduledShort')}` : t('viewDetail')}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
