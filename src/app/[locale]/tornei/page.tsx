import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getTournaments } from '@/lib/data';

// Catalogo tornei (volto PRO). Federazione → circuito → edizioni. Dati SOLO da
// @/lib/data. Slug fisso /tornei (localizzazione path rimandata a PR dedicata).
export default async function TorneiPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Tournaments');
  const groups = await getTournaments();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-sandr-text">
      <h1 className="font-condensed text-3xl font-extrabold uppercase tracking-wide">{t('title')}</h1>

      {groups.length === 0 ? (
        <p className="mt-6 text-sandr-muted">{t('empty')}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((g) => (
            <section key={g.circuitId}>
              <div className="mb-4 flex items-baseline gap-2">
                <h2 className="font-condensed text-xl font-bold uppercase tracking-wide">{g.circuitName}</h2>
                {g.federation ? <span className="text-xs uppercase tracking-wide text-sandr-muted">{g.federation}</span> : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.editions.map((e) => (
                  <div key={e.id} className="rounded-xl border border-white/10 bg-sandr-surface p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          e.face === 'open' ? 'bg-white/10 text-sandr-text' : 'bg-sandr-orange text-black'
                        }`}
                      >
                        {e.face === 'open' ? t('faceOpen') : t('facePro')}
                      </span>
                      {e.resultsOnly ? (
                        <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sandr-muted">
                          {t('resultsOnly')}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 font-condensed text-lg font-bold uppercase tracking-wide">{e.name}</h3>
                    <p className="mt-1 text-sm text-sandr-muted">{e.dates}</p>
                    {e.location ? <p className="text-sm text-sandr-muted">{e.location}</p> : null}
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
