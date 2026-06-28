import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getMyWatchHistory } from '@/lib/user/actions';

// REAL: watch_history (utente loggato), join videos.
export default async function WatchHistoryPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const items = await getMyWatchHistory();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Cronologia</h1>

      {items.length > 0 ? (
        <div className="mt-6 space-y-3">
          {items.map((it) => {
            const pct = it.durationSeconds ? Math.min(100, Math.round((it.watchedSeconds / it.durationSeconds) * 100)) : 0;
            return (
              <div key={it.videoId} className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.thumbnailUrl ?? '/logo.png'} alt="" className="h-14 w-24 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-condensed text-base font-bold uppercase text-white">{it.title}</p>
                  <p className="text-xs text-[#888888]">Visto il {it.lastWatchedAt}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-[#F04E00]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <Link href={`/vod/${it.videoId}`} className="shrink-0 text-[12px] font-semibold uppercase text-sandr-orange hover:text-white">
                  Riprendi
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-[#888888]">Non hai ancora guardato nessun video</p>
      )}
    </div>
  );
}
