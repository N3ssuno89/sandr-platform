import { setRequestLocale } from 'next-intl/server';
import { OpenHome } from '@/components/home/OpenHome';

// "/open": home del volto OPEN, visibile anche senza login.
export default function OpenPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <OpenHome />;
}
