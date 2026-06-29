import { setRequestLocale } from 'next-intl/server';
import { AddVideoFlow } from '@/components/admin/AddVideoFlow';
import { getSports, getFederations, getAthletes, getExistingTags } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';

// I video sono caricati esternamente su Cloudflare Stream: qui si linka un UID
// esistente e si compilano i metadata su Supabase. AREA CRITICA (CLAUDE.md).
export default async function AddVideoPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  const [sports, federations, athletes, existingTags] = await Promise.all([
    getSports(),
    getFederations(),
    getAthletes(),
    getExistingTags(),
  ]);

  return (
    <AddVideoFlow sports={sports} federations={federations} athletes={athletes} existingTags={existingTags} />
  );
}
