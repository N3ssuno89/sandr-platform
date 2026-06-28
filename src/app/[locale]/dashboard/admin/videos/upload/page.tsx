import { setRequestLocale } from 'next-intl/server';
import { UploadFlow } from '@/components/admin/UploadFlow';
import { getSports, getFederations, getAthletes, getExistingTags } from '@/lib/reference/actions';

// Server component: pre-carica i dati di riferimento (sport/federazioni/atleti/
// tag) da Supabase per i dropdown del form. Build-safe: liste vuote senza env.
export default async function UploadVideoPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const [sports, federations, athletes, existingTags] = await Promise.all([
    getSports(),
    getFederations(),
    getAthletes(),
    getExistingTags(),
  ]);

  return (
    <UploadFlow sports={sports} federations={federations} athletes={athletes} existingTags={existingTags} />
  );
}
