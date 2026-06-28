import { setRequestLocale } from 'next-intl/server';
import { getUsers } from '@/lib/admin/actions';
import { requireAdminPage } from '@/lib/supabase/guard';
import { UserManager } from '@/components/admin/UserManager';

// REAL: profiles table, admin-only via RLS.
export default async function AdminUsersPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);
  const users = await getUsers();

  return (
    <div>
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Gestione Utenti</h1>
      <UserManager users={users} />
    </div>
  );
}
