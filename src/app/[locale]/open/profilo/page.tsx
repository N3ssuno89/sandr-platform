import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';
import { OpenThemeShell } from '@/components/faces/OpenThemeShell';

// Profilo del volto OPEN: /open/profilo. Mostra i dati base dell'account se
// loggato, altrimenti invita all'accesso. (La gestione account completa resta
// in /dashboard; qui è la vista nel contesto OPEN.)
async function getSessionUser() {
  if (!isSupabaseConfiguredServer()) return null;
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

export default async function OpenProfilePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('OpenProfile');
  const user = await getSessionUser();

  return (
    <OpenThemeShell>
      <h1 className="font-condensed text-3xl font-extrabold uppercase tracking-wide">{t('title')}</h1>

      {user ? (
        <div className="mt-6 rounded-xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/60">{t('email')}</p>
          <p className="font-condensed text-lg font-bold">{user.email}</p>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-black/10 p-8 text-center">
          <p className="font-condensed text-lg font-bold uppercase tracking-wide">{t('signedOut')}</p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-sandr-orange px-6 py-3 font-condensed font-bold uppercase tracking-wide text-black"
          >
            {t('signIn')}
          </Link>
        </div>
      )}
    </OpenThemeShell>
  );
}
