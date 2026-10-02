import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { ContinueWatchingRow } from '@/components/sections/ContinueWatchingRow';
import { DashboardContent } from '@/components/sections/DashboardContent';
import { getVideosForDisplay } from '@/lib/videos/actions';
import { supabaseReadable, getPublicAthletes, getFeaturedAthletes, getPublicFederations, getSportsMap } from '@/lib/public/queries';
import { toAthleteCard, toFederationCard } from '@/lib/public/map';
import type { Athlete } from '@/types/athlete';
import type { Federation } from '@/types/federation';

// Home PRO completa (stile DAZN post-login): hero in evidenza, "continua a
// guardare", righe video/atleti/federazioni. Video/atleti/circuiti da SUPABASE
// (source of truth); build-safe: liste vuote → mock (dev mode). Usata sia su
// /dashboard/home sia su "/" per gli utenti loggati (volto PRO).
export async function AuthHome() {
  const videos = await getVideosForDisplay();
  const realVideos = videos.length > 0 ? videos : undefined;

  // Video in evidenza per l'hero (tag 'featured' = is_featured nel DB).
  const featured = realVideos?.filter((v) => v.tags.includes('featured')) ?? [];
  const featuredVideos = featured.length > 0 ? featured : undefined;

  // Atleti/federazioni reali per le righe home (mock fallback se vuoto/non config).
  let athletes: Athlete[] | undefined;
  let federations: Federation[] | undefined;
  if (supabaseReadable()) {
    const [featuredRows, allRows, fRows, sportsMap] = await Promise.all([
      getFeaturedAthletes(),
      getPublicAthletes(),
      getPublicFederations(),
      getSportsMap(),
    ]);
    // "Atleti in evidenza": solo is_featured = true. Fallback a tutti se nessuno
    // è in evidenza (così la riga non resta vuota in dev).
    const aRows = featuredRows.length > 0 ? featuredRows : allRows;
    if (aRows.length > 0) {
      athletes = aRows.map((a) =>
        toAthleteCard(
          a,
          sportsMap.get(a.sport_id ?? '') ?? 'Beach Volley',
          fRows.find((f) => f.id === a.federation_id)?.short_name ?? '—',
        ),
      );
    }
    if (fRows.length > 0) {
      federations = fRows.map((f) => toFederationCard(f, sportsMap.get(f.sport_id ?? '') ?? 'Beach Volley'));
    }
  }

  return (
    <>
      <HeroCarousel featuredVideos={featuredVideos} />
      {/* "Continua a guardare": dalla watch_history dell'utente (vuota → nascosta). */}
      <ContinueWatchingRow />
      <DashboardContent realVideos={realVideos} athletes={athletes} federations={federations} />
    </>
  );
}
