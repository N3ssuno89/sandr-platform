import { setRequestLocale, getTranslations } from 'next-intl/server';
import { requireStaffPage } from '@/lib/supabase/guard';
import { getSpeakerConsole } from '@/lib/data';

// Console speaker: /speaker/[matchId]. AREA CRITICA (CLAUDE.md): riservata a
// staff/admin. Guard ruolo SERVER-SIDE minimale (requireStaffPage): senza una
// sessione con ruolo admin/staff → redirect al login.
export default async function SpeakerConsolePage({
  params,
}: {
  params: { locale: string; matchId: string };
}) {
  setRequestLocale(params.locale);
  await requireStaffPage(params.locale);
  const t = await getTranslations('Speaker');

  const data = await getSpeakerConsole(params.matchId);
  if (!data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-sandr-text">
        <p className="font-condensed text-lg font-bold uppercase tracking-wide">{t('notFound')}</p>
      </div>
    );
  }

  const field = (label: string, value: string) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-2 last:border-0">
      <span className="text-xs uppercase tracking-wide text-sandr-muted">{label}</span>
      <span className="text-right font-condensed text-sm font-bold uppercase tracking-wide text-sandr-text">{value}</span>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-sandr-text">
      <div className="flex items-center gap-2">
        <h1 className="font-condensed text-3xl font-extrabold uppercase tracking-wide">{t('title')}</h1>
        <span className="rounded bg-sandr-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
          staff
        </span>
      </div>

      {/* Dettagli partita */}
      <section className="mt-8 rounded-xl border border-white/10 bg-sandr-surface p-5">
        <h2 className="font-condensed text-lg font-bold uppercase tracking-wide">{data.title}</h2>
        <div className="mt-3">
          {field(t('edition'), data.editionName || '—')}
          {field(t('court'), data.courtName || '—')}
          {field(t('status'), data.status)}
        </div>
      </section>

      {/* Speaker assegnati */}
      <section className="mt-6">
        <h2 className="mb-3 font-condensed text-xl font-bold uppercase tracking-wide">{t('speakers')}</h2>
        {data.speakers.length === 0 ? (
          <p className="text-sandr-muted">{t('noSpeakers')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.speakers.map((s) => (
              <span key={s.name} className="rounded-full border border-white/15 px-3 py-1 text-sm">
                {s.name} · <span className="text-sandr-muted">{s.location}</span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Diretta collegata */}
      <section className="mt-6 rounded-xl border border-white/10 p-5">
        <h2 className="mb-3 font-condensed text-xl font-bold uppercase tracking-wide">{t('stream')}</h2>
        {data.stream ? (
          <div>
            {field(t('status'), data.stream.status)}
            {field('audio', data.stream.audio)}
          </div>
        ) : (
          <p className="text-sandr-muted">{t('noStream')}</p>
        )}
      </section>

      {/* Controlli (placeholder, non operativi) */}
      <section className="mt-6 rounded-xl border border-white/10 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg border border-white/15 px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wide text-sandr-muted"
          >
            {t('mic')}
          </button>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg border border-white/15 px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wide text-sandr-muted"
          >
            {t('notes')}
          </button>
        </div>
        <p className="mt-3 text-[11px] text-sandr-muted">{t('controlsNote')}</p>
      </section>
    </div>
  );
}
