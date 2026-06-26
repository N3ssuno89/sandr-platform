import { setRequestLocale } from 'next-intl/server';
import { AthletesIndex } from '@/components/sections/AthletesIndex';

// Indice atleti pubblico. La griglia con i filtri vive nel client component.
export default function AthletesIndexPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <AthletesIndex />;
}
