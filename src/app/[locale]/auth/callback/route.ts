import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Callback di conferma email (Supabase Auth).
// AREA CRITICA (CLAUDE.md): Supabase Auth richiede review umana.
//
// Scambia il `code` ricevuto via email per una sessione e reindirizza alla
// home autenticata; in caso di errore torna al login con ?error=auth.
// Build-safe: se Supabase non è configurato, reindirizza al login.
export async function GET(
  request: Request,
  { params }: { params: { locale: string } },
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const { locale } = params;
  const home = `${origin}/${locale}/dashboard/home`;
  const fail = `${origin}/${locale}/login?error=auth`;

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  if (!code || !configured) {
    return NextResponse.redirect(fail);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(fail);
    }
    return NextResponse.redirect(home);
  } catch {
    return NextResponse.redirect(fail);
  }
}
