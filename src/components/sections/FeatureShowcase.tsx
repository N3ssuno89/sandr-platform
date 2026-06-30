import { FeatureTabs } from '@/components/sections/FeatureTabs';
import { getVideosForDisplay } from '@/lib/videos/actions';
import { getPublicAthletes } from '@/lib/public/queries';

// Wrapper server: recupera immagini REALI (copertine video + foto atleti) da
// Supabase e le passa al FeatureTabs (client). Build-safe: liste vuote → il
// FeatureTabs ricade su gradiente.
export async function FeatureShowcase() {
  const [videos, athletes] = await Promise.all([getVideosForDisplay(), getPublicAthletes()]);

  const thumbnails = videos
    .map((v) => v.thumbnail)
    .filter((x): x is string => !!x)
    .slice(0, 6);
  const athletePhotos = athletes
    .map((a) => a.photo_url)
    .filter((x): x is string => !!x)
    .slice(0, 6);

  return <FeatureTabs media={{ thumbnails, athletePhotos }} />;
}
