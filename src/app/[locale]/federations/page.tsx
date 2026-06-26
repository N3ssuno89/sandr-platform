import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FederationCard } from '@/components/cards/FederationCard';
import { mockFederations } from '@/lib/mock-federations';

export default function FederationsIndexPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Federation');

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-condensed text-4xl font-extrabold uppercase text-white">{t('indexTitle')}</h1>
      <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockFederations.map((f) => (
          <FederationCard key={f.id} federation={f} />
        ))}
      </div>
    </div>
  );
}
