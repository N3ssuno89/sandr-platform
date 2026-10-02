import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getLivePlayable, getRelatedLive } from '@/lib/data';
import { StreamPlayer } from '@/components/player/StreamPlayer';

// Pagina diretta completa: /live/[matchId] (id = video reale del catalogo).
// Il gating è applicato SERVER-SIDE in getLivePlayable (l'uid arriva al client
// solo se l'accesso è consentito). Punteggio live e chat sono placeholder
// "in arrivo": dipendono da Supabase Realtime (AREA CRITICA, CLAUDE.md) che
// richiede review umana prima di essere collegato.
export default async function LivePlayerPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Homes');
  const tl = await getTranslations('Live');
  const [live, related] = await Promise.all([
    getLivePlayable(params.id),
    getRelatedLive(params.id, 'pro'),
  ]);

  // Stato non disponibile (video inesistente o accesso non consentito).
  if (!live || !live.cloudflareUid) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-10">
        <div className="rounded-2xl border border-[color:var(--face-border)] p-10 text-center">
          <p className="font-narrow text-lg font-bold uppercase tracking-wide">{t('notAvailable')}</p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-[10px] bg-[color:var(--face-accent)] px-6 py-3 font-barlow font-bold uppercase tracking-wide text-white"
          >
            {t('signInToWatch')}
          </Link>
        </div>
      </div>
    );
  }

  const accessLabel =
    live.access === 'premium' ? tl('premium') : live.access === 'ppv' ? tl('ppv') : tl('free');

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8 md:px-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Colonna principale: player + info partita */}
        <div>
          {/* Badge */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {t('liveBadge')}
            </span>
            <span className="rounded bg-[color:var(--face-accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {accessLabel}
            </span>
            {live.demo ? (
              <span
                className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--face-muted)]"
                style={{ backgroundColor: 'var(--face-chip)' }}
              >
                {t('demoData')}
              </span>
            ) : null}
          </div>

          <StreamPlayer videoId={live.cloudflareUid} title={live.title} autoplay />

          {/* Titolo + contesto */}
          <h1 className="mt-4 font-display text-3xl uppercase tracking-tight">{live.title}</h1>
          {live.subtitle ? (
            <p className="mt-1 font-barlow text-[color:var(--face-muted2)]">{live.subtitle}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {live.circuit ? (
              <span
                className="rounded-full px-3 py-1 font-barlow text-xs font-bold uppercase tracking-wide"
                style={{ backgroundColor: 'var(--face-chip)' }}
              >
                {live.circuit}
              </span>
            ) : null}
            {live.sport ? (
              <span
                className="rounded-full px-3 py-1 font-barlow text-xs font-bold uppercase tracking-wide"
                style={{ backgroundColor: 'var(--face-chip)' }}
              >
                {live.sport}
              </span>
            ) : null}
            {live.event ? (
              <span
                className="rounded-full px-3 py-1 font-barlow text-xs font-bold uppercase tracking-wide"
                style={{ backgroundColor: 'var(--face-chip)' }}
              >
                {live.event}
              </span>
            ) : null}
          </div>
        </div>

        {/* Sidebar: punteggio + chat (placeholder realtime) */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-[color:var(--face-border)] p-5">
            <h2 className="font-narrow text-lg font-bold uppercase tracking-wide">{tl('scorePanel')}</h2>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="flex h-14 flex-1 flex-col items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--face-chip)' }}
                >
                  <span className="font-barlow text-[10px] uppercase tracking-wide text-[color:var(--face-muted)]">
                    {tl('set')} {s}
                  </span>
                  <span className="font-display text-lg">—</span>
                </div>
              ))}
            </div>
            <p className="mt-3 font-barlow text-xs text-[color:var(--face-muted)]">{tl('scoreSoon')}</p>
          </section>

          <section className="rounded-2xl border border-[color:var(--face-border)] p-5">
            <h2 className="font-narrow text-lg font-bold uppercase tracking-wide">{tl('chat')}</h2>
            <p className="mt-2 font-barlow text-xs text-[color:var(--face-muted)]">{tl('chatSoon')}</p>
          </section>
        </aside>
      </div>

      {/* Altre dirette */}
      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{tl('otherLive')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/live/${r.id}`}
                className="group overflow-hidden rounded-xl border border-[color:var(--face-border)]"
                style={{ backgroundColor: 'var(--face-surface)' }}
              >
                <div
                  className="relative aspect-video"
                  style={{ backgroundColor: 'var(--face-img)' }}
                >
                  {r.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.thumbnail} alt="" className="h-full w-full object-cover" />
                  ) : null}
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                    <span className="h-1 w-1 rounded-full bg-white" />
                    {t('liveBadge')}
                  </span>
                </div>
                <div className="p-3">
                  <p className="truncate font-barlow text-sm font-semibold">{r.title ?? tl('liveGeneric')}</p>
                  {r.subtitle ? (
                    <p className="truncate font-barlow text-xs text-[color:var(--face-muted)]">{r.subtitle}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
