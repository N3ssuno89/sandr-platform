import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { InterviewCardVM, LiveCardVM, NextEventVM } from '@/lib/data';

// Componenti presentazionali delle home. Ricevono i view-model da @/lib/data.
// `light` adatta bordi/testo al tema del volto (OPEN chiaro, PRO scuro).

// Badge "Dati dimostrativi" sui contenuti di prova.
export function DemoBadge() {
  const t = useTranslations('Homes');
  return (
    <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
      {t('demoData')}
    </span>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      <LiveLabel />
    </span>
  );
}

function LiveLabel() {
  const t = useTranslations('Homes');
  return <>{t('liveBadge')}</>;
}

// Riga orizzontale di dirette.
export function LiveRow({
  title,
  items,
  light = false,
}: {
  title: string;
  items: LiveCardVM[];
  light?: boolean;
}) {
  const t = useTranslations('Homes');
  const border = light ? 'border-black/10' : 'border-white/10';
  const muted = light ? 'text-black/60' : 'text-white/60';

  return (
    <section>
      <h2 className="mb-4 font-condensed text-xl font-bold uppercase tracking-wide text-current">{title}</h2>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {items.map((c) => (
          <Link
            key={c.id}
            href={`/live/${c.id}`}
            className={`group block w-[260px] shrink-0 snap-start overflow-hidden rounded-xl border ${border}`}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {c.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              )}
              <span className="absolute left-2 top-2">
                <LiveBadge />
              </span>
              {c.demo ? <span className="absolute right-2 top-2"><DemoBadge /></span> : null}
              <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                {c.audio === 'commentary' ? t('audioCommentary') : t('audioField')}
              </span>
              {c.free ? (
                <span className="absolute bottom-2 right-2 rounded bg-sandr-orange px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
                  {t('freeLive')}
                </span>
              ) : null}
            </div>
            <div className="p-3">
              <p className="line-clamp-2 min-h-[2.5rem] font-condensed text-sm font-bold uppercase leading-tight tracking-wide text-current">
                {c.title ?? t('demoLiveGeneric')}
              </p>
              {c.subtitle ? <p className={`mt-1 line-clamp-1 text-xs ${muted}`}>{c.subtitle}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Riga orizzontale di interviste.
export function InterviewRow({
  title,
  items,
  light = false,
}: {
  title: string;
  items: InterviewCardVM[];
  light?: boolean;
}) {
  const t = useTranslations('Homes');
  const border = light ? 'border-black/10' : 'border-white/10';

  return (
    <section>
      <h2 className="mb-4 font-condensed text-xl font-bold uppercase tracking-wide text-current">{title}</h2>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {items.map((c) => (
          <Link
            key={c.id}
            href={`/vod/${c.id}`}
            className={`group block w-[260px] shrink-0 snap-start overflow-hidden rounded-xl border ${border}`}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {c.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              )}
              {c.demo ? <span className="absolute right-2 top-2"><DemoBadge /></span> : null}
            </div>
            <div className="p-3">
              <p className="line-clamp-2 min-h-[2.5rem] font-condensed text-sm font-bold uppercase leading-tight tracking-wide text-current">
                {c.title ?? t('interviewGeneric')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Stato vuoto delle dirette (flag demo spento): messaggio pulito + prossimo evento.
export function EmptyLive({
  nextEvent,
  light = false,
}: {
  nextEvent: NextEventVM | null;
  light?: boolean;
}) {
  const t = useTranslations('Homes');
  const border = light ? 'border-black/10' : 'border-white/10';
  const muted = light ? 'text-black/60' : 'text-white/60';

  return (
    <div className={`rounded-xl border ${border} p-8 text-center`}>
      <p className="font-condensed text-lg font-bold uppercase tracking-wide text-current">{t('noLive')}</p>
      {nextEvent ? (
        <p className={`mt-2 text-sm ${muted}`}>
          {t('nextEvent')}: <span className="text-current">{nextEvent.title}</span>
          {nextEvent.date ? ` · ${nextEvent.date}` : ''}
          {nextEvent.location ? ` · ${nextEvent.location}` : ''}
        </p>
      ) : null}
    </div>
  );
}
