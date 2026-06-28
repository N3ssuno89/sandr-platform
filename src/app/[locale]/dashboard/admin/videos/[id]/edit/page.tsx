import { setRequestLocale } from 'next-intl/server';
import { VideoMetadataForm } from '@/components/admin/VideoMetadataForm';
import { getVideoForEdit } from '@/lib/videos/actions';
import { getSports, getFederations, getAthletes, getExistingTags } from '@/lib/reference/actions';

// Server component: legge il video da SUPABASE (id Supabase) + dati riferimento.
export default async function EditVideoPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);

  const [video, sports, federations, athletes, existingTags] = await Promise.all([
    getVideoForEdit(params.id),
    getSports(),
    getFederations(),
    getAthletes(),
    getExistingTags(),
  ]);

  if (!video) {
    return (
      <div className="max-w-3xl">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Modifica video</h1>
        <p className="mt-3 text-sm text-sandr-muted">
          Video non trovato (o Supabase non configurato / accesso non admin).
        </p>
      </div>
    );
  }

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
