import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ScrollRow } from '@/components/ui/section-row';
import { AthleteCard } from '@/components/cards/AthleteCard';
import { ReminderButton } from '@/components/sections/ReminderButton';
import { getAthleteById, mockAthletes } from '@/lib/mock-athletes';

export function generateStaticParams() {
  return mockAthletes.map((a) => ({ id: a.id }));
}

export default function AthletePage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Athlete');
  const athlete = getAthleteById(params.id);

  if (!athlete) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#141414] px-4 text-center">
        <p className="font-condensed text-2xl uppercase text-sandr-muted">{t('notFound')}</p>
      </div>
    );
  }

  const statBoxes = [
    { label: t('stats.matches'), value: athlete.stats.matchesPlayed.toString() },
    { label: t('stats.wins'), value: athlete.stats.wins.toString() },
    { label: t('stats.winRate'), value: `${athlete.stats.winRate}%` },
    { label: t('stats.seasonPoints'), value: athlete.stats.seasonPoints.toLocaleString() },
  ];

  const others = mockAthletes.filter((a) => a.id !== athlete.id).slice(0, 4);

  return (
    <div className="bg-[#141414]">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        {/* ===== Hero ===== */}
        <section className="flex flex-col gap-8 md:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={athlete.photo}
            alt={athlete.name}
            className="h-[300px] w-[300px] shrink-0 rounded-xl object-cover"
          />

          <div className="flex-1">
            {athlete.stats.ranking ? (
              <span className="inline-block rounded-full border border-[#F0A800]/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#F0A800]">
                {t('ranking')} #{athlete.stats.ranking}
              </span>
            ) : null}

            <h1 className="mt-3 font-condensed text-5xl font-black uppercase leading-none text-white md:text-6xl">
              {athlete.name}
            </h1>
            <p className="mt-2 text-sm text-[#888888]">
              {athlete.nationFlag} · {athlete.nation}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sandr-text">
                {athlete.sport}
              </span>
              <span className="rounded-full bg-sandr-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
                {athlete.circuit}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-[15px] text-[#C0BDB8]">{athlete.bio}</p>

            {/* Stat boxes */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statBoxes.map((s) => (
                <div key={s.label} className="rounded-lg bg-[#1C1C1C] p-4 text-center">
                  <p className="font-condensed text-[11px] uppercase tracking-wide text-[#888888]">{s.label}</p>
                  <p className="mt-1 font-condensed text-[28px] font-extrabold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Eventi + Match ===== */}
        <section className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Prossimi eventi */}
          <div>
            <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">{t('upcoming')}</h2>
            <ul className="mt-4 space-y-3">
              {athlete.upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#1C1C1C] p-4">
                  <div>
                    <span className="inline-block rounded bg-sandr-orange px-2 py-0.5 text-[11px] font-bold uppercase text-black">
                      {e.date}
                    </span>
                    <p className="mt-2 font-condensed text-[15px] font-bold uppercase tracking-wide text-white">{e.title}</p>
                    <p className="text-[13px] text-[#888888]">
                      {e.circuit} · {e.location}
                    </p>
                  </div>
                  <ReminderButton />
                </li>
              ))}
            </ul>
          </div>

          {/* Match recenti */}
          <div>
            <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">{t('recent')}</h2>
            <ul className="mt-4 space-y-3">
              {athlete.recentMatches.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#1C1C1C] p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        m.result === 'W' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {m.result}
                    </span>
                    <div>
                      <p className="font-condensed text-[15px] font-bold uppercase tracking-wide text-white">{m.title}</p>
                      <p className="text-[13px] text-[#888888]">{m.date}</p>
                    </div>
                  </div>
                  <Link href={`/vod/${m.id}`} className="shrink-0 text-[13px] font-semibold uppercase tracking-wide text-sandr-orange hover:text-sandr-text">
                    {t('watchReplay')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== Altri atleti ===== */}
        <section className="mt-12">
          <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">{t('others')}</h2>
          <ScrollRow>
            {others.map((a) => (
              <div key={a.id} className="mt-4 shrink-0 snap-start">
                <AthleteCard athlete={a} cardWidth={220} />
              </div>
            ))}
          </ScrollRow>
        </section>
      </div>
    </div>
  );
}
