import type { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Helper: refresh della sessione Supabase nel middleware Next.js.
// AREA CRITICA (CLAUDE.md): Auth/sessioni richiedono review umana.
//
// Riceve la response già creata da next-intl e ci propaga i cookie aggiornati
// della sessione. Build-safe: se le env Supabase mancano, non fa nulla e
// ritorna user = null (così la protezione rotte resta inattiva in demo).
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
): Promise<{ user: { id: string } | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return { user: null };
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser() forza il refresh del token se necessario.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user: user ? { id: user.id } : null };
}
