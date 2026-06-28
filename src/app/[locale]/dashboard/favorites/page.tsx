import { setRequestLocale } from 'next-intl/server';
import { DemoPill } from '@/components/account/DemoPill';

// MOCK: favorites feature not yet in schema
export default function FavoritesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Preferiti</h1>
        <DemoPill />
      </div>
      <div className="mt-10 rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-12 text-center">
        <p className="text-sm text-[#888888]">I tuoi atleti e tornei preferiti appariranno qui</p>
      </div>
    </div>
  );
}
