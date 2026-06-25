import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/ui/page-header';

// Pagina di login (placeholder). AREA CRITICA: Supabase Auth richiede review
// umana obbligatoria (CLAUDE.md). Qui niente logica di autenticazione.
export default function LoginPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const tc = useTranslations('Common');

  return (
    <>
      <PageHeader title={tc('signIn')} />
      <div className="mx-auto max-w-md px-4 pb-16">
        <div className="rounded-lg border border-white/10 bg-sandr-surface p-8" />
      </div>
    </>
  );
}
