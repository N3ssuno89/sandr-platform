import { setRequestLocale, getTranslations } from 'next-intl/server';
import { FederationCard } from '@/components/cards/FederationCard';
import { supabaseReadable, getPublicFederations, getSportsMap } from '@/lib/public/queries';
import { toFederationCard } from '@/lib/public/map';
import { mockFederations } from '@/lib/mock-federations';
import type { Federation } from '@/types/federation';

// Indice federazioni pubblico. REAL da Supabase; MOCK FALLBACK se non config/vuoto.
export default async function FederationsIndexPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Federation');

  let federations: Federation[] = mockFederations;
  if (supabaseReadable()) {
    const [rows, sportsMap] = await Promise.all([getPublicFederations(), getSportsMap()]);
    if (rows.length > 0) {
      federations = rows.map((f) => toFederationCard(f, sportsMap.get(f.sport_id ?? '') ?? 'Beach Volley'));
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-condensed text-4xl font-extrabold uppercase text-white">{t('indexTitle')}</h1>
      <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {federations.map((f) => (
          <FederationCard key={f.id} federation={f} />
        ))}
      </div>
    </div>
  );
}
