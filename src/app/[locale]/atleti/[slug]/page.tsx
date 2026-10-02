import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getAthleteProfile } from '@/lib/data';
import { PhotoFill } from '@/components/ui/PhotoFill';

// Profilo atleta (volto PRO). Slug fisso /atleti/[slug] (slug = id atleta per ora).
// Dati SOLO da @/lib/data.
export default async function AtletaPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Athlete');
  const profile = await getAthleteProfile(params.slug);
  if (!profile) notFound();
  const { athlete, currentPairName, matches } = profile;

  const meta = [
    athlete.nation,
    athlete.ranking != null ? `${t('worldRanking')} #${athlete.ranking}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-sandr-text">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-white/10">
          <PhotoFill src={athlete.photoUrl} name={athlete.fullName} />
        </div>
        <div>
          <h1 className="font-condensed text-3xl font-extrabold uppercase tracking-wide">{athlete.fullName}</h1>
          {meta ? <p className="mt-1 text-sandr-muted">{meta}</p> : null}
          {currentPairName ? (
            <p className="mt-1 text-sm text-sandr-muted">
              {t('currentPair')}: <span className="text-sandr-text">{currentPairName}</span>
            </p>
          ) : null}
        </div>
      </div>

      {/* Match recenti */}
      <section className="mt-10">
        <h2 className="mb-4 font-condensed text-xl font-bold uppercase tracking-wide">{t('recent')}</h2>
        {matches.length === 0 ? (
          <p className="text-sandr-muted">{t('noMatches')}</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {matches.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-condensed text-sm font-bold uppercase tracking-wide">{m.opponent}</p>
                  <p className="truncate text-xs text-sandr-muted">
                    {m.editionName}
                    {m.date ? ` · ${m.date}` : ''}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {m.won != null ? (
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        m.won ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-sandr-muted'
                      }`}
                    >
                      {m.won ? t('won') : t('lost')}
                    </span>
                  ) : (
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sandr-muted">
                      {m.status}
                    </span>
                  )}
                  {m.score ? <p className="mt-1 text-xs text-sandr-muted">{m.score}</p> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
