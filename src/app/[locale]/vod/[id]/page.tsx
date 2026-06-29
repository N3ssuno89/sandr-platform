import { setRequestLocale, getTranslations } from 'next-intl/server';
import { VodPlayerView, type OtherVideo } from '@/components/player/VodPlayerView';
import { getVideoForPlayer, getVideoAthletes, getVideosForDisplay } from '@/lib/videos/actions';
import { checkVideoAccess } from '@/lib/access/server';
import { badgeTier } from '@/lib/access/check';
import { getViewerWatchState } from '@/lib/tracking/queries';

function fmtDuration(seconds: number | null): string {
  if (!seconds || seconds < 0) return '';
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Pagina VOD player. Legge il video da SUPABASE (id Supabase), passa il
// cloudflare_uid al TrackingPlayer (player + tracking visione). Rotta dinamica.
export default async function VodDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);

  const pv = await getVideoForPlayer(params.id);

  if (!pv) {
    const t = await getTranslations('Vod');
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#0a0a0a] px-4 text-center">
        <p className="font-condensed text-2xl uppercase text-sandr-muted">{t('player.notAvailable')}</p>
      </div>
    );
  }

  // Controllo accesso SERVER-SIDE (AREA CRITICA, CLAUDE.md): un utente senza i
  // diritti NON deve ricevere il cloudflare_uid di un contenuto premium/ppv.
  const access = await checkVideoAccess(
    { accessLevel: pv.accessLevel, type: pv.type },
    params.id,
  );

  const [all, athletes, watchState] = await Promise.all([
    getVideosForDisplay(),
    getVideoAthletes(params.id),
    // Stato di visione: solo se l'accesso è consentito (altrimenti niente player).
    access.allowed ? getViewerWatchState(params.id) : Promise.resolve({ loggedIn: false, resumeSeconds: 0 }),
  ]);
  const others: OtherVideo[] = all
    .filter((v) => v.id !== params.id)
    .slice(0, 6)
    .map((v) => ({
      id: v.id,
      title: v.title,
      durationLabel: v.duration ?? '',
      thumbnailUrl: v.thumbnail,
      access: badgeTier(v.access ?? (v.isPremium ? 'premium' : 'free'), v.type),
    }));

  return (
    <VodPlayerView
      video={{
        // uid passato SOLO se l'accesso è consentito (altrimenti stringa vuota).
        cloudflareUid: access.allowed ? pv.cloudflareUid ?? '' : '',
        title: pv.title,
        durationLabel: fmtDuration(pv.durationSeconds),
        dateLabel: fmtDate(pv.publishedAt ?? pv.createdAt),
        description: pv.description,
      }}
      others={others}
      athletes={athletes}
      access={{ allowed: access.allowed, reason: access.reason, ppvPrice: pv.ppvPrice }}
      tracking={{ videoId: params.id, loggedIn: watchState.loggedIn, resumeSeconds: watchState.resumeSeconds }}
    />
  );
}
