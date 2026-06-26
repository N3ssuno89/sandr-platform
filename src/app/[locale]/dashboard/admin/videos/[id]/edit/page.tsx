import { setRequestLocale } from 'next-intl/server';
import { getVideo } from '@/lib/cloudflare-stream';
import { VideoMetadataForm, type VideoMeta } from '@/components/admin/VideoMetadataForm';

export default async function EditVideoPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);

  const video = await getVideo(params.id);

  // I metadati custom vivono in meta su Cloudflare Stream.
  const meta = (video?.meta ?? {}) as Record<string, string | undefined>;
  const initial: VideoMeta = {
    name: meta.name,
    circuit: meta.circuit,
    type: meta.type,
    sport: meta.sport,
    event: meta.event,
    athletes: meta.athletes,
    country: meta.country,
    eventDate: meta.eventDate,
    access: meta.access ?? 'free',
    description: meta.description,
    tags: meta.tags,
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Modifica video</h1>
      <p className="mt-1 text-sm text-[#888888]">{initial.name ?? params.id}</p>
      <div className="mt-8">
        <VideoMetadataForm uid={params.id} initial={initial} />
      </div>
    </div>
  );
}
