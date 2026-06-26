import { setRequestLocale } from 'next-intl/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

// Layout pannello admin. AREA CRITICA (CLAUDE.md): in produzione l'accesso
// va limitato al ruolo admin via Supabase RLS (qui pubblico solo in demo).
export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#0a0a0a]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
