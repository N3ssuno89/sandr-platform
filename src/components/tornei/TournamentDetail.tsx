import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getTournamentDetail, type TournamentMatchVM } from '@/lib/data';

// Dettaglio torneo (edizione): anagrafica + partite raggruppate per stato
// (in diretta / in programma / risultati). Tematizzato via variabili CSS del
// volto. Dati SOLO da @/lib/data.
export async function TournamentDetail({ editionId }: { editionId: string }) {
  const t = await getTranslations('Tournaments');
  const d = await getTournamentDetail(editionId);
  if (!d) notFound();

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 md:px-10">
      {/* Intestazione */}
      <div className="flex flex-wrap items-center gap-2">
        {d.live.length > 0 ? (
          <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 font-barlow text-[10px] font-bold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {t('liveNow')}
          </span>
        ) : null}
        <span className="rounded bg-[color:var(--face-accent)] px-2 py-0.5 font-barlow text-[10px] font-bold uppercase tracking-wide text-white">
          {d.face === 'open' ? t('faceOpen') : t('facePro')}
        </span>
      </div>
      <h1 className="mt-3 font-display text-4xl uppercase tracking-tight">{d.name}</h1>
      <p className="mt-1 font-barlow text-[color:var(--face-muted)]">
        {d.circuitName}
        {d.federation ? ` · ${d.federation}` : ''}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-barlow text-sm text-[color:var(--face-muted)]">
        <span>{d.dates}</span>
        {d.location ? <span>{d.location}</span> : null}
        <span>
          {t('registrationLabel')}: {d.registration === 'club' ? t('regClubFull') : t('regIndividualFull')}
        </span>
      </div>

      {/* Sezioni partite */}
      <div className="mt-10 space-y-10">
        {d.live.length > 0 ? (
          <MatchSection title={t('detailLive')} matches={d.live} t={t} live />
        ) : null}
        {d.scheduled.length > 0 ? (
          <MatchSection title={t('detailScheduled')} matches={d.scheduled} t={t} />
        ) : null}
        {d.results.length > 0 ? (
          <MatchSection title={t('detailResults')} matches={d.results} t={t} />
        ) : null}
        {d.live.length + d.scheduled.length + d.results.length === 0 ? (
          <p className="font-barlow text-[color:var(--face-muted)]">{t('noMatchesDetail')}</p>
        ) : null}
      </div>
    </div>
  );
}

function MatchSection({
  title,
  matches,
  t,
  live = false,
}: {
  title: string;
  matches: TournamentMatchVM[];
  t: Awaited<ReturnType<typeof getTranslations>>;
  live?: boolean;
}) {
  return (
    <section>
      <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{title}</h2>
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--face-border)' }}>
        {matches.map((m) => {
          const row = (
            <div
              className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-0"
              style={{ borderColor: 'var(--face-border)' }}
            >
              <div className="min-w-0">
                <p className="truncate font-barlow text-sm font-semibold">{m.title}</p>
                <p className="truncate font-barlow text-xs text-[color:var(--face-muted)]">
                  {m.courtName}
                  {m.time ? ` · ${m.time}` : ''}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {live ? (
                  <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 font-barlow text-[10px] font-bold uppercase tracking-wide text-white">
                    <span className="h-1 w-1 rounded-full bg-white" />
                    {t('liveNow')}
                  </span>
                ) : m.score ? (
                  <span className="font-barlow text-sm font-semibold">{m.score}</span>
                ) : null}
              </div>
            </div>
          );
          // Le partite in diretta linkano al player (/live/[matchId]); il gating
          // è applicato server-side nella pagina diretta.
          return live ? (
            <Link key={m.id} href={`/live/${m.id}`} className="block hover:bg-[color:var(--face-chip)]">
              {row}
            </Link>
          ) : (
            <div key={m.id}>{row}</div>
          );
        })}
      </div>
    </section>
  );
}
