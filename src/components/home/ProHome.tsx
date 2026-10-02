import { getTranslations } from 'next-intl/server';
import { getLiveCards, getInterviewCards, getNextEvent } from '@/lib/data';
import { LiveRow, InterviewRow, EmptyLive } from '@/components/home/HomeSections';

// Home PRO (utenti loggati). Tema scuro (chrome globale). Dati SOLO da @/lib/data.
export async function ProHome() {
  const t = await getTranslations('Homes');
  const [live, interviews, nextEvent] = await Promise.all([
    getLiveCards('pro'),
    getInterviewCards(),
    getNextEvent(),
  ]);

  return (
    <div className="mx-auto max-w-[1360px] space-y-12 px-4 py-10 md:px-10">
      <h1 className="font-display text-4xl uppercase tracking-tight">{t('proTitle')}</h1>

      {live.length > 0 ? (
        <LiveRow title={t('liveNow')} items={live} />
      ) : (
        <section>
          <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{t('liveNow')}</h2>
          <EmptyLive nextEvent={nextEvent} />
        </section>
      )}

      {interviews.length > 0 ? (
        <InterviewRow title={t('interviews')} items={interviews} />
      ) : (
        <section>
          <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{t('interviews')}</h2>
          <div className="rounded-xl border border-[color:var(--face-border)] p-8 text-center text-[color:var(--face-muted)]">{t('noInterviews')}</div>
        </section>
      )}
    </div>
  );
}
