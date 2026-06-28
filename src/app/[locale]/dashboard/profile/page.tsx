import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getMyProfile } from '@/lib/user/actions';
import { cardCls, labelCls, ghostBtn } from '@/components/admin/styles';

function initials(name: string | null, email: string | null): string {
  if (name?.trim()) return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || 'U';
  if (email) return email[0]?.toUpperCase() ?? 'U';
  return 'U';
}

// REAL: profiles (utente loggato).
export default async function ProfilePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const p = await getMyProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Il mio profilo</h1>

      {p ? (
        <div className={`mt-6 ${cardCls}`}>
          <div className="flex items-center gap-4">
            {p.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#242424] font-condensed text-xl font-bold text-white">
                {initials(p.full_name, p.email)}
              </span>
            )}
            <div>
              <p className="font-condensed text-xl font-bold text-white">{p.full_name ?? '—'}</p>
              <p className="text-sm text-[#888888]">{p.email ?? '—'}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className={labelCls}>Ruolo</p>
              <p className="text-sm text-white">{p.role}</p>
            </div>
            <div>
              <p className={labelCls}>Iscritto dal</p>
              <p className="text-sm text-white">{p.createdAt}</p>
            </div>
          </div>

          <Link href="/dashboard/settings" className={`mt-6 inline-block ${ghostBtn}`}>Modifica profilo</Link>
        </div>
      ) : (
        <p className="mt-6 text-sm text-sandr-muted">Accedi per vedere il tuo profilo.</p>
      )}
    </div>
  );
}
