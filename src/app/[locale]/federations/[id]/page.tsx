import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FederationContent } from '@/components/sections/FederationContent';
import { getFederationById, mockFederations } from '@/lib/mock-federations';

export function generateStaticParams() {
  return mockFederations.map((f) => ({ id: f.id }));
}

export default function FederationPage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Federation');
  const federation = getFederationById(params.id);

  if (!federation) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#141414] px-4 text-center">
        <p className="font-condensed text-2xl uppercase text-sandr-muted">{t('notFound')}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414]">
      {/* Hero federazione */}
      <section className="relative bg-[#141414]">
        <div className="absolute inset-0" style={{ backgroundColor: `${federation.color}33` }} />
        <div className="relative mx-auto flex h-[400px] max-w-6xl flex-col justify-center px-4">
          <p className="font-condensed text-[64px] font-black uppercase leading-none text-white md:text-[80px]">
            {federation.shortName}
          </p>
          <p className="mt-2 text-lg text-[#C0BDB8]">{federation.name}</p>
          <p className="mt-3 max-w-2xl text-[15px] text-[#C0BDB8]">{federation.description}</p>
          <button
            type="button"
            className="mt-6 w-fit rounded-lg border border-white/20 px-6 py-3 font-condensed font-bold uppercase tracking-wide text-white"
          >
            {t('follow')}
          </button>
        </div>
      </section>

      {/* Tab bar + contenuti */}
      <FederationContent federation={federation} />
    </div>
  );
}
