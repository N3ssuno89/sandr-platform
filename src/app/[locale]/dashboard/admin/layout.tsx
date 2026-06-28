import { setRequestLocale } from 'next-intl/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { requireAdminPage } from '@/lib/supabase/guard';

// Layout pannello admin. AREA CRITICA (CLAUDE.md): accesso limitato al ruolo
// admin (requireAdminPage redirige i non-admin a /dashboard/home). In demo
// (Supabase non configurato) non blocca.
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#0a0a0a]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
