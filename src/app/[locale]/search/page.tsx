import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getTournaments } from '@/lib/data';
import { getVideosForDisplay } from '@/lib/videos/actions';
import { supabaseReadable, getPublicAthletes, getPublicFederations, getSportsMap } from '@/lib/public/queries';
import { toAthleteCard } from '@/lib/public/map';
import { mockAthletes } from '@/lib/mock-athletes';
import { AthleteCard } from '@/components/cards/AthleteCard';
import { Thumb } from '@/components/ui/Thumb';
import { AccessBadge, LiveBadge } from '@/components/ui/Badges';
import type { Athlete } from '@/types/athlete';

export const dynamic = 'force-dynamic';

// Ricerca su tutto il catalogo (video, atleti, tornei). Server-side: legge ?q,
// filtra e mostra i risultati. Volto PRO (chrome globale).
function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function accessLabel(access: 'free' | 'premium' | 'ppv', t: (k: string) => string): string {
  return access === 'premium' ? t('premium') : access === 'ppv' ? t('ppv') : t('free');
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Search');
  const q = (searchParams.q ?? '').trim();
  const nq = norm(q);

  // Risultati (solo se c'è una query).
  let videos: Awaited<ReturnType<typeof getVideosForDisplay>> = [];
  let athletes: Athlete[] = [];
  let tornei: { id: string; name: string; location: string; face: 'pro' | 'open' }[] = [];

  if (nq.length >= 2) {
    const [allVideos, groups] = await Promise.all([getVideosForDisplay(), getTournaments()]);

    videos = allVideos
      .filter((v) => norm(`${v.title} ${v.teams ?? ''} ${v.circuit ?? ''}`).includes(nq))
      .slice(0, 12);

    // Atleti: stessa sorgente dell'indice (Supabase o mock) → link /athletes/[id].
    let pool: Athlete[] = mockAthletes;
    if (supabaseReadable()) {
      const [rows, feds, sportsMap] = await Promise.all([
        getPublicAthletes(),
        getPublicFederations(),
        getSportsMap(),
      ]);
      if (rows.length > 0) {
        pool = rows.map((a) =>
          toAthleteCard(
            a,
            sportsMap.get(a.sport_id ?? '') ?? 'Beach Volley',
            feds.find((f) => f.id === a.federation_id)?.short_name ?? '—',
          ),
        );
      }
    }
    athletes = pool.filter((a) => norm(`${a.name} ${a.nation} ${a.circuit}`).includes(nq)).slice(0, 12);

    tornei = groups
      .flatMap((g) => g.editions)
      .filter((e) => norm(`${e.name} ${e.location}`).includes(nq))
      .slice(0, 12)
      .map((e) => ({ id: e.id, name: e.name, location: e.location, face: e.face }));
  }

  const total = videos.length + athletes.length + tornei.length;

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 md:px-10">
      <h1 className="font-display text-4xl uppercase tracking-tight">{t('title')}</h1>

      {/* Barra di ricerca (GET → /search?q=) */}
      <form action={`/${params.locale}/search`} method="get" className="mt-6 flex max-w-xl gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          autoFocus
          placeholder={t('placeholder')}
          className="min-w-0 flex-1 rounded-[10px] border px-4 py-3 font-barlow outline-none"
          style={{
            backgroundColor: 'var(--face-surface)',
            borderColor: 'var(--face-border)',
            color: 'var(--face-fg)',
          }}
        />
        <button
          type="submit"
          className="rounded-[10px] bg-[color:var(--face-accent)] px-6 py-3 font-barlow font-bold uppercase tracking-wide text-white"
        >
          {t('cta')}
        </button>
      </form>

      {/* Stati */}
      {nq.length < 2 ? (
        <p className="mt-8 font-barlow text-[color:var(--face-muted)]">{t('hint')}</p>
      ) : total === 0 ? (
        <p className="mt-8 font-barlow text-[color:var(--face-muted)]">{t('noResults', { q })}</p>
      ) : (
        <div className="mt-10 space-y-12">
          {/* Video */}
          {videos.length > 0 ? (
            <section>
              <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{t('videos')}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {videos.map((v) => (
                  <Link
                    key={v.id}
                    href={v.type === 'live' ? `/live/${v.id}` : `/vod/${v.id}`}
                    className="group overflow-hidden rounded-xl border border-[color:var(--face-border)] transition-colors hover:border-[color:var(--face-accent)]"
                    style={{ backgroundColor: 'var(--face-surface)' }}
                  >
                    <div className="relative">
                      <Thumb src={v.thumbnail} label={v.circuit} />
                      <span className="absolute left-2 top-2">
                        {v.type === 'live' ? (
                          <LiveBadge label={t('badgeLive')} small />
                        ) : (
                          <AccessBadge access={v.access ?? 'free'} label={accessLabel(v.access ?? 'free', t)} small />
                        )}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="truncate font-barlow text-sm font-semibold">{v.title}</p>
                      {v.teams ? (
                        <p className="truncate font-barlow text-xs text-[color:var(--face-muted)]">{v.teams}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* Atleti */}
          {athletes.length > 0 ? (
            <section>
              <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{t('athletes')}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {athletes.map((a) => (
                  <AthleteCard key={a.id} athlete={a} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Tornei */}
          {tornei.length > 0 ? (
            <section>
              <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{t('tournaments')}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tornei.map((e) => (
                  <Link
                    key={e.id}
                    href={e.face === 'open' ? '/open/tornei' : '/tornei'}
                    className="rounded-xl border p-4"
                    style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
                  >
                    <p className="font-narrow text-lg font-bold uppercase tracking-wide">{e.name}</p>
                    {e.location ? (
                      <p className="mt-1 font-barlow text-sm text-[color:var(--face-muted)]">{e.location}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
