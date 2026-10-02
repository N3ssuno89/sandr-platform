import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getLivePlayable } from '@/lib/data';
import { StreamPlayer } from '@/components/player/StreamPlayer';
import { OpenThemeShell } from '@/components/faces/OpenThemeShell';

// Diretta del volto OPEN: /open/live/[id]. Player semplice + tema chiaro.
// Gating accesso applicato server-side in getLivePlayable.
export default async function OpenLivePage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Homes');
  const live = await getLivePlayable(params.id);

  return (
    <OpenThemeShell>
      {live && live.cloudflareUid ? (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {t('liveBadge')}
            </span>
            <span className="rounded bg-sandr-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
              {t('freeLive')}
            </span>
            {live.demo ? (
              <span className="rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {t('demoData')}
              </span>
            ) : null}
          </div>
          <StreamPlayer videoId={live.cloudflareUid} title={live.title} autoplay />
          <h1 className="mt-4 font-condensed text-2xl font-extrabold uppercase tracking-wide">{live.title}</h1>
        </>
      ) : (
        <div className="rounded-xl border border-black/10 p-10 text-center">
          <p className="font-condensed text-lg font-bold uppercase tracking-wide">{t('notAvailable')}</p>
          <Link
            href="/open"
            className="mt-4 inline-block rounded-lg bg-sandr-orange px-6 py-3 font-condensed font-bold uppercase tracking-wide text-black"
          >
            SANDR Open
          </Link>
        </div>
      )}
    </OpenThemeShell>
  );
}
