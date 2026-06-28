import { setRequestLocale } from 'next-intl/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/account/SettingsForm';

// AREA CRITICA (CLAUDE.md): Supabase Auth (profilo utente).
// REAL: profile data from Supabase. MOCK: notification toggles

const supaConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

type ProfileRow = { full_name: string | null; email: string | null; preferred_language: string | null };

export default async function SettingsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  let fullName = '';
  let email = '';
  let language = 'it';

  // REAL: profilo dell'utente loggato (Supabase).
  if (supaConfigured) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const sb = supabase as unknown as SupabaseClient;
      const { data } = await sb
        .from('profiles')
        .select('full_name, email, preferred_language')
        .eq('id', user.id)
        .maybeSingle();
      const p = (data as ProfileRow | null) ?? null;
      fullName = p?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? '';
      email = p?.email ?? user.email ?? '';
      language = p?.preferred_language ?? 'it';
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Impostazioni</h1>
      <SettingsForm initialFullName={fullName} email={email} initialLanguage={language} />
    </div>
  );
}
