import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getTournamentDetail, type TournamentMatchVM } from '@/lib/data';
import { LiveBadge } from '@/components/ui/Badges';
import { ScoreSets } from '@/components/ui/ScoreSets';

// Dettaglio torneo (edizione): anagrafica + partite raggruppate per stato
// (in diretta / in programma / risultati). Tematizzato via variabili CSS del
// volto. Dati SOLO da @/lib/data.
export async function TournamentDetail({ editionId }: { editionId: string }) {
  const t = await getTranslations('Tournaments');
  const d = await getTournamentDetail(editionId);
  if (!d) notFound();

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 md:px-10">
      {/* Link indietro al catalogo */}
      <Link
        href={d.face === 'open' ? '/open/tornei' : '/tornei'}
        className="inline-flex items-center gap-1 font-barlow text-sm text-[color:var(--face-muted)] transition-colors hover:text-[color:var(--face-fg)]"
      >
        <span aria-hidden>‹</span> {t('backToList')}
      </Link>

      {/* Intestazione */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {d.live.length > 0 ? <LiveBadge label={t('liveNow')} /> : null}
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
              className="grid grid-cols-[1fr_auto] items-center gap-3 border-b px-4 py-3 last:border-0 sm:grid-cols-[1fr_auto_1fr]"
              style={{ borderColor: 'var(--face-border)' }}
            >
              {/* Team A */}
              <p className="truncate text-right font-barlow text-sm font-semibold sm:text-right">{m.teamA}</p>
              {/* Centro: punteggio / vs / live */}
              <div className="flex min-w-[6rem] flex-col items-center justify-center">
                {live ? (
                  <LiveBadge label={t('liveNow')} small />
                ) : m.score ? (
                  <ScoreSets score={m.score} />
                ) : (
                  <span className="font-barlow text-xs font-bold uppercase text-[color:var(--face-muted)]">vs</span>
                )}
                <span className="mt-1 font-barlow text-[11px] text-[color:var(--face-muted)]">
                  {m.courtName}
                  {m.time ? ` · ${m.time}` : ''}
                </span>
              </div>
              {/* Team B (sotto su mobile) */}
              <p className="col-span-2 truncate font-barlow text-sm font-semibold sm:col-span-1 sm:text-left">{m.teamB}</p>
            </div>
          );
          // Le partite in diretta linkano al player (/live/[matchId]); il gating
          // è applicato server-side nella pagina diretta.
          return live ? (
            <Link key={m.id} href={`/live/${m.id}`} className="block transition-colors hover:bg-[color:var(--face-chip)]">
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
