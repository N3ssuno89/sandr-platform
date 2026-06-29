import { setRequestLocale } from 'next-intl/server';
import { VideoMetadataForm } from '@/components/admin/VideoMetadataForm';
import { getVideoForEdit } from '@/lib/videos/actions';
import { getSports, getFederations, getAthletes, getExistingTags } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';

// Dati sempre freschi: nessuna cache (il form deve mostrare l'ultima versione).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server component: legge il video da SUPABASE (id Supabase = UUID, NON
// cloudflare_uid) + dati riferimento. Gating admin a monte; messaggi di errore
// distinti per capire il vero motivo (non più un generico "Video non trovato").
export default async function EditVideoPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  const [result, sports, federations, athletes, existingTags] = await Promise.all([
    getVideoForEdit(params.id),
    getSports(),
    getFederations(),
    getAthletes(),
    getExistingTags(),
  ]);

  if (!result.ok) {
    const message =
      result.reason === 'not-configured'
        ? 'Supabase non configurato in questo ambiente.'
        : result.reason === 'not-found'
          ? 'Video non trovato: potrebbe essere stato eliminato.'
          : 'Accesso riservato agli amministratori.';
    return (
      <div className="max-w-3xl">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Modifica video</h1>
        <p className="mt-3 text-sm text-sandr-muted">{message}</p>
      </div>
    );
  }

  const video = result.data;

  return (
    <div className="max-w-3xl">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Modifica video</h1>
      <p className="mt-1 text-sm text-[#888888]">{video.title}</p>
      <div className="mt-8">
        <VideoMetadataForm
          cloudflareUid={video.cloudflareUid ?? ''}
          defaultValues={video}
          sports={sports}
          federations={federations}
          athletes={athletes}
          existingTags={existingTags}
        />
      </div>
    </div>
  );
}
